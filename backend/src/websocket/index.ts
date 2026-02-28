import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { config } from "../config";

interface SocketUser {
  id: string;
  email: string;
  role: string;
  socketId: string;
}

class WebSocketServer {
  private io: Server;
  private users: Map<string, SocketUser> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.wsCorOrigin,
        methods: ["GET", "POST"],
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use((socket, next) => {
      // Validate connection if needed
      next();
    });
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log("New WebSocket connection:", socket.id);

      // User authentication
      socket.on("authenticate", (userData: SocketUser) => {
        userData.socketId = socket.id;
        this.users.set(socket.id, userData);
        console.log("User authenticated:", userData.email);

        // Notify all clients that a user connected
        this.io.emit("user:connected", {
          userId: userData.id,
          email: userData.email,
        });
      });

      // Join room (e.g., "kitchen", "waiter:123")
      socket.on("join:room", (room: string) => {
        socket.join(room);
        console.log("User joined room:", room);
      });

      // Order creation
      socket.on("order:created", (orderData) => {
        console.log("Order created event:", orderData);

        // Broadcast to kitchen staff
        this.io.to("kitchen").emit("order:new", orderData);

        // Broadcast to waiter dashboard
        this.io.to("waiters").emit("order:created", orderData);
      });

      // Order status update
      socket.on("order:status-update", (data) => {
        console.log("Order status updated:", data);

        const { orderId, status } = data;

        // Notify all connected clients
        this.io.emit("order:updated", {
          orderId,
          status,
          timestamp: new Date(),
        });

        // Send notification to waiter who created the order
        this.io.to("waiters").emit("kitchen:order-ready", {
          orderId,
          status,
        });
      });

      // Table update
      socket.on("table:updated", (tableData) => {
        console.log("Table updated:", tableData);
        this.io.emit("table:changed", tableData);
      });

      // Payment completed
      socket.on("payment:completed", (paymentData) => {
        console.log("Payment completed:", paymentData);
        this.io.emit("payment:success", paymentData);
      });

      // Disconnect
      socket.on("disconnect", () => {
        const user = this.users.get(socket.id);
        if (user) {
          this.users.delete(socket.id);
          console.log("User disconnected:", user.email);

          this.io.emit("user:disconnected", {
            userId: user.id,
            email: user.email,
          });
        }
      });

      // Error handler
      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    });
  }

  // Public methods for emitting events from server
  public broadcastOrderCreated(orderData: any) {
    this.io.to("kitchen").emit("order:new", orderData);
    this.io.to("waiters").emit("order:created", orderData);
  }

  public broadcastOrderStatusUpdate(orderId: string, status: string) {
    this.io.emit("order:updated", {
      orderId,
      status,
      timestamp: new Date(),
    });
  }

  public broadcastTableUpdate(tableData: any) {
    this.io.emit("table:changed", tableData);
  }

  public broadcastPaymentCompleted(paymentData: any) {
    this.io.emit("payment:success", paymentData);
  }

  public getConnectedUsers(): SocketUser[] {
    return Array.from(this.users.values());
  }

  public getKitchenStaff(): SocketUser[] {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "KITCHEN"
    );
  }

  public getWaiters(): SocketUser[] {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "WAITER"
    );
  }
}

export default WebSocketServer;
