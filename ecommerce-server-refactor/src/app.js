import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import { __dirname } from "./utils.js";
import { initializePassport } from "./config/passport.config.js";
import AuthRouter from "./routes/api/auth.router.js";
import ProductsRouter from "./routes/api/products.router.js";
import MessagesRouter from "./routes/api/messages.router.js";
// import CartsRouter from "./routes/api/carts.router.js";
import MessagesManager from "./dao/dbManagers/messages.manager.js";

const messagesManager = new MessagesManager();

const app = express();
dotenv.config();

const authRouter = new AuthRouter();
const productsRouter = new ProductsRouter();
const messagesRouter = new MessagesRouter();
// const cartsRouter = new CartsRouter();

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DB connected");
} catch (error) {
  console.log(error);
}
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

initializePassport();
app.use(passport.initialize());

app.use("/api/auth", authRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/messages", messagesRouter.getRouter());
// app.use("/api/carts", cartsRouter.getRouter());

const server = app.listen(8080, () => console.log("Server running on port 8080"));

const socketServer = new Server(server);

socketServer.on("connection", async socket => {
  const messages = await messagesManager.getAll();
  console.log(`Nuevo cliente conectado`);

  socket.on("userLogged", data => {
    socket.emit("userConnected", messages);
  });

  socket.on("message", async newMessage => {
    try {
      await messagesManager.add(newMessage);
      messages.push(newMessage);
      socketServer.emit("messages", messages);
    } catch (error) {
      console.log(error);
    }
  });
});

app.set("socketio", socketServer);
