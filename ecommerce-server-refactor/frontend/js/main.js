const cargar = async () => {
  try {
    const response = await fetch("/api/sessions/current", {
      method: "GET",
      headers: {
        "authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (response.status != 200) {
      return (location.href = "/login");
    }

    const data = await response.json();

    const dataToHtml = `<p>Nombre: ${data.payload.first_name} Correo: ${data.payload.email}</p>`;

    document.querySelector("#main").innerHTML = dataToHtml;
  } catch (error) {
    document.querySelector("#main").innerHTML = error;
  }
};

document.onload(cargar())