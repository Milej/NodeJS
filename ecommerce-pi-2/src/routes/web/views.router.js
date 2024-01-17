import Products from "../../dao/dbManagers/products.manager.js";
import Carts from "../../dao/dbManagers/carts.manager.js";
import Messages from "../../dao/dbManagers/messages.manager.js";
import Router from "../router.js";
import { accessRoles, passportStrategies } from "../../config/enums.js";
import { authToken } from "../../utils.js";

export default class ViewsRouter extends Router {
  constructor() {
    super();
    this.productManager = new Products();
    this.cartManager = new Carts();
    this.messagesManager = new Messages();
  }

  init() {
    this.get(
      "/register",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      (req, res) => res.render("register")
    );

    this.get(
      "/login",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      (req, res) => res.render("login")
    );

    this.get(
      "/profile",
      [accessRoles.USER],
      passportStrategies.NOTHING,
      (req, res) => res.render("profile", { user: req.session.user })
    );

    this.get(
      "/products",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      (req, res) => this.productsView(req, res)
    );

    this.get(
      "/current",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      (req, res) => res.render("current")
    );
  }

  async productsView(req, res) {
    try {
      const response = await this.getProducts(req, res);
      res.render("products", response);
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts(req, res) {
    try {
      // Listar todos los productos con limit
      let { limit = 10, page: cPage = 1, sort, query, queryValue } = req.query;
      let result;

      if (query && queryValue) {
        result = await this.productManager.getAllWithQueries(
          limit,
          cPage,
          sort,
          query,
          queryValue
        );
      } else {
        result = await this.productManager.getAll(limit, cPage, sort);
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

      return {
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
      };
    } catch (error) {
      console.log(error);
      return { status: "error", error: error.message };
    }
  }

  // router.get("/product-detail", async (req, res) => {
  //   const { id } = req.query;
  //   const result = await this.productManager.getById(id);

  //   res.render("product-detail", result);
  // });

  // router.get("/home", async (req, res) => {
  //   const products = await productManager.getAll();
  //   res.render("home", { products });
  // });

  // router.get("/realtimeproducts", async (req, res) => {
  //   const io = req.app.get("socketio");
  //   const products = await productManager.getAll();

  //   io.on("connection", (socket) => {
  //     console.log("Cliente conectado");
  //     io.emit("showProducts", products);
  //   });
  //   res.render("realTimeProducts");
  // });

  // router.get("/carts/:cid", async (req, res) => {
  //   const { cid } = req.params;
  //   const result = await cartManager.getById(cid);
  //   res.render("carts", result);
  // });

  // router.get("/chat", async (req, res) => {
  //   const messages = await messagesManager.getAll();
  //   res.render("chat", { messages });
  // });
}
