const API_URL = 'https://tu-api.com/reportes'; // Cambia por tu endpoint real

const form = document.getElementById('reporteForm');
const lista = document.getElementById('listaReportes');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const descripcion = document.getElementById('descripcion').value;

  await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ titulo, descripcion })
  });

  form.reset();
  cargarReportes();
});

async function cargarReportes() {
  const res = await fetch(API_URL);
  const reportes = await res.json();

  lista.innerHTML = '';
  reportes.forEach(reporte => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${reporte.titulo}</strong><br />
      ${reporte.descripcion}<br />
      <button onclick="editarReporte('${reporte.id}', '${reporte.titulo}', '${reporte.descripcion}')">Editar</button>
      <button onclick="eliminarReporte('${reporte.id}')">Eliminar</button>
    `;
    lista.appendChild(li);
  });
}

async function editarReporte(id, tituloPrevio, descripcionPrevio) {
  const nuevoTitulo = prompt('Nuevo título:', tituloPrevio);
  const nuevaDescripcion = prompt('Nueva descripción:', descripcionPrevio);

  if (nuevoTitulo && nuevaDescripcion) {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ titulo: nuevoTitulo, descripcion: nuevaDescripcion })
    });
    cargarReportes();
  }
}

async function eliminarReporte(id) {
  if (confirm('¿Estás seguro de eliminar este reporte?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarReportes();
  }
}

// Cargar al inicio
cargarReportes();
