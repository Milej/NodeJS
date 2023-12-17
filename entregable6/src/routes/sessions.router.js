import { Router } from "express";
import passport from "passport";

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
  passport.authenticate("github", { failureRedirect: "/login" }),
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

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "fail-login" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(401)
        .send({ status: "error", message: "Credenciales incorrectas" });
    }

    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
    };

    res.send({ status: "success", message: "Login success" });
  }
);

router.get("/fail-login", async (req, res) => {
  res.status(500).send({ status: "error", message: "Login fallido" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      return res.status(500).send({ status: "error", message: error.message });
    res.redirect("/login");
  });
});

export default router;
