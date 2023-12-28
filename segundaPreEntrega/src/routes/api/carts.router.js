import { Router } from "express";
import CartManager from "../../dao/dbManagers/CartManager.js";

const router = Router();
const manager = new CartManager();

router.post("/", async (req, res) => {
  // { id -> autogenerada, products -> array de productos solo el id}
  const products = req.body;
  const response = await manager.addCart(products);

  if (response.statusCode === 201) {
    res
      .status(response.statusCode)
      .send({ status: "success", payload: response.payload });
  } else {
    res
      .status(response.statusCode)
      .send({ status: "error", message: response.message });
  }
});

router.get("/:cid", async (req, res) => {
  // Listar productos que pertenezcan al carrito con el id
  const cartId = req.params.cid;
  const response = await manager.getCartById(cartId);
  res.send(response);
});

router.post("/:cid/product/:pid", async (req, res) => {
  // { agregar id de producto y quantity, si ya existe, agregamos la cantidad }
  const productId = Number(req.params.pid);
  const cartId = Number(req.params.cid);
  const response = await manager.addProductToCart(cartId, productId);

  if (response.error === "404")
    return res.status(404).send("Carrito no encontrado");

  res.send(response);
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const result = await manager.deleteProductFromCart(cid, pid);

  res.status(result.code).send(result);
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const products = req.body;

  const result = await manager.updateCartProducts(cid, products);

  res.status(result.code).send(result);
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const result = await manager.updateProductQuantity(cid, pid, quantity);

  res.status(result.code).send(result);
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  const result = await manager.deleteAllProducts(cid);
  res.status(result.code).send(result);
});

export default router;
