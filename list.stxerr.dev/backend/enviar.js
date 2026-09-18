#!/usr/bin/env node

/**
 * enviar.js — email distribution + transactional mailer
 *
 * Exports: sendMail(email, token, type) — used by email_handler.js
 *
 * CLI usage:
 *   cat email.eml | node enviar.js               # redistribute incoming email
 *   node enviar.js <email> <token> verify         # send verification email
 *   node enviar.js <email> -      welcome         # send welcome email
 *   node enviar.js <email> -      goodbye         # send unsubscribe confirmation
 *
 * Dependencies: npm install better-sqlite3
 */

import fs           from "fs";
import path         from "path";
import { execSync } from "child_process";
import Database     from "better-sqlite3";

// ─── Config ────────────────────────────────────────────────────────────────────

const DB_PATH         = "/srv/maillist-webpage/backend/database.db";
const FROM_NOREPLY    = "noreply@stxerr.dev";
const FROM_LIST       = "devel@stxerr.dev";
const MSMTP_ACCOUNT   = "devel";
const LOG_FILE        = path.join(process.env.HOME, ".procmail.log");

// ─── Internal helpers ──────────────────────────────────────────────────────────

function log(msg) {
  fs.appendFileSync(LOG_FILE, `${new Date().toISOString()}: ${msg}\n`);
}

function sendRaw(to, subject, body, from = FROM_NOREPLY) {
  const raw = [`From: ${from}`, `To: ${to}`, `Subject: ${subject}`, ``, body].join("\n");
  execSync(`msmtp -a ${MSMTP_ACCOUNT} ${to}`, { input: raw });
}

function extractEmail(line) {
  const bracketed = line.match(/<([\w.+\-]+@[\w.\-]+)>/);
  if (bracketed) return bracketed[1];
  const bare = line.match(/([\w.+\-]+@[\w.\-]+)/);
  return bare ? bare[1] : null;
}

// ─── Main export (used by email_handler.js) ────────────────────────────────────

/**
 * Sends a transactional email.
 * @param {string} email  Recipient address
 * @param {string} token  Verification token (only used for type "verify")
 * @param {"verify"|"welcome"|"goodbye"} type
 */
export function sendMail(email, token, type) {
  if (type === "verify") {
    sendRaw(
      email,
      "Verify your email address.",
      `Hello! Before joining or leaving my mailing list, I need to make sure this email is yours:\n\n1. Go to https://list.stxerr.dev/verify.html?email=${email}\nVerification code: ${token}\n\nYou're receiving this email to confirm your subscription at SyntaxError mailing list. If you didn't request anything, please ignore this email.`
    );
  } else if (type === "welcome") {
    sendRaw(
      email,
      "Welcome to my mailing list!",
      `Hey! You actually joined it! :)\n\nThank you very much, you can expect emails coming at your inbox with conversations about nerdy stuff in the next hours or days.`
    );
  } else if (type === "goodbye") {
    sendRaw(
      email,
      "See you!",
      `I received your request to unsubscribe and your email has been DELETED from the list, I didn't save anything about you.\n\nYou can subscribe again anytime you want at https://list.stxerr.dev ;)`
    );
  } else {
    throw new Error(`Unknown type: "${type}". Use: verify | welcome | goodbye`);
  }
}

// ─── CLI mode — only runs when called directly ─────────────────────────────────

if (process.argv[1] === new URL(import.meta.url).pathname) {

  // Transactional mode: node enviar.js <email> <token> <type>
  if (process.argv.length >= 5) {
    const [,, email, token, type] = process.argv;
    try {
      sendMail(email, token, type);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
    process.exit(0);
  }

  // Distribution mode: cat email.eml | node enviar.js
  const rawEmail = fs.readFileSync("/dev/stdin", "utf8");
  const lines    = rawEmail.split(/\r?\n/);

  let sender     = null;
  let senderName = null;

  const returnPathLine = lines.find((l) => /^Return-Path:/i.test(l));
  if (returnPathLine) sender = extractEmail(returnPathLine);

  // Always check From: for the display name, regardless of Return-Path
  const fromLine = lines.find((l) => /^From:/i.test(l));
  if (fromLine) {
    if (!sender) sender = extractEmail(fromLine);
    // Extract display name from: From: Display Name <addr> or "Display Name" <addr>
    const nameMatch = fromLine.match(/^From:\s+"?([^"<]+?)"?\s+</i);
    if (nameMatch) senderName = nameMatch[1].trim();
  }

  if (!sender) {
    log("Could not determine sender, ignoring.");
    process.exit(0);
  }

  const db         = new Database(DB_PATH);
  const registered = db
    .prepare("SELECT EXISTS(SELECT 1 FROM subscribers WHERE email = ?) AS found")
    .get(sender).found;

  if (!registered) {
    log(`${sender} not registered, ignoring.`);
    sendRaw(sender, "Not subscribed",
      "Your email address is not registered on this mailing list.\n\nTo subscribe, visit: https://list.stxerr.dev"
    );
    db.close();
    process.exit(0);
  }

  const contentTypeLine = lines.find((l) => /^Content-Type:/i.test(l)) || "";
  const subjectLine     = lines.find((l) => /^Subject:/i.test(l))       || "";
  const subject         = subjectLine.replace(/^Subject:\s*/i, "").trim();

  if (/text\/html/i.test(contentTypeLine)) {
    log(`${sender} rejected - HTML email.`);
    sendRaw(sender, `Re: ${subject}`,
      "Your email was rejected.\n\nThis mailing list only accepts plain text emails.\nPlease configure your email client to send without HTML and try again."
    );
    db.close();
    process.exit(0);
  }

  const subscribers = db.prepare("SELECT email FROM subscribers").all().map((r) => r.email);
  db.close();

  // Extract only the body (everything after the first blank line)
  const blankIndex = lines.findIndex((l) => l.trim() === "");
  const body       = blankIndex !== -1 ? lines.slice(blankIndex + 1).join("\n").trim() : rawEmail;

  // Git patches are forwarded as-is, no sender header needed
  const isGitPatch = /\[PATCH/i.test(subject);
  const senderTag  = senderName ? `${senderName} <${sender}>` : sender;
  const cleanBody  = isGitPatch ? body : `From: ${senderTag}\n\n${body}`;

  let sent = 0, failed = 0;
  for (const recipient of subscribers) {
    try {
      sendRaw(recipient, subject, cleanBody, FROM_LIST);
      sent++;
    } catch (err) {
      log(`Failed to send to ${recipient}: ${err.message}`);
      failed++;
    }
  }

  log(`${sender} → distributed to ${sent} subscribers (${failed} failed).`);
}
