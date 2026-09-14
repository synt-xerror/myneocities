#!/usr/bin/env node

"use strict";

const fs   = require("fs");
const path = require("path");

const SRC = __dirname;
const OUT = path.join(SRC, "dist", "index.html");

const NAV = [
  { id: "blog",        label: "blog",         ext: null },
  { id: "about",       label: "about",        ext: null },
  { id: "projects",    label: "projects",     ext: null },
  { id: "arts",        label: "arts",         ext: null },
  { id: "mailing",     label: "mailing list", ext: null },
  { id: "radio",       label: "radio",        ext: null },
  { id: null,          label: "git",          ext: "https://git.stxerr.dev" },
  { id: null,          label: "youtube",      ext: "https://www.youtube.com/@synt-xerror" },
  { id: null,          label: "cool video",   ext: "https://youtu.be/vgRB0JIr37g?si=8gKz2H2qcuYLew45" },
];

// ── UTILITIES ─────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
}

function readDir(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(ext)).sort();
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── POST PARSER ───────────────────────────────────────────────────────────

function parseTxt(raw, filename) {
  const lines   = raw.split("\n");
  const meta    = {};
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\w+):\s*(.*)$/);
    if (m) {
      meta[m[1].trim()] = m[2].trim();
      bodyStart = i + 1;
    } else {
      if (lines[i].trim() === "" && i === bodyStart) bodyStart = i + 1;
      break;
    }
  }

  const body = lines.slice(bodyStart).join("\n").trim();

  const fm = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  const dateRaw = meta.date || (fm ? fm[1] : "");
  const months  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let dateStr   = dateRaw;
  if (dateRaw.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, mo, d] = dateRaw.split("-");
    dateStr = `${parseInt(d)} ${months[parseInt(mo) - 1]} ${y}`;
  }

  return { ...meta, date: dateStr, dateRaw, body };
}

function wrap(text, width, indent) {
  return text.split("\n").map(line => {
    if (line.trim() === "") return "";
    const words = line.split(" ");
    const lines = [];
    let cur = indent;
    for (const word of words) {
      if (cur.length + word.length > width && cur.trim() !== "") {
        lines.push(cur.trimEnd());
        cur = indent + word + " ";
      } else {
        cur += word + " ";
      }
    }
    if (cur.trim()) lines.push(cur.trimEnd());
    return lines.join("\n");
  }).join("\n");
}

function manpagePost(meta, body, backHref, prevLink, nextLink) {
  const tag     = esc(meta.tag || "");
  const date    = esc(meta.date || "");
  const bodyEsc = esc(body);

  return `
    <div class="manpage-wrap">
      <a class="back" href="#${backHref}">&lt; back</a>
      <pre class="manpage"><span class="header"><a href="#blog">SYNTAXERROR</a>(1)                   ${tag ? tag.toUpperCase() : "BLOG"}                   <a href="#blog">SYNTAXERROR</a>(1)</span>

<span class="section">NAME</span>
     ${esc(meta.title || "untitled")}

<span class="section">SYNOPSIS</span>
     date: ${date}${tag ? `\n     tag:  ${tag}` : ""}

<span class="section">DESCRIPTION</span>
${wrap(bodyEsc, 72, "     ")}
${prevLink || nextLink ? `
<span class="section">SEE ALSO</span>
     ${[prevLink, nextLink].filter(Boolean).join(", ")}` : ""}</pre>
    </div>`;
}

// ── BLOG ──────────────────────────────────────────────────────────────────

function buildBlog() {
  const files = readDir(path.join(SRC, "blog"), ".txt").reverse();

  if (!files.length) {
    return `
    <section class="page" id="blog">
      <div class="content-area">
        <h2>blog</h2>
        <p>no posts yet.</p>
      </div>
    </section>`;
  }

  const posts = files.map((filename, i) => {
    const raw  = fs.readFileSync(path.join(SRC, "blog", filename), "utf8");
    const meta = parseTxt(raw, filename);
    const id   = "blog-" + slugify(filename.replace(/\.txt$/, ""));
    return { id, filename, meta, index: i };
  });

  console.log(`   ${posts.length} post(s)`);

  const listItems = posts.map(p => `
        <a href="#${p.id}">
          <span class="date">${esc(p.meta.date)}</span>
          <span>${esc(p.meta.title || p.filename)}</span>
          ${p.meta.tag ? `<span class="tag">${esc(p.meta.tag)}</span>` : ""}
        </a>`).join("\n");

  const listSection = `
    <section class="page" id="blog">
      <div class="content-area">
        <h2>blog</h2>
        <div class="list">
          ${listItems}
        </div>
      </div>
    </section>`;

  const postSections = posts.map((p, i) => {
    const prev = posts[i + 1];
    const next = posts[i - 1];
    const prevLink = prev ? `<a href="#${prev.id}">${esc(prev.meta.title)}</a>` : null;
    const nextLink = next ? `<a href="#${next.id}">${esc(next.meta.title)}</a>` : null;
    return `
    <section class="page" id="${p.id}">
      <div class="content-area">
        ${manpagePost(p.meta, p.meta.body, "blog", prevLink, nextLink)}
      </div>
    </section>`;
  }).join("\n");

  return listSection + "\n" + postSections;
}

// ── ABOUT ─────────────────────────────────────────────────────────────────

function buildAbout() {
  const fp  = path.join(SRC, "about.txt");
  const raw = fs.existsSync(fp) ? fs.readFileSync(fp, "utf8") : "nothing here yet.";

  return `
    <section class="page" id="about">
      <div class="content-area">
        <h2>about</h2>
        <pre>${esc(raw)}</pre>
      </div>
    </section>`;
}

// ── PROJECTS ──────────────────────────────────────────────────────────────

function buildProjects() {
  const fp = path.join(SRC, "projects.json");
  let projects = [];
  if (fs.existsSync(fp)) projects = JSON.parse(fs.readFileSync(fp, "utf8"));

  const rows = projects.map(p => `
          <a href="${esc(p.url)}" target="_blank" rel="noopener">
            <span class="name">${esc(p.name)}</span>
            <span>${esc(p.desc)}</span>
            <span class="status ${esc(p.status)}">${esc(p.status)}</span>
          </a>`).join("\n");

  return `
    <section class="page" id="projects">
      <div class="content-area">
        <h2>projects</h2>
        <div class="project-list">
          ${rows || "<p>no projects listed yet.</p>"}
        </div>
      </div>
    </section>`;
}

// ── ARTS ──────────────────────────────────────────────────────────────────

function buildArts() {
  const files = readDir(path.join(SRC, "arts"), ".txt").reverse();

  if (!files.length) {
    return `
    <section class="page" id="arts">
      <div class="content-area">
        <h2>arts</h2>
        <p>nothing posted yet.</p>
      </div>
    </section>`;
  }

  const entries = files.map(filename => {
    const raw  = fs.readFileSync(path.join(SRC, "arts", filename), "utf8");
    const meta = parseTxt(raw, filename);
    const id   = "art-" + slugify(filename.replace(/\.txt$/, ""));
    return { id, filename, meta };
  });

  console.log(`   ${entries.length} art(s)`);

  const listItems = entries.map(e => `
        <a href="#${e.id}">
          <span class="date">${esc(e.meta.date)}</span>
          <span>${esc(e.meta.title || e.filename)}</span>
          ${e.meta.media ? `<span class="tag">${esc(e.meta.media)}</span>` : ""}
        </a>`).join("\n");

  const listSection = `
    <section class="page" id="arts">
      <div class="content-area">
        <h2>arts</h2>
        <div class="list">
          ${listItems}
        </div>
      </div>
    </section>`;

  const entrySections = entries.map(e => {
    const img = e.meta.file
      ? `\n        <img src="arts/${esc(e.meta.file)}" alt="${esc(e.meta.title || "")}">`
      : "";
    return `
    <section class="page" id="${e.id}">
      <div class="content-area">
        <a class="back" href="#arts">&lt; back</a>
        <h3>${esc(e.meta.title || "untitled")}</h3>
        <p class="meta">${esc(e.meta.date)}${e.meta.media ? " &mdash; " + esc(e.meta.media) : ""}</p>
        ${img}
        ${e.meta.body ? `<pre>${esc(e.meta.body)}</pre>` : ""}
      </div>
    </section>`;
  }).join("\n");

  return listSection + "\n" + entrySections;
}

// ── MAILING LIST ──────────────────────────────────────────────────────────

function buildMailing() {
  return `
    <section class="page" id="mailing">
      <div class="content-area">
        <h2>mailing list</h2>
        <p>address: <code>devel@stxerr.dev</code></p>

        <p>
To subscribe, type your email in this box and click "subscribe". After this, you will 
be able to send and receive every email from it. Otherwise, you can unsubscribe using
the button "unsubscribe".
        </p>

        <div class="mailing-form" id="mailing-form">
          <input name="email" placeholder="devel@stxerr.dev" id="mailing-email" type="email">
          <button type="button" id="subButton">subscribe</button>
          <button type="button" id="unsubButton">unsubscribe</button>
        </div>

        <div id="mailing-confirm" hidden>
          <p>enter the code sent to your email:</p>
          <div class="mailing-form">
            <input id="mailing-code" type="text" placeholder="000000">
            <button type="button" id="confirmButton">confirm</button>
          </div>
        </div>

        <p id="mailing-error" hidden style="color:var(--red);margin-top:8px;"></p>

        <h3>why?</h3>
        <p>
Good question, I don't have so much contributors to have the real need for a mailing list. 
But, when people finally (somehow) get some interest in my projects, I have a cool mailing 
list for sending patches. BUT (a really big "BUT"), you can send whatever you want, not 
just patches and code stuff, this mailing list is for everyone, like a secret obscure 
forum to send to everyone pictures of... funny cats.
        </p>
        <p>
In another perspective, mailing lists are so freaking cool, and I have my own. I will 
post how this mailing list works in my blog some day.
        </p>
        <p>What are you waiting for? Subscribe now and join our discussion :)</p>
      </div>
    </section>`;
}

// ── RADIO ─────────────────────────────────────────────────────────────────

function buildRadio() {
  const fp = path.join(SRC, "radio.json");
  let playlist = [];
  if (fs.existsSync(fp)) playlist = JSON.parse(fs.readFileSync(fp, "utf8"));

  return `
    <section class="page" id="radio">
      <div class="content-area">
        <h2>radio</h2>
        <div class="radio-player">
          <div class="radio-track" id="radio-title">--</div>
          <div class="radio-artist" id="radio-artist">--</div>
          <audio id="radio-audio" preload="none"></audio>
          <div class="radio-controls">
            <button class="radio-btn" id="radio-prev">prev</button>
            <button class="radio-btn radio-btn-main" id="radio-play">play</button>
            <button class="radio-btn" id="radio-next">next</button>
          </div>
          <div class="radio-progress">
            <span id="radio-time">0:00</span>
            <input type="range" id="radio-seek" min="0" max="100" value="0" step="0.1">
            <span id="radio-duration">0:00</span>
          </div>
        </div>
        <ul class="radio-playlist" id="radio-playlist"></ul>
      </div>
    </section>
    <script>window.__PLAYLIST__ = ${JSON.stringify(playlist)};</script>`;
}

// ── NAV ───────────────────────────────────────────────────────────────────

function buildNav() {
  const items = NAV.map(item => {
    if (item.ext) {
      // external: no visual distinction, but JS will intercept and show popup
      return `      <a href="${esc(item.ext)}" data-ext="1" target="_blank" rel="noopener">${esc(item.label)}</a>`;
    }
    return `      <a href="#${item.id}" data-section="${item.id}">${esc(item.label)}</a>`;
  }).join("\n");

  return `  <nav id="sidebar">
    <img src="/assets/buttons/stxerrdev.png" class="nav-logo">
${items}
  </nav>`;
}

// ── FULL HTML ─────────────────────────────────────────────────────────────

function buildHTML(nav, content) {
  return `<!DOCTYPE html>
<html lang="en">
<!--
  Generated by build.js -- do not edit manually.
  To rebuild: node build.js
-->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SyntaxError</title>
  <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
  <link rel="shortcut icon" href="favicon/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
  <link rel="manifest" href="favicon/site.webmanifest">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

${nav}

  <div id="main-content">
${content}
  </div>

<!-- external link popup -->
<div id="ext-popup" hidden>
  <p>you are leaving for:</p>
  <code id="ext-url"></code>
  <div>
    <button id="ext-cancel">cancel</button>
    <button id="ext-go">go</button>
  </div>
</div>

<script src="script.js"></script>
</body>
</html>`;
}

// ── MAIN ──────────────────────────────────────────────────────────────────

function main() {
  console.log("building stxerr.dev...\n");

  const dist = path.join(SRC, "dist");
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });

  console.log("blog...");     const blog      = buildBlog();
  console.log("about...");    const about     = buildAbout();
  console.log("projects..."); const projects  = buildProjects();
  console.log("arts...");     const arts      = buildArts();
  console.log("mailing...");  const mailing   = buildMailing();
  console.log("radio...");    const radio     = buildRadio();

  const nav     = buildNav();
  const content = [blog, about, projects, arts, mailing, radio].join("\n");
  const html    = buildHTML(nav, content);

  fs.writeFileSync(OUT, html, "utf8");

  const kb = (html.length / 1024).toFixed(1);
  console.log(`\ndone -> dist/index.html (${kb} KB)`);
}

main();
