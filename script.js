var laugh = new Audio('https://files.catbox.moe/gvu6w1.mp3');
fetch("https://api.github.com/repos/synt-xerror/myneocities/commits?per_page=1")
     .then(r => r.json())
     .then(data => {
const c = data[0];
const d = new Date(c.commit.author.date);
const day = String(d.getDate()).padStart(2, "0");
const month = String(d.getMonth() + 1).padStart(2, "0");
const year = d.getFullYear();
const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC"
}).format(d);
const formatedDate = `${day}-${month}-${year}`;
   
document.getElementById("commit").innerHTML =
    `last change: ${formatedDate} ${time} UTC
    (<a href="${c.html_url}" target="_blank">#${c.sha.slice(0, 7)}</a>)`;
});
