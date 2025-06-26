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
      const prioridadClass = {
        alta: "prioridad-alta",
        media: "prioridad-media",
        baja: "prioridad-baja",
      };

      const clasePrioridad = prioridadClass[rep.priority.toLowerCase()] || "";

      const tr = document.createElement("tr");

      const estado = rep.status.toLowerCase();
      let estadoClass = "";

      if (estado === "pendiente") estadoClass = "estado-pendiente";
      else if (estado === "finalizado") estadoClass = "estado-finalizado";
      else if (estado === "asignado") estadoClass = "estado-asignado";

      // Composición dinámica de los botones
      let botones = "";

      // No tenés id aquí, entonces para botones deberías usar otro campo o traer id igual en PHP pero no mostrarlo (o agregarlo oculto)
      // Pero para que los botones funcionen, necesitás el id aunque no lo muestres en la tabla visible.

      // Por eso, mejor traer id pero no mostrarlo en la tabla visible, para poder usarlo en botones
      const id = rep.id; // asegurate de traerlo desde PHP aunque no lo muestres en la tabla

      if (estado === "pendiente") {
        botones += `<button class="btn-asignar btn-accion" onclick="asignarReporte(${id}, '${rep.priority}')">Asignar</button>`;
        botones += `<button class="btn-detalle btn-accion" onclick="verDetalle(${id})">Ver detalle</button>`;
      } else if (estado === "asignado") {
        botones += `<button class="btn-asignar btn-accion asignado" disabled>Asignado</button>`;
        botones += `<button class="btn-finalizar btn-accion" onclick="finalizarReporte(${id}, '${rep.priority}')">Finalizar</button>`;
        botones += `<button class="btn-eliminar btn-accion" onclick="eliminarReporte(${id})">Eliminar</button>`;
        botones += `<button class="btn-detalle btn-accion" onclick="verDetalle(${id})">Ver detalle</button>`;
      } else {
        botones += `<button class="btn-detalle btn-accion" onclick="verDetalle(${id})">Ver detalle</button>`;
      }

      tr.innerHTML = `
        <td>${rep.user_name || "Sin nombre"}</td>
        <td>${rep.title}</td>
        <td>${rep.area || "-"}</td>
        <td class="${estadoClass}">${rep.status}</td>
        <td class="${clasePrioridad}">${rep.priority}</td>
        <td>${
          rep.created_at ? rep.created_at.slice(0, 16).replace("T", " ") : "-"
        }</td>
        <td>${
          rep.resolved_at ? rep.resolved_at.slice(0, 16).replace("T", " ") : "-"
        }</td>
        <td>
          <div class="btn-container">
            ${botones}
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    alert("Error al cargar reportes: " + error.message);
    console.error(error);
  }
}

async function finalizarReporte(id, prioridad) {
  if (!confirm("¿Querés marcar este reporte como FINALIZADO?")) return;

  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", "Finalizado");
    formData.append("priority", prioridad); // ✔️ clave: mantener la prioridad original
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

async function verDetalle(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("⛔ No has iniciado sesión.");
    return (window.location.href = "login.html");
  }

  try {
    const response = await fetch(
      `http://localhost/Ticketa/problems_get.php?id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await response.json();

    if (!response.ok || !data.success || !data.reporte) {
      return Swal.fire(
        "Error",
        data.message || "No se pudo obtener el detalle del reporte.",
        "error"
      );
    }

    const rep = data.reporte;

    Swal.fire({
      title: `Reporte #${rep.id}`,
      html: `
        <p><strong>Título:</strong> ${rep.title}</p>
        <p><strong>Estado:</strong> ${rep.status}</p>
        <p><strong>Creado:</strong> ${
          rep.created_at ? rep.created_at.replace("T", " ").slice(0, 16) : "-"
        }</p>
        <p><strong>Resuelto:</strong> ${
          rep.resolved_at ? rep.resolved_at.replace("T", " ").slice(0, 16) : "-"
        }</p>
        <p><strong>Prioridad:</strong> ${rep.priority}</p>
        <p><strong>Área:</strong> ${rep.area || "-"}</p>
        <p><strong>Usuario:</strong> ${rep.user_name || "Sin nombre"}</p>
        ${
          rep.image_path
            ? `<img src="${rep.image_path}" alt="Imagen reporte" style="max-width: 100%; margin-top: 10px; border-radius: 8px;">`
            : ""
        }
      `,
      icon: "info",
      confirmButtonText: "Cerrar",
      width: "40rem",
    });
  } catch (error) {
    Swal.fire(
      "Error",
      "Error al obtener el detalle: " + error.message,
      "error"
    );
  }
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

// Asignar reporte
async function asignarReporte(id, prioridad) {
  if (!confirm("¿Querés asignar este reporte?")) return;

  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", "Asignado");
    formData.append("priority", prioridad); // ✔️ Esto evita que el backend la reemplace con 'MEDIA'

    const response = await fetch(API_PUT_REPORTES, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (response.ok && data.success) {
      alert("Reporte asignado.");
      cargarReportes();
    } else {
      alert("Error al asignar: " + (data.message || "Error desconocido"));
    }
  } catch (error) {
    alert("Error en la conexión: " + error.message);
  }
}
