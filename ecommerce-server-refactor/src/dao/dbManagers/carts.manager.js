import cartsModel from "./models/carts.model.js";

export default class Carts {
  constructor() {
    console.log("Working carts with db");
  }

  async getCart(id) {
    const cart = await cartsModel.findOne({ _id: id }).lean();
    return cart;
  }

  async addCart(products) {
    const result = await cartsModel.create(products);
    return result;
  }

  async addProductToCart(cart, cartId) {
    const result = await cartsModel.updateOne({ _id: cartId }, cart);
    return result;
  }

  async deleteProductFromCart(cart, cartId) {
    const result = await cartsModel.updateOne({ _id: cartId }, cart);
    return result;
  }

  async updateCart(products, cartId) {
    const result = await cartsModel.updateOne({ _id: cartId, products });
    return result;
  }

  async updateProductQuantityInCart(cartId, cart) {
    const result = await cartsModel.updateOne({ _id: cartId }, cart);
    return result;
  }

  async deleteCart(cartId, products) {
    const result = await cartsModel.updateOne({ _id: cartId, products });
    return result;
  }
}
