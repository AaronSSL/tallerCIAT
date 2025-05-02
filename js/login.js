document.addEventListener('DOMContentLoaded', function() {
  // Verificar si ya hay una sesión activa
  if (localStorage.getItem("accesoPermitido") === "true" && 
      sessionStorage.getItem("sesionActiva") === "true") {
    window.location.href = 'index.html';
    return;
  }

  // Inicializar cliente de Supabase
  const supabaseUrl = "https://hadrdwcgboyqbpoqyyhg.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZHJkd2NnYm95cWJwb3F5eWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjE0MzEsImV4cCI6MjA2MTYzNzQzMX0.xkey8tSmffYh_jdcbhT9Og1ic2XStnn7HErDFyk-_30";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    
    try {
      console.log("Intentando iniciar sesión con:", usuario);
      
      // Consultar la tabla de admins para verificar credenciales
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('usuario', usuario)
        .eq('contrasena', contrasena)
        .single();
      
      console.log("Respuesta:", data, error);
      
      if (error || !data) {
        loginError.style.display = 'block';
        return;
      }
      
      // Guardar información de sesión
      localStorage.setItem('usuario', usuario);
      localStorage.setItem('admin_id', data.id);
      
      // Establecer los valores de acceso y sesión
      localStorage.setItem("accesoPermitido", "true");
      sessionStorage.setItem("sesionActiva", "true");
      
      console.log("Sesión guardada, redirigiendo...");
      
      // Redirigir al dashboard
      window.location.href = 'index.html';
      
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      loginError.style.display = 'block';
    }
  });
});