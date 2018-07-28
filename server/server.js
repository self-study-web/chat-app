const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

const app = express();
// We user http.createServer instaed of express(app.listen) as
// it allows us to reuse the server to also include socketIO
var server = http.createServer(app);
// websocket server - we can listen/emit events
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("createMessage", newMessage => {
    console.log("createMessage", newMessage);
    io.emit("newMessage", {
      from: newMessage.from,
      text: newMessage.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

/* When we integrate socket.io with our server, we get access(from client side) to
 - a route that accepts incoming connections(can accept web socket connections)
 - a JS library http://localhost:3000/socket.io/socket.io.js 
   This contains the code we needed on the client to make connections and transfer data
   servet to client or vice versa

 */
