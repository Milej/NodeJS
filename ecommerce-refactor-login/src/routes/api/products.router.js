import { Router } from "express";
import Products from "../../dao/dbManagers/products.manager.js";

const router = Router();
const manager = new Products();

router.get("/", async (req, res) => {
  try {
    // Listar todos los productos con limit
    let { limit = 10, page: cPage = 1, sort, query, queryValue } = req.query;
    let result;

    if (query && queryValue) {
      result = await manager.getAllWithQueries(
        limit,
        cPage,
        sort,
        query,
        queryValue
      );
    } else {
      result = await manager.getAll(limit, cPage, sort);
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
      prevLinkUrl = `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}${
        sort ? `&sort=${sort}` : ""
      }${query ? `&query=${query}&queryValue=${queryValue}` : ""}`;
    }

    if (hasNextPage) {
      nextLinkUrl = `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}${
        sort ? `&sort=${sort}` : ""
      }${query ? `&query=${query}&queryValue=${queryValue}` : ""}`;
    }

    res.send({
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
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    // Traer solo el producto con el id proporcionado
    const productId = req.params.pid;
    const product = await manager.getById(productId);

    res.send({ status: "success", payload: product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category)
      return res
        .status(400)
        .send({ status: "error", message: "Valores incompletos" });

    const result = await manager.add({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    const io = req.app.get("socketio");

    io.emit("showProducts", await manager.getAll());

    res.status(201).send({ status: "success", payload: result });
    // {
    //   id -> autogenerado, title, description, code, price -> Number, status -> Boolean, stock -> Number, category, thumbnail -> Array
    // }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    // Actualizar el producto sin eliminiar o modificar el id
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    const productId = req.params.pid;

    if (!title || !description || !code || !price || !stock || !category)
      return res
        .status(400)
        .send({ status: "error", message: "Valores incompletos" });

    const result = await manager.update(productId, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    const io = req.app.get("socketio");

    io.emit("showProducts", await manager.getAll());

    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const result = await manager.delete(productId);

    const io = req.app.get("socketio");
    io.emit("showProducts", await manager.getAll());

    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

export default router;
