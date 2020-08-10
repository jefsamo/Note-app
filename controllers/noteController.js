const fs = require("fs");
const path = require("path");

exports.createNote = (req, res) => {
  let body = [];

  req
    .on("data", (chunk) => body.push(chunk))
    .on("end", () => {
      body = Buffer.concat(body).toString();
      if (!body) {
        res.statusCode = 400;
        res.end("Error sending data");
      }
      body = JSON.parse(body);

      const { topic, note } = body;
      if (!topic || !note) {
        res.statusCode = 400;

        res.end("Error adding note");
      }
      const name = createFile(topic, note);

      const data = { topic, note };

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    });
};

exports.deleteNote = (req, res) => {
  const [_, __, topic, fileName] = req.url.split("/");

  if (!topic || !fileName) {
    res.statusCode = 400;
    res.end("Invalid parameters in the query");
  }

  if (!deleteFile(topic, fileName)) {
    res.statusCode = 404;
    res.end("Note does not exist");
  }
  // console.log(topic.length);
  res.statusCode = 204;
  res.setHeader("Content-Type", "text/plain");
  res.end("");
  // checkForLastItemInFolder("Sunday");
};

exports.updateNote = (req, res) => {
  const [_, __, topic, fileName] = req.url.split("/");

  if (!topic || !fileName) {
    res.statusCode = 400;
    res.end("Wrong topic or filename");
  }

  let body = [];

  req
    .on("data", (chunk) => body.push(chunk))
    .on("end", () => {
      body = Buffer.concat(body).toString();
      if (!body) {
        res.statusCode = 400;
        res.end("Invalid parameters in the body");
      }
      body = JSON.parse(body);

      const { note } = body;

      if (!note) {
        res.statusCode = 400;
        res.end("Invalid parameter in the note");
      }

      if (!updateFile(topic, fileName, note)) {
        res.statusCode = 404;
        res.end("Note not found");
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("");
    });
};

exports.getAllNotes = (req, res) => {
  res.end(`Get all notes route`);
};

const createFile = (topic, data) => {
  const dir = `./notes/${topic}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const fileName = `note-${Date.now()}.txt`;
  const filePath = `${dir}/${fileName}`;
  fs.writeFileSync(filePath, data);
};

const deleteFile = (topic, fileName) => {
  const filePath = `./notes/${topic}/${fileName}.txt`;

  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    fs.unlinkSync(filePath);
    checkForLastItemInFolder(topic, `./notes/${topic}`);
    return true;
  } catch (error) {
    return false;
  }
};

const updateFile = (topic, fileName, data) => {
  const filePath = `./notes/${topic}/${fileName}.txt`;

  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    fs.writeFileSync(filePath, data);
    return true;
  } catch (error) {
    return false;
  }
};

const checkForLastItemInFolder = (topic, fileDir) => {
  let totalFiles = "";
  fs.readdir(`./notes/${topic}`, (error, files) => {
    totalFiles = files.length; // return the number of files
    console.log(totalFiles); // print the total number of files
    // totalFiles === 0 ? fs.unlink(fileDir) : null;
    if (totalFiles === 0) {
      fs.rmdir(fileDir, { recursive: true }, (err) => {
        if (err) {
          throw err;
        }

        console.log(`is deleted!`);
      });
    }
  });
};
