import express from "express";
import productsRouter from "./routes/api/products.router.js";
import cartsRouter from "./routes/api/carts.router.js";
import messagesRouter from "./routes/api/messages.router.js";
import { __dirname } from "./utils.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/web/views.router.js";
import { Server } from "socket.io";

dotenv.config();

const handleDatabaseError = (err, req, res, next) => {
  console.error("Error de conexión a la base de datos:", err);

  res
    .status(500)
    .send(
      "Error interno del servidor. Por favor, inténtalo de nuevo más tarde."
    );
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Database connected");
} catch (error) {
  console.error("Eror internto", error);
  handleDatabaseError(error, req, res, next);
}

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messagesRouter);

// app.use("/", handleDatabaseError(error, req, res, next));

const server = app.listen(8080, console.log("Server running on port 8080"));

const socketServer = new Server(server);

socketServer.on("connection", async (socket) => {
  const messages = await messagesManager.getAll();
  console.log(`Nuevo cliente conectado`);

  socket.on("userLogged", (data) => {
    socket.emit("userConnected", messages);
  });

  socket.on("message", async (newMessage) => {
    try {
      await messagesManager.add(newMessage);
      messages.push(newMessage);
      socketServer.emit("messages", messages);
    } catch (error) {
      console.log(error);
    }
  });
});
