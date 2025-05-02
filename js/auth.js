document.addEventListener('DOMContentLoaded', function() {
  // Verificar si hay una sesión activa
  const usuarioActual = localStorage.getItem('usuario');
  if (!usuarioActual) {
    window.location.href = 'login.html';
    return;
  }
  
  // Configurar el botón de cerrar sesión
  const cerrarSesionBtn = document.getElementById('cerrar-sesion');
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Limpiar datos de sesión
      localStorage.removeItem('usuario');
      localStorage.removeItem('admin_id');
      
      // Redirigir al login
      window.location.href = 'login.html';
    });
  }
});