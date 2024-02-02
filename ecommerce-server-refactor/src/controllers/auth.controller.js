import { userRegister as userRegisterService, userLogin as userLoginService } from "../services/auth.service.js";

const githubLogin = async (req, res) => {
  try {
    res.sendSuccess({
      status: "success",
      message: "Sesión iniciada con GitHub",
    });
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const githubRedirect = async (req, res) => {
  try {
    req.session.user = req.user;
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const userRegister = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const user = { first_name, last_name, email, age, password };

    if (!first_name || !last_name || !email || !age || !password) {
      return res.sendClientError("Debes completar todos los campos");
    }

    const result = await userRegisterService(user);

    if (result.status === "error") {
      return res.sendClientError(result.message);
    }

    res
      .cookie("token", result, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({ status: "success", message: "Usuario registrado correctamente" });
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendClientError("Email o contraseña incompleto");
    }

    const result = await userLoginService(email, password);

    if (result.status === "error") {
      return res.sendClientError(result.message);
    }

    res
      .cookie("token", result.accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({ status: "success", message: "Login success" });
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const userLogout = async (req, res) => {
  res.clearCookie("token").send({ status: "success", message: "Logout success" });
};

const currentUser = async (req, res) => {
  if (!req.user) {
    return res.sendClientUnauthorized("Usuario no autorizado");
  }

  res.sendSuccess(req.user);
};

export { githubLogin, githubRedirect, userRegister, userLogin, userLogout, currentUser };
