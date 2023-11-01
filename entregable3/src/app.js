import express from "express"
import ProductManager from "../managers/ProductManager.js"

const app = express()
const manager = new ProductManager("./files/Productos.json")

app.use(express.urlencoded({ extended: true }))

app.get("/products", async (req, res) => {
  // obtengo el parametro por su nombre
  let { limit } = req.query

  // llamo a la funcion del product manager
  const productos = await manager.getProducts()

  if (limit) {

    // si el limit es mayor que la cantidad de productos, el limit se asigna al tamaño del array de productos
    if (productos.length < limit) limit = productos.length

    const productosLimits = []

    for (let i = 0; i < limit; i++) {
      productosLimits.push(productos[i])
    }

    res.send({ productos: productosLimits })

  } else {
    res.send({ productos: productos })
  }
})

app.get("/products/:pid", async (req, res) => {

  const productoId = Number(req.params.pid)

  const productos = await manager.getProducts()

  const productoEncontrado = productos.find(p => p.id === productoId)

  if (!productoEncontrado) return res.send({ error: "Producto no encontrado" })

  res.send({ producto: productoEncontrado })

})

app.listen(8080, () => console.log("Servior montando en el puerto 8080"))