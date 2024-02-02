import productsModel from "./models/products.model.js";

export default class Products {
  constructor() {
    console.log("Working products with db");
  }

  async getAll(query, options) {
    const products = await productsModel.paginate(query, options);
    return products;
  }

  async getById(id) {
    const product = await productsModel.findOne({ _id: id }).lean();
    return product;
  }

  async add(product) {
    const result = await productsModel.create(product);
    return result;
  }

  async update(id, product) {
    const result = await productsModel.updateOne({ _id: id }, product);
    return result;
  }

  async delete(id) {
    const result = await productsModel.deleteOne({ _id: id });
    return result;
  }
}
