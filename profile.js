document.getElementById("btnProfile").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  console.log("Token para enviar:", token);

  if (!token) {
    alert("No hay token. Iniciá sesión primero.");
    return;
  }

  try {
    const response = await fetch("http://localhost/Ticketa/profile.php", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Respuesta API:", data);

    if (response.ok && data.success) {
      let mensaje = `Bienvenido: ${data.user} (Rol: ${data.role})`;

      // Si el usuario es admin, podrías redirigir o mostrar algo extra
      if (data.role === "admin") {
        mensaje += "\n🔒 Tenés acceso al panel de administración.";
        // window.location.href = "/admin/dashboard.html"; // si tuvieras un panel
      }

      document.getElementById("profileInfo").innerText = mensaje;
    } else {
      document.getElementById("profileInfo").innerText = "";
      alert("Acceso denegado: " + data.message);
    }
  } catch (error) {
    alert("Error al cargar perfil: " + error.message);
  }
});

document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("token");
  document.getElementById("profileInfo").innerText = "";
  alert("Sesión cerrada.");
});
