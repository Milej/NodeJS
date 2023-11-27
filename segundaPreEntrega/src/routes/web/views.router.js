import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";
import CartManager from "../../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
  const result = await productManager.getProducts(req.query);
  res.render("products", result);
});

router.get("/product-detail", async (req, res) => {
  const { id } = req.query;
  const result = await productManager.getProductById(id);

  res.render("product-detail", result.payload);
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const result = await cartManager.getCartById(cid);
  console.log(JSON.stringify(result.payload, null, "\t"));
  res.render("carts", result.payload);
});

export default router;
