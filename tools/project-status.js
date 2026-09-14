#!/usr/bin/env node
"use strict";

// usage:
//   node projects.js                          — rebuild projects.html from data/projects.json
//   node projects.js --set manybot status wip — update a field and rebuild

const fs   = require("fs");
const path = require("path");

const ROOT     = path.join(__dirname, "..");
const DATA     = path.join(ROOT, "data", "projects.json");
const OUT      = path.join(ROOT, "projects.html");
const SITE_URL = "https://stxerr.dev";

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
}

function buildNav(active) {
  const navFile = path.join(ROOT, "data", "nav.json");
  if (!fs.existsSync(navFile)) return "";
  const nav = JSON.parse(readFile(navFile));
  return nav.map(item => {
    if (item.ext) return `<a href="${esc(item.ext)}" target="_blank" rel="noopener">${esc(item.label)}</a>`;
    const isActive = item.id === active;
    return `<a href="${esc(item.href)}"${isActive ? ' class="active"' : ""}>${esc(item.label)}</a>`;
  }).join("\n  ");
}

function buildPage(projects) {
  const cards = projects.map(p => `
  <div class="project-card">
    <div class="project-header">
      <span class="name">${esc(p.name)}</span>
      <span class="status ${esc(p.status)}">${esc(p.status)}</span>
    </div>
    <p class="desc">${esc(p.description)}</p>
    ${p.update ? `<p class="update">↳ ${esc(p.update)}</p>` : ""}
    ${p.url ? `<a class="project-link" href="${esc(p.url)}" target="_blank" rel="noopener">visit →</a>` : ""}
  </div>`).join("");

  const nav = buildNav("projects");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projects — SyntaxError</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
  <link rel="shortcut icon" href="/favicon/favicon.ico">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
<nav id="sidebar">
  <a href="/"><img src="/assets/logo.png" class="nav-logo" alt="SyntaxError"></a>
  ${nav}
</nav>
<div id="main">
<div class="content">
  <h2>Projects</h2>
  <div class="project-cards">${cards}
  </div>
</div>
</div>
<script src="/script.js"></script>
</body>
</html>`;
}

function main() {
  const args = process.argv.slice(2);

  if (!fs.existsSync(DATA)) {
    console.error("data/projects.json not found");
    process.exit(1);
  }

  const projects = JSON.parse(readFile(DATA));

  // --set <name> <field> <value>
  if (args[0] === "--set") {
    const [, name, field, ...rest] = args;
    const value = rest.join(" ");
    const proj  = projects.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!proj) { console.error(`project not found: ${name}`); process.exit(1); }
    proj[field] = value;
    fs.writeFileSync(DATA, JSON.stringify(projects, null, 2), "utf8");
    console.log(`updated ${proj.name}.${field} = "${value}"`);
  }

  fs.writeFileSync(OUT, buildPage(projects), "utf8");
  console.log(`→ projects.html`);
  console.log("done.");
}

main();
