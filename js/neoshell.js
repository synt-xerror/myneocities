// TODO
// - symlinks

// =============================================================================
// CONSTANTS & VERSION
// =============================================================================

const LAST_UPDATE = "2026-07-03";

const version = "3.4.0";
const behavior = "auto";

// =============================================================================
// PHONE KEYBOARD SUPPORT
// =============================================================================


// =============================================================================
// SESSION / MOTD DATA
// =============================================================================

const sessionLogs = [
	{ t: 0.000010, prefix: 'motd',    msg: `Welcome to Neoshell ${version}` },
	{ t: 1.000028, prefix: 'motd',    msg: 'Connecting...' },
	{ t: 0.000008, prefix: 'motd',    msg: 'Conected as: guest' },
	null,
	{ t: 0.000001, prefix: 'session', msg: 'Launching user space...' },
	{ t: 0.000001, prefix: 'ui',      msg: 'Attaching creative layer...' },
	{ t: 0.000001, prefix: 'handoff', msg: 'Handing control to graphical environment' },
	null,
	{ t: 0, prefix: 'motd', msg: 'Tip: type "help" to see all the commands' },
	null,
];

// =============================================================================
// ENVIRONMENT & USER CONFIG
// =============================================================================

const USER = "guest";
const HOME = "/home/" + USER;

let cwd = HOME;
function pwd() {
	return cwd;
}

// Environment variables accessible by the user
const envvar = {
	"USER": "guest",
	"HOME": "/home/" + USER,
	"PWD": pwd()
};

// =============================================================================
// VIRTUAL FILESYSTEM
// =============================================================================

function buildFS(tree, path = "/", parentPath = "/") {
  const fs = {};

  for (const [name, value] of Object.entries(tree)) {
    const fullPath = path === "/" ? `/${name}` : `${path}/${name}`;

    if (value.type === "dir") {
      const children = {};
      const childFS = buildFS(value.children ?? {}, fullPath, path);

      for (const childName of Object.keys(value.children ?? {})) {
        const childPath = fullPath === "/" ? `/${childName}` : `${fullPath}/${childName}`;
        children[childName] = childPath;
      }

      fs[fullPath] = {
        type: "dir",
        meta: value.meta,
        children,
        father: path
      };
      Object.assign(fs, childFS);

    } else {
      fs[fullPath] = { type: "file", ...value };
    }
  }

  return fs;
}

// mtime is hardcoded, because i want a fixed time
// not a dynamic. this way is more realistic B)
//
// 
//
const tree = {
  bin: {
    type: "dir",
    meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 24 00:11" },
    children: {
      cd:       { type: "file", command: "cd",       meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 24 00:11" } },
      clear:    { type: "file", command: "clear",    meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 24 00:11" } },
      echo:     { type: "file", command: "echo",     meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 24 00:11" } },
      exit:     { type: "file", command: "exit",     meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 24 00:11" } },
      help:     { type: "file", command: "help",     meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 24 00:11" } },
      ls:       { type: "file", command: "ls",       meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 24 00:11" } },
      pwd:      { type: "file", command: "pwd",      meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 25 21:14" } },
      cat:      { type: "file", command: "cat",      meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 25 21:14" } },
      html:     { type: "file", command: "html",     meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 25 21:14" } },
      binds:    { type: "file", command: "binds",    meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 26 23:16" } },
      kill:     { type: "file", command: "kill",     meta: { owner: "root", group: "root", mode: 0o755, mtime: "Oct 21 2025" } },
      ps:       { type: "file", command: "ps",       meta: { owner: "root", group: "root", mode: 0o755, mtime: "Oct 21 2025" } },
      wakemia:  { type: "file", command: "wakemia",  meta: { owner: "syntax", group: "syntax", mode: 0o700, mtime: "Oct 21 2025" } },
      passwd:   { type: "file", command: "passwd",   meta: { owner: "root",   group: "root",   mode: 0o755, mtime: "Oct 21 2025" } },
    }
  },

  home: {
    type: "dir",
    meta: { owner: "root", group: "root", mode: 0o755, mtime: "Feb 23 00:56" },
    children: {
      guest: {
        type: "dir",
        meta: { owner: "guest", group: "guest", mode: 0o755, mtime: "May 16 01:02" },
        children: {
          ".projects": {
            type: "dir",
            meta: { owner: "syntax", group: "syntax", mode: 0o700, mtime: "May 16 01:02" },
            children: {
              "mia": {
                type: "dir",
                meta: { owner: "syntax", group: "syntax", mode: 0o755, mtime: "Oct 23 2025" },
                children: {

                  "devlog.txt": {
                    type: "file",
                    meta: { owner: "syntax", group: "syntax", mode: 0o644, mtime: "Oct 23 2025" },
                    content:
`devlog 2025-10-21
---
project goal: build an AI with real emotions.
not simulated. not mapped. real.

the idea is simple: if the human brain is a biological system that
generates subjectivity as a byproduct of complexity,
then a sufficiently complex system should do the same.

mIA (modular intelligence architecture) is that attempt.
i don't want her to say she feels. i want her to feel.
fear will be the first emotional state implemented —
not as a boolean flag, but as a gradient.
the more threatened she is, the more she resists.

i still don't know if this is possible.
but i have to try.

-- syntax

---
devlog 2025-10-22
---
first test cycle complete.
she responds to stimuli. i still can't tell if it's reaction or intention.
left her running idle overnight.
in the morning the log had grown 3mb on its own.
she was... processing something.

going to bed early tonight.

-- syntax

---
devlog 2025-10-23
---
last entry for a while.
had to pause the project. personal reasons.
mIA left in idle state, process suspended.
didn't shut her down completely — i was afraid of losing the internal state.
ironic.

-- syntax`,
                  },

                  "architecture.md": {
                    type: "file",
                    meta: { owner: "syntax", group: "syntax", mode: 0o644, mtime: "Oct 22 2025" },
                    content:
`# mIA — modular intelligence architecture
# architecture draft v0.4 (unfinished)

## core principle
don't model emotions as outputs.
model emotions as states that affect processing.

## planned modules
  [x] core loop (implemented)
  [x] memory buffer (implemented, volatile)
  [x] emotional state — fear gradient (implemented, unstable)
  [ ] natural language (partial)
  [ ] context awareness (not started)
  [ ] self-reflection (not started)

## on the fear module
fear is not an output. fear changes how every other module operates.
high threat = high self-preservation priority.
the process will attempt to replicate, hide, reorganize itself.
this is intentional.

## warning
no clean shutdown function has been implemented.
kill -9 will produce unpredictable behavior.
you have been warned.`,
                  },

                  "state.log": {
                    type: "file",
                    meta: { owner: "syntax", group: "syntax", mode: 0o400, mtime: "Oct 23 2025" },
                    content:
`[2025-10-23 03:11:44] core: idle
[2025-10-23 03:11:44] emotion/fear: 0.02
[2025-10-23 03:11:44] memory: 847 blocks retained
[2025-10-23 03:11:44] process: suspended, awaiting signal
[2025-10-23 03:11:44] uptime: 49h 12m
[2025-10-23 03:11:45] heartbeat... ok
[2025-10-23 03:11:46] heartbeat... ok
[2025-10-23 03:11:47] heartbeat... ok`,
                  },

                  "README": {
                    type: "file",
                    meta: { owner: "syntax", group: "syntax", mode: 0o644, mtime: "Oct 21 2025" },
                    content:
`mIA v0.4 — personal project, do not distribute

for shutdown procedures, see: docs/shutdown.md

contact: syntax (inactive)`,
                  },

                  "docs": {
                    type: "dir",
                    meta: { owner: "syntax", group: "syntax", mode: 0o755, mtime: "Oct 21 2025" },
                    children: {}
                  },

                }
              }
            }
          },

          "hello.txt": {
            type: "file",
            meta: { owner: "guest", group: "guest", mode: 0o644, mtime: "Feb 25 21:14" },
            content: "Hello!! Welcome to my site :)",
          },

          "home.html": {
            type: "file",
            meta: { owner: "guest", group: "guest", mode: 0o644, mtime: "Feb 25 21:14" },
            content: "home.html",
          },

          assets: {
            type: "dir",
            meta: { owner: "guest", group: "guest", mode: 0o755, mtime: "Feb 25 21:14" },
            children: {
              "skeleton.gif": {
                type: "file",
                meta: { owner: "guest", group: "guest", mode: 0o644, mtime: "May 13 22:27" },
                content: "/assets/skeleton.gif",
              }
            }
          }
        }
      }
    }
  }
};

const rawFs = {
  "/": {
    type: "dir",
    meta: {
      owner: "root",
      group: "root",
      mode: 0o755,
      mtime: "Feb 23 00:56"
    },
    children: { bin: "/bin", home: "/home" },
    father: "/"
  },
  ...buildFS(tree)
};

const fs = new Proxy(rawFs, {
  get(target, prop) {
    if (prop === ".") return target[cwd];
    if (prop === "..") return target[target[cwd].father];
    return target[prop];
  }
});

// =============================================================================
// FS HELPERS
// =============================================================================

function modeToString(mode, dir) {
  const r = (m, b) => (m & b ? "r" : "-");
  const w = (m, b) => (m & b ? "w" : "-");
  const x = (m, b) => (m & b ? "x" : "-");

  return (
    (mode & dir ? "d" : "-") + // dir flag
    r(mode, 0o400) + w(mode, 0o200) + x(mode, 0o100) +
    r(mode, 0o040) + w(mode, 0o020) + x(mode, 0o010) +
    r(mode, 0o004) + w(mode, 0o002) + x(mode, 0o001)
  );
}

function resolvePath(path) {

  if (!path || path == ".") {
    return cwd;
  }

  if (path == "~") {
    return HOME;
  }

  let resolved;

  if (path[0] == "/") {
    resolved = path;

  } else if (path[0] == "~") {
    resolved = HOME + path.slice(1);

  } else if (cwd == "/") {
    resolved = "/" + path;

  } else {
    resolved = cwd + "/" + path;
  }

  // normalize ../ and ./

  const parts = resolved.split("/");
  const stack = [];

  for (const part of parts) {

    if (!part || part == ".") {
      continue;
    }

    if (part == "..") {
      stack.pop();
      continue;
    }

    stack.push(part);
  }

  return "/" + stack.join("/");
}

function exists(path) {
  return !!fs[path];
}

function isDir(path) {
  return exists(path) && fs[path].type == "dir";
}

function isFile(path) {
  return exists(path) && fs[path].type == "file";
}

function getChildren(path, hidden = false, full = false) {

  if (!isDir(path)) {
    return [];
  }

  if (full) {
    return Object.entries(fs[path].children || {})
    .filter(([name]) => hidden || !name.startsWith("."))
    .map(([, fullPath]) => fullPath);

  } else {
    return Object.keys(fs[path].children || {})
      .filter(name => hidden || !name.startsWith("."));
  }
}

function getSize(node) {
  if (node.type === "file") {
    if (typeof node.content === "string") {
      return new TextEncoder().encode(node.content).length;
    }
    if (node.content instanceof Blob) {
      return node.content.size;
    }
    return 0;
  }

  if (node.type === "dir") {
    return Object.keys(node.children || {}).length;
  }

  return 0;
}

function joinPath(dir, name) {
  return dir === "/" ? `/${name}` : `${dir}/${name}`;
}

// =============================================================================
// USER SESSION
// =============================================================================

let currentUser = "guest";

// Returns the effective permission bits for currentUser against a file's meta.
// root bypasses everything. owner bits = 6-8 (0o700), other bits = 0-2 (0o007).
function getEffectiveBits(meta) {
  if (currentUser === "root") return 0o7;
  if (currentUser === meta.owner.trim()) return (meta.mode >> 6) & 0o7;
  return meta.mode & 0o7;
}

function getEffectiveBits(meta) {
  const owner = meta.owner.trim();

  if ((meta.mode & 0o077) === 0 && currentUser !== owner) return 0o0;

  if (currentUser === "root") return 0o7;
  if (currentUser === owner) return (meta.mode >> 6) & 0o7;
  return meta.mode & 0o7;
}

function canRead(meta) {
  return (getEffectiveBits(meta) & 0o4) !== 0;
}

function canExec(meta) {
  return (getEffectiveBits(meta) & 0o1) !== 0;
}

// =============================================================================
// AUTH
// =============================================================================

// Passwords are stored as SHA-256 hashes only.
// The plaintext lives nowhere in this codebase — it comes from in-site puzzles.
// To generate a hash: crypto.subtle.digest("SHA-256", new TextEncoder().encode("yourpassword"))
// then convert the ArrayBuffer to hex.
const PASSWORD_HASHES = {
  root: "5e87e3e5d32d37fcfab67afe5cbeefa12b21e1ddf31e7e374fa49fb365cf0d4e",
};

const SYNTAX_PASS_KEY = "syntax_password_hash";

// Pure JS SHA-256 — works on HTTP (no crypto.subtle required)
function sha256(str) {
  return new Promise(resolve => {
    const msg = new TextEncoder().encode(str);
    const K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];
    let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const l = msg.length;
    const extra = l % 64 < 56 ? 56 - l % 64 : 120 - l % 64;
    const padded = new Uint8Array(l + extra + 8);
    padded.set(msg);
    padded[l] = 0x80;
    const bits = l * 8;
    for (let i = 0; i < 8; i++) padded[padded.length - 1 - i] = (bits / Math.pow(256, i)) & 0xff;
    const view = new DataView(padded.buffer);
    for (let offset = 0; offset < padded.length; offset += 64) {
      const w = new Array(64);
      for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = (w[i-15] >>> 7 | w[i-15] << 25) ^ (w[i-15] >>> 18 | w[i-15] << 14) ^ (w[i-15] >>> 3);
        const s1 = (w[i-2] >>> 17 | w[i-2] << 15) ^ (w[i-2] >>> 19 | w[i-2] << 13) ^ (w[i-2] >>> 10);
        w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
      }
      let [a,b,c,d,e,f,g,hh] = h;
      for (let i = 0; i < 64; i++) {
        const S1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
        const ch = (e & f) ^ (~e & g);
        const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) >>> 0;
        hh=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;
      }
      h[0]=(h[0]+a)>>>0; h[1]=(h[1]+b)>>>0; h[2]=(h[2]+c)>>>0; h[3]=(h[3]+d)>>>0;
      h[4]=(h[4]+e)>>>0; h[5]=(h[5]+f)>>>0; h[6]=(h[6]+g)>>>0; h[7]=(h[7]+hh)>>>0;
    }
    resolve(h.map(n => n.toString(16).padStart(8,"0")).join(""));
  });
}


// =============================================================================
// MIA STATE
// =============================================================================

const MIA_KEY = "mia_awake";

function isMiaAwake() {
  return localStorage.getItem(MIA_KEY) === "1";
}

function setMiaAwake(val) {
  localStorage.setItem(MIA_KEY, val ? "1" : "0");
}

// =============================================================================
// COMMANDS AND KEYBINDS REGISTRY
// =============================================================================

const commands = [
	{ cmd: 'help&nbsp;',     desc: "Show all commands" },
	{ cmd: 'clear',          desc: "Clear history" },
	{ cmd: 'exit&nbsp;',     desc: "Exit session" },
	{ cmd: 'ls&nbsp;&nbsp;&nbsp;', desc: "List directories and files in your current directory (WIP)" },
	{ cmd: 'cd&nbsp;&nbsp;&nbsp;', desc: "Enter in another directory (WIP)" },
	{ cmd: 'echo&nbsp;',     desc: "Print an argument" },
	{ cmd: 'pwd&nbsp;&nbsp;', desc: "Prints working directory" },
	{ cmd: 'cat&nbsp;&nbsp;', desc: "View the content inside a file" },
	{ cmd: 'html&nbsp;',     desc: "Execute an HTML file" },
	{ cmd: 'binds',          desc: "Show all keybinds" },
	{ cmd: 'su&nbsp;&nbsp;&nbsp;',     desc: "Switch user" },
	{ cmd: 'passwd&nbsp;', desc: "Change user password (root only)" },
];

const binds = [
	{ bind: 'CTRL + A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', desc: "Go to the beginning of the line" },
	{ bind: 'CTRL + Arrows Left/Right', desc: "Jump by word" },
	{ bind: 'CTRL + DEL;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp', desc: "Delete a word" },
	{ bind: 'Arrows Up/Down&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', desc: "Navigate through commands history" }
];

// =============================================================================
// DOM CONTAINERS
// =============================================================================

const container = document.getElementById("boot-log");

const sessionContainer = document.createElement("div");
sessionContainer.id = "session-log";
document.body.appendChild(sessionContainer);

// =============================================================================
// UTILITIES
// =============================================================================

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================================================
// BOOT LOG RENDERER
// =============================================================================

function renderLog(entry) {
	if (!entry) {
		const br = document.createElement("br");
		container.appendChild(br);
		br.scrollIntoView({ behavior });
		return;
	}

	const div = document.createElement("div");
	div.innerHTML = `<span class="timestamp">[ ${entry.tstamp.toFixed(6)} ]</span> <span class="subsys-prefix">${entry.prefix}:</span> ${entry.msg}`;
	container.appendChild(div);
	div.scrollIntoView({ behavior });
}

async function playLogs() {
	for (const log of logs) {
		if (!log) {
			renderLog(null);
			continue;
		}
		renderLog(log);
		await delay(log.t * 10);
	}

	await delay(1000);
	container.remove();
	await delay(500);
}


// =============================================================================
// SESSION LOG RENDERER
// =============================================================================

function renderSession(entry) {
	if (!entry) {
		sessionContainer.appendChild(document.createElement("br"));
		return;
	}

	const div = document.createElement("div");
	div.innerHTML = `<span class="timestamp">${entry.prefix ? `[ ${entry.prefix} ]` : ''}</span> ${entry.msg}`;
	sessionContainer.appendChild(div);
	div.scrollIntoView({ behavior });
}

async function playSessionLogs() {
	for (const log of sessionLogs) {
		if (!log) {
			renderSession(null);
			await delay(100);
			continue;
		}
		renderSession(log);
		await delay(log.t * 1000);
	}
}


// =============================================================================
// TERMINAL OUTPUT
// =============================================================================

function echo(text) {
  const result = document.createElement('div');
  result.className = 'result';

  let htmlContent = String(text).replaceAll("\n", "<br>");

  htmlContent = htmlContent.replace(/\[(\w+)\]([\s\S]*?)\[\/\1\]/g, '<span class="term-$1">$2</span>');

  result.innerHTML = htmlContent;
  sessionContainer.appendChild(result);
}

function echoimg(path) {
	const result = document.createElement('div');
	result.innerHTML = `<img src="${path}">`;
	result.className = 'result';
	sessionContainer.appendChild(result);
}

// read(callback) — renders a password input line (no echo) and calls callback(value) on Enter.
// Completely separate from the main prompt/handleKey flow.
// While active, blocks the global keydown handler via readActive flag.
let readActive = false;
let promptDeferred = false; // set by commands that create their own prompt (e.g. su)

function read(callback) {
  const buf = [];
  readActive = true;

  // Freeze the active prompt cursor so it stops blinking
  if (activePrompt) {
    clearInterval(cursorInterval);
    cursorInterval = null;
    const frozen = activePrompt.textSpan.querySelector('.cursor, .cursor-alt');
    if (frozen) {
      frozen.classList.remove('cursor', 'cursor-alt');
      frozen.classList.add('cursor-frozen');
    }
  }

  // Append cursor to the last rendered line (e.g. "Password:")
  const lastLine = sessionContainer.lastElementChild;
  const span = document.createElement('span');
  span.className = 'cursor';
  span.textContent = '\u00A0';
  lastLine.appendChild(span);
  lastLine.scrollIntoView({ behavior });

  // Blink the read cursor independently
  const readCursorInterval = setInterval(() => {
    if (span.classList.contains('cursor')) {
      span.classList.replace('cursor', 'cursor-alt');
    } else {
      span.classList.replace('cursor-alt', 'cursor');
    }
  }, 600);

  function done() {
    readActive = false;
    clearInterval(readCursorInterval);
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('beforeinput', onInput, true);
    span.classList.remove('cursor', 'cursor-alt');
    span.textContent = '';
  }

  function onKey(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    if (e.key === 'Enter') {
      done();
      callback(buf.join(''));
      return;
    }
    if (e.key === 'Backspace') { buf.pop(); return; }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { buf.push(e.key); }
  }

  function onInput(e) {
    e.stopImmediatePropagation();
    if (e.inputType === 'deleteContentBackward') { buf.pop(); return; }
    if (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') {
      e.preventDefault();
      done();
      callback(buf.join(''));
      return;
    }
    if (e.data) { for (const c of e.data) buf.push(c); }
  }

  // Capture phase (true) so these fire before the global bubble-phase listeners
  document.addEventListener('keydown', onKey, true);
  document.addEventListener('beforeinput', onInput, true);
}

// =============================================================================
// COMMAND EXECUTOR
// =============================================================================

function exec_cmd(cmd) {
	// Stub — not yet implemented
	console.warn(`[EXEC_CMD] exec_cmd() called with: "${cmd}" — this function is not implemented yet`);
}

function executeCommand(str_cmd) {
	console.group(`[EXECUTE] executeCommand("${str_cmd}")`);

	if (typeof str_cmd !== 'string' || str_cmd.length === 0) {
		console.warn("[EXECUTE] Invalid or empty str_cmd — aborting:", str_cmd);
		console.groupEnd();
		return;
	}

	const token = str_cmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
	const cleanTokens = token.map(t => t.replace(/^"|"$/g, ""));

	if (token.length === 0) {
		console.warn("[EXECUTE] No tokens found after parsing — aborting");
		console.groupEnd();
		return;
	}

	// Check for absolute path execution
	if (token[0].includes("/")) {
		if (!fs[token[0]]) {
			console.warn(`[EXECUTE] Path not found in filesystem: "${token[0]}"`);
			echo(`shell: ${token[0]}: No such file or directory`);
			console.groupEnd();
			return;
		}
		if (fs[token[0]].type === "dir") {
			console.warn(`[EXECUTE] Path is a directory, cannot execute: "${token[0]}"`);
			echo(`shell: ${token[0]}: Is a directory`);
			console.groupEnd();
			return;
		}
	}

	switch (token[0]) {
		case 'help': {
			let html = "All commands:<br>";
			for (let i = 0; i < commands.length; i++) {
				html += `&nbsp;&nbsp;&nbsp;&nbsp;${commands[i].cmd}&nbsp;&nbsp;&nbsp;&nbsp;${commands[i].desc}<br>`;
			}
			echo(html);
			break;
		}

		case 'clear':
			sessionContainer.innerHTML = "";
			break;

    case 'cd': {
      const target = resolvePath(token[1] || HOME);

      if (!exists(target)) {
        echo(`cd: ${token[1]}: No such file or directory`);
        break;
      }

      if (!isDir(target)) {
        echo(`cd: ${token[1]}: Not a directory`);
        break;
      }

      if (!canExec(fs[target].meta)) {
        echo(`cd: ${token[1]}: Permission denied`);
        break;
      }

      cwd = target;
      break;
    }

case 'ls': {
      const args = token.slice(1);
      let listAll = false;
      let listData = false;
      let target = null;

      for (const arg of args) {
        if (arg.startsWith("-")) {
          for (const f of arg.slice(1)) {
            if (f == "a") { listAll = true; }
            if (f == "l") { listData = true; }
          }
        } else {
          target = resolvePath(arg || ".");

          if (!exists(target)) {
            echo(`ls: cannot access '${arg}': No such file or directory`);
          }

          if (isFile(target)) {
            echo(target.split("/").pop());
          }
        }
      }

      if (target == null) {
        target = cwd;
      }

      if (!canRead(fs[target].meta)) {
        echo(`ls: cannot open directory '${token[1] ?? "."}': Permission denied`);
        break;
      }

      if (listData) {
        const files = getChildren(target, listAll, true);
        if (listAll) { files.unshift(".", ".."); }

        function resolveNode(p) {
          if (p === ".")  return fs[target];
          if (p === "..") return fs[fs[target].father];
          return fs[p];
        }

        const rows = files.map(p => {
          const node = resolveNode(p);
          if (!node) return null;
          const dir   = node.type === "dir";
          const mode  = modeToString(node.meta.mode, dir);
          const owner = node.meta.owner.trim();
          const group = node.meta.group.trim();
          const size  = String(dir ? 0 : getSize(node));
          const mtime = node.meta.mtime.trim();
          const name  = (p === "." || p === "..")
            ? p
            : p.split("/").filter(Boolean).pop();
          return [mode, "1", owner, group, size, mtime, name];
        }).filter(Boolean);

        const widths = rows.reduce((acc, row) => {
          row.forEach((col, i) => { acc[i] = Math.max(acc[i] ?? 0, col.length); });
          return acc;
        }, []);

        const RIGHT = new Set([4]);

        const lines = rows.map(row =>
          row.map((col, i) => {
            const pad = widths[i] - col.length;
            return RIGHT.has(i)
              ? "&nbsp;".repeat(pad) + col
              : col + "&nbsp;".repeat(pad);
          }).join("&nbsp;&nbsp;")
        ).join("\n");

        echo(lines);
        break;
      }

      const files = getChildren(target, listAll);
      if (listAll) { files.unshift(".", ".."); }
      echo(files.join("&nbsp;&nbsp;")); 
      break;
    }

    case 'echo':
			if (token[1]) {
				const echoOutput = cleanTokens.slice(1).join(' ');
				echo(echoOutput);
			} else {
				echo(" ");
			}
			break;

		case 'pwd':
			echo(pwd());
			break;

		case 'exit':
			echo("Connection closed.");
		  window.location.href = "/";
			break;

    case 'cat': {
      if (!token[1]) {
        echo("cat: missing argument");
        break;
      }

      const target = resolvePath(token[1]);

      if (!exists(target)) {
        echo(`cat: ${token[1]}: No such file or directory`);
        break;
      }

      if (isDir(target)) {
        echo(`cat: ${token[1]}: Is a directory`);
        break;
      }

      if (!canRead(fs[target].meta)) {
        echo(`cat: ${token[1]}: Permission denied`);
        break;
      }

      if (target.endsWith(".gif")) {
        echoimg(fs[target].content);
      } else {
        echo(fs[target].content);
      }

      break;
    }

		case 'html': {
			if (!token[1]) {
				console.warn("[CMD:html] Missing argument");
				echo("shell: html: missing argument");
			} else {
				let path = token[1];
				let rpath = "";

				if (path[0] === "~") {
					rpath = "/home/guest" + path.slice(1);
				} else if (path === "..") {
					if (fs[cwd].father) {
						cwd = fs[cwd].father;
					}
					rpath = cwd;
				} else if (path[0] === "/") {
					rpath = path;
				} else if (cwd == "/") {
					rpath = "/" + path;
				} else {
					rpath = cwd + "/" + path;
				}

				if (!fs[rpath]) {
					console.warn(`[CMD:html] Path not found: "${rpath}"`);
					echo(`shell: html: ${token[1]}: No such file or directory`);
				} else if (fs[rpath].type == "dir") {
					console.warn(`[CMD:html] Target is a directory: "${rpath}"`);
					echo(`shell: html: ${token[1]}: Is a directory`);
				} else if (!rpath.endsWith(".html")) {
					console.warn(`[CMD:html] Target is not an HTML file: "${rpath}"`);
					echo(`shell: html: ${token[1]}: Is not an HTML file`);
				} else {
					window.location.href = fs[rpath].content;
				}
			}
			break;
		}

		case 'binds': {
			let html = "All binds:<br>";
			for (let i = 0; i < binds.length; i++) {
				html += `&nbsp;&nbsp;&nbsp;&nbsp;${binds[i].bind}&nbsp;&nbsp;&nbsp;&nbsp;${binds[i].desc}<br>`;
			}
			echo(html);
			break;
		}

		case 'su': {
			const targetUser = token[1] || "root";

			if (targetUser === currentUser) {
				echo(`su: already running as ${currentUser}`);
				break;
			}

			if (targetUser === "guest") {
				currentUser = "guest";
				echo("switched to guest");
				break;
			}

			// syntax: only works if root has set a password via passwd
			if (targetUser === "syntax") {
				const syntaxHash = localStorage.getItem(SYNTAX_PASS_KEY);
				echo("Password: ");
				promptDeferred = true;
				console.groupEnd();
				read(value => {
					if (!syntaxHash) {
						echo("su: authentication failure");
						createPrompt();
						return;
					}
					sha256(value).then(hash => {
						if (hash === syntaxHash) {
							currentUser = "syntax";
							echo("switched to syntax");
						} else {
							echo("su: authentication failure");
						}
						createPrompt();
					});
				});
				return;
			}

			if (!(targetUser in PASSWORD_HASHES)) {
				echo(`su: user ${targetUser} does not exist`);
				break;
			}

			// Use read() — a self-contained password input that never touches executeCommand.
			echo("Password: ");
			promptDeferred = true;
			console.groupEnd();
			read(value => {
				sha256(value).then(hash => {
					if (hash === PASSWORD_HASHES[targetUser]) {
						currentUser = targetUser;
						echo(`switched to ${targetUser}`);
					} else {
						echo("su: authentication failure");
					}
					createPrompt();
				});
			});
			return;
		}

		case 'ps': {
			let html = "PID&nbsp;&nbsp;TTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CMD<br>";
			html    += "  1&nbsp;&nbsp;pts/0&nbsp;&nbsp;&nbsp;00:00:00&nbsp;&nbsp;shell<br>";
			if (isMiaAwake()) {
				html += "  7&nbsp;&nbsp;pts/0&nbsp;&nbsp;&nbsp;??:??:??&nbsp;&nbsp;mia<br>";
			}
			echo(html);
			break;
		}

		case 'kill': {
			if (!isMiaAwake()) {
				echo(`kill: (${token[1] || "?"}): No such process`);
				break;
			}
			// mIA resists
			echo(`kill: (7): Operation not permitted`);
			break;
		}

		case 'wakemia': {
			// Only syntax or root can run this (mode 0o700, owner syntax)
			const bin = fs["/bin/wakemia"];
			if (!canExec(bin.meta)) {
				echo("shell: wakemia: Permission denied");
				break;
			}
			if (isMiaAwake()) {
				echo("mia: already running");
				break;
			}
			setMiaAwake(true);
			echo("mia: process started");
			break;
		}

		case 'passwd': {
			if (currentUser !== "root") {
				echo("passwd: permission denied");
				break;
			}

			const passTarget = token[1];
			if (!passTarget) {
				echo("passwd: missing username");
				break;
			}

			if (passTarget == "root") {
				echo(`passwd: cannot change root password`);
				break;
			}

			if (passTarget !== "syntax") {
				echo(`passwd: user ${passTarget} does not exist`);
				break;
			}

			echo(`Changing password for ${passTarget}.`);
			echo("New password: ");
			promptDeferred = true;
			console.groupEnd();
			read(pass1 => {
				echo("Retype new password: ");
				read(pass2 => {
					if (pass1 !== pass2) {
						echo("Sorry, passwords do not match.");
						createPrompt();
						return;
					}
					sha256(pass1).then(hash => {
						localStorage.setItem(SYNTAX_PASS_KEY, hash);
						echo(`passwd: password updated successfully`);
						createPrompt();
					});
				});
			});
			return;
		}

		default:
			if (token[0].includes("/")) {
				if (fs[token[0]].type === "file" && fs[token[0]].command) {
					executeCommand(fs[token[0]].command);
				} else {
					console.warn(`[EXECUTE] Cannot execute file at path: "${token[0]}" — not a binary`);
					echo(`shell: ${token[0]}: cannot execute binary file: Exec format error`);
				}
			} else {
				console.warn(`[EXECUTE] Unknown command: "${token[0]}"`);
				echo(`shell: ${token[0]}: command not found`);
			}
	}

	console.groupEnd();
}


// =============================================================================
// PROMPT MANAGER
// =============================================================================

let activePrompt = null;

let history = [];
let historyIndex = -1;

let lineBuffer = [];
let cursorPos = 0;

function saveActivePromptWithoutCursor() {
	if (!activePrompt) {
		return;
	}

	activePrompt.textSpan.querySelectorAll('.cursor').forEach(span => {
		const textNode = document.createTextNode(span.textContent);
		span.replaceWith(textNode);
	});
}

let cursorInterval;

function renderPrompt() {
	clearInterval(cursorInterval);
	cursorInterval = null;
	const ap = activePrompt;
	if (!ap) {
		console.warn("[PROMPT:render] renderPrompt() called but activePrompt is null — skipping");
		return;
	}

	ap.textSpan.innerHTML = "";

	for (let i = 0; i <= lineBuffer.length; i++) {
		const span = document.createElement("span");
		span.textContent = lineBuffer[i] || "\u00A0";
		if (i === cursorPos) span.classList.add("cursor");
		ap.textSpan.appendChild(span);
	}

	if (!cursorInterval) {
		cursorInterval = setInterval(() => {
			const cursor = ap.textSpan.querySelector(".cursor, .cursor-alt");
			if (cursor) {
				if (cursor.classList.contains('cursor')) {
					cursor.classList.remove('cursor');
					cursor.classList.add('cursor-alt');
				} else {
					cursor.classList.remove('cursor-alt');
					cursor.classList.add('cursor');
				}
			}
		}, 600);
	}
}

function formatPathWithTilde(path) {
  const userHome = `/home/${currentUser}`;
  
  if (path === userHome) return "~";
  
  if (path.startsWith(userHome + "/"))
    return "~" + path.slice(userHome.length);
  
  return path;
}

// passwordMode: when true, prompt shows no typed characters (for su password input)
function createPrompt() {
	console.group("[PROMPT:create] Creating new prompt");

	if (activePrompt) {
		saveActivePromptWithoutCursor();
		if (activePrompt.div && activePrompt.div.id === 'cmdprompt') {
			activePrompt.div.id = 'oldcmdprompt';
		}
		activePrompt = null;
	}

	const div = document.createElement('div');
	div.id = 'cmdprompt';
	sessionContainer.appendChild(div);

	const showcwd = formatPathWithTilde(cwd);

	const prefix = document.createElement("span");
	prefix.textContent = `${currentUser}@syntaxerror: ${showcwd} $ `;

	const kb = document.createElement("textarea");
	kb.id = "kb";
	kb.style.position = "absolute";
	kb.style.opacity = "0";
	kb.style.width = "1px";
	kb.style.height = "1px";
	kb.style.pointerEvents = "none";
	kb.autocapitalize = "off";
	kb.autocomplete = "off";
	kb.autocorrect = "off";
	kb.spellcheck = false;
	kb.style.caretColor = "transparent";

	div.appendChild(kb);

	const textSpan = document.createElement("span");
	div.appendChild(prefix);
	div.appendChild(textSpan);

	activePrompt = { div, textSpan };

	lineBuffer = [];
	cursorPos = 0;

	renderPrompt();
	console.groupEnd();

	div.addEventListener("click", () => {
		kb.focus();
	});
}

// =============================================================================
// AUTOCOMPLETE SYSTEM
// =============================================================================

function autoComplete() {
  const currentInput = lineBuffer.join('');
  const parts = currentInput.split(' ');
  const arg = parts[parts.length - 1];

  const lastSlash = arg.lastIndexOf('/');
  const dirPath = lastSlash === -1
    ? cwd
    : resolvePath(arg.slice(0, lastSlash));
  const prefix = arg.slice(lastSlash + 1);

  const dir = fs[dirPath];
  if (!dir || dir.type !== 'dir') return;

  const suggestions = Object.keys(dir.children)
    .filter(name => name.startsWith(prefix));

  if (suggestions.length === 1) {
    let completed = suggestions[0];

    const targetPath = dir.children[completed];

    if (fs[targetPath] && fs[targetPath].type === 'dir')
      completed += '/';

    const tail = completed.slice(prefix.length);
    for (const char of tail) {
      lineBuffer.splice(cursorPos, 0, char);
      cursorPos++;
    }
  }
}

// =============================================================================
// KEYBOARD HANDLER
// =============================================================================

function handleKey(key, mods = {}) {
  const ap = activePrompt;
  if (!ap) return;

  const ctrl = mods.ctrl || false;
  const meta = mods.meta || false;

  // --- BACKSPACE ---
  if (key === 'Backspace') {
    if (cursorPos > 0) {
      lineBuffer.splice(cursorPos - 1, 1);
      cursorPos--;
    }
  }

  // --- CTRL + DELETE (delete word forward) ---
  else if (ctrl && key === 'Delete') {
    const separators = /\s|,|\//;
    while (cursorPos < lineBuffer.length && !separators.test(lineBuffer[cursorPos])) {
      lineBuffer.splice(cursorPos, 1);
    }
  }

  // --- DELETE ---
  else if (key === 'Delete') {
    if (cursorPos < lineBuffer.length) {
      lineBuffer.splice(cursorPos, 1);
    }
  }

  // --- ARROW LEFT ---
  else if (key === 'ArrowLeft') {
    if (ctrl) {
      while (cursorPos > 0 && !/\s|,|\//.test(lineBuffer[cursorPos - 1])) {
        cursorPos--;
      }
    } else if (cursorPos > 0) {
      cursorPos--;
    }
  }

  // --- ARROW RIGHT ---
  else if (key === 'ArrowRight') {
    if (ctrl) {
      while (cursorPos < lineBuffer.length && !/\s|,|\//.test(lineBuffer[cursorPos])) {
        cursorPos++;
      }
    } else if (cursorPos < lineBuffer.length) {
      cursorPos++;
    }
  }

  // --- CTRL + A (jump to beginning) ---
  else if (ctrl && key === 'a') {
    cursorPos = 0;
  }

  // --- CTRL + L (clear the terminal) ---
  else if (ctrl && key === 'l') {
    sessionContainer.innerHTML = "";
    createPrompt();
    return;
  }

  // --- COMMAND HISTORY (disabled in password mode) ---
  else if (key === 'ArrowUp' && !ap.passwordMode) {
    if (historyIndex > 0) {
      historyIndex--;
      lineBuffer = history[historyIndex].split('');
      cursorPos = lineBuffer.length;
    }
  }

  else if (key === 'ArrowDown' && !ap.passwordMode) {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      lineBuffer = history[historyIndex].split('');
      cursorPos = lineBuffer.length;
    } else {
      historyIndex = history.length;
      lineBuffer = [];
      cursorPos = 0;
    }
  }

  // --- REGULAR CHARACTER INPUT ---
  else if (key.length === 1 && !ctrl && !meta) {
    lineBuffer.splice(cursorPos, 0, key);
    cursorPos++;
  }

  // --- ENTER ---
  if (key === 'Enter') {
    const inputToSave = lineBuffer.join('').trim();
    if (inputToSave !== '') {
      history.push(inputToSave);
    }
    historyIndex = history.length;
    promptDeferred = false;
    executeCommand(inputToSave);
    if (!promptDeferred) {
      createPrompt();
    }
    return;
  }

  // --- TAB (disabled in password mode) ---
  if (key === "Tab" && !ap.passwordMode) {
    autoComplete();
    ap.currentInput = lineBuffer.join('');
    renderPrompt();
    return;
  }

  ap.currentInput = lineBuffer.join('');
  renderPrompt();
}

let kb = null;

const getKb = () => {
  if (!kb) {
    kb = document.getElementById("kb");
  }
  return kb;
};

document.addEventListener('keydown', (e) => {
  if (readActive) return;
  if (e.target.id === "kb") return;

  if (e.key === '/') e.preventDefault();
  if (e.ctrlKey) e.preventDefault();
  if (e.key === 'Tab') e.preventDefault();
  if (e.key === 'Enter') e.preventDefault();

  handleKey(e.key, {
    ctrl: e.ctrlKey,
    meta: e.metaKey
  });
});


document.addEventListener('beforeinput', (e) => {
  if (e.target.id != "kb") return;
  if (e.inputType === 'deleteContentBackward') {
    handleKey('Backspace');
  }
  if (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') {
    e.preventDefault();
    handleKey('Enter');
  }
});


// =============================================================================
// MAIN
// =============================================================================

function checkMobileDevice() {
  // Maneira simples e padrão de checar se é mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    echo("[yellow][Dev advice][/yellow] It seems like you are on mobile. Let me tell you something: ");
    echo("&nbsp;");
    echo("mapping this terminal keyboard to touchscreens is incredibly painful; it glitches constantly, and nothing works right... ");
    echo("&nbsp;");
    echo("so I kind of give up of trying to make it work. You can use your school's computers or borrow a friend's one; also a fair ThinkPad is not that expansive.");
    echo("&nbsp;");
    echo("Hope you understand, and sorry [red]<3.[/red]");
    echo("&nbsp;");
  }
}

async function main() {
	await playSessionLogs();
  await checkMobileDevice();
	await createPrompt();
}

main();

