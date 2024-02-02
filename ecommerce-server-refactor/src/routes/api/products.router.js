import Router from "../router.js";
import { accessRoles, passportStrategies } from "../../config/enums.js";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/products.controller.js";

export default class ProductsRouter extends Router {
  init() {
    this.get("/", [accessRoles.PUBLIC], passportStrategies.JWT, getProducts);

    this.get("/:pid", [accessRoles.PUBLIC], passportStrategies.JWT, getProduct);

    this.post("/", [accessRoles.ADMIN], passportStrategies.JWT, addProduct);

    this.put("/:pid", [accessRoles.ADMIN], passportStrategies.JWT, updateProduct);

    this.delete("/:pid", [accessRoles.ADMIN], passportStrategies.JWT, deleteProduct);
  }
}
