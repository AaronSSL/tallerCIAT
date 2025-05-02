document.addEventListener('DOMContentLoaded', function() {
  // Verificar si hay una sesión activa
  if (localStorage.getItem("accesoPermitido") !== "true" || 
      sessionStorage.getItem("sesionActiva") !== "true") {
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
      
      // Eliminar los valores de acceso y sesión
      localStorage.removeItem("accesoPermitido");
      sessionStorage.removeItem("sesionActiva");
      
      // Redirigir al login
      window.location.href = 'login.html';
    });
  }
});