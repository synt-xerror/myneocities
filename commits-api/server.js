#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

// Lê o mesmo config.json usado pelo script Python
// (precisa ter pelo menos a chave "database").
const CONFIG_PATH = process.env.CONFIG_PATH || path.join(__dirname, "config.json");

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Arquivo de configuração não encontrado: ${CONFIG_PATH}`);
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
}

let dbPath = process.env.DB_PATH;

if (!dbPath) {
  const config = loadConfig();
  dbPath = config.database;
}

if (!dbPath) {
  throw new Error("config.json precisa da chave 'database'.");
}

const db = new Database(dbPath, { readonly: true, fileMustExist: true });

const app = express();
app.use(cors());

// ---------------------------------------------------------------
// GET /identities
// [{ id, name, email }]
// ---------------------------------------------------------------
app.get("/identities", (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, name, email
       FROM identities
       ORDER BY id`
    )
    .all();

  res.json(rows);
});

// ---------------------------------------------------------------
// GET /repositories
// [{ name, path, last_sync_at }]
// ---------------------------------------------------------------
app.get("/repositories", (req, res) => {
  const rows = db
    .prepare(
      `SELECT name, path, last_sync_at
       FROM repositories
       ORDER BY name`
    )
    .all();

  res.json(rows);
});

// ---------------------------------------------------------------
// GET /heatmap?identity=ID  (identity é opcional)
// Sem identity, soma os commits de todas as identidades.
// Formato pronto pra heatmap de calendário (ex: cal-heatmap,
// react-calendar-heatmap): [{ date: "YYYY-MM-DD", count: N }]
// ---------------------------------------------------------------
app.get("/heatmap", (req, res) => {
  const identityId = req.query.identity ? parseInt(req.query.identity, 10) : null;

  let rows;

  if (identityId) {
    rows = db
      .prepare(
        `SELECT
           date(c.commit_date) AS date,
           COUNT(*) AS count
         FROM commits c
         JOIN commit_identities ci
           ON ci.repository_name = c.repository_name
           AND ci.commit_hash = c.hash
         WHERE ci.identity_id = ?
         GROUP BY date
         ORDER BY date`
      )
      .all(identityId);
  } else {
    rows = db
      .prepare(
        `SELECT
           date(c.commit_date) AS date,
           COUNT(*) AS count
         FROM commits c
         GROUP BY date
         ORDER BY date`
      )
      .all();
  }

  res.json(rows);
});

// ---------------------------------------------------------------
// GET /repository-stats?identity=ID  (identity é opcional)
// Formato pronto pra gráfico de barras/pizza:
// [{ repository: "nome.git", count: N }]
// ---------------------------------------------------------------
app.get("/repository-stats", (req, res) => {
  const identityId = req.query.identity ? parseInt(req.query.identity, 10) : null;

  let rows;

  if (identityId) {
    rows = db
      .prepare(
        `SELECT
           r.name AS repository,
           COUNT(*) AS count
         FROM commits c
         JOIN repositories r
           ON r.name = c.repository_name
         JOIN commit_identities ci
           ON ci.repository_name = c.repository_name
           AND ci.commit_hash = c.hash
         WHERE ci.identity_id = ?
         GROUP BY r.name
         ORDER BY count DESC, r.name`
      )
      .all(identityId);
  } else {
    rows = db
      .prepare(
        `SELECT
           r.name AS repository,
           COUNT(*) AS count
         FROM commits c
         JOIN repositories r
           ON r.name = c.repository_name
         GROUP BY r.name
         ORDER BY count DESC, r.name`
      )
      .all();
  }

  res.json(rows);
});

// ---------------------------------------------------------------
// GET /commits?identity=ID  (identity é opcional)
// [{ hash, repository, author_name, author_email, date, subject }]
// ---------------------------------------------------------------
app.get("/commits", (req, res) => {
  const identityId = req.query.identity ? parseInt(req.query.identity, 10) : null;

  let rows;

  if (identityId) {
    rows = db
      .prepare(
        `SELECT
           c.hash,
           r.name AS repository,
           c.author_name,
           c.author_email,
           c.commit_date AS date,
           c.subject
         FROM commits c
         JOIN repositories r
           ON r.name = c.repository_name
         JOIN commit_identities ci
           ON ci.repository_name = c.repository_name
           AND ci.commit_hash = c.hash
         WHERE ci.identity_id = ?
         ORDER BY c.commit_date`
      )
      .all(identityId);
  } else {
    rows = db
      .prepare(
        `SELECT
           c.hash,
           r.name AS repository,
           c.author_name,
           c.author_email,
           c.commit_date AS date,
           c.subject
         FROM commits c
         JOIN repositories r
           ON r.name = c.repository_name
         ORDER BY c.commit_date`
      )
      .all();
  }

  res.json(rows);
});

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Banco: ${dbPath}`);
});

