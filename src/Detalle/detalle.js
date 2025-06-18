const mockReportes = [
  { id: '1', titulo: 'Luminaria rota', descripcion: 'Luminaria rota en calle 25', estado: 'Pendiente' },
  { id: '2', titulo: 'Bache', descripcion: 'Gran bache en avenida central', estado: 'Finalizado' }
];

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const reporte = mockReportes.find(r => r.id === id);

if (reporte) {
  document.getElementById('reporte-id').textContent = reporte.id;
  document.getElementById('reporte-titulo').textContent = reporte.titulo;
  document.getElementById('reporte-descripcion').textContent = reporte.descripcion;
  document.getElementById('reporte-estado').textContent = reporte.estado;
} else {
  document.body.innerHTML = '<p>Reporte no encontrado</p>';
}
const iconoElem = document.getElementById('reporte-icono');

if (reporte.estado === 'Pendiente') {
  estadoElem.classList.add('estado-pendiente');
  iconoElem.textContent = '⏳';
} else if (reporte.estado === 'Finalizado') {
  estadoElem.classList.add('estado-finalizado');
  iconoElem.textContent = '✔️';
}
