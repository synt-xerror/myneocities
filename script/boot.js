const logs = [
	{ t: 0.000001, prefix: 'site_core', msg: 'boot sequence start' },
	{ t: 0.004221, prefix: 'vfs', msg: 'initializing virtual filesystem' },
	{ t: 0.009884, prefix: 'vdev', msg: 'attaching content layer... res="success"' },
	null,

	{ t: 0.015332, prefix: 'vfs', msg: 'mounting root at /srv/www... res="success"' },
	{ t: 0.021771, prefix: 'vfs', msg: 'loading inode table' },
	{ t: 0.028004, prefix: 'vfs', msg: 'registering index.html... res="success"' },
	{ t: 0.032551, prefix: 'vfs', msg: 'registering about.html... res="success"' },
	{ t: 0.038229, prefix: 'vfs', msg: 'registering blog.html... res="success"' },
	{ t: 0.043770, prefix: 'vfs', msg: 'registering changelog.html... res="success"' },
	{ t: 0.049441, prefix: 'vfs', msg: 'registering cool-stuff.html... res="success"' },
	{ t: 0.035118, prefix: 'vfs', msg: 'registering webrings.html... res="success"' },
	{ t: 0.047884, prefix: 'vfs', msg: 'registering source.html... res="success"' },
	{ t: 0.036552, prefix: 'vfs', msg: 'registering not_found.html... res="success"' },
	null,

	{ t: 1.872991, prefix: 'vfs', msg: 'mounting /assets... res="success"' },
	null,

	{ t: 1.100221, prefix: 'vfs', msg: 'mounting /blog... res="success"' },
	{ t: 1.106004, prefix: 'vfs', msg: 'registering blog entries... res="success"' },
	null,

	{ t: 0.912441, prefix: 'vfs', msg: 'mounting /cool-stuff... res="success"' },
	{ t: 0.906004, prefix: 'vfs', msg: 'registering the coolest stuffs... res="success"' },
	null,

	{ t: 0.035552, prefix: 'vfs', msg: 'mounting /style... res="success"' },
	{ t: 0.000884, prefix: 'font', msg: 'loading WebPlus_IBM_VGA_8x14.woff... res="success"' },
	{ t: 0.096221, prefix: 'css', msg: 'linking global.css... res="success"' },
	{ t: 0.000552, prefix: 'css', msg: 'linking index.css... res="success"' },
	null,

	{ t: 0.156221, prefix: 'vfs', msg: 'mounting /scripts... res="success"' },
	{ t: 0.131884, prefix: 'script', msg: 'loading boot.js... res="success"' },
	null,

	{ t: 0.000534, prefix: 'sys', msg: 'parsing robots.txt... res="success"' },
	{ t: 0.173441, prefix: 'sys', msg: 'reading README.md... res="success"' },
	null,

	{ t: 0.008892, prefix: 'vfs', msg: '11 directories mounted' },
	{ t: 0.005552, prefix: 'vfs', msg: '89 files indexed' },
	null,

	{ t: 0.192004, prefix: 'ui', msg: 'initializing interface layer... res="success"' },
	{ t: 0.198441, prefix: 'nav', msg: 'mapping accessible nodes... res="success"' },
	null,

	{ t: 0.205002, prefix: 'site_core', msg: 'initialization complete' },
	{ t: 0.210441, prefix: 'site_core', msg: 'root exposed at "/"' },
	{ t: 0.000884, prefix: 'site_core', msg: 'awaiting input' }
];

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const container = document.getElementById("boot-log");

function renderLog(entry) {
	if (!entry) {
		container.appendChild(document.createElement("br"));
		return;
	}

	const div = document.createElement("div"); // novo div a cada log
	div.innerHTML = `<span class="timestamp">[ ${entry.t.toFixed(6)} ]</span> <span class="subsys-prefix">${entry.prefix}:</span> ${entry.msg}`;
	container.appendChild(div);
}

async function playLogs() {
	for (const log of logs) {
		if (!log) {
			renderLog(null);
			continue;
		}
		renderLog(log);
		await delay(log.t * 800);
	}

	await delay(1000);
	container.remove();
	await delay(500);
}

// Cria novo container para MOTD / sessão
const sessionContainer = document.createElement("div");
sessionContainer.id = "session-log";
document.body.appendChild(sessionContainer);

const sessionLogs = [
	{ t: 0.000010, prefix: 'motd', msg: 'Welcome to SyntaxError! 3.0.0-alpha' },
	{ t: 0.000012, prefix: 'motd', msg: 'Host provider: Neocities' },
	{ t: 0.000018, prefix: 'motd', msg: 'Session type: guest' },
	{ t: 0.000010, prefix: 'motd', msg: 'Latency: 37ms' },
	null,
	{ t: 0.000015, prefix: 'session', msg: 'Launching user space...' },
	{ t: 0.000013, prefix: 'ui', msg: 'Attaching creative layer...' },
	{ t: 1.000012, prefix: 'handoff', msg: 'Handing control to graphical environment' },
	null,
	{ t: 0.000015, prefix: 'motd', msg: 'This website is under construction!'},
	{ t: 0.000019, prefix: 'motd', msg: 'Please, comeback here in 1 week!'},
	null,
	{ t: 0.000014, prefix: 'motd', msg: 'If you liked, please follow this site on Neocities and star it on GitHub/Codeberg to motivate me :).'},
	{ t: 0.000014, prefix: 'motd', msg: 'GitHub: https://github.com/synt-xerror/myneocities'},
	{ t: 0.000014, prefix: 'motd', msg: 'Codeberg: https://codeberg.org/synt-xerror/myneocities'},
	null
];

function renderSession(entry) {
	if (!entry) {
		sessionContainer.appendChild(document.createElement("br"));
		return;
	}
	const div = document.createElement("div");
	div.innerHTML = `<span class="timestamp">${entry.prefix ? `[ ${entry.prefix} ]` : ''}</span> ${entry.msg}`;
	sessionContainer.appendChild(div);
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

async function main() {
	await playLogs();
	await playSessionLogs();

	await delay(1000);

	const div = document.createElement("div");
	div.classList.add("terminal-line");
	sessionContainer.appendChild(div);
	
	const textSpan = document.createElement("span");
	const cursor = document.createElement("span");
	cursor.textContent = "█";
	cursor.style.color = "white";
	
	div.appendChild(document.createTextNode("guest@syntaxerror:~/ $ "));
	div.appendChild(textSpan);
	div.appendChild(cursor);
	
	let currentInput = "";
	
	setInterval(() => {
		cursor.style.color = cursor.style.color === "white" ? "black" : "white";
	}, 600);
	
	document.addEventListener("keydown", (e) => {
		cursor.style.color = "white";
		if (e.key === "Backspace") {
		    	cursor.style.color = "white";
		    	currentInput = currentInput.slice(0, -1);
	    	} else if (e.key === "Enter") {
	    	    	console.log("Comando digitado:", currentInput);
	    	    	currentInput = "";
	    	} else if (e.key.length === 1) {
	    	    	currentInput += e.key;
	    	}
	
	    	textSpan.textContent = currentInput;
	});

}

main();
