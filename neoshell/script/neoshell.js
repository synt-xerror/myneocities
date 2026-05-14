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

      fs[fullPath] = { type: "dir", children, father: path };
      Object.assign(fs, childFS);

    } else {
      fs[fullPath] = { type: "file", ...value };
    }
  }

  return fs;
}

const tree = {
  bin: {
    type: "dir",
    children: {
      cd:    { type: "file", command: "cd" },
      clear: { type: "file", command: "clear" },
      echo:  { type: "file", command: "echo" },
      exit:  { type: "file", command: "exit" },
      help:  { type: "file", command: "help" },
      ls:    { type: "file", command: "ls" },
      pwd:   { type: "file", command: "pwd" },
      cat:   { type: "file", command: "cat" },
      html:  { type: "file", command: "html" },
      binds: { type: "file", command: "binds" },
    }
  },
  home: {
    type: "dir",
    children: {
      guest: {
        type: "dir",
        children: {
          "hello.txt": { type: "file", content: "Hello!! Welcome to my site :)" },
          "home.html": { type: "file", content: "home.html" },
          assets: {
            type: "dir",
            children: {
              "skeleton.gif": { type: "file", content: "neoshell/assets/skeleton.gif" }
            }
          }
        }
      }
    }
  }
};

const fs = {
  "/": { type: "dir", children: { bin: "/bin", home: "/home" }, father: "/" },
  ...buildFS(tree)
};


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
	result.innerHTML = text;
	result.className = 'result';
	sessionContainer.appendChild(result);
}

function echoimg(path) {
	const result = document.createElement('div');
	result.innerHTML = `<img src="${path}">`;
	result.className = 'result';
	sessionContainer.appendChild(result);
}

// =============================================================================
// AUTOCOMPLETE SYSTEM
// =============================================================================

function autocomplete(input, currentDir) {
  // separa o comando do argumento
  // ex: "cat hel" → arg = "hel"
  const parts = input.split(" ");
  const arg = parts[parts.length - 1];

  // resolve o prefixo do caminho
  // ex: "assets/sk" → dirPath = "/home/guest/assets", prefix = "sk"
  const lastSlash = arg.lastIndexOf("/");
  const dirPath = lastSlash === -1
    ? currentDir
    : resolve(currentDir, arg.slice(0, lastSlash)); // sua função de resolver caminho
  const prefix = arg.slice(lastSlash + 1);

  // pega os filhos do diretório atual
  const dir = fs[dirPath];
  if (!dir || dir.type !== "dir") return [];

  // filtra pelos que começam com o prefixo digitado
  return Object.keys(dir.children)
    .filter(name => name.startsWith(prefix));
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

		case 'cd':
			if (!token[1]) {
				cwd = "/home/guest";
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
					console.warn(`[CMD:cd] Path does not exist in filesystem: "${rpath}"`);
					echo(`shell: cd: ${rpath}: No such file or directory`);
				} else if (fs[rpath].type !== "dir") {
					console.warn(`[CMD:cd] Target is not a directory: "${token[1]}" (type: ${fs[rpath].type})`);
					echo(`shell: cd: ${token[1]}: Not a directory`);
				} else {
					cwd = rpath;
				}
			}
			break;

		case 'ls':
			const lsChildren = Object.keys(fs[cwd]?.children || {});
			echo(lsChildren.join("&nbsp;&nbsp"));
			break;

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
				console.warn("[CMD:cat] Missing argument");
				echo("shell: cat: missing argument");
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
					console.warn(`[CMD:cat] Path not found: "${rpath}"`);
					echo(`shell: cat: ${token[1]}: No such file or directory`);
				} else if (fs[rpath].type == "dir") {
					console.warn(`[CMD:cat] Target is a directory: "${rpath}"`);
					echo(`shell: cat: ${token[1]}: Is a directory`);
				} else if (rpath.endsWith(".gif")) {
					echoimg(fs[rpath].content);
				} else {
					echo(fs[rpath].content);
				}
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

function saveActivePromptWithoutCursor() {
	if (!activePrompt) {
		return;
	}

	// Remove the 'cursor' class from all spans inside the current prompt's textSpan
	activePrompt.textSpan.querySelectorAll('.cursor').forEach(span => {
		// Replace the span with a plain text node
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
					cursor.class
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
		saveActivePromptWithoutCursor();
		if (activePrompt.div && activePrompt.div.id === 'cmdprompt') {
			activePrompt.div.id = 'oldcmdprompt';
		}
		activePrompt = null;
	}

	const div = document.createElement('div');
	div.id = 'cmdprompt';
	sessionContainer.appendChild(div);

	const prefix = document.createElement("span");
	prefix.textContent = `guest@syntaxerror: ${cwd} $ `;

	const textSpan = document.createElement("span");

	div.appendChild(prefix);
	div.appendChild(textSpan);

	activePrompt = { div, textSpan };

	lineBuffer = [];
	cursorPos = 0;

	renderPrompt();
	console.groupEnd();
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

  // --- TAB ---
  if (key === "Tab") {
    const currentInput = lineBuffer.join('');
    const parts = currentInput.split(' ');
    const arg = parts[parts.length - 1];
  
    // descobre em qual diretório buscar e qual o prefixo
    const lastSlash = arg.lastIndexOf('/');
    const dirPath = lastSlash === -1
      ? cwd
      : resolvePath(cwd, arg.slice(0, lastSlash)); // reuse sua função de resolver caminho
    const prefix = arg.slice(lastSlash + 1);
  
    const dir = fs[dirPath];
    if (!dir || dir.type !== 'dir') return;
  
    const suggestions = Object.keys(dir.children)
      .filter(name => name.startsWith(prefix));
  
    if (suggestions.length === 0) {
      // nada a fazer
    } else if (suggestions.length === 1) {
      // completa o lineBuffer
      const completed = suggestions[0];
      const tail = completed.slice(prefix.length); // só o que falta digitar
      for (const char of tail) {
        lineBuffer.splice(cursorPos, 0, char);
        cursorPos++;
      }
    } else {
      // mostra opções (como o bash)
      printLine(suggestions.join('  '));
    }
  
    ap.currentInput = lineBuffer.join('');
    renderPrompt();
    return;
  }
  ap.currentInput = lineBuffer.join('');
  renderPrompt();
}

// desktop

document.addEventListener('keydown', (e) => {
  if (e.target === kb) return;
  if (e.key === 'Tab') e.preventDefault(); // adiciona essa linha
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
  kb.value = "";
});

kb.addEventListener('input', (e) => {
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
