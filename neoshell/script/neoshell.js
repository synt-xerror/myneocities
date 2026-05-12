// TODO
// hidden files
// new prompt

// =============================================================================
// CONSTANTS & VERSION
// =============================================================================

const LAST_UPDATE = "2026-05-11";
const CHANGELOG = "Support for mobile devices arrived";
const INFO = "Now this site is hosted on my own server, my neocities page just redirect to here";

const version = "3.2.3";
const behavior = "auto";

console.log("[INIT] Neoshell script loaded");
console.log(`[INIT] Version: ${version}`);
console.log(`[INIT] Scroll behavior: ${behavior}`);

// =============================================================================
// PHONE KEYBOARD SUPPORT
// =============================================================================


// =============================================================================
// SESSION / MOTD DATA
// =============================================================================

const sessionLogs = [
	{ t: 0.000010, prefix: 'motd',    msg: `Welcome to Neoshell ${version}` },
	{ t: 0.000012, prefix: 'motd',    msg: 'Host provider: Self-hosted (Ubuntu VPS, Nginx)' },
	{ t: 1.000028, prefix: 'motd',    msg: 'Connecting...' },
	{ t: 0.000008, prefix: 'motd',    msg: 'Conected as: guest' },
	null,
	{ t: 0.000110, prefix: 'session', msg: 'Launching user space...' },
	{ t: 0.000011, prefix: 'ui',      msg: 'Attaching creative layer...' },
	{ t: 0.000410, prefix: 'handoff', msg: 'Handing control to graphical environment' },
	null,
	{ t: 0, prefix: 'motd', msg: `LAST UPDATE: ${LAST_UPDATE}` },
	{ t: 0, prefix: 'motd', msg: `CHANGELOG: ${CHANGELOG}` },
	{ t: 0, prefix: 'motd', msg: `INFO: ${INFO}` },
	null,
	{ t: 0, prefix: 'motd', msg: 'If you liked, please follow this site on Neocities and star it on GitHub/Codeberg to motivate me :).' },
	{ t: 0, prefix: 'motd', msg: 'GitHub: https://github.com/synt-xerror/myneocities' },
	{ t: 0, prefix: 'motd', msg: 'Codeberg: https://codeberg.org/synt-xerror/myneocities' },
	null,
	{ t: 0, prefix: 'motd', msg: 'Tip: type "help" to see all the commands' },
	null,
];

console.log(`[DATA] sessionLogs array loaded: ${sessionLogs.filter(Boolean).length} entries`);


// =============================================================================
// ENVIRONMENT & USER CONFIG
// =============================================================================

const USER = "guest";
const HOME = "/home/" + USER;

console.log(`[ENV] USER=${USER}`);
console.log(`[ENV] HOME=${HOME}`);

let cwd = HOME;
function pwd() {
	console.log(`[CMD:pwd] Current working directory: ${cwd}`);
	return cwd;
}

// Environment variables accessible by the user
const envvar = {
	"USER": "guest",
	"HOME": "/home/" + USER,
	"PWD": pwd()
};

console.log("[ENV] Environment variables:", envvar);


// =============================================================================
// VIRTUAL FILESYSTEM
// =============================================================================

const fs = {
	"/": {
		type: "dir",
		children: {
			"bin":  "/bin",
			"home": "/home"
		},
		father: "/"
	},

	"/bin": {
		type: "dir",
		children: {
			"cd":    "/bin/cd",
			"clear": "/bin/clear",
			"echo":  "/bin/echo",
			"exit":  "/bin/exit",
			"help":  "/bin/help",
			"ls":    "/bin/ls",
			"pwd":   "/bin/pwd",
			"cat":	 "/bin/cat",
			"html":  "/bin/html",
			"binds":  "/bin/binds"
		},
		father: "/"
	},

	"/bin/cd":    { type: "file", command: "cd" },
	"/bin/clear": { type: "file", command: "clear" },
	"/bin/echo":  { type: "file", command: "echo" },
	"/bin/exit":  { type: "file", command: "exit" },
	"/bin/help":  { type: "file", command: "help" },
	"/bin/ls":    { type: "file", command: "ls" },
	"/bin/pwd":   { type: "file", command: "pwd" },
	"/bin/cat":   { type: "file", command: "cat"},
	"/bin/html":   { type: "file", command: "html"},
	"/bin/binds":   { type: "file", command: "binds"},

	"/home": {
		type: "dir",
		children: {
			"guest": HOME
		},
		father: "/"
	},

	[HOME]: {
		type: "dir",
		children: {
			"assets":    HOME + "/assets",
			"hello.txt": HOME + "/hello.txt",
			"home.html": HOME + "/home.html"
		},
		father: "/home"
	},

	[HOME + "/home.html"]: {
		type: "file",
		content: "home.html"
	},

	[HOME + "/hello.txt"]: {
		type: "file",
		content: "Hello!! Welcome to my site :)"
	},

	[HOME + "/assets"]: {
		type: "dir",
		children: {
			"lain.gif": HOME + "/assets/lain.gif"
		},
		father: HOME
	},

	[HOME + "/assets/lain.gif"]: {
		type: "file",
		content: "assets/lain.gif"
	}
};

console.log(`[FS] Virtual filesystem initialized: ${Object.keys(fs).length} nodes`);
console.log("[FS] Filesystem tree:", Object.keys(fs));


// =============================================================================
// COMMANDS AND KEYBINDS REGISTRY
// =============================================================================

const commands = [
	{ cmd: 'help&nbsp;', desc: "Show all commands" },
	{ cmd: 'clear',      desc: "Clear history" },
	{ cmd: 'exit&nbsp;', desc: "Exit session" },
	{ cmd: 'ls&nbsp;&nbsp;&nbsp;', desc: "List directories and files in your current directory (WIP)" },
	{ cmd: 'cd&nbsp;&nbsp;&nbsp;', desc: "Enter in another directory (WIP)" },
	{ cmd: 'echo&nbsp;', desc: "Print an argumment" },
	{ cmd: 'pwd&nbsp;&nbsp;', desc: "Prints working directory" },
	{ cmd: 'cat&nbsp;&nbsp;', desc: "View the content inside a file" },
	{ cmd: 'html&nbsp;', desc: "Execute an HTML file" },
	{ cmd: 'binds', desc: "Show all keybinds" }
];

const binds = [
	{ bind: 'CTRL + A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', desc: "Go to the beginning of the line" },
	{ bind: 'CTRL + Arrows Left/Right', desc: "Jump by word" },
	{ bind: 'CTRL + DEL;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp', desc: "Delete a word" },
	{ bind: 'Arrows Up/Down&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', desc: "Navigate through commands history" }

];

console.log(`[CMD] Command registry loaded: ${commands.length} commands`);


// =============================================================================
// DOM CONTAINERS
// =============================================================================

const container = document.getElementById("boot-log");
console.log(`[DOM] #boot-log element:`, container ? "found" : "NOT FOUND");

const sessionContainer = document.createElement("div");
sessionContainer.id = "session-log";
document.body.appendChild(sessionContainer);
console.log("[DOM] #session-log container created and appended to body");


// =============================================================================
// UTILITIES
// =============================================================================

function delay(ms) {
	console.log(`[UTIL:delay] Waiting ${ms}ms`);
	return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================================================
// BOOT LOG RENDERER
// =============================================================================

function renderLog(entry) {
	if (!entry) {
		console.log("[BOOT] Rendering separator (null entry)");
		const br = document.createElement("br");
		container.appendChild(br);
		br.scrollIntoView({ behavior });
		return;
	}

	console.log(`[BOOT] Rendering log entry — prefix: ${entry.prefix} | tstamp: ${entry.tstamp} | delay: ${entry.t * 10}ms | msg: "${entry.msg}"`);
	const div = document.createElement("div");
	div.innerHTML = `<span class="timestamp">[ ${entry.tstamp.toFixed(6)} ]</span> <span class="subsys-prefix">${entry.prefix}:</span> ${entry.msg}`;
	container.appendChild(div);
	div.scrollIntoView({ behavior });
}

async function playLogs() {
	console.log(`[BOOT] Starting boot log playback — ${logs.length} total items`);
	for (const log of logs) {
		if (!log) {
			renderLog(null);
			continue;
		}
		renderLog(log);
		await delay(log.t * 10);
	}

	console.log("[BOOT] Boot log playback complete — waiting 1000ms before removing container");
	await delay(1000);
	container.remove();
	console.log("[BOOT] Boot log container removed from DOM");
	await delay(500);
}


// =============================================================================
// SESSION LOG RENDERER
// =============================================================================

function renderSession(entry) {
	if (!entry) {
		console.log("[SESSION] Rendering separator (null entry)");
		sessionContainer.appendChild(document.createElement("br"));
		return;
	}

	console.log(`[SESSION] Rendering session entry — prefix: ${entry.prefix} | delay: ${entry.t * 1000}ms | msg: "${entry.msg}"`);
	const div = document.createElement("div");
	div.innerHTML = `<span class="timestamp">${entry.prefix ? `[ ${entry.prefix} ]` : ''}</span> ${entry.msg}`;
	sessionContainer.appendChild(div);
	div.scrollIntoView({ behavior });
}

async function playSessionLogs() {
	console.log(`[SESSION] Starting session log playback — ${sessionLogs.length} total items`);
	for (const log of sessionLogs) {
		if (!log) {
			renderSession(null);
			await delay(100);
			continue;
		}
		renderSession(log);
		await delay(log.t * 1000);
	}
	console.log("[SESSION] Session log playback complete");
}


// =============================================================================
// TERMINAL OUTPUT
// =============================================================================

function echo(text) {
	console.log(`[ECHO] Outputting text to terminal: "${text}"`);
	const result = document.createElement('div');
	result.innerHTML = text;
	result.className = 'result';
	sessionContainer.appendChild(result);
}

function echoimg(path) {
	console.log(`[ECHOIMG] Outputting image to terminal: "${path}"`);
	const result = document.createElement('div');
	result.innerHTML = `<img src="${path}">`;
	result.className = 'result';
	sessionContainer.appendChild(result);
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

	console.log("[EXECUTE] Raw input:", str_cmd);

	const token = str_cmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
	console.log("[EXECUTE] Tokens found:", token);

	const cleanTokens = token.map(t => t.replace(/^"|"$/g, ""));
	console.log("[EXECUTE] Cleaned tokens:", cleanTokens);

	if (token.length === 0) {
		console.warn("[EXECUTE] No tokens found after parsing — aborting");
		console.groupEnd();
		return;
	}

	// Check for absolute path execution
	if (token[0].includes("/")) {
		console.log(`[EXECUTE] Absolute path detected: "${token[0]}"`);
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

	console.log(`[EXECUTE] Dispatching command: "${token[0]}"`);

	switch (token[0]) {
		case 'help': {
			console.log("[CMD:help] Listing all commands");
			let html = "All commands:<br>";
			for (let i = 0; i < commands.length; i++) {
				html += `&nbsp;&nbsp;&nbsp;&nbsp;${commands[i].cmd}&nbsp;&nbsp;&nbsp;&nbsp;${commands[i].desc}<br>`;
			}
			echo(html);
			break;
		}

		case 'clear':
			console.log("[CMD:clear] Clearing session container innerHTML");
			sessionContainer.innerHTML = "";
			break;

		case 'cd':
			console.log(`[CMD:cd] Argument: "${token[1]}" | cwd before: "${cwd}"`);
			if (!token[1]) {
				console.log("[CMD:cd] No argument provided — resetting to home directory");
				cwd = "/home/guest";
			} else {
				let path = token[1];
				let rpath = "";

				if (path[0] === "~") {
					rpath = "/home/guest" + path.slice(1);
					console.log(`[CMD:cd] Tilde expansion: "${path}" → "${rpath}"`);
				} else if (path === "..") {
					if (fs[cwd].father) {
						cwd = fs[cwd].father;
					}
					rpath = cwd;
					console.log(`[CMD:cd] Parent directory navigation — new cwd: "${cwd}"`);
				} else if (path[0] === "/") {
					rpath = path;
					console.log(`[CMD:cd] Absolute path: "${rpath}"`);
				} else if (cwd == "/") {
					rpath = "/" + path;
					console.log(`[CMD:cd] Relative path from root: "${rpath}"`);
				} else {
					rpath = cwd + "/" + path;
					console.log(`[CMD:cd] Relative path resolved: "${rpath}"`);
				}

				if (!fs[rpath]) {
					console.warn(`[CMD:cd] Path does not exist in filesystem: "${rpath}"`);
					echo(`shell: cd: ${rpath}: No such file or directory`);
				} else if (fs[rpath].type !== "dir") {
					console.warn(`[CMD:cd] Target is not a directory: "${token[1]}" (type: ${fs[rpath].type})`);
					echo(`shell: cd: ${token[1]}: Not a directory`);
				} else {
					cwd = rpath;
					console.log(`[CMD:cd] Directory changed successfully — cwd now: "${cwd}"`);
				}
			}
			break;

		case 'ls':
			console.log(`[CMD:ls] Listing children of "${cwd}"`);
			const lsChildren = Object.keys(fs[cwd]?.children || {});
			console.log(`[CMD:ls] Found ${lsChildren.length} entries:`, lsChildren);
			echo(lsChildren.join("&nbsp;&nbsp"));
			break;

		case 'echo':
			if (token[1]) {
				const echoOutput = cleanTokens.slice(1).join(' ');
				console.log(`[CMD:echo] Printing: "${echoOutput}"`);
				echo(echoOutput);
			} else {
				console.log("[CMD:echo] No argument — printing empty line");
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
			console.log(`[CMD:cat] Argument: "${token[1]}" | cwd: "${cwd}"`);
			if (!token[1]) {
				console.warn("[CMD:cat] Missing argument");
				echo("shell: cat: missing argument");
			} else {
				let path = token[1];
				let rpath = "";

				if (path[0] === "~") {
					rpath = "/home/guest" + path.slice(1);
					console.log(`[CMD:cat] Tilde expansion: "${path}" → "${rpath}"`);
				} else if (path === "..") {
					if (fs[cwd].father) {
						cwd = fs[cwd].father;
					}
					rpath = cwd;
					console.log(`[CMD:cat] Parent dir (edge case): "${rpath}"`);
				} else if (path[0] === "/") {
					rpath = path;
					console.log(`[CMD:cat] Absolute path: "${rpath}"`);
				} else if (cwd == "/") {
					rpath = "/" + path;
					console.log(`[CMD:cat] Relative path from root: "${rpath}"`);
				} else {
					rpath = cwd + "/" + path;
					console.log(`[CMD:cat] Relative path resolved: "${rpath}"`);
				}

				if (!fs[rpath]) {
					console.warn(`[CMD:cat] Path not found: "${rpath}"`);
					echo(`shell: cat: ${token[1]}: No such file or directory`);
				} else if (fs[rpath].type == "dir") {
					console.warn(`[CMD:cat] Target is a directory: "${rpath}"`);
					echo(`shell: cat: ${token[1]}: Is a directory`);
				} else if (rpath.endsWith(".gif")) {
					console.log(`[CMD:cat] Target is a GIF — rendering as image: "${fs[rpath].content}"`);
					echoimg(fs[rpath].content);
				} else {
					console.log(`[CMD:cat] Displaying file content: "${fs[rpath].content}"`);
					echo(fs[rpath].content);
				}
			}
			break;
		}

		case 'html': {
			console.log(`[CMD:html] Argument: "${token[1]}" | cwd: "${cwd}"`);
			if (!token[1]) {
				console.warn("[CMD:html] Missing argument");
				echo("shell: html: missing argument");
			} else {
				let path = token[1];
				let rpath = "";

				if (path[0] === "~") {
					rpath = "/home/guest" + path.slice(1);
					console.log(`[CMD:html] Tilde expansion: "${path}" → "${rpath}"`);
				} else if (path === "..") {
					if (fs[cwd].father) {
						cwd = fs[cwd].father;
					}
					rpath = cwd;
					console.log(`[CMD:html] Parent dir (edge case): "${rpath}"`);
				} else if (path[0] === "/") {
					rpath = path;
					console.log(`[CMD:html] Absolute path: "${rpath}"`);
				} else if (cwd == "/") {
					rpath = "/" + path;
					console.log(`[CMD:html] Relative path from root: "${rpath}"`);
				} else {
					rpath = cwd + "/" + path;
					console.log(`[CMD:html] Relative path resolved: "${rpath}"`);
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
					console.log(`[CMD:html] Navigating to: "${fs[rpath].content}"`);
					window.location.href = fs[rpath].content;
				}
			}
			break;
		}

		case 'binds': {
			console.log("[CMD:binds] Listing all binds");
			let html = "All binds:<br>";
			for (let i = 0; i < binds.length; i++) {
				html += `&nbsp;&nbsp;&nbsp;&nbsp;${binds[i].bind}&nbsp;&nbsp;&nbsp;&nbsp;${binds[i].desc}<br>`;
			}
			echo(html);
			break;
		}

		default:
			if (token[0].includes("/")) {
				console.log(`[EXECUTE] Absolute path in default branch: "${token[0]}"`);
				if (fs[token[0]].type === "file" && fs[token[0]].command) {
					console.log(`[EXECUTE] Executing binary via absolute path: "${fs[token[0]].command}"`);
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
console.log("[PROMPT] activePrompt initialized to null");

let history = [];
let historyIndex = -1;
console.log("[PROMPT] Command history initialized — index:", historyIndex);

function saveActivePromptWithoutCursor() {
	if (!activePrompt) {
		console.log("[PROMPT:save] No active prompt — nothing to save");
		return;
	}

	console.log("[PROMPT:save] Stripping cursor span from active prompt's textSpan");
	// Remove the 'cursor' class from all spans inside the current prompt's textSpan
	activePrompt.textSpan.querySelectorAll('.cursor').forEach(span => {
		// Replace the span with a plain text node
		const textNode = document.createTextNode(span.textContent);
		span.replaceWith(textNode);
		console.log(`[PROMPT:save] Cursor span replaced with text node: "${span.textContent}"`);
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

	console.log(`[PROMPT:render] Re-rendering prompt — lineBuffer: "${lineBuffer.join('')}" | cursorPos: ${cursorPos}`);
	ap.textSpan.innerHTML = "";

	for (let i = 0; i <= lineBuffer.length; i++) {
		const span = document.createElement("span");
		span.textContent = lineBuffer[i] || "\u00A0"; // non-breaking space for cursor at end of line	
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

function createPrompt() {
	console.group("[PROMPT:create] Creating new prompt");

	if (activePrompt) {
		console.log("[PROMPT:create] Existing active prompt found — finalizing it");
		saveActivePromptWithoutCursor();
		if (activePrompt.div && activePrompt.div.id === 'cmdprompt') {
			activePrompt.div.id = 'oldcmdprompt';
			console.log("[PROMPT:create] Previous prompt div ID changed to 'oldcmdprompt'");
		}
		activePrompt = null;
	}

	const div = document.createElement('div');
	div.id = 'cmdprompt';
	sessionContainer.appendChild(div);
	console.log("[PROMPT:create] New prompt div created and appended to session container");

	const prefix = document.createElement("span");
	prefix.textContent = `guest@syntaxerror: ${cwd} $ `;
	console.log(`[PROMPT:create] Prompt prefix: "guest@syntaxerror: ${cwd} $"`);

	const textSpan = document.createElement("span");

	div.appendChild(prefix);
	div.appendChild(textSpan);

	activePrompt = { div, textSpan };
	console.log("[PROMPT:create] activePrompt set to new prompt");

	lineBuffer = [];
	cursorPos = 0;
	console.log("[PROMPT:create] lineBuffer and cursorPos reset");

	renderPrompt();
	console.groupEnd();
}

// =============================================================================
// KEYBOARD HANDLER
// =============================================================================

function handleKey(key, mods = {}) {
  const ap = activePrompt;
  if (!ap) return;

  console.log(`[KEYBOARD] Key pressed: "${key}"`);

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

  // --- COMMAND HISTORY ---
  else if (key === 'ArrowUp') {
    if (historyIndex > 0) {
      historyIndex--;
      lineBuffer = history[historyIndex].split('');
      cursorPos = lineBuffer.length;
    }
  }

  else if (key === 'ArrowDown') {
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
    executeCommand(inputToSave);
    createPrompt();
    return;
  }

  ap.currentInput = lineBuffer.join('');
  renderPrompt();
}

// desktop

document.addEventListener('keydown', (e) => {
  if (e.target === kb) return;
	handleKey(e.key, {
		ctrl: e.ctrlKey,
		meta: e.metaKey
	});
});

// mobile

const kb = document.getElementById("kb");

document.addEventListener("touchstart", () => {
  kb.focus();
});

document.addEventListener("click", () => {
  kb.focus();
});

kb.addEventListener("input", (e) => {
  console.log(e.target.value);
  kb.value = "";
});

kb.addEventListener('input', (e) => {
  console.log('[INPUT]', e.inputType, JSON.stringify(e.data));
  const text = e.data;
  if (!text) return;
  for (const char of text) {
    if (char === '\n') {
      handleKey('Enter');
    } else {
      handleKey(char);
    }
  }
  kb.value = "";
});

kb.addEventListener('beforeinput', (e) => {
  console.log('[BEFOREINPUT]', e.inputType, JSON.stringify(e.data));
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

async function main() {
	await playSessionLogs();
	await delay(1000);
	await createPrompt();
}

main();
