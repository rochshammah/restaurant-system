import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io(WS_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      });

      socket.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, []);

  const emit = (event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    socket?.on(event, callback);
  };

  const off = (event: string, callback?: (data: any) => void) => {
    socket?.off(event, callback);
  };

  return {
    socket,
    isConnected,
    emit,
    on,
    off,
  };
};

export const getSocket = () => socket;
