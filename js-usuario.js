const API_POST_URL = "http://localhost/Ticketa/problems_post.php";
const API_PUT_URL = "http://localhost/Ticketa/problems_put.php";
const API_GET_URL = "http://localhost/Ticketa/problems_get.php";
const API_DELETE_URL = "http://localhost/Ticketa/problems_delete.php";

function mostrarSeccion(seccion) {
  document.getElementById("seccion-reportes").style.display =
    seccion === "reportes" ? "block" : "none";
  document.getElementById("seccion-estado").style.display =
    seccion === "estado" ? "block" : "none";

  if (seccion === "estado") cargarEstado();
}

async function enviarReporteForm() {
  const form = document.getElementById("reporteForm");
  const formData = new FormData(form);
  const id = document.getElementById("reporte_id").value;
  const endpoint = id ? API_PUT_URL : API_POST_URL;

  if (id) formData.append("id", id);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const resText = await res.text();
    console.log("Respuesta servidor:", resText);

    const data = JSON.parse(resText);

    if (res.ok && data.success) {
      mostrarMensaje(`✅ ${data.message}`);
      form.reset();
      document.getElementById("reporte_id").value = "";
      document.querySelector('#reporteForm button[type="submit"]').textContent =
        "Enviar Reporte";
      mostrarSeccion("estado");
      cargarEstado();
    } else {
      mostrarMensaje(`❌ ${data.message || "Error desconocido"}`, "error");
    }
  } catch (error) {
    console.error("Error en solicitud:", error);
    mostrarMensaje("❌ Error en la conexión con el servidor.", "error");
  }
}

function mostrarMensaje(mensaje, tipo = "ok") {
  const div = document.getElementById("mensaje");
  div.textContent = mensaje;
  div.className = tipo === "ok" ? "respuesta success" : "respuesta error";
  div.style.display = "block";
  setTimeout(() => {
    div.style.display = "none";
  }, 4000);
}

async function cargarEstado() {
  try {
    const res = await fetch(API_GET_URL);
    const text = await res.text();
    const data = JSON.parse(text);

    const lista = document.getElementById("listaEstado");
    lista.innerHTML = "";

    if (res.ok && data.success) {
      if (data.reportes.length === 0) {
        lista.innerHTML = `<li>No hay reportes cargados aún.</li>`;
        return;
      }

      data.reportes.forEach((rep) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${rep.title}</strong><br>
          Descripción: ${rep.description}<br>
          Estado: ${rep.status}<br>
          Prioridad: ${rep.priority}<br>
          Área: ${rep.area || "No especificada"}<br>
          Usuario: ${rep.user_name || "No informado"}<br>
          Creado: ${rep.created_at}<br>
          ${
            rep.image_path
              ? `<img src="${rep.image_path}" width="100" style="margin-top:10px;">`
              : ""
          }
          <div style="margin-top:10px;">
            <button onclick="verReporte(${rep.id})">Ver</button>
            <button onclick="abrirModalModificar(${rep.id})">Modificar</button>
            <button onclick="eliminarReporte(${rep.id})">Cancelar</button>
          </div>
        `;
        lista.appendChild(li);
      });
    } else {
      lista.innerHTML = `<li>Error al cargar reportes.</li>`;
    }
  } catch (e) {
    console.error("Error en cargarEstado:", e);
    document.getElementById(
      "listaEstado"
    ).innerHTML = `<li>❌ Error al conectar con el servidor.</li>`;
  }
}

function verReporte(id) {
  alert(`Funcionalidad para ver el reporte #${id} no implementada aún.`);
}

async function eliminarReporte(id) {
  if (!confirm("¿Cancelar este reporte?")) return;

  try {
    const res = await fetch(`${API_DELETE_URL}?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.ok && data.success) {
      mostrarMensaje("✅ Reporte cancelado.");
      cargarEstado();
    } else {
      mostrarMensaje(`❌ ${data.message || "No se pudo eliminar."}`, "error");
    }
  } catch (e) {
    console.error(e);
    mostrarMensaje("❌ Error en la eliminación.", "error");
  }
}

async function abrirModalModificar(id) {
  try {
    const res = await fetch(API_GET_URL);
    const data = await res.json();

    if (res.ok && data.success) {
      const rep = data.reportes.find((r) => r.id == id);
      if (!rep) return mostrarMensaje("❌ Reporte no encontrado", "error");

      document.getElementById("mod_id").value = rep.id;
      document.getElementById("mod_title").value = rep.title;
      document.getElementById("mod_description").value = rep.description;
      document.getElementById("mod_area").value = rep.area || "";
      document.getElementById("mod_user_name").value = rep.user_name || "";
      document.getElementById("mod_priority").value = rep.priority;
      document.getElementById("mod_created_at").value =
        rep.created_at?.slice(0, 16) || "";
      document.getElementById("mod_resolved_at").value =
        rep.resolved_at?.slice(0, 16) || "";

      document.getElementById("modalModificar").style.display = "flex";
    }
  } catch (e) {
    console.error(e);
    mostrarMensaje("❌ Error al cargar el reporte para editar", "error");
  }
}

function cerrarModalModificar() {
  document.getElementById("modalModificar").style.display = "none";
  document.getElementById("formModificar").reset();
}

document
  .getElementById("formModificar")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submit modificar formulario");

    const form = e.target;
    const formData = new FormData(form);
    const id = formData.get("id");

    if (!id) {
      mostrarMensaje("❌ Falta ID para modificar.", "error");
      return;
    }

    try {
      const res = await fetch(API_PUT_URL, {
        method: "POST",
        body: formData,
      });

      const resText = await res.text();
      console.log("Respuesta servidor (modificación):", resText);
      const data = JSON.parse(resText);

      if (res.ok && data.success) {
        cerrarModalModificar();
        cargarEstado();
        mostrarSeccion("estado");
        // Aquí mostramos modal de éxito para que el usuario lo cierre manualmente:
        document.getElementById("modalExito").style.display = "flex";
      } else {
        mostrarMensaje(`❌ ${data.message || "Error desconocido"}`, "error");
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("❌ Error en la conexión con el servidor.", "error");
    }
  });

// --- NUEVO: Mostrar botón para admin que vuelva al panel ---
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const perfil = await fetch("http://localhost/Ticketa/profile.php", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await perfil.json();

    if (data.success && data.role === "admin") {
      const btnAdmin = document.getElementById("btnAdminPanel");
      if (btnAdmin) {
        btnAdmin.style.display = "inline-block";
        btnAdmin.addEventListener("click", () => {
          window.location.href = "admin.html";
        });
      }
    }
  } catch (e) {
    console.error("Error verificando perfil:", e);
  }
});

// Evento para el submit del formulario de reporte
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("reporteForm").addEventListener("submit", (e) => {
    e.preventDefault();
    enviarReporteForm();
  });

  mostrarSeccion("reportes");
});
