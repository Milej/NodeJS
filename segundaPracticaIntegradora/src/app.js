import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import productsRouter from "./routes/api/products.router.js";
import messagesRouter from "./routes/api/messages.router.js";
import cartsRouter from "./routes/api/carts.router.js";
import usersRouter from "./routes/api/users.router.js";
import sessionsRouter from "./routes/api/sessions.router.js";
import viewsRouter from "./routes/web/views.router.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";

// Esto que implemento del manager en el app no se si estara bien
import Messages from "./dao/dbManagers/messages.manager.js";

const messagesManager = new Messages();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

initializePassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

try {
  await mongoose.connect(
    "mongodb+srv://maxemestudioadmin:41089042Max@cursonodejs.mchxnmr.mongodb.net/ecommerce?retryWrites=true&w=majority"
  );

  console.log("Database connected");
} catch (error) {
  console.log(error);
}

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

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
