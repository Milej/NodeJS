const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  // Para el login normal
  // try {
  //   const response = await fetch("/api/sessions/login", {
  //     method: "POST",
  //     headers: {
  //       "Accept": "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(obj),
  //   });

  //   if (response.status == 200) {
  //     window.location.replace("/products");
  //   }
  // } catch (error) {
  //   console.log(error);
  // }

  // Para login con passport jwt
  try {
    const response = await fetch("/api/sessions/passport-login", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    const content = await response.json();
    const { access_token } = content;

    if (access_token) {
      localStorage.setItem("access_token", access_token);
      location.href = "/products";
    } else {
      location.href = "/login";
    }
  } catch (error) {
    console.log(error);
  }
});
