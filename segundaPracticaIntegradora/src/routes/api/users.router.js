import Users from "../../dao/dbManagers/users.manager.js";
import { Router } from "express";
import { createHash, isValidPassword, generateToken } from "../../utils.js";

const router = Router();
const manager = new Users();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res
        .status(400)
        .send({ status: "error", message: "Valores incompletos" });
    }

    const existsUser = await manager.getByEmail(email);

    if (existsUser) {
      return res
        .status(400)
        .send({ status: "error", message: "Usuario ya existe" });
    }

    const hashPassword = createHash(password);

    const newUser = { ...req.body };
    newUser.password = hashPassword;

    const result = await manager.save(newUser);

    const { password: _, ...savedUser } = result;
    const accessToken = generateToken(savedUser);

    res
      .cookie("token", accessToken, { maxAge: 60 * 60 * 1000 })
      .send({ status: "success", message: "Login success" });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ status: "error", message: "Valores incompletos" });
    }

    const user = await manager.getByEmail(email);

    if (!user) {
      return res
        .status(400)
        .send({ status: "error", message: "El usuario no existe" });
    }

    const validatePassword = isValidPassword(password, user.password);

    if (!validatePassword) {
      return res
        .status(400)
        .send({ status: "error", message: "La contraseña es incorrecta" });
    }

    const { password: _, ...publicUser } = user;
    const accessToken = generateToken(publicUser);

    res
      .cookie("token", accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true })
      .send({ status: "success", message: "Login success" });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;
