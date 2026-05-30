import http from "node:http";
import { Readable } from "node:stream";

import app from "../dist/server/server.js";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 3000);

function toRequestBody(req) {
  if (req.method === "GET" || req.method === "HEAD") {
    return undefined;
  }

  return Readable.toWeb(req);
}

const server = http.createServer(async (req, res) => {
  try {
    const origin = `http://${req.headers.host ?? `${host}:${port}`}`;
    const url = new URL(req.url ?? "/", origin);
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          headers.append(key, item);
        }
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    }

    const request = new Request(url, {
      method: req.method,
      headers,
      body: toRequestBody(req),
      duplex: "half",
    });

    const response = await app.fetch(request, {}, {});
    res.statusCode = response.status;

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (!response.body) {
      res.end();
      return;
    }

    const body = Buffer.from(await response.arrayBuffer());
    res.end(body);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`Business CRM SSR server listening on http://${host}:${port}`);
});
