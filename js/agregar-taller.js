document.addEventListener('DOMContentLoaded', function() {
  const formulario = document.getElementById('nuevo-taller-form');
  
  // Initialize Supabase client
  const supabaseUrl = "https://hadrdwcgboyqbpoqyyhg.supabase.co"; // Replace with your Supabase URL
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZHJkd2NnYm95cWJwb3F5eWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjE0MzEsImV4cCI6MjA2MTYzNzQzMX0.xkey8tSmffYh_jdcbhT9Og1ic2XStnn7HErDFyk-_30"; // Replace with your Supabase Anon Key
  
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  formulario.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const nuevoTaller = {
      titulo: document.getElementById('titulo').value,
      descripcion: document.getElementById('descripcion').value,
      encargado: document.getElementById('encargado').value,
      correo_encargado: document.getElementById('correo_encargado').value,
      fecha: document.getElementById('fecha').value,
      hora_inicio: document.getElementById('hora_inicio').value,
      horario_fin: document.getElementById('horario_fin').value
    };
    
    try {
      // Validar que la hora de fin sea posterior a la hora de inicio
      if (nuevoTaller.hora_inicio >= nuevoTaller.horario_fin) {
        alert('La hora de finalización debe ser posterior a la hora de inicio.');
        return;
      }
      
      // Guardar en la base de datos
      const { data, error } = await supabase
        .from('talleres')
        .insert([nuevoTaller]);
      
      if (error) throw error;
      
      alert('Taller agregado correctamente');
      
      // Limpiar formulario
      formulario.reset();
      
      // Opcional: redirigir al dashboard
      window.location.href = 'index.html';
      
    } catch (error) {
      console.error('Error al guardar taller:', error);
      alert('Error al guardar el taller. Por favor, intente de nuevo.');
    }
  });
});