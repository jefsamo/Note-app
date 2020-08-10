const http = require("http");
const note = require("./controllers/noteController");

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === "/" && method === "GET") {
    res.writeHead(200);
    console.log(req.url);
    res.end("Welcome to Note App");
  } else if (method === "GET" && url === "/notes") {
    note.getAllNotes(req, res);
  } else if (method === "POST" && url === "/note") {
    note.createNote(req, res);
    // } else if (method === "GET" && url.startsWith("/note")) {
    //   findNote(req, res);
  } else if (method === "PATCH" && url.startsWith("/note")) {
    note.updateNote(req, res);
  } else if (method === "DELETE" && url.startsWith("/note")) {
    note.deleteNote(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end({ message: `No ${method} with this ${url}` });
  }
});

const hostname = "127.0.0.1";
const port = 2000;

server.listen(port, hostname, () => {
  console.log(`App running at http://${hostname}:${port}/`);
});
