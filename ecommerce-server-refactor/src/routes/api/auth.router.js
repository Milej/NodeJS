import Router from "../router.js";
import passport from "passport";
import { accessRoles, passportStrategies } from "../../config/enums.js";
import {
  githubLogin,
  githubRedirect,
  userRegister,
  userLogin,
  userLogout,
  currentUser,
} from "../../controllers/auth.controller.js";

export default class AuthRouter extends Router {
  init() {
    this.get("/github", [accessRoles.PUBLIC], passportStrategies.GITHUB, githubLogin);

    this.get(
      "/github-callback",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      passport.authenticate("github", { failureRedirect: "login.html" }),
      githubRedirect
    );

    this.post("/register", [accessRoles.PUBLIC], passportStrategies.NOTHING, userRegister);

    this.post("/login", [accessRoles.PUBLIC], passportStrategies.NOTHING, userLogin);

    this.get("/logout", [accessRoles.PUBLIC], passportStrategies.NOTHING, userLogout);

    this.get("/current", [accessRoles.USER, accessRoles.ADMIN], passportStrategies.JWT, currentUser);
  }
}
