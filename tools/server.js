import express from "express";
import morgan from "morgan";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const app = express();
const port = 3001;

app.use(morgan("dev"));

const pages = ["/", "random", "about", "projects", "webrings", "neoshell"];

for (const page of pages) {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(root, page, "index.html"));
  });
}

app.use("/js", express.static("js"));
app.use("/css", express.static("css"));
app.use("/assets", express.static("assets"));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

