const totalEl = document.getElementById("commits-today");
const reposList = document.getElementById("repos");
const monthChartEl = document.getElementById("month-chart");
const monthDetailsEl = document.getElementById("month-details");

const TIMEZONE = "America/Sao_Paulo";

function todayLocal() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function monthKey(dateStr) {
  return dateStr.slice(0, 7);
}

function monthLabel(key) {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function renderTodaySummary(commits) {
  const today = todayLocal();
  const todayCommits = commits.filter(c => c.date.slice(0, 10) === today);

  totalEl.textContent = todayCommits.length;

  const byRepo = new Map();
  for (const c of todayCommits) {
    if (!byRepo.has(c.repository)) byRepo.set(c.repository, []);
    byRepo.get(c.repository).push(c.subject);
  }

  reposList.innerHTML = "";

  for (const [repo, subjects] of byRepo) {
    const li = document.createElement("li");

    const toggle = document.createElement("a");
    toggle.textContent = `${subjects.length} on ${repo} - `;

    const gitA = document.createElement("a");
    gitA.href = `https://git.stxerr.dev/${repo}`;
    gitA.textContent = "view";
    toggle.appendChild(gitA);

    const details = document.createElement("ul");
    for (const subject of subjects) {
      const detailLi = document.createElement("li");
      detailLi.textContent = subject;
      details.appendChild(detailLi);
    }

    toggle.addEventListener("click", () => {
      details.style.display = details.style.display === "block" ? "none" : "block";
    });

    li.appendChild(toggle);
    li.appendChild(details);
    reposList.appendChild(li);
  }
}

function renderMonthChart(commits) {
  const byMonth = new Map();

  for (const c of commits) {
    const key = monthKey(c.date);
    if (!byMonth.has(key)) byMonth.set(key, new Map());
    const repoCounts = byMonth.get(key);
    repoCounts.set(c.repository, (repoCounts.get(c.repository) || 0) + 1);
  }

  const months = Array.from(byMonth.keys()).sort().slice(-12);
  const totals = months.map(key =>
    Array.from(byMonth.get(key).values()).reduce((sum, n) => sum + n, 0)
  );
  const max = Math.max(1, ...totals);

  function toggleMonthDetails(key, total) {
    if (monthDetailsEl.dataset.open === key) {
      monthDetailsEl.style.display = "none";
      monthDetailsEl.dataset.open = "";
      return;
    }

    const repoCounts = byMonth.get(key);
    const rows = Array.from(repoCounts.entries()).sort((a, b) => b[1] - a[1]);

    monthDetailsEl.innerHTML = "";

    const heading = document.createElement("strong");
    heading.textContent = `${monthLabel(key)}: ${total} commit${total === 1 ? "" : "s"}`;
    monthDetailsEl.appendChild(heading);

    const ul = document.createElement("ul");
    for (const [repo, count] of rows) {
      const li = document.createElement("li");
      const a = document.createElement("a");

      a.textContent = `${count} on ${repo}`;
      a.href = `https://git.stxerr.dev/${repo}`;
      
      li.appendChild(a)
      ul.appendChild(li);
    }
    monthDetailsEl.appendChild(ul);

    monthDetailsEl.style.display = "block";
    monthDetailsEl.dataset.open = key;
  }

  monthChartEl.innerHTML = "";

  months.forEach((key, i) => {
    const col = document.createElement("div");
    col.className = "month-col";

    const bar = document.createElement("div");
    bar.className = "month-bar";
    bar.style.height = `${Math.max(4, (totals[i] / max) * 100)}px`;
    bar.title = `${totals[i]} commit${totals[i] === 1 ? "" : "s"}`;
    bar.addEventListener("click", () => toggleMonthDetails(key, totals[i]));

    const label = document.createElement("div");
    label.className = "month-label";
    label.textContent = monthLabel(key);

    col.appendChild(bar);
    col.appendChild(label);
    monthChartEl.appendChild(col);
  });
}

(async () => {
  try {
    const commits = await fetchJSON("/commits-api/commits");
    renderTodaySummary(commits);
    renderMonthChart(commits);
  } catch (err) {
    console.error(err);
  }
})();

