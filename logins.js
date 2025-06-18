document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost/Ticketa/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Login exitoso");
        localStorage.setItem("token", data.token); // Guardar el token
      } else {
        alert("Error al iniciar sesión: " + data.message);
      }
    } catch (error) {
      alert("Error de red: " + error.message);
    }
  });
