import Products from "../dao/dbManagers/products.manager.js";

const productManager = new Products();

const getProducts = async (limit, cPage, sort, query, queryValue) => {
  // Variable para luego rellenar con la data del manager
  let data;

  // Nos sirven para enviar como parametros para la busqueda
  let queryParams = {};
  const options = {
    limit,
    page: cPage,
    lean: true,
  };

  if (sort == "asc" || sort == "desc") {
    options.sort = { price: sort };
  }

  if (query && queryValue) {
    queryParams = {
      [query]: queryValue,
    };
  }

  // Obtenemos los datos de la base de datos
  data = await productManager.getAll(queryParams, options);

  // Extraemos lo que necesitamos de los datos
  const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = data;

  // En caso de que tenga una proxima o una anterior pagina, configuramos las urls
  let prevLinkUrl = null;
  let nextLinkUrl = null;
  if (hasPrevPage) {
    prevLinkUrl = `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}${sort ? `&sort=${sort}` : ""}${
      query ? `&query=${query}&queryValue=${queryValue}` : ""
    }`;
  }
  if (hasNextPage) {
    nextLinkUrl = `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}${sort ? `&sort=${sort}` : ""}${
      query ? `&query=${query}&queryValue=${queryValue}` : ""
    }`;
  }

  const result = {
    status: "success",
    products: docs,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink: prevLinkUrl,
    nextLink: nextLinkUrl,
  };

  return result;
};

const getProduct = async pid => {
  const product = await productManager.getById(pid);
  return product;
};

const addProduct = async data => {
  const { title, description, code, price, status, stock, category, thumbnails } = data;

  if (!title || !description || !code || !price || !stock || !category)
    return { status: "error", message: "Debes completar todos los campos" };

  const result = await productManager.add({ title, description, code, price, status, stock, category, thumbnails });
  return result;
};

const updateProduct = async (id, product) => {
  const result = await productManager.update(id, product);
  return result;
};

const deleteProduct = async id => {
  const result = await productManager.delete(id);
  return result;
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
