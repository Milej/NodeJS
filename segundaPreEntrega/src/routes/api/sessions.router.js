import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res
        .status(400)
        .send({ status: "Error", message: "Falta algun valor" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res
        .status(400)
        .send({ status: "error", message: "Ya existe este usuario" });
    }

    await User.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    res
      .status(201)
      .send({ status: "success", message: "Usuario creado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }).lean();

    if (!user) {
      return res
        .status(400)
        .send({ status: "error", message: "Credenciales invalidas" });
    }

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      rol: user.rol,
    };

    res.redirect("/products");
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      return res.status(500).send({ status: "error", message: error.message });
    res.redirect("/login");
  });
});

export default router;
