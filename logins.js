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
        localStorage.setItem("token", data.token);

        // Decodificar el token para obtener el rol (sin librerías externas)
        const payloadBase64 = data.token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));

        localStorage.setItem("role", payload.role);

        if (payload.role === "admin") {
          alert("Accediste como ADMINISTRADOR");
          window.location.href = "admin.html"; // Redirige al panel admin
        } else if (payload.role === "user") {
          alert("Accediste como USUARIO normal");
          window.location.href = "html_formulario.html"; // Redirige al formulario usuario
        } else {
          alert("Accediste con rol desconocido: " + payload.role);
          // Opcional: redirigir o mostrar algo
        }
      } else {
        alert("Error al iniciar sesión: " + data.message);
      }
    } catch (error) {
      alert("Error de red: " + error.message);
    }
  });
