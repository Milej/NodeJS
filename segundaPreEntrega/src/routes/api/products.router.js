import { Router } from "express";
import ProductManager from "../../dao/dbManagers/ProductManager.js";

const router = Router();
const manager = new ProductManager("./files/Products.json");

router.get("/", async (req, res) => {
  // Listar todos los productos con limit
  // Sino recibe sort, no realizar ordenamiento
  // Sino recibe query, realizar una busqueda general
  const result = await manager.getProducts(req.query);
  res.status(result.code).send(result);
});

router.get("/:pid", async (req, res) => {
  // Traer solo el producto con el id proporcionado
  const productId = Number(req.params.pid);
  const response = await manager.getProductById(productId);

  if (response === "404")
    return res
      .status(404)
      .send({ status: "error", message: "Producto no encontrado" });

  res.send(response);
});

router.post("/", async (req, res) => {
  const product = req.body;
  const response = await manager.addProduct(product);

  if (response === "400")
    return res
      .status(400)
      .send({ status: "error", message: "Valores incompletos" });

  res.status(201).send({ status: "success", payload: response });
  // {
  //   id -> autogenerado, title, description, code, price -> Number, status -> Boolean, stock -> Number, category, thumbnail -> Array
  // }
});

router.put("/:pid", async (req, res) => {
  // Actualizar el producto sin eliminiar o modificar el id
  const productId = Number(req.params.pid);
  const product = req.body;

  const response = await manager.updateProduct(productId, product);

  if (response === "400") {
    return res
      .status(400)
      .send({ status: "error", message: "Valores incompletos" });
  } else if (response === "404") {
    return res
      .status(404)
      .send({ status: "error", message: "Producto no encontrado" });
  }

  res.send({ status: "success", payload: response });
});

router.delete("/:pid", async (req, res) => {
  const productId = Number(req.params.pid);

  const response = await manager.deleteProduct(productId);

  if (response === "404") {
    return res
      .status(404)
      .send({ status: "error", message: "Producto no encontrado" });
  }

  res.send({ status: "success", payload: response });
});

export default router;
