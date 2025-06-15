const API_POST_URL = 'http://localhost/parcial-latikera/problems_post.php'; // Asegurate que esta ruta es correcta

async function enviarReporteForm() {
  const form = document.getElementById('reporteForm');
  const formData = new FormData(form); // Tomamos todos los campos del formulario directamente

  console.log('📤 Enviando datos con FormData...');

  try {
    const res = await fetch(API_POST_URL, {
      method: 'POST',
      body: formData // No seteamos headers, FormData lo maneja solo
    });

    const resText = await res.text();
    console.log('📥 Respuesta cruda del servidor:', resText);

    let data;
    try {
      data = JSON.parse(resText);
    } catch (e) {
      throw new Error('Respuesta del servidor no es JSON válido.');
    }

    if (res.ok && data.success) {
      mostrarMensaje(`✅ ${data.message}`);
      form.reset(); // Limpiamos el formulario
    } else {
      mostrarMensaje(`❌ ${data.message || 'Error desconocido'}`, 'error');
    }
  } catch (error) {
    console.error('❌ Error en la solicitud:', error);
    mostrarMensaje('❌ Error en la conexión con el servidor.', 'error');
  }
}

// Escuchar el evento submit del formulario
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reporteForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita recargar la página
    enviarReporteForm(); // Enviamos los datos
  });
});

// Mostrar mensajes en pantalla
function mostrarMensaje(mensaje, tipo = 'ok') {
  const div = document.getElementById("mensaje");
  div.textContent = mensaje;
  div.className = tipo === 'ok' ? 'mensaje ok' : 'mensaje error';
  div.style.display = 'block';
  setTimeout(() => {
    div.style.display = 'none';
  }, 4000);
}
