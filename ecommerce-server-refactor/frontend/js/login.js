const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (document.querySelector("#txtError"))
    document.querySelector("#txtError").remove();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    const content = await response.json();

    if (response.status === 400) {
      const txtError = document.createElement("p");
      txtError.id = "txtError";
      txtError.innerHTML = `${content.message}`;
      form.append(txtError);
      return;
    }

    window.location.href = "profile.html";
  } catch (error) {
    console.log(error);
  }
});
