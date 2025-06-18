const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const mockReportes = [
  { id: '1', titulo: 'Luminaria rota', descripcion: 'Luminaria rota en calle 25', estado: 'Pendiente', prioridad: 'Alta' },
  { id: '2', titulo: 'Bache', descripcion: 'Gran bache en avenida central', estado: 'Finalizado', prioridad: 'Media' }
];

const reporte = mockReportes.find(r => r.id === id);

if (!reporte) {
  document.body.innerHTML = '<p>Reporte no encontrado</p>';
} else {
  document.getElementById('reporte-id').textContent = reporte.id;
  document.getElementById('reporte-titulo').textContent = reporte.titulo;
  document.getElementById('reporte-descripcion').textContent = reporte.descripcion;
  document.getElementById('reporte-estado').textContent = reporte.estado;
  document.getElementById('reporte-prioridad').textContent = reporte.prioridad;

  // Agregar clase al estado
  const estadoElem = document.getElementById('reporte-estado');
  if (reporte.estado === 'Pendiente') {
    estadoElem.classList.add('estado-pendiente');
  } else if (reporte.estado === 'Finalizado') {
    estadoElem.classList.add('estado-finalizado');
  }

  // Agregar clase a la prioridad
  const prioridadElem = document.getElementById('reporte-prioridad');
  if (reporte.prioridad === 'Alta') {
    prioridadElem.classList.add('prioridad-alta');
  } else if (reporte.prioridad === 'Media') {
    prioridadElem.classList.add('prioridad-media');
  } else if (reporte.prioridad === 'Baja') {
    prioridadElem.classList.add('prioridad-baja');
  }
}
