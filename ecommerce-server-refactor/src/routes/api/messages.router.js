import Router from "../router.js";
import { accessRoles, passportStrategies } from "../../config/enums.js";
import { getMessages, addMessage } from "../../controllers/messages.controller.js";

export default class MessagesRouter extends Router {
  init() {
    this.get("/", [accessRoles.USER, accessRoles.ADMIN], passportStrategies.JWT, getMessages);

    this.post("/", [accessRoles.USER, accessRoles.ADMIN], passportStrategies.JWT, addMessage);
  }
}
