import { WebSocket, WebSocketServer } from "ws";

const port = 8080;
const server = new WebSocketServer({ port: port });
const clients = new Set<WebSocket>();
const clients_name = new Map<WebSocket, string>();

console.log(`WebSocket Server is running on port ${port}`);

server.on("connection", (ws) => {
  console.log("Client has connected");
  clients.add(ws);
  clients_name.set(ws, `${clients.size}`);

  ws.send(`You are name is ${clients_name.get(ws)}`);

  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`${clients_name.get(ws)}: ${message}`);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client has disconnected");
    clients.delete(ws);
  });
});
