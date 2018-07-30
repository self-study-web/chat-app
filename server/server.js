const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

const app = express();
// We user http.createServer instaed of express(app.listen) as
// it allows us to reuse the server to also include socketIO
var server = http.createServer(app);
// websocket server - we can listen/emit events
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    // socket.leave('room name)
    // io.emit() -> to all //-> io.to(roomname).emit - to room
    // socket.braodcast.emit() - to everyone except sender // socket.braodcast.to(roomname).emit
    // socket.emit() - to specific

    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat App")
    );
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined`)
      );

    callback();
  });

  socket.on("createMessage", (newMessage, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(newMessage.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, newMessage.text)
      );
    }

    callback();
  });

  socket.on("createLocationMessage", coords => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left the room`)
      );
    }
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
