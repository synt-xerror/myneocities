const PAGES = [
	{ path: "/",           label: "(hd0,1)/boot/home.img" },
	{ path: "/blog",       label: "(hd0,1)/boot/blog.img" },
	{ path: "/neoshell",   label: "(hd0,1)/boot/neoshell.img" },
	{ path: "/resources",  label: "(hd0,1)/boot/resources.img" },
];

const bootMessages = [
	{ t: 0,    msg: "GRUB loading." },
	{ t: 10,  msg: "Welcome to GRUB!", className: "welcome" },
	{ t: 900,  msg: '‎ ' },
	{ t: 10,  msg: `error: '/root${window.location.pathname}.img': no such file or directory.` },
	{ t: 10,  msg: "Entering rescue mode..." },
	{ t: 0,  msg: '‎ ' },
	{ t: 700,  msg: "tip: type 'cd /' to return home" },
];

const container  = document.getElementById("grub-log");
const promptArea = document.getElementById("grub-prompt");

let lineBuffer = [];
let cursorPos  = 0;
let history    = [];
let historyIndex = -1;
let cursorInterval = null;
let activePrompt = null;

function delay(ms) {
	return new Promise(r => setTimeout(r, ms));
}

function renderLine(msg, className) {
	const div = document.createElement("div");
  div.textContent = msg;
  if (className) div.className = className;
	container.appendChild(div);
}

async function playBoot() {
	for (const entry of bootMessages) {
		await delay(entry.t);
		renderLine(entry.msg, entry.className);
	}
}

function echo(text) {
	const div = document.createElement("div");
	div.textContent = text;
	div.className = "result";
	container.appendChild(div);
}

function echoHTML(html) {
	const div = document.createElement("div");
	div.innerHTML = html;
	div.className = "result";
	container.appendChild(div);
}

function executeCommand(raw) {
	const tokens = raw.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];
	if (tokens.length === 0) return;

	const cmd  = tokens[0];
	const arg  = tokens[1] || "";

	switch (cmd) {
		case "ls": {
			echo("(hd0) (hd0,1) (hd0,2)");
			break;
		}

		case "cd": {
			if (!arg) {
				window.location.href = "/";
				break;
			}

			const clean = arg.replace(/^["']|["']$/g, "");

			const match = PAGES.find(p =>
				p.path === clean ||
				p.label === clean ||
				clean.endsWith(p.path)
			);

			if (match) {
				window.location.href = match.path;
			} else {
				echo(`error: ${clean}: no such file or directory.`);
			}
			break;
		}

		default:
			echo(`error: ${cmd}: unknown command.`);
	}
}

function renderPrompt() {
	clearInterval(cursorInterval);
	if (!activePrompt) return;

	activePrompt.textSpan.innerHTML = "";

	for (let i = 0; i <= lineBuffer.length; i++) {
		const span = document.createElement("span");
		span.textContent = lineBuffer[i] || "\u00A0";
		if (i === cursorPos) span.classList.add("cursor");
		activePrompt.textSpan.appendChild(span);
	}

	cursorInterval = setInterval(() => {
		const cursor = activePrompt.textSpan.querySelector(".cursor, .cursor-alt");
		if (!cursor) return;
		cursor.classList.toggle("cursor");
		cursor.classList.toggle("cursor-alt");
	}, 600);
}

function savePrompt() {
	if (!activePrompt) return;
	activePrompt.textSpan.querySelectorAll(".cursor, .cursor-alt").forEach(span => {
		span.replaceWith(document.createTextNode(span.textContent));
	});
}

function createPrompt() {
	clearInterval(cursorInterval);
	savePrompt();

	const div = document.createElement("div");
	div.className = "prompt-line";
	container.appendChild(div);

	const prefix = document.createElement("span");
	prefix.className = "prompt-prefix";
	prefix.textContent = "grub rescue> ";

	const textSpan = document.createElement("span");

	div.appendChild(prefix);
	div.appendChild(textSpan);

	activePrompt = { div, textSpan };
	lineBuffer   = [];
	cursorPos    = 0;

	renderPrompt();
	div.scrollIntoView({ behavior: "smooth" });
}

function handleKey(key, mods = {}) {
  console.log(key);
	if (!activePrompt) return;
	const ctrl = mods.ctrl || false;

	if (key === "Backspace") {
		if (cursorPos > 0) { lineBuffer.splice(cursorPos - 1, 1); cursorPos--; }
	} else if (key === "Delete") {
		if (cursorPos < lineBuffer.length) lineBuffer.splice(cursorPos, 1);
	} else if (key === "ArrowLeft") {
		if (ctrl) {
			while (cursorPos > 0 && !/\s/.test(lineBuffer[cursorPos - 1])) cursorPos--;
		} else if (cursorPos > 0) cursorPos--;
	} else if (key === "ArrowRight") {
		if (ctrl) {
			while (cursorPos < lineBuffer.length && !/\s/.test(lineBuffer[cursorPos])) cursorPos++;
		} else if (cursorPos < lineBuffer.length) cursorPos++;
	} else if (ctrl && key === "a") {
		cursorPos = 0;
	} else if (key === "ArrowUp") {
		if (historyIndex > 0) { historyIndex--; lineBuffer = history[historyIndex].split(""); cursorPos = lineBuffer.length; }
	} else if (key === "ArrowDown") {
		if (historyIndex < history.length - 1) { historyIndex++; lineBuffer = history[historyIndex].split(""); cursorPos = lineBuffer.length; }
		else { historyIndex = history.length; lineBuffer = []; cursorPos = 0; }
	} else if (key === "Enter") {
		const input = lineBuffer.join("").trim();
		if (input) { history.push(input); }
		historyIndex = history.length;
		executeCommand(input);
		createPrompt();
		return;
	} else if (key.length === 1 && !ctrl) {
		lineBuffer.splice(cursorPos, 0, key);
		cursorPos++;
	}

	renderPrompt();
}

document.addEventListener("keydown", e => {
  console.log("key:", e.key, "history:", history, "index:", historyIndex);
	const kb = document.getElementById("kb");
	if (e.target === kb) return;

  if (
    e.key === "/" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft" ||
    (e.ctrlKey && e.key === "f")
  ) {
    e.preventDefault();
  }

	handleKey(e.key, { ctrl: e.ctrlKey });
});

const kb = document.getElementById("kb");

document.addEventListener("click",      () => kb.focus());
document.addEventListener("touchstart", () => kb.focus());

kb.addEventListener("input", e => {
	const text = e.data;
	kb.value = "";
	if (!text) return;
	for (const char of text) {
		handleKey(char === "\n" ? "Enter" : char);
	}
});

kb.addEventListener("beforeinput", e => {
	if (e.inputType === "deleteContentBackward") { e.preventDefault(); handleKey("Backspace"); }
	if (e.inputType === "insertLineBreak" || e.inputType === "insertParagraph") { e.preventDefault(); handleKey("Enter"); }
});

async function main() {
	await playBoot();
	createPrompt();
}

main();
