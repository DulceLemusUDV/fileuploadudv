var express = require("express"),
  app = express(),
  server = require("http").Server(app);
var io = require("socket.io")(server),
  socketStream = require("socket.io-stream"),
  fs = require("fs");
var path = require("path");
var port = process.env.PORT || 8082;
app.use(express.static(__dirname));
var uploadRelPath = "Uploads/";
var server1 = server.listen(port, function () {
  console.log("server Listening on port " + port);
});

io.on("connection", function (socket) {
  socketStream(socket).on("fileUpload", function (stream, data) {
    var filename = path.basename(data.name);
    console.log(data);
    try {
      fs.lstatSync(uploadRelPath, function (err, stats) {
        if (!err && stats.isDirectory()) {
          fs.mkdir(uploadRelPath);
        }
      });
    } catch (e) {
      console.log(JSON.stringify(e));
      fs.mkdir(uploadRelPath);
    }

    stream.pipe(fs.createWriteStream(uploadRelPath + filename));
  });
  socket.on("fileClear", function () {
    removeFiles(uploadRelPath);
  });
});
function removeFiles(dirPath) {
  try {
    var files = fs.readdirSync(dirPath);
  } catch (e) {
    console.log(JSON.stringify(e));
    return;
  }
  console.log("Removing All Files" + JSON.stringify(files));
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + "/" + files[i];
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmDir(filePath);
    }
}
