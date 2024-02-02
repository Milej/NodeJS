import {
  getProducts as getProductsService,
  getProduct as getProductService,
  addProduct as addProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../services/products.service.js";

const getProducts = async (req, res) => {
  try {
    // Extraemos los parametros
    let { limit = 10, page = 1, sort, query, queryValue } = req.query;
    const products = await getProductsService(limit, page, sort, query, queryValue);
    res.sendSuccess(products);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const getProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await getProductService(pid);
    res.sendSuccess(product);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const addProduct = async (req, res) => {
  try {
    const result = await addProductService(req.body);

    if (result.status === "error") return res.sendClientError(result.message);

    const io = req.app.get("socketio");

    io.emit("showProducts", await getProductsService());
    res.sendSuccessNewResource(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const { pid } = req.params;

    const product = { title, description, code, price, status, stock, category, thumbnails };

    if (!title || !description || !code || !price || !stock || !category) {
      return res.sendClientError("Debes completar todos los campos");
    }

    const result = await updateProductService(pid, product);
    const io = req.app.get("socketio");

    io.emit("showProducts", await getProductsService());

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await deleteProductService(pid);
    const io = req.app.get("socketio");

    io.emit("showProducts", await getProductsService());

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
