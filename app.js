const express = require('express');
const app = express();

const http = require("http");
const path = require("path");

const socketio = require("socket.io");  // corrected typo
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));  

io.on("connection", function(socket) {
    socket.on("send-locatiion", function (data) {
        io.emit("received-location ", {id:socket.id, ...data}); 
    });
    console.log("connected");
});

app.get("/", function(req, res) {
    res.render("index");  // corrected method usage
});
server.listen(5000);