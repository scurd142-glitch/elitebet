import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function initializeSocket(server: any) {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(",") || "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected to Aviator game:", socket.id);

    socket.on("join-aviator", () => {
      socket.join("aviator");
    });

    socket.on("leave-aviator", () => {
      socket.leave("aviator");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Aviator game:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

export function broadcastMultiplier(multiplier: number, status: "flying" | "crashed") {
  const io = getIO();
  io.to("aviator").emit("multiplier-update", { multiplier, status });
}

export function broadcastRoundStart(crashPoint: number) {
  const io = getIO();
  io.to("aviator").emit("round-start", { crashPoint });
}

export function broadcastBetPlaced(userId: string, amount: number) {
  const io = getIO();
  io.to("aviator").emit("bet-placed", { userId, amount });
}

export function broadcastCashout(userId: string, multiplier: number, amount: number) {
  const io = getIO();
  io.to("aviator").emit("cashout", { userId, multiplier, amount });
}
