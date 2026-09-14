#!/usr/bin/env node
"use strict";

const fs = require("fs");

const SITE = "https://stxerr.dev";

const updates = [
  {
    title: "added changelog rss",
    description: "here i will put updates about my website",
    link: "/rss.xml",
  },
];

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const items = updates.map(update => `
    <item>
      <title>${escapeXml(update.title)}</title>
      <description>${escapeXml(update.description)}</description>
      <link>${SITE}${update.link}</link>
      <guid>${SITE}${update.link}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
`).join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">

  <channel>

    <title>SyntaxError! Changelog</title>
    <link>${SITE}</link>
    <description>site updates and changes</description>

${items}

  </channel>

</rss>
`;

fs.writeFileSync("rss.xml", rss);

console.log("generated rss.xml");
