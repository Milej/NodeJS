const socket = io()
let email = ''
const chatBox = document.querySelector('#chatBox')
const chatMessage = document.querySelector('#chatMessage')

Swal.fire({
  title: 'Bienvenido',
  text: 'Introduce tu correo electrónico para continuar',
  input: 'text',
  inputValidator: value => {
    return !value && 'Introduce tu correo electrónico'
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
  confirmButtonText: 'Ingresar'
}).then(input => {
  email = input.value
  socket.emit('userLogged', email)
})

socket.on('userConnected', data => {
  let messages = ''
  data.forEach(message => {
    messages += `${message.user}: ${message.message}<br>`
  })
  chatBox.innerHTML = messages
})

socket.on('messages', data => {
  let messages = ''
  data.forEach(message => {
    messages += `${message.user}: ${message.message}<br>`
  })
  chatBox.innerHTML = messages
})

chatMessage.addEventListener('keyup', e => {
  if (e.key == 'Enter') {
    socket.emit('message', { user: email, message: chatMessage.value })
    chatMessage.value = ''
  }
})
