const socket = io()

const productList = document.querySelector('#product-list')

socket.on('showProducts', data => {
  productList.innerHTML = ''
  data.forEach(product => {
    productList.innerHTML += `<li>${product.title} | ${product.code}</li>`
  })
})
