#!/usr/bin/env python3

import argparse
import json
import os
import sqlite3
import subprocess
import sys
from pathlib import Path


SCHEMA = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS identities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repositories (
    name TEXT PRIMARY KEY,
    path TEXT NOT NULL UNIQUE,
    last_sync_at TEXT
);

CREATE TABLE IF NOT EXISTS commits (
    repository_name TEXT NOT NULL,
    hash TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    commit_date TEXT NOT NULL,
    subject TEXT,
    diff TEXT,

    PRIMARY KEY (repository_name, hash),

    FOREIGN KEY (repository_name)
        REFERENCES repositories(name)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS commit_identities (
    repository_name TEXT NOT NULL,
    commit_hash TEXT NOT NULL,
    identity_id INTEGER NOT NULL,

    PRIMARY KEY (
        repository_name,
        commit_hash,
        identity_id
    ),

    FOREIGN KEY (repository_name, commit_hash)
        REFERENCES commits(repository_name, hash)
        ON DELETE CASCADE,

    FOREIGN KEY (identity_id)
        REFERENCES identities(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_commits_date
    ON commits(commit_date);

CREATE INDEX IF NOT EXISTS idx_commits_repository
    ON commits(repository_name);

CREATE INDEX IF NOT EXISTS idx_commits_author_email
    ON commits(author_email);

CREATE INDEX IF NOT EXISTS idx_commit_identities_identity
    ON commit_identities(identity_id);

CREATE INDEX IF NOT EXISTS idx_commit_identities_commit
    ON commit_identities(repository_name, commit_hash);
"""


def load_config(path):
    path = Path(path)

    if not path.exists():
        raise RuntimeError(
            f"Arquivo de configuração não encontrado: {path}"
        )

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def connect_database(path):
    path = os.path.abspath(path)

    directory = os.path.dirname(path)

    if directory:
        os.makedirs(directory, exist_ok=True)

    conn = sqlite3.connect(path)

    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")

    conn.executescript(SCHEMA)

    ensure_diff_column(conn)

    return conn


def ensure_diff_column(conn):
    """
    Migração leve para bancos criados antes da coluna 'diff'
    existir (executescript com IF NOT EXISTS não adiciona
    colunas em tabelas já existentes).
    """

    columns = {
        row[1]
        for row in conn.execute("PRAGMA table_info(commits)")
    }

    if "diff" not in columns:
        conn.execute("ALTER TABLE commits ADD COLUMN diff TEXT")
        conn.commit()


def sync_identities(conn, config):
    """
    O config.json é a fonte de verdade das identidades.

    - Identidade nova: adicionada.
    - Identidade existente: nome atualizado.
    - Identidade removida do config: removida do banco.
    """

    configured = {}

    for identity in config.get("identities", []):
        name = identity["name"].strip()
        email = identity["email"].strip().lower()

        if not name:
            raise ValueError(
                "Nome da identidade não pode ser vazio."
            )

        if not email:
            raise ValueError(
                "E-mail da identidade não pode ser vazio."
            )

        if email in configured:
            raise ValueError(
                f"E-mail duplicado no config.json: {email}"
            )

        configured[email] = name

    existing = conn.execute(
        """
        SELECT id, name, email
        FROM identities
        """
    ).fetchall()

    existing_by_email = {
        email.lower(): (
            identity_id,
            name,
            email,
        )
        for identity_id, name, email in existing
    }

    # Adiciona novas identidades e atualiza as existentes.
    for email, name in configured.items():
        if email in existing_by_email:
            identity_id, old_name, old_email = (
                existing_by_email[email]
            )

            if old_name != name:
                conn.execute(
                    """
                    UPDATE identities
                    SET name = ?
                    WHERE id = ?
                    """,
                    (name, identity_id),
                )
        else:
            conn.execute(
                """
                INSERT INTO identities (
                    name,
                    email
                )
                VALUES (?, ?)
                """,
                (name, email),
            )

            print(
                f"Identidade adicionada: "
                f"{name} <{email}>"
            )

    # Remove identidades que não existem mais no config.
    for email, (
        identity_id,
        name,
        old_email,
    ) in existing_by_email.items():

        if email not in configured:
            count = conn.execute(
                """
                SELECT COUNT(*)
                FROM commit_identities
                WHERE identity_id = ?
                """,
                (identity_id,),
            ).fetchone()[0]

            print(
                f"Identidade removida: "
                f"{name} <{old_email}> "
                f"({count} associações)"
            )

            conn.execute(
                """
                DELETE FROM identities
                WHERE id = ?
                """,
                (identity_id,),
            )

    conn.commit()


def get_identities(conn):
    return conn.execute(
        """
        SELECT id, name, email
        FROM identities
        ORDER BY id
        """
    ).fetchall()


def discover_repositories(root):
    """
    Procura recursivamente por repositórios bare *.git.
    """

    root = Path(root).resolve()

    if not root.exists():
        raise RuntimeError(
            f"Diretório de repositórios não existe: {root}"
        )

    repositories = []

    for path in root.rglob("*.git"):
        if not path.is_dir():
            continue

        if not (path / "HEAD").exists():
            continue

        repositories.append(path)

    return sorted(repositories)


def get_or_create_repository(conn, path):
    """
    O nome do repositório (basename do diretório .git) é
    usado como chave. Se dois caminhos diferentes gerarem o
    mesmo nome, um erro claro é levantado em vez de misturar
    os commits dos dois.
    """

    path = str(Path(path).resolve())
    name = Path(path).name

    row = conn.execute(
        """
        SELECT name, path
        FROM repositories
        WHERE path = ?
        """,
        (path,),
    ).fetchone()

    if row:
        return row[0]

    existing_path = conn.execute(
        """
        SELECT path
        FROM repositories
        WHERE name = ?
        """,
        (name,),
    ).fetchone()

    if existing_path:
        raise RuntimeError(
            f"Conflito de nome de repositório: '{name}' já "
            f"existe apontando para '{existing_path[0]}', "
            f"mas o caminho encontrado agora foi '{path}'. "
            f"Como o nome é usado como chave, dois caminhos "
            f"diferentes não podem ter o mesmo nome."
        )

    conn.execute(
        """
        INSERT INTO repositories (
            name,
            path
        )
        VALUES (?, ?)
        """,
        (name, path),
    )

    conn.commit()

    return name


def get_git_commits(repo_path, emails):
    """
    Obtém os commits alcançáveis por --all e filtra
    pelo author_email.

    Formato:

    HASH | AUTHOR_NAME | AUTHOR_EMAIL | DATE | SUBJECT
    """

    command = [
        "git",
        "--git-dir",
        str(repo_path),
        "log",
        "--all",
        "--format=%H%x1f%an%x1f%ae%x1f%aI%x1f%s%x1e",
    ]

    result = subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=True,
    )

    wanted_emails = {
        email.strip().lower()
        for email in emails
    }

    commits = []

    for record in result.stdout.split("\x1e"):
        record = record.strip()

        if not record:
            continue

        fields = record.split("\x1f")

        if len(fields) != 5:
            continue

        (
            commit_hash,
            author_name,
            author_email,
            commit_date,
            subject,
        ) = fields

        author_email = author_email.strip().lower()

        if author_email not in wanted_emails:
            continue

        commits.append({
            "hash": commit_hash,
            "author_name": author_name,
            "author_email": author_email,
            "commit_date": commit_date,
            "subject": subject,
        })

    return commits


def get_commit_parent_count(repo_path, commit_hash):
    result = subprocess.run(
        [
            "git", "--git-dir", str(repo_path),
            "rev-list", "--parents", "-n", "1", commit_hash,
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=True,
    )

    # Primeiro token é o próprio commit; o resto são os pais.
    return len(result.stdout.strip().split()) - 1


def get_commit_diff(repo_path, commit_hash):
    """
    Diff em texto puro de um commit, excluindo conteúdo de
    arquivos binários (imagem, áudio, etc.) — pra esses,
    guarda só se foi adicionado/removido/modificado.

    Merge commits são pulados: o diff combinado do git usa
    um formato inconsistente entre --numstat e --name-status
    (um pode listar um arquivo que o outro omite), então não
    dá pra reconciliar os dois com segurança.
    """

    if get_commit_parent_count(repo_path, commit_hash) > 1:
        return "Merge commit — diff not tracked."

    numstat = subprocess.run(
        [
            "git", "--git-dir", str(repo_path),
            "show", "--no-color", "--format=", "--numstat",
            "--no-renames", commit_hash,
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=True,
    ).stdout

    name_status = subprocess.run(
        [
            "git", "--git-dir", str(repo_path),
            "show", "--no-color", "--format=", "--name-status",
            "--no-renames", commit_hash,
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=True,
    ).stdout

    # numstat marca binário com "-\t-\tpath" em vez de contagens.
    binary_paths = set()

    for line in numstat.splitlines():
        line = line.strip()

        if not line:
            continue

        added, removed, path = line.split("\t", 2)

        if added == "-" and removed == "-":
            binary_paths.add(path)

    status_by_path = {}

    for line in name_status.splitlines():
        line = line.strip()

        if not line:
            continue

        parts = line.split("\t")
        status_by_path[parts[-1]] = parts[0]

    text_paths = [
        path
        for path in status_by_path
        if path not in binary_paths
    ]

    diff_text = ""

    if text_paths:
        diff_text = subprocess.run(
            [
                "git", "--git-dir", str(repo_path),
                "show", "--no-color", "--format=", "--no-renames",
                commit_hash, "--", *text_paths,
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=True,
        ).stdout

    labels = {"A": "added", "D": "removed", "M": "modified"}

    binary_lines = [
        f"Binary file {labels.get(status_by_path[path][0], 'modified')}: {path}"
        for path in sorted(binary_paths)
    ]

    parts = [
        part
        for part in (diff_text.strip(), "\n".join(binary_lines))
        if part
    ]

    return "\n\n".join(parts)


def import_commits(
    conn,
    repo_path,
    repository_name,
    commits,
    identity_map,
    diff_repositories,
):
    new_commits = 0
    new_associations = 0

    for commit in commits:
        commit_hash = commit["hash"]

        cursor = conn.execute(
            """
            INSERT OR IGNORE INTO commits (
                repository_name,
                hash,
                author_name,
                author_email,
                commit_date,
                subject
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                repository_name,
                commit_hash,
                commit["author_name"],
                commit["author_email"],
                commit["commit_date"],
                commit["subject"],
            ),
        )

        if cursor.rowcount > 0:
            new_commits += 1

            # Só busca o diff pra commit novo, e só se o
            # repositório estiver liberado em 'diff_repositories'.
            if repository_name in diff_repositories:
                diff = get_commit_diff(repo_path, commit_hash)

                conn.execute(
                    """
                    UPDATE commits
                    SET diff = ?
                    WHERE repository_name = ?
                      AND hash = ?
                    """,
                    (diff, repository_name, commit_hash),
                )

        identity_id = identity_map.get(
            commit["author_email"]
        )

        if identity_id is None:
            continue

        cursor = conn.execute(
            """
            INSERT OR IGNORE INTO commit_identities (
                repository_name,
                commit_hash,
                identity_id
            )
            VALUES (?, ?, ?)
            """,
            (
                repository_name,
                commit_hash,
                identity_id,
            ),
        )

        if cursor.rowcount > 0:
            new_associations += 1

    conn.commit()

    return new_commits, new_associations


def sync(config, conn):
    repositories_dir = config["repositories_dir"]

    diff_repositories = set(
        config.get("diff_repositories", [])
    )

    sync_identities(
        conn,
        config,
    )

    identities = get_identities(conn)

    if not identities:
        print("Nenhuma identidade cadastrada.")
        print(
            "Adicione uma identidade em "
            "config.json."
        )
        return

    identity_map = {
        email.lower(): identity_id
        for identity_id, name, email in identities
    }

    emails = list(identity_map.keys())

    repositories = discover_repositories(
        repositories_dir
    )

    print(
        f"Identidades: {len(identities)}"
    )

    print(
        f"Repositórios encontrados: "
        f"{len(repositories)}"
    )

    print()

    total_new_commits = 0
    total_new_associations = 0

    for repo_path in repositories:
        try:
            repository_name = get_or_create_repository(
                conn,
                repo_path,
            )

            print(
                f"[{repository_name}]"
            )

            commits = get_git_commits(
                repo_path,
                emails,
            )

            new_commits, new_associations = (
                import_commits(
                    conn,
                    repo_path,
                    repository_name,
                    commits,
                    identity_map,
                    diff_repositories,
                )
            )

            print(
                f"  encontrados:   {len(commits)}"
            )

            print(
                f"  novos commits: {new_commits}"
            )

            print(
                f"  associações:   {new_associations}"
            )

            total_new_commits += new_commits
            total_new_associations += (
                new_associations
            )

        except subprocess.CalledProcessError as exc:
            print(
                f"  ERRO executando Git: "
                f"{exc.stderr.strip()}",
                file=sys.stderr,
            )

        except Exception as exc:
            print(
                f"  ERRO: {exc}",
                file=sys.stderr,
            )

        print()

    print("Sincronização concluída.")
    print(
        f"Novos commits: {total_new_commits}"
    )
    print(
        f"Novas associações: "
        f"{total_new_associations}"
    )


def list_commits(conn, identity_id=None):
    """
    Saída:

    hash|repository.git|author_name|author_email|date|subject
    """

    if identity_id is None:
        rows = conn.execute(
            """
            SELECT
                c.hash,
                r.name,
                c.author_name,
                c.author_email,
                c.commit_date,
                c.subject
            FROM commits c
            JOIN repositories r
                ON r.name = c.repository_name
            ORDER BY c.commit_date
            """
        ).fetchall()

    else:
        rows = conn.execute(
            """
            SELECT
                c.hash,
                r.name,
                c.author_name,
                c.author_email,
                c.commit_date,
                c.subject
            FROM commits c
            JOIN repositories r
                ON r.name = c.repository_name
            JOIN commit_identities ci
                ON ci.repository_name = c.repository_name
                AND ci.commit_hash = c.hash
            WHERE ci.identity_id = ?
            ORDER BY c.commit_date
            """,
            (identity_id,),
        ).fetchall()

    for row in rows:
        print(
            "|".join(
                str(value)
                if value is not None
                else ""
                for value in row
            )
        )


def heatmap(conn, identity_id):
    """
    Saída:

    YYYY-MM-DD|quantidade
    """

    rows = conn.execute(
        """
        SELECT
            date(c.commit_date) AS day,
            COUNT(*) AS commits
        FROM commits c
        JOIN commit_identities ci
            ON ci.repository_name = c.repository_name
            AND ci.commit_hash = c.hash
        WHERE ci.identity_id = ?
        GROUP BY day
        ORDER BY day
        """,
        (identity_id,),
    ).fetchall()

    for day, count in rows:
        print(
            f"{day}|{count}"
        )


def repository_stats(conn, identity_id):
    """
    Saída:

    repository.git|quantidade
    """

    rows = conn.execute(
        """
        SELECT
            r.name,
            COUNT(*) AS commits
        FROM commits c
        JOIN repositories r
            ON r.name = c.repository_name
        JOIN commit_identities ci
            ON ci.repository_name = c.repository_name
            AND ci.commit_hash = c.hash
        WHERE ci.identity_id = ?
        GROUP BY r.name
        ORDER BY commits DESC, r.name
        """,
        (identity_id,),
    ).fetchall()

    for repository, count in rows:
        print(
            f"{repository}|{count}"
        )


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Agregador de commits de múltiplos "
            "repositórios Git."
        )
    )

    parser.add_argument(
        "--config",
        default="config.json",
        help="Arquivo de configuração.",
    )

    subparsers = parser.add_subparsers(
        dest="command"
    )

    subparsers.add_parser(
        "sync",
        help="Sincroniza os repositórios.",
    )

    subparsers.add_parser(
        "identities",
        help="Lista as identidades configuradas.",
    )

    commits_parser = subparsers.add_parser(
        "commits",
        help="Lista commits.",
    )

    commits_parser.add_argument(
        "--identity",
        type=int,
    )

    heatmap_parser = subparsers.add_parser(
        "heatmap",
        help="Gera dados para o heatmap.",
    )

    heatmap_parser.add_argument(
        "--identity",
        type=int,
        required=True,
    )

    repository_stats_parser = subparsers.add_parser(
        "repository-stats",
        help="Mostra commits por repositório.",
    )

    repository_stats_parser.add_argument(
        "--identity",
        type=int,
        required=True,
    )

    args = parser.parse_args()

    try:
        config = load_config(
            args.config
        )

        if "database" not in config:
            raise RuntimeError(
                "config.json precisa de "
                "'database'."
            )

        if "repositories_dir" not in config:
            raise RuntimeError(
                "config.json precisa de "
                "'repositories_dir'."
            )

        conn = connect_database(
            config["database"]
        )

        if args.command == "sync":
            sync(
                config,
                conn,
            )

        elif args.command == "identities":
            sync_identities(
                conn,
                config,
            )

            for identity_id, name, email in (
                get_identities(conn)
            ):
                print(
                    f"{identity_id}: "
                    f"{name} <{email}>"
                )

        elif args.command == "commits":
            list_commits(
                conn,
                args.identity,
            )

        elif args.command == "heatmap":
            heatmap(
                conn,
                args.identity,
            )

        elif args.command == "repository-stats":
            repository_stats(
                conn,
                args.identity,
            )

        else:
            parser.print_help()

        conn.close()

    except KeyboardInterrupt:
        print(
            "\nInterrompido.",
            file=sys.stderr,
        )
        sys.exit(130)

    except Exception as exc:
        print(
            f"ERRO: {exc}",
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()

