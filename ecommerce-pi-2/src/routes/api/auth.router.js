import Router from "../router.js";
import passport from "passport";
import Users from "../../dao/dbManagers/users.manager.js";
import { hashPassword, generateToken, validatePassword } from "../../utils.js";
import { accessRoles, passportStrategies } from "../../config/enums.js";

export default class AuthRouter extends Router {
  constructor() {
    super(); // Llama al constructor padre
    this.userManager = new Users();
  }

  init() {
    this.get(
      "/github",
      [accessRoles.PUBLIC],
      passportStrategies.GITHUB,
      passport.authenticate("github", { scope: "[user:email]" }),
      async (req, res) => {
        res.status(200).send({
          status: "success",
          message: "Sesión iniciada con GitHub",
        });
      }
    );

    this.get(
      "/github-callback",
      [accessRoles.PUBLIC],
      passportStrategies.GITHUB,
      passport.authenticate("github", { failureRedirect: "/login" }),
      async (req, res) => {
        req.session.user = req.user;
        res.redirect("/products");
      }
    );

    this.get(
      "/logout",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.userLogout
    );

    this.post(
      "/register",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.userRegister,
      async (req, res) => {
        res.redirect("/products");
      }
    );

    this.post(
      "/login",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.userLogin
    );

    this.get(
      "/current",
      [accessRoles.USER, accessRoles.ADMIN],
      passportStrategies.JWT,
      (req, res) => {
        res.send({ status: "success", payload: req.user });
      }
    );
  }

  async userLogout(req, res) {
    res.clearCookie("token");
    res.redirect("/login");
  }

  async userRegister(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      if (!first_name || !last_name || !email || !age || !password) {
        return res
          .status(400)
          .send({ status: "error", message: "Valores incompletos" });
      }

      const existsUser = await this.userManager.getByEmail(email);

      if (existsUser) {
        return res
          .status(400)
          .send({ status: "error", message: "Usuario ya existe" });
      }

      const hashedPassword = hashPassword(password);

      const newUser = { ...req.body };
      newUser.password = hashedPassword;

      const user = await this.userManager.save(newUser);

      const accessToken = generateToken(user);

      res
        .cookie("token", accessToken, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .send({ status: "success", message: "Login success" });
    } catch (error) {
      return res.status(500).send({ status: "error", message: error.message });
    }
  }

  async userLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .send({ status: "error", message: "Valores incompletos" });
      }

      const user = await this.userManager.getByEmail(email);

      if (!user) {
        return res
          .status(400)
          .send({ status: "error", message: "El usuario no existe" });
      }

      const isValidPassword = validatePassword(password, user.password);

      if (!isValidPassword) {
        return res
          .status(400)
          .send({ status: "error", message: "La contraseña es incorrecta" });
      }

      const { password: _, ...publicUser } = user;

      const accessToken = generateToken(publicUser);
      // Cookies
      res
        .cookie("token", accessToken, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .send({ status: "success", message: "Login success" });
    } catch (error) {
      return res.status(500).send({ status: "error", message: error.message });
    }
  }
}
