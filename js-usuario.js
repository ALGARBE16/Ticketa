const API_POST_URL = 'http://localhost/parcial-latikera/problems_post.php';
const API_GET_URL = 'http://localhost/parcial-latikera/problems_get.php';
const API_DELETE_URL = 'http://localhost/parcial-latikera/problems_delete.php';

// Mostrar mensaje visual
function mostrarMensaje(mensaje, tipo = 'ok') {
  const div = document.getElementById("mensaje");
  div.textContent = mensaje;
  div.className = tipo === 'ok' ? 'respuesta success' : 'respuesta error';
  div.style.display = 'block';
  setTimeout(() => {
    div.style.display = 'none';
  }, 4000);
}

// Mostrar u ocultar secciones
function mostrarSeccion(seccion) {
  document.getElementById('seccion-reportes').style.display = seccion === 'reportes' ? 'block' : 'none';
  document.getElementById('seccion-estado').style.display = seccion === 'estado' ? 'block' : 'none';
}

// Mostrar formulario de creación
function mostrarFormulario() {
  const form = document.getElementById('reporteForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Obtener y mostrar lista de reportes
async function cargarReportes() {
  try {
    const res = await fetch(API_GET_URL);
    const data = await res.json();
    const lista = document.getElementById('listaReportes');
    lista.innerHTML = '';

    if (res.ok && data.success) {
      data.reportes.forEach(rep => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${rep.title}</strong><br>
          ${rep.description}<br>
          Prioridad: ${rep.priority}<br>
          Estado: ${rep.status}<br>
          <button onclick="eliminarReporte(${rep.id})">Eliminar</button>
          <button onclick="modificarReporte(${rep.id})">Modificar</button>
        `;
        lista.appendChild(li);
      });
    } else {
      lista.innerHTML = `<li>Error al cargar reportes</li>`;
    }
  } catch (e) {
    console.error(e);
    document.getElementById('listaReportes').innerHTML = `<li>Error de conexión</li>`;
  }
}

// Obtener y mostrar estado de reportes
async function cargarEstado() {
  try {
    const res = await fetch(API_GET_URL);
    const data = await res.json();
    const lista = document.getElementById('listaEstado');
    lista.innerHTML = '';

    if (res.ok && data.success) {
      data.reportes.forEach(rep => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>Reporte #${rep.id}</strong><br>
          Estado: ${rep.status}<br>
          ${rep.description}<br>
          <button>Ver reporte</button>
        `;
        lista.appendChild(li);
      });
    } else {
      lista.innerHTML = `<li>Error al cargar estado de reportes</li>`;
    }
  } catch (e) {
    console.error(e);
    document.getElementById('listaEstado').innerHTML = `<li>Error de conexión</li>`;
  }
}

// Eliminar reporte
async function eliminarReporte(id) {
  if (!confirm('¿Eliminar este reporte?')) return;

  try {
    const res = await fetch(`${API_DELETE_URL}?id=${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (res.ok && data.success) {
      mostrarMensaje(`✅ Reporte eliminado`);
      cargarReportes();
    } else {
      mostrarMensaje(`❌ ${data.message || 'No se pudo eliminar'}`, 'error');
    }
  } catch (e) {
    console.error(e);
    mostrarMensaje('❌ Error al intentar eliminar', 'error');
  }
}

// Modificar reporte (no implementado aún)
function modificarReporte(id) {
  alert(`Función modificar reporte #${id} aún no implementada.`);
}

// Enviar formulario
async function enviarReporteForm() {
  const form = document.getElementById('reporteForm');
  const formData = new FormData(form);

  try {
    const res = await fetch(API_POST_URL, {
      method: 'POST',
      body: formData
    });

    const resText = await res.text();
    console.log('📥 Respuesta cruda del servidor:', resText);

    let data;
    try {
      data = JSON.parse(resText.replace(/^\uFEFF/, '').trim());
    } catch (e) {
      console.error('❌ No se pudo parsear JSON. Texto recibido:', resText);
      throw new Error("Respuesta del servidor no es JSON válido.");
    }

    if (res.ok && data.success) {
      mostrarMensaje(`✅ ${data.message}`);
      form.reset();
      form.style.display = 'none';
      cargarReportes(); // recargar lista de reportes
    } else {
      mostrarMensaje(`❌ ${data.message || 'Error desconocido'}`, 'error');
    }
  } catch (error) {
    console.error('❌ Error en la solicitud:', error);
    mostrarMensaje('❌ Error en la conexión con el servidor.', 'error');
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reporteForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      enviarReporteForm();
    });
  }

  mostrarSeccion('reportes');
  cargarReportes();
  cargarEstado();
});
