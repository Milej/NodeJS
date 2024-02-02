import {
  getCart as getCartService,
  addCart as addCartService,
  addProductToCart as addProductToCartService,
  deleteProductFromCart as deleteProductFromCartService,
  updateCart as updateCartService,
  updateProductQuantityInCart as updateProductQuantityInCartService,
  deleteCart as deleteCartService,
} from "../services/carts.service.js";

const getCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await getCartService(cartId);

    if (result.status === "error") return res.sendClientError(result.message);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const addCart = async (req, res) => {
  try {
    const products = req.body;
    const result = await addCartService(products);

    if (result.status === "error") return res.sendClientError(result.message);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const addProductToCart = async (req, res) => {
  try {
    const productId = req.params.pid;
    const cartId = req.params.cid;

    const result = await addProductToCartService(productId, cartId);

    if (result.status === "error") return res.sendClientError(result.message);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const productId = req.params.pid;
    const cartId = req.params.cid;

    const result = await deleteProductFromCartService(productId, cartId);

    if (result.status === "error") return res.sendClientError(result.message);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body;

    const result = await updateCartService(products, cartId);

    if (result.status === "error") return res.sendClientError(result.message);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const updateProductQuantityInCart = async (req, res) => {
  try {
    const productId = req.params.pid;
    const cartId = req.params.cid;
    const { quantity } = req.body;

    const result = await updateProductQuantityInCartService(productId, quantity, cartId);

    if (result.status === "error") return res.sendClientError(result.message);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await deleteCartService(cartId);

    if (result.status === "error") return res.sendClientError(result.message);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export {
  getCart,
  addCart,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantityInCart,
  deleteCart,
};
