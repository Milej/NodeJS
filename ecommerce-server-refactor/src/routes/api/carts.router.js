import Router from "../router.js";
import { accessRoles, passportStrategies } from "../../config/enums.js";
import {
  getCart,
  addCart,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantityInCart,
  deleteCart,
} from "../../controllers/carts.controller.js";

export default class CartsRouter extends Router {
  init() {
    // getCart
    this.get("/:cid", [accessRoles.USER], passportStrategies.JWT, getCart);

    // addCart
    this.post("/", [accessRoles.USER], passportStrategies.JWT, addCart);

    // addProductToCart
    this.post("/:cid/products/:pid", [accessRoles.USER], passportStrategies.JWT, addProductToCart);

    // deleteProductFromCart
    this.delete("/:cid/products/:pid", [accessRoles.USER], passportStrategies.JWT, deleteProductFromCart);

    // updateCart
    this.put("/:cid", [accessRoles.USER], passportStrategies.JWT, updateCart);

    // updateProductQuantityInCart
    this.put("/:cid/products/:pid", [accessRoles.USER], passportStrategies.JWT, updateProductQuantityInCart);

    // deleteCart
    this.delete("/:cid", [accessRoles.USER], passportStrategies.JWT, deleteCart);
  }
}
