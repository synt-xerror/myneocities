// =============================================================================
// CONSTANTS & VERSION
// =============================================================================

const version = "3.0.1";
const behavior = "auto";


// =============================================================================
// BOOT LOG DATA
// =============================================================================

const logs = [
	// --- EARLY BOOT ---
	{ t: 5, tstamp: 0.000000, prefix: 'kernel', msg: `Neoshell ${version} booting on Neocities virtual host` },
	{ t: 3, tstamp: 0.000012, prefix: 'kernel', msg: 'Command line: BOOT_SITE=/srv/www root=/ index.html ro quiet splash debug' },
	{ t: 3, tstamp: 0.000021, prefix: 'kernel', msg: 'BIOS-provided physical RAM map:' },
	{ t: 3, tstamp: 0.000034, prefix: 'bios',   msg: 'e820: [mem 0x0000000000000000-0x00000000000fffff] usable' },
	{ t: 3, tstamp: 0.000049, prefix: 'bios',   msg: 'e820: [mem 0x0000000000100000-0x000000041f7fffff] usable' },
	{ t: 4, tstamp: 0.000063, prefix: 'bios',   msg: 'e820: [mem 0x000000041f800000-0x000000041fffffff] reserved' },
	{ t: 5, tstamp: 0.000078, prefix: 'bios',   msg: 'e820: [mem 0x00000004a0000000-0x00000004bfffffff] reserved' },
	{ t: 2, tstamp: 0.000091, prefix: 'kernel', msg: 'NX protection: active' },
	{ t: 3, tstamp: 0.000107, prefix: 'kernel', msg: 'DMI: Neocities Virtual Machine v2.4, BIOS 1.14.0 04/01/2014' },
	{ t: 4, tstamp: 0.000119, prefix: 'kernel', msg: 'APIC: virtual APIC enabled, 4 virtual cores detected' },
	{ t: 5, tstamp: 0.000134, prefix: 'kernel', msg: 'TSC: detected 2700.000 MHz virtual processor' },
	{ t: 6, tstamp: 0.000148, prefix: 'kernel', msg: 'PCI: Using configuration type 1 for base access' },
	{ t: 2, tstamp: 0.000162, prefix: 'kernel', msg: 'clocksource: tsc-early: mask: 0xffffffffffffffff max_cycles: 0x26f6c77a00f' },
	{ t: 3, tstamp: 0.000179, prefix: 'kernel', msg: 'ACPI: IRQ0 used by override' },
	{ t: 3, tstamp: 0.000193, prefix: 'kernel', msg: 'PCI: bus0: Fast back to back transfers disabled' },
	null,

	// --- VFS / FILESYSTEM ---
	{ t: 9, tstamp: 0.001034, prefix: 'vfs', msg: 'mounting root filesystem /srv/www [ext4, ro]' },
	{ t: 7, tstamp: 0.001189, prefix: 'vfs', msg: 'EXT4-fs (vda1): mounted filesystem with ordered data mode' },
	{ t: 7, tstamp: 0.001247, prefix: 'vfs', msg: 'loading initramfs image: /boot/initramfs.img — size: 4.2M' },
	{ t: 5, tstamp: 0.001398, prefix: 'vfs', msg: 'unpacking initramfs: 312 entries extracted' },
	{ t: 7, tstamp: 0.001502, prefix: 'vfs', msg: 'registering pages: index.html about.html blog.html source.html changelog.html cool-stuff.html' },
	{ t: 6, tstamp: 0.001614, prefix: 'vfs', msg: 'inode table: 6 pages, 47 assets, 3 symlinks' },
	{ t: 5, tstamp: 0.001728, prefix: 'vfs', msg: 'mounting /assets [tmpfs] — res="success"' },
	{ t: 3, tstamp: 0.001831, prefix: 'vfs', msg: 'mounting /scripts [tmpfs] — res="success"' },
	{ t: 7, tstamp: 0.001942, prefix: 'vfs', msg: 'mounting /style [tmpfs] — res="success"' },
	{ t: 6, tstamp: 0.002018, prefix: 'vfs', msg: 'parsing robots.txt — 2 rules loaded — res="success"' },
	{ t: 5, tstamp: 0.002134, prefix: 'vfs', msg: 'reading README.md — 1.1K — res="success"' },
	{ t: 5, tstamp: 0.002241, prefix: 'vfs', msg: 'sitemap.xml not found — skipping' },
	{ t: 2, tstamp: 0.002309, prefix: 'vfs', msg: 'checking filesystem integrity: 0 errors, 0 warnings' },
	null,

	// --- MODULE LOADING ---
	{ t: 9, tstamp: 0.003012, prefix: 'modules', msg: 'loading CSS engine module v1.3.2 — res="success"' },
	{ t: 9, tstamp: 0.003189, prefix: 'modules', msg: 'loading JS runtime module v2.1.7 — res="success"' },
	{ t: 8, tstamp: 0.003271, prefix: 'modules', msg: 'loading font driver: WebPlus_IBM_VGA_8x14.woff — 28K — res="success"' },
	{ t: 8, tstamp: 0.003388, prefix: 'modules', msg: 'loading font driver: WebPlus_IBM_VGA_9x16.woff — 31K — res="success"' },
	{ t: 3, tstamp: 0.003461, prefix: 'modules', msg: 'registering theme engines: darkmode lightmode — res="success"' },
	{ t: 5, tstamp: 0.003572, prefix: 'modules', msg: 'initializing syntax checker engine — dialect: HTML5+CSS3 — res="success"' },
	{ t: 9, tstamp: 0.003648, prefix: 'modules', msg: 'loading animation controller — 14 keyframes registered' },
	{ t: 9, tstamp: 0.003729, prefix: 'modules', msg: 'loading markdown parser v0.6.1 — res="success"' },
	{ t: 8, tstamp: 0.003841, prefix: 'modules', msg: 'registering event listeners: DOMContentLoaded scroll resize keydown — 4 hooks' },
	null,

	// --- NETWORK ---
	{ t: 6, tstamp: 0.004502, prefix: 'network', msg: 'initializing virtual NIC eth0 — MTU 1500 — res="success"' },
	{ t: 5, tstamp: 0.004639, prefix: 'network', msg: 'DHCP: sending DISCOVER on eth0' },
	{ t: 4, tstamp: 0.004721, prefix: 'network', msg: 'DHCP: received OFFER from 192.168.42.1' },
	{ t: 3, tstamp: 0.004808, prefix: 'network', msg: 'DHCP: IP 192.168.42.42/24 assigned — gateway 192.168.42.1 — lease 86400s' },
	{ t: 2, tstamp: 0.004912, prefix: 'network', msg: 'resolving DNS: neocities.org — 198.199.98.6 — res="success"' },
	{ t: 5, tstamp: 0.005034, prefix: 'network', msg: 'TCP handshake: SYN → neocities.org:443' },
	{ t: 4, tstamp: 0.005119, prefix: 'network', msg: 'TCP handshake: SYN-ACK ← neocities.org:443 — RTT 11ms' },
	{ t: 2, tstamp: 0.005203, prefix: 'network', msg: 'TLS 1.3 negotiation complete — cipher: TLS_AES_256_GCM_SHA384' },
	{ t: 3, tstamp: 0.005318, prefix: 'network', msg: 'virtual latency: 11ms — packet loss: 0.0% — link up' },
	null,

	// --- NEOCITIES SERVER HANDSHAKE ---
	{ t: 5, tstamp: 0.005801, prefix: 'neocities', msg: 'GET /api/ping HTTP/2 — status: 200 OK — res="success"' },
	{ t: 5, tstamp: 0.005934, prefix: 'neocities', msg: 'authenticating site token: ****...**** — res="accepted"' },
	{ t: 4, tstamp: 0.006048, prefix: 'neocities', msg: 'server: neocities/1.0 (nginx) — proto: HTTP/2' },
	{ t: 2, tstamp: 0.006159, prefix: 'neocities', msg: 'GET /api/info — site: syntaxerror — plan: supporter — res="success"' },
	{ t: 3, tstamp: 0.006271, prefix: 'neocities', msg: 'last_updated: fetched — no delta since last boot' },
	{ t: 6, tstamp: 0.006384, prefix: 'neocities', msg: 'CDN edge node: nyc-01 — distance: 9ms' },
	{ t: 5, tstamp: 0.006498, prefix: 'neocities', msg: 'retrieving static asset manifest — 42 files indexed — res="success"' },
	{ t: 3, tstamp: 0.006601, prefix: 'neocities', msg: 'verifying checksums: 42/42 passed — 0 corrupted — res="success"' },
	{ t: 2, tstamp: 0.006712, prefix: 'neocities', msg: 'CDN cache status: HIT (42) MISS (0) EXPIRED (0)' },
	{ t: 1, tstamp: 0.006819, prefix: 'neocities', msg: 'push channel: ws://neocities.org/live — state: CONNECTED' },
	null,

	// --- SYSTEMD ---
	{ t: 7, tstamp: 0.007203, prefix: 'systemd', msg: 'Starting Neoshell system manager' },
	{ t: 6, tstamp: 0.007318, prefix: 'systemd', msg: 'Reached target: Local Encrypted Volumes' },
	{ t: 5, tstamp: 0.007421, prefix: 'systemd', msg: 'Reached target: Basic System' },
	{ t: 7, tstamp: 0.007534, prefix: 'systemd', msg: 'Started: udev Kernel Device Manager (virtual)' },
	{ t: 7, tstamp: 0.007648, prefix: 'systemd', msg: 'Mounted: /proc /sys /dev (virtual filesystems)' },
	{ t: 8, tstamp: 0.007751, prefix: 'systemd', msg: 'Starting: virtual timer services...' },
	{ t: 4, tstamp: 0.007863, prefix: 'systemd', msg: 'Starting: session-manager.service...' },
	{ t: 2, tstamp: 0.007974, prefix: 'systemd', msg: 'Started: session-manager.service — PID 1142' },
	{ t: 6, tstamp: 0.008089, prefix: 'systemd', msg: 'Starting: site-watchdog.service...' },
	{ t: 8, tstamp: 0.008198, prefix: 'systemd', msg: 'Started: site-watchdog.service — PID 1201' },
	{ t: 9, tstamp: 0.008304, prefix: 'systemd', msg: 'Reached target: Multi-User System' },
	{ t: 8, tstamp: 0.008417, prefix: 'systemd', msg: 'All critical system services active' },
	null,

	// --- UI / TERMINAL ---
	{ t: 9, tstamp: 0.008901, prefix: 'ui', msg: 'initializing interface layer: interactive terminal v0.9.8' },
	{ t: 8, tstamp: 0.009012, prefix: 'ui', msg: 'loading command registry: help clear blog about source cool-stuff changelog' },
	{ t: 7, tstamp: 0.009124, prefix: 'ui', msg: 'mapping accessible nodes: / /about /blog /source /changelog — res="success"' },
	{ t: 6, tstamp: 0.009237, prefix: 'ui', msg: 'initializing cursor and prompt handler — blink_rate: 530ms' },
	{ t: 5, tstamp: 0.009349, prefix: 'ui', msg: 'loading color schemes: default solarized matrix gruvbox' },
	{ t: 1, tstamp: 0.009461, prefix: 'ui', msg: 'stdin/stdout bound to #terminal — tabindex: 0' },
	{ t: 4, tstamp: 0.009574, prefix: 'ui', msg: 'history buffer: 256 entries — res="success"' },
	{ t: 6, tstamp: 0.009688, prefix: 'ui', msg: 'autocomplete engine: 7 commands indexed — res="success"' },
	null,

	// --- SITE CORE / FINAL ---
	{ t: 5, tstamp: 0.010103, prefix: 'site_core', msg: 'running self-test: memory OK — DOM OK — network OK' },
	{ t: 5, tstamp: 0.010219, prefix: 'site_core', msg: 'entropy pool seeded — /dev/urandom ready' },
	{ t: 3, tstamp: 0.010334, prefix: 'site_core', msg: `${version} boot sequence complete — uptime: 0.01033s` },
	{ t: 4, tstamp: 0.010448, prefix: 'site_core', msg: 'root exposed at "/" — process uid: www-data' },
	{ t: 6, tstamp: 0.010561, prefix: 'site_core', msg: 'awaiting input' },
];


// =============================================================================
// SESSION / MOTD DATA
// =============================================================================

const sessionLogs = [
	{ t: 0.000010, prefix: 'motd',    msg: `Welcome to Neoshell ${version}` },
	{ t: 0.000012, prefix: 'motd',    msg: 'Host provider: Neocities' },
	{ t: 1.000028, prefix: 'motd',    msg: 'Connecting...' },
	{ t: 0.000008, prefix: 'motd',    msg: 'Conected as: guest' },
	null,
	{ t: 0.000110, prefix: 'session', msg: 'Launching user space...' },
	{ t: 0.000011, prefix: 'ui',      msg: 'Attaching creative layer...' },
	{ t: 0.000410, prefix: 'handoff', msg: 'Handing control to graphical environment' },
	null,
	{ t: 0, prefix: 'motd', msg: 'LAST UPDATE: 2026-02-25' },
	{ t: 0, prefix: 'motd', msg: 'CHANGELOG: All the commands working properly! And I changed the name to Neoshell because it is cooler' },
	{ t: 0, prefix: 'motd', msg: 'INFO: I want to update the prompt next time.' },
	null,
	{ t: 0, prefix: 'motd', msg: 'If you liked, please follow this site on Neocities and star it on GitHub/Codeberg to motivate me :).' },
	{ t: 0, prefix: 'motd', msg: 'GitHub: https://github.com/synt-xerror/myneocities' },
	{ t: 0, prefix: 'motd', msg: 'Codeberg: https://codeberg.org/synt-xerror/myneocities' },
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

// variáveis de ambiente acessadas pelo usuário
const envvar = {
	"USER": "guest",
	"HOME": "/home/" + USER,
	"PWD": pwd()
};


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
			"html":  "/bin/html"
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


// =============================================================================
// COMMAND REGISTRY
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
	{ cmd: 'html&nbsp;', desc: "Execute an HTML file" }
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
// COMMAND EXECUTOR
// =============================================================================

function exec_cmd(cmd) {
}

function executeCommand(str_cmd) {
	if (typeof str_cmd !== 'string' || str_cmd.length === 0) return;

	const token = str_cmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
	const cleanTokens = token.map(t => t.replace(/^"|"$/g, ""));

	if (token.length === 0) return;

	// Verificação de caminhos absolutos
	if (token[0].includes("/")) {
		if (!fs[token[0]]) {
			echo(`shell: ${token[0]}: No such file or directory`);
			return;
		}
		if (fs[token[0]].type === "dir") {
			echo(`shell: ${token[0]}: Is a directory`);
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
				    	rpath = cwd; // atualiza rpath só pra consistência
				} else if (path[0] === "/") {
				    	rpath = path;
				} else if (cwd == "/") {
					rpath = "/" + path;
				} else {
					rpath = cwd + "/" + path;
				}
			
				if (!fs[rpath]) {
				    	echo(`shell: cd: ${rpath}: No such file or directory`);
				} else if (fs[rpath].type !== "dir") {
				    	echo(`shell: cd: ${token[1]}: Not a directory`);
				} else {
				    	cwd = rpath;
				}
			}
			break;

		case 'ls':
			echo(Object.keys(fs[cwd]?.children || {}).join("&nbsp;&nbsp"));
			break;

		case 'echo':
			if (token[1]) {
				echo(token.slice(1).join(' '));
			} else {
				echo(" ");
			}
			break;

		case 'pwd':
			echo(pwd());
			break;

		case 'exit':
			echo("Connection closed.");
			sessionContainer.remove();
			break;

		case 'cat':
			if (!token[1]) {
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
				    	echo(`shell: cat: ${token[1]}: No such file or directory`);
				} else if (fs[rpath].type == "dir") {
				    	echo(`shell: cat: ${token[1]}: Is a directory`);
				} else if (rpath.endsWith(".gif")) { 
					echoimg(fs[rpath].content);	
				} else {
				    	echo(fs[rpath].content);
				}
			}
			break;
		case 'html':
			if (!token[1]) {
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
				    	echo(`shell: html: ${token[1]}: No such file or directory`);
				} else if (fs[rpath].type == "dir") {
				    	echo(`shell: html: ${token[1]}: Is a directory`);
				} else if (!rpath.endsWith(".html")) { 
					echo(`shell: html: ${token[1]}: Is not an HTML file`);	
				} else {
					window.location.href = fs[rpath].content;
				}
			}

			break;
		default:
			if (token[0].includes("/")) {
				if (fs[token[0]].type === "file" && fs[token[0]].command) {
					console.log(`executing by absolute path: ${fs[token[0]].command}`);
					executeCommand(fs[token[0]].command);
				} else {
					echo(`shell: ${token[0]}: cannot execute binary file: Exec format error`);
				}
			} else {
				echo(`shell: ${token[0]}: command not found`);
			}
	}
}


// =============================================================================
// PROMPT MANAGER CLEAN & FUNCTIONAL
// =============================================================================

let activePrompt = null;
function createPrompt() {
    // aposentar prompt antigo
    if (activePrompt) {
        clearInterval(activePrompt.blinkInterval);
        if (activePrompt.cursor && activePrompt.cursor.parentNode) activePrompt.cursor.remove();
        if (activePrompt.div && activePrompt.div.id === 'cmdprompt') activePrompt.div.id = 'oldcmdprompt';
        activePrompt = null;
    }

    const div = document.createElement('div');
    div.id = 'cmdprompt';
    sessionContainer.appendChild(div);
    div.scrollIntoView({ behavior: 'auto' });

    const textSpan = document.createElement('span');
    textSpan.className = 'cursorText';

    const cursor = document.createElement('span');
    cursor.textContent = '█';
    cursor.id = 'cursor';
    cursor.style.userSelect = "none";

    div.appendChild(document.createTextNode(`guest@syntaxerror: ${cwd} $ `));
    div.appendChild(textSpan);
    div.appendChild(cursor);

    const blinkInterval = setInterval(() => {
        const c = document.getElementById('cursor');
        if (c) c.textContent = c.textContent === '█' ? '' : '█';
    }, 600);

    activePrompt = { div, textSpan, cursor, blinkInterval, currentInput: '' };
}
// =============================================================================
// KEYBOARD HANDLER
// =============================================================================

if (!document._promptKeyHandlerInstalled) {
	document._promptKeyHandlerInstalled = true;

	document.addEventListener('keydown', (e) => {
		const ap = activePrompt;
		if (!ap) return;

		if (e.key === 'Backspace' || e.key === 'Enter') e.preventDefault();

		if (e.key === 'Backspace') {
			ap.currentInput = ap.currentInput.slice(0, -1);

		} else if (e.key === 'Enter') {
			const inputToSave = ap.currentInput;
			const command = commands.find(c => c.cmd === inputToSave);
			executeCommand(inputToSave);
			createPrompt();

		} else if (e.ctrlKey && e.key === "c") {
			const inputToSave = ap.currentInput;
			const command = commands.find(c => c.cmd === inputToSave);
			const interruptedInput = inputToSave + "^C";
			createPrompt(interruptedInput);

		} else if (e.key.length === 1) {
			ap.currentInput += e.key;
		}

		// atualiza texto exibido
		ap.textSpan.textContent = ap.currentInput;
		if (ap.cursor) ap.cursor.textContent = '█';
	});
}


// =============================================================================
// MAIN
// =============================================================================

async function main() {
	await playLogs();
	await playSessionLogs();
	await delay(1000);
	await createPrompt();
}

main();
