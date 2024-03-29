import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import dotenv from "dotenv";
import { __dirname } from "./utils.js";
import sessionRouter from "./routes/api/sessions.router.js";
import productsRouter from "./routes/api/products.router.js";
import messagesRouter from "./routes/api/messages.router.js";
import cartsRouter from "./routes/api/carts.router.js";
import viewsRouter from "./routes/web/views.router.js";
import { Server } from "socket.io";
import MessagesManager from "./dao/dbManagers/messages.manager.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

const messagesManager = new MessagesManager();

const app = express();
dotenv.config();

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Database connected");
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(
  session({
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 3600,
    }),
    secret: "Coder55575Secret",
    resave: true,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/sessions", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

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
