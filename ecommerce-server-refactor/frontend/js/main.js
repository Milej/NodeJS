// const autorizacion = async () => {
//   try {
//     const response = await fetch("http://localhost:8080/api/auth/current", {
//       method: "GET",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await response.json();

//     if (response.status != 200 || !data.payload) {
//       return (location.href = "./");
//     }

//     location.href = "profile.html";
//   } catch (error) {
//     console.log(error);
//   }
// };

// autorizacion();
