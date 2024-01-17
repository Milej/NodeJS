const socket = io();

const productList = document.querySelector("#product-list");

socket.on("showProducts", (data) => {
  productList.innerHTML = "";
  data.forEach((product) => {
    productList.innerHTML += `<li><button class="deleteProduct" product="${product._id}">X</button>${product.title}</li>`;
  });
});

const form = document.querySelector("#addProduct");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const object = {};

  data.forEach((value, key) => (object[key] = value));

  let response = await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
    },
  });

  response = await response.json();

  if (response.status === "error") {
    alert(response.message);
  }

  if (response.status === "success") {
    console.log(response.payload);
    alert("Producto añadido correctamente");
    form.reset();
  }
});

const deleteProduct = async (e) => {
  if (!e.target.classList.contains("deleteProduct")) {
    return;
  }

  const productId = e.target.getAttribute("product");

  let response = await fetch(`/api/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  response = await response.json();

  if (response.status === "error") {
    alert(response.message);
  }

  if (response.status === "success") {
    console.log(response.payload);
    alert("Producto eliminado correctamente");
  }
};

document.addEventListener("click", deleteProduct);
