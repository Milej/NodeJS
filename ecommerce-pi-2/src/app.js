import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { initializePassport } from "./config/passport.config.js";
import ViewsRouter from "./routes/web/views.router.js";
import SessionsRouter from "./routes/api/sessions.router.js";
import ProductsRouter from "./routes/api/products.router.js";
import messagesRouter from "./routes/api/messages.router.js";
import cartsRouter from "./routes/api/carts.router.js";
import MessagesManager from "./dao/dbManagers/messages.manager.js";

const messagesManager = new MessagesManager();

const app = express();
dotenv.config();

const viewsRouter = new ViewsRouter();
const sessionRouter = new SessionsRouter();
const productsRouter = new ProductsRouter()

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Database connected");
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser())

initializePassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/api/sessions", sessionRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
// app.use("/api/messages", messagesRouter);
// app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter.getRouter());

const server = app.listen(8080, () =>
  console.log("Server running on port 8080")
);

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

app.set("socketio", socketServer);
