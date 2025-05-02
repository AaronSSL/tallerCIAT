document.addEventListener('DOMContentLoaded', async () => {
  // Supabase client (replace with your actual Supabase URL and Key)
  const supabaseUrl = "https://hadrdwcgboyqbpoqyyhg.supabase.co"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZHJkd2NnYm95cWJwb3F5eWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjE0MzEsImV4cCI6MjA2MTYzNzQzMX0.xkey8tSmffYh_jdcbhT9Og1ic2XStnn7HErDFyk-_30"
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const tablaTalleres = document.getElementById('talleres-tabla');
  const totalRegistros = document.getElementById('total-registros');
  const buscarTaller = document.getElementById('buscar-taller');
  
  let talleres = [];
  
  // Función para cargar talleres
  async function cargarTalleres() {
    try {
      const { data, error } = await supabase
        .from('talleres')
        .select('*')
        .order('fecha', { ascending: false });
      
      if (error) throw error;
      
      talleres = data || [];
      mostrarTalleres(talleres);
      
    } catch (error) {
      console.error('Error al cargar talleres:', error);
      tablaTalleres.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-danger">
            Error al cargar los talleres. Por favor, intente de nuevo.
          </td>
        </tr>
      `;
    }
  }
  
  // Función para mostrar talleres en la tabla
  function mostrarTalleres(talleres) {
    if (talleres.length === 0) {
      tablaTalleres.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            No se encontraron talleres registrados.
          </td>
        </tr>
      `;
      totalRegistros.textContent = '0';
      return;
    }
    
    tablaTalleres.innerHTML = talleres.map(taller => `
      <tr>
        <td>${taller.id}</td>
        <td>${taller.titulo}</td>
        <td>${taller.descripcion.length > 50 ? taller.descripcion.substring(0, 50) + '...' : taller.descripcion}</td>
        <td>${taller.encargado}</td>
        <td>${formatearFecha(taller.fecha)}</td>
        <td>${taller.hora_inicio} - ${taller.horario_fin}</td>
        <td>
          <button class="btn btn-sm btn-info ver-detalles" data-id="${taller.id}">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-danger eliminar-taller" data-id="${taller.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
    
    totalRegistros.textContent = talleres.length;
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.ver-detalles').forEach(btn => {
      btn.addEventListener('click', () => verDetallesTaller(btn.dataset.id));
    });
    
    document.querySelectorAll('.eliminar-taller').forEach(btn => {
      btn.addEventListener('click', () => eliminarTaller(btn.dataset.id));
    });
  }
  
  // Función para formatear fecha
  function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString();
  }
  
  // Función para ver detalles de un taller
  async function verDetallesTaller(id) {
    const taller = talleres.find(t => t.id == id);
    
    if (taller) {
      document.getElementById('detalle-titulo').textContent = taller.titulo;
      document.getElementById('detalle-descripcion').textContent = taller.descripcion;
      document.getElementById('detalle-encargado').textContent = taller.encargado;
      document.getElementById('detalle-correo').textContent = taller.correo_encargado;
      document.getElementById('detalle-fecha').textContent = formatearFecha(taller.fecha);
      document.getElementById('detalle-horario').textContent = `${taller.hora_inicio} - ${taller.horario_fin}`;
      
      const modal = new bootstrap.Modal(document.getElementById('detallesTallerModal'));
      modal.show();
    }
  }
  
  // Función para eliminar un taller
  async function eliminarTaller(id) {
    if (!confirm('¿Está seguro que desea eliminar este taller?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('talleres')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Recargar talleres
      cargarTalleres();
      
    } catch (error) {
      console.error('Error al eliminar taller:', error);
      alert('Error al eliminar el taller. Por favor, intente de nuevo.');
    }
  }
  
  // Filtrar talleres
  buscarTaller.addEventListener('input', function() {
    const busqueda = this.value.toLowerCase();
    
    const talleresFiltrados = talleres.filter(taller => 
      taller.titulo.toLowerCase().includes(busqueda) ||
      taller.descripcion.toLowerCase().includes(busqueda) ||
      taller.encargado.toLowerCase().includes(busqueda)
    );
    
    mostrarTalleres(talleresFiltrados);
  });
  
  // Cargar talleres al iniciar
  cargarTalleres();
});