import { Router } from "express";

const router = Router();

const publicAccess = (req, res, next) => {
  if (req.session?.user) return res.redirect("/");
  next();
};

const privateAccess = (req, res, next) => {
  if (!req.session?.user) return res.redirect("/login");
  next();
};

const adminAccess = (req, res, next) => {
  if (!req.session?.user) return res.redirect("/login");

  if (req.session.user?.rol !== "admin")
    return res.send({
      status: "error",
      message: "No tienes permiso para ver esta pagina",
    });

  next();
};

router.get("/register", publicAccess, (req, res) => {
  res.render("register");
});

router.get("/login", publicAccess, (req, res) => {
  res.render("login");
});

router.get("/products", adminAccess, (req, res) => {
  // No puedo hacer que se quede en esta vista, salta a la "/" no se porque
  res.render("products", {
    user: req.session.user,
  });
});

router.get("/", privateAccess, (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

export default router;
