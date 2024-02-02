import Carts from "../dao/dbManagers/carts.manager.js";

const cartsManager = new Carts();

const getCart = async cartId => {
  if (!cartId) return { status: "error", message: "Debes enviar un id válido" };

  const cart = await cartsManager.getCart(cartId);
  return cart;
};

const addCart = async products => {
  if (!products) return { status: "error", message: "Debes completar con articulo por lo menos" };

  const result = await cartsManager.addCart(products);
  return result;
};

const addProductToCart = async (productId, cartId) => {
  if (!productId || !cartId) return { status: "error", message: "Falta algún valor" };

  const cart = await getCart(cartId);

  if (!cart) return { status: "error", message: "El carrito no existe" };

  const productFound = cart.products.find(product => product.product._id == productId);

  if (productFound) {
    productFound.quantity++;
  } else {
    const product = { product: productId };
    cart.products.push(product);
  }

  const result = await addProductToCart(cart, cartId);
  return result;
};

const deleteProductFromCart = async (productId, cartId) => {
  if (!productId || !cartId) return { status: "error", message: "Falta algún valor" };

  const cart = await getCart(cartId);

  if (!cart) return { status: "error", message: "El carrito no existe" };

  const productIndex = cart.products.findIndex(product => product.product._id == productId);

  if (productIndex) {
    cart.products.splice(productIndex, 1);
  }

  const result = await deleteProductFromCart(cart, cartId);
  return result;
};

const updateCart = async (products, cartId) => {
  if (!products || !cartId) return { status: "error", message: "Falta algún valor" };

  const cart = await getCart(cartId);

  if (!cart) return { status: "error", message: "El carrito no existe" };

  const result = await updateCart(products, cartId);
  return result;
};

const updateProductQuantityInCart = async (productId, quantity, cartId) => {
  if (!cartId || !productId || !quantity) return { status: "error", message: "Falta algún valor" };

  const cart = await getCart(cartId);

  if (!cart) return { status: "error", message: "El carrito no existe" };

  const productFound = cart.products.find(product => product.product._id == productId);

  if (productFound) {
    productFound.quantity = quantity;
  }

  const result = await cartsManager.updateProductQuantityInCart(cartId, cart);
  return result;
};

const deleteCart = async cartId => {
  if (!cartId) return { status: "error", message: "Falta algún valor" };

  const cart = await getCart(cartId);

  if (!cart) return { status: "error", message: "El carrito no existe" };

  const result = await cartsManager.deleteCart(cartId, []);
  return result;
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
