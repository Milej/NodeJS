import mongoose from "mongoose";
import productsModel from "../models/products.model.js";

export default class ProductManager {
  addProduct = async (product) => {
    try {
      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.status ||
        !product.stock ||
        !product.category
      ) {
        throw new Error(400);
      }

      const products = await this.getProducts();

      if (products.length === 0) {
        product.id = 1;
      } else {
        product.id = products[products.length - 1].id + 1;
      }

      products.push(product);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products),
        null,
        "\t"
      );

      return "Producto creado correctamente";
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  getProducts = async (query) => {
    // Solucionar el tema de buscar por disponibilidad
    try {
      const {
        limit = 10,
        page: pageNumber = 1,
        sort,
        category,
        availables,
      } = query;

      let options = {
        lean: true,
        limit,
        page: pageNumber,
      };

      if (sort) {
        options.sort = { price: sort };
      }

      let queryOption = {};

      if (category || availables) {
        queryOption = {
          $or: [
            { category: { $regex: new RegExp(category, "i") } },
            { status: availables },
          ],
        };
      }

      const {
        docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
      } = await productsModel.paginate(queryOption, options);

      let prevLink = null;
      let nextLink = null;

      if (hasPrevPage) {
        prevLink = `http://localhost:8080/products?page=${prevPage}&limit=${limit}`;
      }

      if (hasNextPage) {
        nextLink = `http://localhost:8080/products?page=${nextPage}&limit=${limit}`;
      }

      return {
        code: 200,
        status: "success",
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      console.log(error);
      return { code: 500, status: "error", message: error.message };
    }
  };

  getProductById = async (id) => {
    try {
      const product = await productsModel.findOne({ _id: id });

      if (!product)
        return {
          code: 404,
          status: "error",
          message: "Producto no encontrado",
        };

      return { code: 200, status: "success", payload: product };
    } catch (error) {
      console.log(error);
      return { code: 500, status: "error", message: error.message };
    }
  };

  updateProduct = async (id, product) => {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((p) => p.id === id);

      if (productIndex === -1) throw new Error(404);

      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.status ||
        !product.stock ||
        !product.category
      )
        throw new Error(400);

      products[productIndex] = product;
      product.id = id;

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );

      return `Producto ${id} editado correctamente`;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts();

      const productIndex = products.findIndex((p) => p.id === id);

      if (productIndex === -1) throw new Error(404);

      products.splice(productIndex, 1);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );

      return "Producto eliminado";
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };
}
