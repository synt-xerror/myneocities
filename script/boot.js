const version = "3.0.0-beta";

const logs = [
	// --- EARLY BOOT ---
	{ t: 5, tstamp: 0.000000, prefix: 'kernel', msg: `SyntaxError! ${version} booting on Neocities virtual host` },
	{ t: 3, tstamp: 0.000012, prefix: 'kernel', msg: 'Command line: BOOT_SITE=/srv/www root=/ index.html ro quiet splash debug' },
	{ t: 3, tstamp: 0.000021, prefix: 'kernel', msg: 'BIOS-provided physical RAM map:' },
	{ t: 3, tstamp: 0.000034, prefix: 'bios', msg: 'e820: [mem 0x0000000000000000-0x00000000000fffff] usable' },
	{ t: 3, tstamp: 0.000049, prefix: 'bios', msg: 'e820: [mem 0x0000000000100000-0x000000041f7fffff] usable' },
	{ t: 4, tstamp: 0.000063, prefix: 'bios', msg: 'e820: [mem 0x000000041f800000-0x000000041fffffff] reserved' },
	{ t: 5, tstamp: 0.000078, prefix: 'bios', msg: 'e820: [mem 0x00000004a0000000-0x00000004bfffffff] reserved' },
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
	{ t: 7, tstamp: 0.007203, prefix: 'systemd', msg: 'Starting SyntaxError! system manager' },
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
function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const container = document.getElementById("boot-log");

const behavior = "auto";
function renderLog(entry) {
	if (!entry) {
		br = document.createElement("br");
		container.appendChild(br);
		br.scrollIntoView({ behavior: behavior });
		return;
	}

	const div = document.createElement("div"); // novo div a cada log
	div.innerHTML = `<span class="timestamp">[ ${entry.tstamp.toFixed(6)} ]</span> <span class="subsys-prefix">${entry.prefix}:</span> ${entry.msg}`;
	container.appendChild(div);
	div.scrollIntoView({ behavior: behavior });
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

// Cria novo container para MOTD / sessão
const sessionContainer = document.createElement("div");
sessionContainer.id = "session-log";
document.body.appendChild(sessionContainer);

const sessionLogs = [
	{ t: 0.000010, prefix: 'motd', msg: `Welcome to SyntaxError! ${version}` },
	{ t: 0.000012, prefix: 'motd', msg: 'Host provider: Neocities' },
	{ t: 1.000028, prefix: 'motd', msg: 'Connecting...' },
	{ t: 0.000008, prefix: 'motd', msg: 'Conected as: guest' },
	null,
	{ t: 0.000110, prefix: 'session', msg: 'Launching user space...' },
	{ t: 0.000011, prefix: 'ui', msg: 'Attaching creative layer...' },
	{ t: 0.000410, prefix: 'handoff', msg: 'Handing control to graphical environment' },
	null,
	{ t: 0, prefix: 'motd', msg: 'This website is under construction!'},
	{ t: 0, prefix: 'motd', msg: 'CHANGELOG: Now you can execute commands!'},
	{ t: 0, prefix: 'motd', msg: 'INFO: Some commands are experimental and not complete, and the directories and files are just placeholder, gonna change this next update.'},
	null,
	{ t: 0, prefix: 'motd', msg: 'If you liked, please follow this site on Neocities and star it on GitHub/Codeberg to motivate me :).'},
	{ t: 0, prefix: 'motd', msg: 'GitHub: https://github.com/synt-xerror/myneocities'},
	{ t: 0, prefix: 'motd', msg: 'Codeberg: https://codeberg.org/synt-xerror/myneocities'},
	null,
	{ t: 0, prefix: 'motd', msg: 'Tip: type "help" to see all the commands'},
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
	div.scrollIntoView({ behavior: behavior });
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

const fsTree = {
}

const commands = [
	{ cmd: 'help&nbsp;', desc: "Show all commands"},
	{ cmd: 'clear', desc: "Clear history"},
	{ cmd: 'exit&nbsp;', desc: "Exit session"},
	{ cmd: 'ls&nbsp;&nbsp;&nbsp;', desc: "List directories and files in your current directory (WIP)"},
	{ cmd: 'cd&nbsp;&nbsp;&nbsp;', desc: "Enter in another directory (WIP)"},
	{ cmd: 'echo&nbsp;', desc: "Print an argumment"}
];

function exec_cmd(cmd) {
}

// usa sua variável commands e exec_cmd existentes
// container onde os prompts aparecem
let activePrompt = null; // guarda o prompt atual

// TODO
// possibilidade de imprimir variáveis, de ambiente e as que o usuário define durante'
function echo(text) {
	const result = document.createElement('div');
	result.innerHTML = text;
	result.className = 'result';
	sessionContainer.appendChild(result);
}

let dir = "~";
function createPrompt(str_oldcmd) {
    	if (typeof str_oldcmd === 'string' && str_oldcmd.length > 0) { 
		const token = str_oldcmd.match(/(?:[^\s"]+|"[^"]*")+/g); // Tudo com aspas vira um único token
		const cleanTokens = token.map(t => t.replace(/^"|"$/g, "")); // Sem aspas
		
		switch(token[0]) {
			case 'help':
				console.log('Show all commands');
				let html = "All commands:<br>";
				for (let i = 0; i < commands.length; i++) {
					html += `&nbsp;&nbsp;&nbsp;&nbsp;${commands[i].cmd}&nbsp;&nbsp;&nbsp;&nbsp;${commands[i].desc}<br>`;
				}
				echo(html);
				break;
			case 'clear':
				console.log('Clearing history');
				sessionContainer.innerHTML = "";
				break;
			case 'cd':
				if (token[1] === undefined) {
					dir = "~";
				} else if (token[2]) {
					echo("shell: cd: too many arguments");
				} else if (token[1] == "..") {
					if (dir == "~") {
						dir = "/home";
					} else if (dir == "/home") {
						dir = "/";
					} else if (dir == "/") {
						dir = "/";
					} else if (dir == "/bin") {
						dir = "/";
					} else {
						dir = "~";
					}
				} else {
					dir = token[1];
					console.log(`Changing directory to ${dir}`);
				}
				break;
			case 'ls':
				console.log(`Listing files in current directory ${dir}`);
				if (dir == "~") {
					echo("index.html  blog.html  assets");
				} else if (dir == "assets") {
					echo("lain.png");
				} else if (dir == "/home") {
					echo("guest");
				} else if (dir == "/") {
					echo("bin  home");	
				}
				break;
			case 'echo':
				echo(token.slice(1).join(' '));
				break;i
			case 'exit':
				echo("Connection closed.");
				sessionContainer.remove();
				break;
			default:
				console.log('Command not found');
				echo(`shell: ${token[0]}: command not found`);
		}
    	}

    // aposentar prompt ativo (parar piscar e remover cursor)
    if (activePrompt) {
        clearInterval(activePrompt.blinkInterval);
        // remover cursor do DOM (deixa o texto antigo sem cursor)
        if (activePrompt.cursor && activePrompt.cursor.parentNode) {
            activePrompt.cursor.remove();
        }
        // renomeia id do div antigo para manter unicidade (opcional)
        if (activePrompt.div && activePrompt.div.id === 'cmdprompt') {
            activePrompt.div.id = 'oldcmdprompt';
        }
        activePrompt = null;
    }

    // criar novo prompt
    const div = document.createElement('div');
    div.id = 'cmdprompt';
    sessionContainer.appendChild(div);
    div.scrollIntoView({ behavior: 'smooth' });

    const textSpan = document.createElement('span'); // onde o input aparece
    textSpan.className = 'cursorText';

    const cursor = document.createElement('span');
    cursor.textContent = '█';
    cursor.id = 'cursor';
	cursor.style.userSelect = "none";
    div.appendChild(document.createTextNode(`guest@syntaxerror: ${dir} $ `));
    div.appendChild(textSpan);
    div.appendChild(cursor);

    // fazer piscar apenas do cursor atual (procura por id evita afetar antigos)
    const blinkInterval = setInterval(() => {
        const c = document.getElementById('cursor');
        if (c) c.textContent = c.textContent === '█' ? '' : '█';
    }, 600);

    // configura activePrompt
    activePrompt = {
        div,
        textSpan,
        cursor,
        blinkInterval,
        currentInput: ''
    };
}

// handler de teclado único (instala apenas uma vez)
if (!document._promptKeyHandlerInstalled) {
    document._promptKeyHandlerInstalled = true;
    document.addEventListener('keydown', (e) => {
        const ap = activePrompt;
        if (!ap) return; // nada a fazer se não houver prompt ativo

        // evita comportamento padrão para Backspace e Enter (se quiser)
        if (e.key === 'Backspace' || e.key === 'Enter') e.preventDefault();

        if (e.key === 'Backspace') {
        	ap.currentInput = ap.currentInput.slice(0, -1);
        } else if (e.key === 'Enter') {
        	const inputToSave = ap.currentInput;
        	const command = commands.find(c => c.cmd === inputToSave);
        	// cria novo prompt sempre (passando o texto digitado para histórico)
        	createPrompt(inputToSave);
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

async function main() {
	await playLogs();
	await playSessionLogs();
	await delay(1000);
	await createPrompt();
}

main();
