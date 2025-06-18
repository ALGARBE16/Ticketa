const mockReportes = [
  { usuario: 'Juan', problema: 'Luminaria rota', estado: 'Pendiente', respuesta: 'En revisión' },
  { usuario: 'Ana', problema: 'Bache', estado: 'Finalizado', respuesta: 'Arreglado' }
];

const tabla = document.getElementById('tabla-reportes');

mockReportes.forEach(rep => {
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${rep.usuario}</td>
    <td>${rep.problema}</td>
    <td>${rep.estado}</td>
    <td>${rep.respuesta}</td>
    <td>
      <button class="btn-accion">Finalizar</button>
      <button class="btn-accion">Eliminar</button>
    </td>
  `;
  tabla.appendChild(fila);
});
