import cartsModel from "./models/carts.model.js";

export default class CartManager {
  addCart = async (products) => {
    try {
      await cartsModel.create({ products });
      return { statusCode: 201, payload: "Carrito creado correctamente" };
    } catch (error) {
      console.log(error);
      return { statusCode: 500, message: error.message };
    }
  };

  getCarts = async () => {
    try {
      const result = await cartsModel.find();
      return { status: "success", payload: result };
    } catch (error) {
      console.log(error);
      return { status: "error", message: error.message };
    }
  };

  getCartById = async (id) => {
    try {
      const result = await cartsModel.findOne({ _id: id }).lean();
      return { status: "success", payload: result };
    } catch (error) {
      console.log(error);
      return { status: "error", message: error.message };
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);
      const cart = carts.find((cart) => cart.id === cartId);

      if (cartIndex === -1) throw new Error(404);

      cart.products.forEach((product) => {
        if (product.product === productId) {
          product.quantity++;
        } else {
          const product = {
            product: productId,
            quantity: 1,
          };
          cart.products.push(product);
        }
      });

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));

      return "Se agrego el producto al carrito";
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  deleteProductFromCart = async (cartId, productId) => {
    try {
      const cart = await cartsModel.findOne({ _id: cartId });

      if (!cart)
        return { code: 404, status: "error", message: "Carrito no encontrado" };

      const productToDelete = cart.products.findIndex(
        (p) => p.product == productId
      );

      cart.products.splice(productToDelete, 1);

      const result = await cartsModel.updateOne({ _id: cartId }, cart);

      return { code: 200, status: "success", payload: result };
    } catch (error) {
      console.log(error);
      return { status: "error", message: error.message };
    }
  };

  updateCartProducts = async (cartId, products) => {
    try {
      const result = await cartsModel.updateOne(
        { _id: cartId },
        { products: products }
      );

      return { code: 200, status: "success", payload: result };
    } catch (error) {
      console.log(error);
      return { code: 500, status: "error", message: error.message };
    }
  };

  updateProductQuantity = async (cartId, product, quantity) => {
    try {
      const cart = await cartsModel.findOne({ _id: cartId });

      if (!cart)
        return { code: 404, status: "error", message: "Carrito no encontrado" };

      const productToUpdate = cart.products.find((p) => p.product == product);
      productToUpdate.quantity = quantity;

      const result = await cartsModel.updateOne({ _id: cartId }, cart);

      return { code: 200, status: "success", payload: result };
    } catch (error) {
      console.log(error);
      return { code: 500, status: "error", message: error.message };
    }
  };

  deleteAllProducts = async (cartId) => {
    try {
      const result = await cartsModel.updateOne(
        { _id: cartId },
        { products: [] }
      );

      return { code: 200, status: "success", payload: result };
    } catch (error) {
      console.log(error);
      return { status: "error", message: error.message };
    }
  };
}
