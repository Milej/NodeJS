import { Router } from "express";
import ProductManager from "../../dao/dbManagers/products.manager.js";
import CartManager from "../../dao/dbManagers/carts.manager.js";
import MessagesManager from "../../dao/dbManagers/messages.manager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();
const messagesManager = new MessagesManager();

const publicAccess = (req, res, next) => {
  if (req.session?.user) return res.redirect("/profile");
  next();
};

const privateAccess = (req, res, next) => {
  if (!req.session?.user) return res.redirect("/");
  next();
};

const adminAccess = (req, res, next) => {
  if (!req.session?.user) return res.redirect("/");

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

router.get("/", publicAccess, (req, res) => {
  res.render("login");
});

router.get("/profile", privateAccess, (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

const getProducts = async (req, res) => {
  try {
    // Listar todos los productos con limit
    let { limit = 10, page: cPage = 1, sort, query, queryValue } = req.query;
    let result;

    if (query && queryValue) {
      result = await productManager.getAllWithQueries(
        limit,
        cPage,
        sort,
        query,
        queryValue
      );
    } else {
      result = await productManager.getAll(limit, cPage, sort);
    }

    const {
      docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
    } = result;

    let prevLinkUrl = null;
    let nextLinkUrl = null;

    if (hasPrevPage) {
      prevLinkUrl = `http://localhost:8080/products?limit=${limit}&page=${prevPage}${
        sort ? `&sort=${sort}` : ""
      }${query ? `&query=${query}&queryValue=${queryValue}` : ""}`;
    }

    if (hasNextPage) {
      nextLinkUrl = `http://localhost:8080/products?limit=${limit}&page=${nextPage}${
        sort ? `&sort=${sort}` : ""
      }${query ? `&query=${query}&queryValue=${queryValue}` : ""}`;
    }

    res.render("products", {
      status: "success",
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: prevLinkUrl,
      nextLink: nextLinkUrl,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
};

router.get("/products", privateAccess, getProducts);

router.get("/product-detail", async (req, res) => {
  const { id } = req.query;
  const result = await productManager.getById(id);

  res.render("product-detail", result);
});

router.get("/home", async (req, res) => {
  const products = await productManager.getAll();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const io = req.app.get("socketio");
  const products = await productManager.getAll();

  io.on("connection", (socket) => {
    console.log("Cliente conectado");
    io.emit("showProducts", products);
  });
  res.render("realTimeProducts");
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const result = await cartManager.getById(cid);
  res.render("carts", result);
});

router.get("/chat", async (req, res) => {
  const messages = await messagesManager.getAll();
  res.render("chat", { messages });
});

export default router;
