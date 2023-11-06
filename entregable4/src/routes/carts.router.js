import { Router } from "express";
import CartManager from "../managers/CartManager.js"

const router = Router()
const manager = new CartManager("./files/Carts.json")

router.post("/", async (req, res) => {
  // { id -> autogenerada, products -> array de productos solo el id}
  const products = req.body
  const response = await manager.addCart(products)

  if (response.error === "400") {
    return res.status(400).send("Valores incompletos")
  }

  res.send(201).status({ status: "success", payload: response })

})

router.get("/:cid", async (req, res) => {
  // Listar productos que pertenezcan al carrito con el id
  const cartId = Number(req.params.cid)
  const response = await manager.getCartById(cartId)

  if (response.error === "404") {
    return res.status(404).send("Carrito no encontrado")
  }

  res.send({ products: response.products })
})

router.post("/:cid/product/:pid", async (req, res) => {
  // { agregar id de producto y quantity, si ya existe, agregamos la cantidad }
  const productId = Number(req.params.pid)
  const cartId = Number(req.params.cid)
  const response = await manager.addProductToCart(cartId, productId)

  if (response.error === "404")
    return res.status(404).send("Carrito no encontrado")
  
  res.send(response)
})

export default router