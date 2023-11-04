import express, { urlencoded } from "express"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import { __dirname } from "./utils.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.listen(8080, console.log("Servidor corriendo en el puerto 8080"))