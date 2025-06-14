const API_POST_URL = 'http://localhost/parcial-latikera/Ticketa/problems_post.php';

async function enviarReporteForm() {
  const formData = new URLSearchParams();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('status', document.getElementById('status').value);
  formData.append('created_at', document.getElementById('created_at').value);
  formData.append('resolved_at', document.getElementById('resolved_at').value || '');
  formData.append('priority', document.getElementById('priority').value);

  try {
    const res = await fetch(API_POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await res.json();

    if (res.ok && data.success) {
      mostrarMensaje(`✅ ${data.message}`);
    } else {
      mostrarMensaje(`❌ ${data.message || 'Error desconocido'}`, 'error');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    mostrarMensaje('❌ Error en la conexión con el servidor.', 'error');
  }
}
