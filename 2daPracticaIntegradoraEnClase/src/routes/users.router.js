import Users from "../dao/dbManagers/users.manager.js";
import Router from "./router.js";
import { accessRoles, passportStrategies } from "../config/enums.js";
import { createHash, isValidPassword, generateToken } from "../utils.js";

export default class UsersRouter extends Router {
  constructor() {
    super();
    this.usersManager = new Users();
  }

  init() {
    this.post(
      "/login",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.login
    );

    this.post(
      "/register",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.register
    );
  }

  async register(req, res) {
    try {
      const { first_name, last_name, rol, email, password } = req.body;
      if (!first_name || !last_name || !rol || !email || !password) {
        return res.sendClientError("Valores incompletos");
      }

      const existsUser = await this.usersManager.getByEmail(email);

      if (existsUser) {
        return res.sendClientError("El usuario ya existe");
      }

      const hashedPassword = createHash(password);

      const newUser = {
        ...req.body,
      };

      newUser.password = hashedPassword;

      const result = await this.usersManager.save(newUser);

      res.sendSuccessNewResource(result);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.sendClientError("Valores incompletos");
      }

      const user = await this.usersManager.getByEmail(email);

      if (!user) {
        return res.sendClientError("No coincide el correo");
      }

      const comparePassword = isValidPassword(password, user.password);

      if (!comparePassword) {
        return res.sendClientError("Contraseña erronea");
      }

      const accessToken = generateToken(user);

      res.sendSuccess(accessToken);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }
}
