import { Router } from "express";
import passport from "passport";
import userModel from "../../dao/dbManagers/models/users.model.js";

const router = Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.send({ status: "success", message: "Usuario registrado con github" });
  }
);

router.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "fail-register" }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario registrado" });
  }
);

router.get("/fail-register", (req, res) => {
  res.status(500).send({ status: "error", message: "Registro fallido" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = {
        name: `Coder House`,
        email: "adminCoder@coder.com",
        age: 1,
        rol: "admin",
      };
    } else {
      const user = await userModel.findOne({ email, password }).lean();

      if (!user)
        return res
          .status(400)
          .send({ status: "error", message: "Credenciales invalidas" });

      req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol: user.rol,
      };
    }

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
    res.redirect("/");
  });
});

export default router;
