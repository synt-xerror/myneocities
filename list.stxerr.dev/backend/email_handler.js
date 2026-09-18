import express         from "express";
import Database        from "better-sqlite3";
import rateLimit       from "express-rate-limit";
import { sendMail }    from "./enviar.js";

const app = express();
const db  = new Database("database.db");

app.use(express.json());

console.log("[init] Starting server...");

db.exec(`
CREATE TABLE IF NOT EXISTS pending (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       VARCHAR(255) NOT NULL,
  token       VARCHAR(64)  NOT NULL,
  type        VARCHAR(20)  NOT NULL,
  expires_at  TIMESTAMP    NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
`);
db.exec(`
CREATE TABLE IF NOT EXISTS subscribers (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  email          VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

console.log("[init] Tables verified/created successfully.");

// ─── Helpers ───────────────────────────────────────────────────────────────────

function createEmailEvent(email, type) {
  console.log(`[createEmailEvent] Creating "${type}" event for ${email}`);
  const now     = new Date().toISOString();
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const token   = Math.random().toString(36).substring(2, 8).toUpperCase();
  db.prepare(`
    INSERT INTO pending (email, token, type, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(email, token, type, expires, now);
  console.log(`[createEmailEvent] Event created — token: ${token}, expires at: ${expires}`);
  return { token, expires };
}

function subscribe(email) {
  console.log(`[subscribe] Subscribing ${email}`);
  db.prepare(`INSERT INTO subscribers (email) VALUES (?)`).run(email);
  console.log(`[subscribe] ${email} subscribed successfully.`);
}

function deletePending(email) {
  console.log(`[deletePending] Removing pending entries for ${email}`);
  db.prepare(`DELETE FROM pending WHERE email = ?`).run(email);
}

// ─── Routes ────────────────────────────────────────────────────────────────────

app.post("/sub", (req, res) => {
  const { email } = req.body;
  console.log(`[POST /sub] Request received — email: ${email}`);
  const result = createEmailEvent(email, "sub");
  try {
    sendMail(email, result.token, "verify");
    console.log(`[POST /sub] Verification email sent to ${email}`);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
  res.json({ token: result.token, expiresAt: result.expires });
});

app.post("/unsub", (req, res) => {
  const { email } = req.body;
  console.log(`[POST /unsub] Request received — email: ${email}`);
  const result = createEmailEvent(email, "unsub");
  try {
    sendMail(email, result.token, "verify");
    console.log(`[POST /unsub] Verification email sent to ${email}`);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
  res.json({ token: result.token, expiresAt: result.expires });
});

const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: "too_many_attempts" },
});

app.post("/verify", verifyLimiter, (req, res) => {
  const { email, userToken } = req.body;
  console.log(`[POST /verify] Request received — email: ${email}, token: ${userToken}`);

  const row = db.prepare(`
    SELECT email, token, type, expires_at
    FROM pending
    WHERE email = ? AND token = ?
  `).get(email, userToken);

  if (!row) {
    console.warn(`[POST /verify] Invalid token for ${email}`);
    return res.status(400).json({ error: "invalid_token" });
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    console.warn(`[POST /verify] Expired token for ${email} (expired at ${row.expires_at})`);
    return res.status(400).json({ error: "time_expired" });
  }

  console.log(`[POST /verify] Valid token — type: ${row.type}, processing...`);

  if (row.type === "sub") {
    subscribe(email);
    try {
      sendMail(email, "", "welcome");
      console.log(`[POST /verify] Welcome email sent to ${email}`);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }
  } else if (row.type === "unsub") {
    console.log(`[POST /verify] Removing ${email} from subscribers`);
    db.prepare(`DELETE FROM subscribers WHERE email = ?`).run(email);
    try {
      sendMail(email, "", "goodbye");
      console.log(`[POST /verify] Goodbye email sent to ${email}`);
    } catch (err) {
      console.error("Failed to send goodbye email:", err);
    }
  }

  deletePending(email);
  console.log(`[POST /verify] Flow completed successfully for ${email}`);
  return res.status(200).json({ status: "ok" });
});

app.get("/status/:email", (req, res) => {
  const { email } = req.params;
  console.log(`[GET /status] Checking status for ${email}`);

  const subscribed = db.prepare(`SELECT 1 FROM subscribers WHERE email = ?`).get(email);
  const pending    = db.prepare(`
    SELECT type, expires_at FROM pending
    WHERE email = ? AND expires_at > datetime('now')
    ORDER BY expires_at DESC LIMIT 1
  `).get(email);

  const status = {
    subscribed: !!subscribed,
    pending: pending ? { type: pending.type, expiresAt: pending.expires_at } : null,
  };

  console.log(`[GET /status] Result for ${email}:`, status);
  return res.json(status);
});

// ─── Expired pending cleanup ───────────────────────────────────────────────────

setInterval(() => {
  const result = db.prepare(`DELETE FROM pending WHERE expires_at <= datetime('now')`).run();
  if (result.changes > 0)
    console.log(`[cleanup] Removed ${result.changes} expired pending entr${result.changes === 1 ? "y" : "ies"}.`);
}, 60 * 1000);

app.listen(3001, () => {
  console.log("[init] Server running on port 3001");
});
