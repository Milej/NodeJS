import { Router } from "express";
import Carts from "../../dao/dbManagers/carts.manager.js";

const router = Router();
const cartsManager = new Carts();

router.post("/", async (req, res) => {
  try {
    // { id -> autogenerada, products -> array de productos solo el id}
    const products = req.body;
    console.log(products);
    if (!products) {
      return res
        .status(400)
        .send({ status: "error", message: "Valores incompletos" });
    }

    const result = await cartsManager.add(products);

    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    // Listar productos que pertenezcan al carrito con el id
    const cartId = req.params.cid;
    const cart = await cartsManager.getById(cartId);

    res.send({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    // { agregar id de producto y quantity, si ya existe, agregamos la cantidad }
    const productId = req.params.pid;
    const cartId = req.params.cid;

    if (!productId || !cartId)
      return res
        .status(400)
        .send({ status: "error", message: "Valores incompletos" });

    const cart = await cartsManager.getById(cartId);

    if (!cart)
      return res
        .status(400)
        .send({ status: "error", message: "Carrito no existe" });

    const productFound = cart.products.find(
      (product) => product.product._id == productId
    );

    if (productFound) {
      productFound.quantity++;
    } else {
      const product = { product: productId };
      cart.products.push(product);
    }

    const result = await cartsManager.addProductToCart(cartId, cart);

    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const cartId = req.params.cid;

    if (!productId || !cartId)
      return res
        .status(400)
        .send({ status: "error", message: "Valores incompletos" });

    const cart = await cartsManager.getById(cartId);

    if (!cart)
      return res
        .status(400)
        .send({ status: "error", message: "Carrito no existe" });

    const productIndex = cart.products.findIndex(
      (product) => product.product._id == productId
    );

    if (productIndex) {
      cart.products.splice(productIndex, 1);
    }

    const result = await cartsManager.deleteProductFromCart(cartId, cart);

    res.send({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body;

    if (!products || !cartId) {
      return res
        .status(400)
        .send({ status: "error", message: "Valores incompletos" });
    }

    const result = await cartsManager.update(cartId, products);

    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (!cartId || !productId)
      return res
        .status(400)
        .send({ status: "error", message: "Valores incompletos" });

    const cart = await cartsManager.getById(cartId);

    if (!cart)
      return res
        .status(400)
        .send({ status: "error", message: "Carrito no existe" });

    const productFound = cart.products.find(
      (product) => product.product._id == productId
    );

    if (productFound) {
      productFound.quantity = quantity;
    }

    const result = await cartsManager.updateProductCartQuantity(cartId, cart);

    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    if (!cartId)
      return res.status(400).send({
        status: "error",
        message: "Se requiere el ID del carrito a eliminar",
      });

    const result = await cartsManager.deleteAllProducts(cartId);

    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

export default router;
