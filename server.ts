import { readFileSync } from "node:fs";
import { Canvas } from "skia-canvas";
import http from "node:http";

const hostname = "127.0.0.1";
// const hostname = "0.0.0.0";
const port = 3000;

let lastTime = new Date();

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "", `http://${req.headers.host}`);

  if (url.pathname === "/" || url.pathname === "/index.html") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    const script = readFileSync("index.html", "utf8");
    res.write(script);
    res.end();
    return;
  } else if (req.url === "/script.js") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/javascript");
    const script = readFileSync("script.js", "utf8").replace(
      "{time}",
      new Date().toString()
    );
    res.write(script);
    res.end();
    return;
  } else if (url.pathname === "/date.png") {
    const refreshHeader = !!req.headers["x-refresh"];
    const params = new URLSearchParams(url.search);
    const refreshQuery = params.has("refresh");
    if (refreshHeader || refreshQuery) {
      lastTime = new Date();
    }

    const canvas = new Canvas(400, 400);
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const str = lastTime.toString();
    const strSize = ctx.measureText(str);
    const strHeight =
      strSize.actualBoundingBoxAscent + strSize.actualBoundingBoxDescent;

    ctx.fillText(
      str,
      width / 2 - strSize.width / 2,
      height / 2 - strHeight / 2
    );

    if (!refreshQuery) {
      res.setHeader("Cache-Control", "public, max-age=3600");
    }
    res.setHeader("Content-Type", "image/png");
    res.write(canvas.toBufferSync("png"));
  }

  res.statusCode = 404;
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
