import net from "node:net";

const server = net.createServer();

server.addListener("connection", (socket) => {
  console.log(socket);
  socket.write("hello");
  socket.on("data", (data) => {
    socket.write(data);
  });
});

server.listen(8080, "0.0.0.0", () => {
  console.log("server is listening at 0.0.0.0:8080");
});
