#!/usr/bin/env node
"use strict";

// usage: node new-post.js posts/2026-05-21-first-post.txt
//
// - adds entry to posts.html index
// - regenerates rss.xml

const fs   = require("fs");
const path = require("path");

const ROOT      = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "posts");
const INDEX     = path.join(ROOT, "posts.html");
const RSS       = path.join(ROOT, "rss.xml");
const SITE_URL  = "https://stxerr.dev";

// ── UTILS ─────────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDate(str) {
  if (!str) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return str;
  return `${parseInt(m[3])} ${months[parseInt(m[2]) - 1]} ${m[1]}`;
}

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
}

// ── POST PARSER ───────────────────────────────────────────────────────────────

function parsePost(file) {
  const ext  = path.extname(file).toLowerCase();
  const base = path.basename(file);
  const raw  = readFile(path.join(POSTS_DIR, file));

  const fm      = base.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.[^.]+$/);
  const dateRaw = fm ? fm[1] : "";

  if (ext === ".html") {
    const titleMatch = raw.match(/<title[^>]*>([^<]*)<\/title>/i);
    const tagMatch   = raw.match(/<meta\s+name=["']tag["']\s+content=["']([^"']*)["']/i);
    const dateMatch  = raw.match(/<meta\s+name=["']date["']\s+content=["']([^"']*)["']/i);
    return {
      file, ext,
      title:   titleMatch ? titleMatch[1].trim() : base,
      tag:     tagMatch   ? tagMatch[1].trim()   : "",
      date:    fmtDate(dateMatch ? dateMatch[1].trim() : dateRaw),
      dateRaw: dateMatch  ? dateMatch[1].trim()  : dateRaw,
      desc:    "",
    };
  }

  if (ext === ".txt") {
    const lines = raw.split("\n");
    const meta  = {};
    let bodyStart = 0;
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^(\w+):\s*(.+)$/);
      if (m) { meta[m[1].toLowerCase()] = m[2].trim(); bodyStart = i + 1; }
      else if (lines[i].trim() === "" && i === bodyStart) bodyStart = i + 1;
      else break;
    }
    const body = lines.slice(bodyStart).join("\n").trim();
    return {
      file, ext,
      title:   meta.title   || base,
      tag:     meta.tag     || "",
      date:    fmtDate(meta.date || dateRaw),
      dateRaw: meta.date    || dateRaw,
      desc:    body.slice(0, 160).replace(/\n/g, " "),
    };
  }

  return { file, ext, title: base, tag: "", date: fmtDate(dateRaw), dateRaw, desc: "" };
}

// ── SCAN ALL POSTS ────────────────────────────────────────────────────────────

function scanPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => !f.startsWith("."))
    .sort()
    .reverse()
    .map(parsePost);
}

// ── GENERATE posts.html ───────────────────────────────────────────────────────

function buildIndex(posts) {
  const rows = posts.map(p => {
    const slug = p.file.replace(/\.[^.]+$/, ".html");
    return `
  <a href="/posts/${esc(slug)}">
    <span class="date">${esc(p.date)}</span>
    <span>${esc(p.title)}</span>
    ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : `<span></span>`}
  </a>`;
  }).join("");

  const nav  = buildNav("posts");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Posts — SyntaxError</title>
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
  <h2>Posts</h2>
  <div class="list">${rows}
  </div>
</div>
</div>
<script src="/script.js"></script>
</body>
</html>`;
}

// ── GENERATE rss.xml ──────────────────────────────────────────────────────────

function buildRSS(posts) {
  const items = posts.map(p => {
    const slug = p.file.replace(/\.[^.]+$/, ".html");
    const url  = `${SITE_URL}/posts/${slug}`;
    const date = p.dateRaw ? new Date(p.dateRaw).toUTCString() : "";
    return `
  <item>
    <title>${esc(p.title)}</title>
    <link>${esc(url)}</link>
    <description>${esc(p.desc)}</description>
    <pubDate>${date}</pubDate>
    <guid>${esc(url)}</guid>
  </item>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SyntaxError</title>
    <link>${SITE_URL}</link>
    <description>posts from stxerr.dev</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`;
}

// ── NAV HELPER ────────────────────────────────────────────────────────────────

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

// ── MAIN ──────────────────────────────────────────────────────────────────────

function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: node new-post.js posts/<filename>");
    process.exit(1);
  }

  const file = path.basename(arg);
  const dest = path.join(POSTS_DIR, file);

  if (!fs.existsSync(dest)) {
    console.error(`file not found: ${dest}`);
    process.exit(1);
  }

  console.log(`post: ${file}`);

  const posts = scanPosts();

  // generate individual post page if .txt or other non-html
  const ext = path.extname(file).toLowerCase();
  if (ext !== ".html") {
    const post    = posts.find(p => p.file === file);
    const raw     = readFile(dest);
    const content = ext === ".txt"
      ? `<pre class="post-text">${esc(raw.split("\n").slice(
          raw.split("\n").findIndex((l, i) => {
            if (i === 0) return false;
            return !l.match(/^\w+:\s*.+$/);
          })
        ).join("\n").trim())}</pre>`
      : `<pre class="post-code">${esc(raw)}</pre>`;

    const slug    = file.replace(/\.[^.]+$/, ".html");
    const postDir = path.join(ROOT, "posts");
    const outPath = path.join(postDir, slug);
    const nav     = buildNav("posts");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(post?.title || file)} — SyntaxError</title>
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
  <a class="back" href="/posts.html">&lt; back</a>
  <div class="post-wrap">
    ${content}
  </div>
</div>
</div>
<script src="/script.js"></script>
</body>
</html>`;

    fs.writeFileSync(outPath, html, "utf8");
    console.log(`  → posts/${slug}`);
  }

  // update posts.html
  fs.writeFileSync(INDEX, buildIndex(posts), "utf8");
  console.log(`  → posts.html`);

  // update rss.xml
  fs.writeFileSync(RSS, buildRSS(posts), "utf8");
  console.log(`  → rss.xml`);

  console.log("done.");
}

main();
