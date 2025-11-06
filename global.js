export function tempoDesde(dateString) {
  // se a data vier só como "2025-11-05", assume meia-noite no fuso local (-03:00)
  if (!dateString.includes("T")) {
    dateString = dateString.trim() + "T00:00:00-03:00";
  }
  // cria objeto Date com fuso local
  const data = new Date(dateString);
  const agora = new Date();

  const diff = agora - data; // diferença em milissegundos
  const segundos = Math.floor(diff / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (segundos < 60) return `${segundos} seconds ago`;
  if (minutos < 60) return `${minutos} minute${minutos > 1 ? "s" : ""} ago`;
  if (horas < 24) return `${horas} hour${horas > 1 ? "s" : ""} ago`;
  if (dias < 7) return `${dias} day${dias > 1 ? "s" : ""} ago`;

  // se for mais antigo que uma semana, mostra a data formatada
  return data.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function update(type) {
  document.addEventListener("DOMContentLoaded", () => {

    fetch("./posts/posts.json")
      .then((response) => response.json())
      .then(async (files) => {
        const container = document.querySelector(".posts");

        // se a variável for verdadeira, deixa só o último post
        const lista = type == "home" ? [files[0]] : files;

        // cria uma lista de promessas (cada fetch de post)
        const promises = lista.map(async (file) => {
          const r = await fetch(`./posts/${file}`);
          const html = await r.text();
          const postDiv = document.createElement("div");
          postDiv.innerHTML = html;
          container.appendChild(postDiv);
        });

        // espera todos os posts terminarem de carregar
        await Promise.all(promises);

        document.querySelectorAll("[id^='date']").forEach((dateElem) => {
          const num = dateElem.id.replace("date", "");
          const timeElem = document.getElementById("time" + num);
          const hourElem = document.getElementById("hour" + num);

          let dateString = dateElem.textContent.trim();
          if (hourElem) {
            dateString += "T" + hourElem.textContent.trim() + ":00-03:00";
          }

          if (timeElem) {
            timeElem.textContent = tempoDesde(dateString);
          }
        });
      })
      .catch((err) => console.error("Erro ao carregar posts:", err));
  });
}

