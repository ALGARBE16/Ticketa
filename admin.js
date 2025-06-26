const API_GET_REPORTES = "http://localhost/Ticketa/problems_get.php";
const API_PUT_REPORTES = "http://localhost/Ticketa/problems_put.php";
const API_DELETE_REPORTES = "http://localhost/Ticketa/problems_delete.php";

async function cargarReportes() {
  try {
    const response = await fetch(API_GET_REPORTES);
    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(
        "Error al cargar reportes: " + (data.message || "Error desconocido")
      );
      return;
    }

    const tbody = document.querySelector("#tablaReportes tbody");
    tbody.innerHTML = "";

    data.reportes.forEach((rep) => {
      const tr = document.createElement("tr");

      let estadoClass = "";
      if (rep.status.toLowerCase() === "pendiente")
        estadoClass = "estado-pendiente";
      else if (rep.status.toLowerCase() === "finalizado")
        estadoClass = "estado-finalizado";

      tr.innerHTML = `
        <td>${rep.id}</td>
        <td>${rep.user_name || "Sin nombre"}</td>
        <td>${rep.title}</td>
        <td>${
          rep.description.length > 80
            ? rep.description.slice(0, 80) + "..."
            : rep.description
        }</td>
        <td>${rep.area || "-"}</td>
        <td class="${estadoClass}">${rep.status}</td>
        <td>${rep.priority}</td>
        <td>${
          rep.created_at ? rep.created_at.slice(0, 16).replace("T", " ") : "-"
        }</td>
        <td>${
          rep.resolved_at ? rep.resolved_at.slice(0, 16).replace("T", " ") : "-"
        }</td>
        <td>${
          rep.image_path
            ? `<img src="${rep.image_path}" alt="Imagen reporte">`
            : "-"
        }</td>
        <td>
          ${
            rep.status.toLowerCase() === "pendiente"
              ? `<button class="btn-finalizar btn-accion" onclick="finalizarReporte(${rep.id})">Finalizar</button>`
              : `<button class="btn-finalizar btn-accion" disabled>Finalizado</button>`
          }
          <button class="btn-eliminar btn-accion" onclick="eliminarReporte(${
            rep.id
          })">Eliminar</button>
          <button class="btn-detalle btn-accion" onclick="verDetalle(${
            rep.id
          })">Ver detalle</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    alert("Error al cargar reportes: " + error.message);
    console.error(error);
  }
}

async function finalizarReporte(id) {
  if (!confirm("¿Querés marcar este reporte como FINALIZADO?")) return;

  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", "Finalizado");
    const fechaNow = new Date().toISOString().slice(0, 16);
    formData.append("resolved_at", fechaNow);

    const response = await fetch(API_PUT_REPORTES, {
      method: "POST",
      body: formData,
    });
    const resText = await response.text();
    const data = JSON.parse(resText);

    if (response.ok && data.success) {
      alert("Reporte finalizado con éxito.");
      cargarReportes();
    } else {
      alert("Error al finalizar: " + (data.message || "Error desconocido"));
    }
  } catch (error) {
    alert("Error en la conexión: " + error.message);
  }
}

async function eliminarReporte(id) {
  if (
    !confirm("¿Querés eliminar este reporte? Esta acción no se puede deshacer.")
  )
    return;

  try {
    const response = await fetch(`${API_DELETE_REPORTES}?id=${id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (response.ok && data.success) {
      alert("Reporte eliminado.");
      cargarReportes();
    } else {
      alert("Error al eliminar: " + (data.message || "Error desconocido"));
    }
  } catch (error) {
    alert("Error en la conexión: " + error.message);
  }
}

function verDetalle(id) {
  window.location.href = "html_formulario.html?id=" + id;
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("⛔ No has iniciado sesión.");
    return (window.location.href = "login.html");
  }

  try {
    const perfil = await fetch("http://localhost/Ticketa/profile.php", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const info = await perfil.json();

    if (!info.success || info.role !== "admin") {
      alert("⛔ Acceso denegado. No sos administrador.");
      return (window.location.href = "login.html");
    }

    // Si es admin, cargar reportes
    cargarReportes();
  } catch (error) {
    alert("Error al verificar perfil: " + error.message);
    window.location.href = "login.html";
  }
});
