// TODO
// hidden files
// new prompt

// =============================================================================
// CONSTANTS & VERSION
// =============================================================================

const LAST_UPDATE = "2026-02-26";
const CHANGELOG = "Prompt updated! Now you can edit what you typed, navigate past commands, jump words, and more (type 'binds').";
const INFO = "Gonna focus on home.html and get some ideas, the next update on Neoshell can be delayed";

const version = "3.1.0";
const behavior = "auto";

console.log("[INIT] Neoshell script loaded");
console.log(`[INIT] Version: ${version}`);
console.log(`[INIT] Scroll behavior: ${behavior}`);


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

console.log(`[DATA] logs array loaded: ${logs.filter(Boolean).length} entries (+${logs.filter(l => l === null).length} separators)`);


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
				const echoOutput = token.slice(1).join(' ');
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
			console.log("[CMD:exit] Closing session — removing session container from DOM");
			echo("Connection closed.");
			sessionContainer.remove();
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

function renderPrompt() {
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

document.addEventListener('keydown', (e) => {
	const ap = activePrompt;
	if (!ap) {
		console.warn("[KEYBOARD] keydown fired but no active prompt — ignoring");
		return;
	}

	console.log(`[KEYBOARD] Key pressed: "${e.key}" | ctrlKey: ${e.ctrlKey} | metaKey: ${e.metaKey} | cursorPos: ${cursorPos} | bufferLen: ${lineBuffer.length}`);

	// Prevent default browser behavior for certain keys
	const keysToBlock = ['/', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
	if (keysToBlock.includes(e.key) || e.ctrlKey || e.metaKey) {
		console.log(`[KEYBOARD] Preventing default for key: "${e.key}"`);
		e.preventDefault();
	}

	// --- BACKSPACE ---
	if (e.key === 'Backspace') {
		if (cursorPos > 0) {
			const removed = lineBuffer[cursorPos - 1];
			lineBuffer.splice(cursorPos - 1, 1);
			cursorPos--;
			console.log(`[KEYBOARD] Backspace: removed char "${removed}" at position ${cursorPos} — buffer now: "${lineBuffer.join('')}"`);
		} else {
			console.log("[KEYBOARD] Backspace: cursorPos is 0, nothing to remove");
		}
	}

	// --- DELETE ---
	else if (e.key === 'Delete') {
		if (cursorPos < lineBuffer.length) {
			const removed = lineBuffer[cursorPos];
			lineBuffer.splice(cursorPos, 1);
			console.log(`[KEYBOARD] Delete: removed char "${removed}" at position ${cursorPos} — buffer now: "${lineBuffer.join('')}"`);
		} else {
			console.log("[KEYBOARD] Delete: cursorPos is at end of buffer, nothing to delete");
		}
	}

	// --- CTRL + DELETE (delete word forward) ---
	if (e.ctrlKey && e.key === 'Delete') {
		const before = lineBuffer.join('');
		const separators = /\s|,|\//;
		while (cursorPos < lineBuffer.length && !separators.test(lineBuffer[cursorPos])) {
			lineBuffer.splice(cursorPos, 1);
		}
		console.log(`[KEYBOARD] Ctrl+Delete: deleted word forward — buffer: "${before}" → "${lineBuffer.join('')}"`);
	}

	// --- ARROW LEFT ---
	else if (e.key === 'ArrowLeft') {
		if (cursorPos > 0) {
			cursorPos--;
			console.log(`[KEYBOARD] ArrowLeft: cursorPos → ${cursorPos}`);
		} else {
			console.log("[KEYBOARD] ArrowLeft: already at position 0");
		}
	}

	// --- ARROW RIGHT ---
	else if (e.key === 'ArrowRight') {
		if (cursorPos < lineBuffer.length) {
			cursorPos++;
			console.log(`[KEYBOARD] ArrowRight: cursorPos → ${cursorPos}`);
		} else {
			console.log("[KEYBOARD] ArrowRight: already at end of buffer");
		}
	}

	// --- CTRL + ARROW LEFT (jump word backward) ---
	if (e.ctrlKey && e.key === 'ArrowLeft') {
		const prev = cursorPos;
		while (cursorPos > 0 && !/\s|,|\//.test(lineBuffer[cursorPos - 1])) {
			cursorPos--;
		}
		console.log(`[KEYBOARD] Ctrl+ArrowLeft: cursor jumped backward from ${prev} to ${cursorPos}`);
	}

	// --- CTRL + ARROW RIGHT (jump word forward) ---
	if (e.ctrlKey && e.key === 'ArrowRight') {
		const prev = cursorPos;
		while (cursorPos < lineBuffer.length && !/\s|,|\//.test(lineBuffer[cursorPos])) {
			cursorPos++;
		}
		console.log(`[KEYBOARD] Ctrl+ArrowRight: cursor jumped forward from ${prev} to ${cursorPos}`);
	}

	// --- CTRL + A (jump to beginning of line) ---
	if (e.ctrlKey && e.key === 'a') {
		console.log(`[KEYBOARD] Ctrl+A: cursor moved to beginning — was at ${cursorPos}`);
		cursorPos = 0;
	}
	
	// --- COMMAND HISTORY (ARROW UP / DOWN) ---
	if (e.key === 'ArrowUp') {
		if (historyIndex > 0) {
			historyIndex--;
			lineBuffer = history[historyIndex].split('');
			cursorPos = lineBuffer.length;
			console.log(`[KEYBOARD] ArrowUp: history index → ${historyIndex} | loaded: "${history[historyIndex]}"`);
		} else {
			console.log(`[KEYBOARD] ArrowUp: already at oldest history entry (index ${historyIndex})`);
		}
	}
	else if (e.key === 'ArrowDown') {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			lineBuffer = history[historyIndex].split('');
			cursorPos = lineBuffer.length;
			console.log(`[KEYBOARD] ArrowDown: history index → ${historyIndex} | loaded: "${history[historyIndex]}"`);
		} else {
			historyIndex = history.length;
			lineBuffer = [];
			cursorPos = 0;
			console.log(`[KEYBOARD] ArrowDown: past end of history — buffer cleared`);
		}
	}

	// --- REGULAR CHARACTER INPUT ---
	else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
		lineBuffer.splice(cursorPos, 0, e.key);
		cursorPos++;
		console.log(`[KEYBOARD] Character inserted: "${e.key}" at position ${cursorPos - 1} — buffer now: "${lineBuffer.join('')}"`);
	}

	// --- ENTER (submit command) ---
	if (e.key === 'Enter') {
		const inputToSave = lineBuffer.join('').trim();
		console.log(`[KEYBOARD] Enter pressed — trimmed input: "${inputToSave}"`);
		if (inputToSave !== "") {
			history.push(inputToSave);
			console.log(`[KEYBOARD] Command saved to history — history length: ${history.length}`);
		} else {
			console.log("[KEYBOARD] Empty input — not saved to history");
		}
		historyIndex = history.length;
		console.log(`[KEYBOARD] historyIndex reset to: ${historyIndex}`);
		executeCommand(inputToSave);
		createPrompt();
		return; // avoid re-rendering the current prompt after Enter
	}

	ap.currentInput = lineBuffer.join('');
	console.log(`[KEYBOARD] activePrompt.currentInput updated: "${ap.currentInput}"`);
	renderPrompt();
});


// =============================================================================
// MAIN
// =============================================================================

async function main() {
	console.log("[MAIN] main() started");
	console.log("[MAIN] Starting boot log playback");
	await playLogs();
	console.log("[MAIN] Boot logs done");
	console.log("[MAIN] Starting session log playback");
	await playSessionLogs();
	console.log("[MAIN] Session logs done — waiting 1000ms before prompt");
	await delay(1000);
	console.log("[MAIN] Creating initial prompt");
	await createPrompt();
	console.log("[MAIN] Initialization complete — terminal ready for input");
}

main();
