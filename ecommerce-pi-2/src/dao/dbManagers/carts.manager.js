import cartsModel from "./models/carts.model.js";

export default class Carts {
  constructor() {
    console.log("Working with carts");
  }

  add = async (products) => {
    const result = await cartsModel.create(products);
    return result;
  };

  getById = async (id) => {
    const cart = await cartsModel.findOne({ _id: id }).lean();
    return cart;
  };

  addProductToCart = async (cartId, cart) => {
    const result = await cartsModel.updateOne({ _id: cartId }, cart);
    return result;
  };

  deleteProductFromCart = async (cartId, cart) => {
    const result = await cartsModel.updateOne({ _id: cartId }, cart);
    return result;
  };

  update = async (cartId, products) => {
    const result = await cartsModel.updateOne({ _id: cartId, products });
    return result;
  };

  updateProductCartQuantity = async (cartId, cart) => {
    const result = await cartsModel.updateOne({ _id: cartId }, cart);
    return result;
  };

  deleteAllProducts = async (cartId) => {
    const result = await cartsModel.updateOne(
      { _id: cartId },
      { products: [] }
    );
    return result;
  };
}
