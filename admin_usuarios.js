const API_GET_USUARIOS = "http://localhost/Ticketa/usuarios_get.php";
const API_PUT_USUARIOS = "http://localhost/Ticketa/usuarios_put.php";
// const API_PUT_USUARIOS = "http://localhost/Ticketa/usuarios_put.php"; volver asi luego

async function cargarUsuarios() {
  try {
    const response = await fetch(API_GET_USUARIOS);
    const data = await response.json();

    if (!response.ok || !data.success) {
      alert("Error al cargar usuarios: " + (data.message || "Desconocido"));
      return;
    }

    const tbody = document.querySelector("#tablaUsuarios tbody");
    tbody.innerHTML = "";

    data.usuarios.forEach(usuario => {
      const tr = document.createElement("tr");

      const rolActual = usuario.role.toLowerCase();
      const nuevoRol = rolActual === "admin" ? "user" : "admin";

      const boton = `
  <button class="btn-accion btn-rol-${nuevoRol}" onclick="cambiarRol(${usuario.id}, '${nuevoRol}')">
    Cambiar a ${nuevoRol}
  </button>
`;


      tr.innerHTML = `
        <td>${usuario.id}</td>
        
        <td>${usuario.email || "-"}</td>
        <td class="rol-${rolActual}">${rolActual}</td>
        <td><div class="btn-container">${boton}</div></td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    alert("Error en la conexión: " + error.message);
  }
}

async function cambiarRol(id, nuevoRol) {
  if (!confirm(`¿Cambiar a rol ${nuevoRol}?`)) return;

  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("role", nuevoRol);

    const response = await fetch(API_PUT_USUARIOS, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Rol actualizado correctamente.");
      cargarUsuarios();
    } else {
      alert("Error al actualizar rol: " + (data.message || "Desconocido"));
    }
  } catch (error) {
    alert("Error en la conexión: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
});