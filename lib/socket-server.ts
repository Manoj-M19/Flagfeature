import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { verifyToken } from "./auth";

let io: SocketIOServer | null = null;

export function initSocketServer(server: HTTPServer) {
  if (io) return io;

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SOCKET_URL || "<http://localhost:3000>",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error("Invalide token"));
    }

    socket.data.userId = decoded.userId;
    next();
  });

  io.on("Connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-project", (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`User joined project room: ${projectId}`);
    });

    socket.on("leave-project", (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnect:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

export function emitFLagToggle(projectId: string, flag: any) {
  if (io) {
    io.to(`project:${projectId}`).emit("flag-toggled", flag);
  }
}
