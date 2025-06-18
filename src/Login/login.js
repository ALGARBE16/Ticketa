function iniciarSesion() {
  const usuario = document.getElementById('login-usuario').value;
  const pass = document.getElementById('login-pass').value;

  if (usuario === 'admin' && pass === '1234') {
    window.location.href = '../Admin/admin.html';
  } else if (usuario === 'usuario' && pass === '1234') {
    window.location.href = '../Usuario/index.html';
  } else {
    document.getElementById('login-error').textContent = 'Usuario o contraseña incorrectos';
  }
}

function registrarse() {
  const usuario = document.getElementById('reg-usuario').value;
  const pass = document.getElementById('reg-pass').value;

  if (usuario && pass) {
    // Simula guardado, en proyecto real esto va al backend
    document.getElementById('reg-msg').textContent = `Usuario ${usuario} registrado (simulado)`;
  } else {
    document.getElementById('reg-msg').textContent = 'Completa usuario y contraseña';
  }
}
