import passport from "passport";
import { userModel } from "../../dao/dbManagers/models/users.model.js";
import Users from "../../dao/dbManagers/users.manager.js";
import {
  hashPassword,
  generateToken,
  validatePassword,
  authToken,
} from "../../utils.js";
import Router from "../router.js";
import { accessRoles, passportStrategies } from "../../config/enums.js";

export default class SessionsRouter extends Router {
  constructor() {
    super();
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

    this.post(
      "/register",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.userRegister
    );

    this.post(
      "/login",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.userLogin
    );

    this.get(
      "/logout",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.userLogout
    );

    this.post(
      "/passport-register",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.passportRegister,
      async (req, res) => {
        res.redirect("/products");
      }
    );

    this.post(
      "/passport-login",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.passportLogin
    );

    this.get(
      "/current",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      authToken,
      async (req, res) => {
        res.send({ status: "success", payload: req.user });
      }
    );
  }

  async userLogout(req, res) {
    req.session.destroy((error) => {
      if (error)
        return res
          .status(500)
          .send({ status: "error", message: error.message });
      res.redirect("/login");
    });
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

      req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role,
      };

      res.status(201).send({ status: "success", message: "Login success" });
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

      req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role,
      };

      res.status(200).send({ status: "success", message: "Login success" });
    } catch (error) {
      return res.status(500).send({ status: "error", message: error.message });
    }
  }

  async passportRegister(req, res) {
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

      res.status(201).send({ status: "success", acces_token: accessToken });
    } catch (error) {
      return res.status(500).send({ status: "error", message: error.message });
    }
  }

  async passportLogin(req, res) {
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

      res.status(200).send({ status: "success", access_token: accessToken });
    } catch (error) {
      return res.status(500).send({ status: "error", message: error.message });
    }
  }

  // router.post(
  //   "/passport-register",
  //   passport.authenticate("register", { failureRedirect: "fail-register" }),
  //   async (req, res) => {
  //     res.status(201).send({ status: "success", message: "Usuario registrado" });
  //   }
  // );

  // router.get("/fail-register", (req, res) => {
  //   res.status(500).send({ status: "error", message: "Registro fallido" });
  // });

  // router.post("/passport-login", async (req, res) => {
  //   try {
  //     const { email, password } = req.body;

  //     if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
  //       req.session.user = {
  //         name: `Coder House`,
  //         email: "adminCoder@coder.com",
  //         age: 1,
  //         rol: "admin",
  //       };
  //     } else {
  //       const user = await userModel.findOne({ email, password }).lean();

  //       if (!user)
  //         return res
  //           .status(400)
  //           .send({ status: "error", message: "Credenciales invalidas" });

  //       req.session.user = {
  //         name: `${user.first_name} ${user.last_name}`,
  //         email: user.email,
  //         age: user.age,
  //         rol: user.rol,
  //       };
  //     }

  //     res.redirect("/products");
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({ status: "error", message: error.message });
  //   }
  // });

  // router.get("/current", passportCall("jwt"), async (req, res) => {
  //   res.send({ status: "success", payload: req.user });
  // });
}
