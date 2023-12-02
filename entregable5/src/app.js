import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import dotenv from "dotenv";
import __dirname from "./utils.js";
import sessionRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";

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

app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

app.listen(8080, () => console.log("Server running"));
