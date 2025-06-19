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
        localStorage.setItem("token", data.token);

        // Decodificar el token para obtener el rol (sin librerías externas)
        const payloadBase64 = data.token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));

        localStorage.setItem("role", payload.role);

        // Si es admin, redireccionar a panel (opcional)
        if (payload.role === "admin") {
          alert("Accediste como ADMINISTRADOR");
          // window.location.href = "/admin/dashboard.html"; // si querés redirigir
        }
      } else {
        alert("Error al iniciar sesión: " + data.message);
      }
    } catch (error) {
      alert("Error de red: " + error.message);
    }
  });
