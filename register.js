document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const response = await fetch("http://localhost/Ticketa/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Usuario registrado correctamente");
      } else {
        alert("Error al registrar: " + data.message);
      }
    } catch (error) {
      alert("Error de red: " + error.message);
    }
  });
