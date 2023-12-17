const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  // const result = await fetch("/api/sessions/login", {
  //   method: "POST",
  //   body: JSON.stringify(obj),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // }).then((result) => {
  //   if (result.status == 200) {
  //     window.location.replace("/");
  //   }
  //   console.log(result)
  // });

  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.remove();
  }

  const response = await fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { status, message } = await response.json();

  const element = document.createElement("p");

  if (status === "success") {
    element.style = "padding:4px; color: green;";
  } else {
    element.style = "padding:4px; color: red;";
  }

  element.id = "errorMessage";
  element.innerHTML = message;

  form.after(element);

  if (status === "success") {
    window.location.replace("/");
  }
});
