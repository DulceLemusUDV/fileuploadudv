require.config({
  baseUrl: "scripts/",
});
require(["socket.io", "socket.io-stream"], function (socketIO, SocketStream) {
  console.log("required");
  var file, name, socket, stream;
  document
    .getElementById("imageUploaderInput")
    .addEventListener("change", function (event) {
      file = event.target.files[0];
      console.log(file);
    });

  document
    .getElementById("textUploaderInput")
    .addEventListener("change", function (event) {
      name = event.target.value;
      console.log(name);
    });

  document
    .getElementById("btnSubmit")
    .addEventListener("click", function (event) {
      event.preventDefault();
      if (file) {
        console.log("uploading file");
        sendFile(file, name);
      }
    });
  clearHTMLElements();
  function createSocket() {
    socket = socketIO.connect("https://upload-files-udv.herokuapp.com/");
  }
  createSocket();
  function sendFile(file, nameFile) {
    console.log(file);
    stream = SocketStream.createStream();
    SocketStream(socket).emit("fileUpload", stream, { name: nameFile });
    var blobStream = SocketStream.createBlobReadStream(file);
    var size = 0;
    showHTMLElements();
    blobStream.on("data", function (chunk) {
      size += chunk.length;
      var percentage = Math.floor((size / file.size) * 100) + "%";
      document.getElementsByClassName("progress-bar")[0].style.width =
        percentage;
      document.getElementById("prgress-bar-value").innerHTML = percentage;
      console.log(Math.floor((size / file.size) * 100) + "%");
      if (percentage == "100%") {
        var timeout = setTimeout(function () {
          clearHTMLElements();
          clearTimeout(timeout);
          document.getElementById("successId").style.display = "block";
        }, 2000);
      }
    });

    blobStream.pipe(stream);
  }

  function clearHTMLElements() {
    document.getElementsByClassName("progress")[0].style.display = "none";
    document.getElementsByClassName("progress-bar")[0].style.width = 0 + "%";
    document.getElementById("prgress-bar-value").innerHTML = 0 + "%";
  }
  function showHTMLElements() {
    document.getElementsByClassName("progress")[0].style.display = "block";
    document.getElementById("successId").style.display = "none";
  }
});
