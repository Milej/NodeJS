import express from "express";
import productsRouter from "./routes/api/products.router.js";
import cartsRouter from "./routes/api/carts.router.js";
import { __dirname } from "./utils.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/web/views.router.js";

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
  // handleDatabaseError(error, req, res, next);
}

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.use("/", handleDatabaseError(error, req, res, next));

app.listen(8080, console.log("Servidor corriendo en el puerto 8080"));
