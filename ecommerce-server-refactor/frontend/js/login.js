const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  try {
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    console.log(response);

    if (response.status === 200) {
      console.log(document.cookie);
    }
  } catch (error) {
    console.log(error);
  }
});
