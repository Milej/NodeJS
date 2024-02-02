const getUserData = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/current", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

getUserData();
