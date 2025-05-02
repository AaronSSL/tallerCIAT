document.addEventListener('DOMContentLoaded', async () => {
  // Supabase client
  const supabaseUrl = "https://hadrdwcgboyqbpoqyyhg.supabase.co"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZHJkd2NnYm95cWJwb3F5eWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjE0MzEsImV4cCI6MjA2MTYzNzQzMX0.xkey8tSmffYh_jdcbhT9Og1ic2XStnn7HErDFyk-_30"
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const tablaTalleres = document.getElementById('talleres-tabla');
  const totalRegistros = document.getElementById('total-registros');
  const buscarTaller = document.getElementById('buscar-taller');
  const guardarCambiosBtn = document.getElementById('guardar-cambios');
  
  let talleres = [];
  let editarTallerModal;
  
  // Inicializar el modal
  if (typeof bootstrap !== 'undefined') {
    editarTallerModal = new bootstrap.Modal(document.getElementById('editarTallerModal'));
  }
  
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
          <td colspan="6" class="text-center text-danger">
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
          <td colspan="6" class="text-center">
            No se encontraron talleres registrados.
          </td>
        </tr>
      `;
      totalRegistros.textContent = '0';
      return;
    }
    
    tablaTalleres.innerHTML = talleres.map(taller => `
      <tr>
        <!-- Eliminada la celda del ID -->
        <td>${taller.titulo}</td>
        <td>${taller.descripcion.length > 50 ? taller.descripcion.substring(0, 50) + '...' : taller.descripcion}</td>
        <td>${taller.encargado}</td>
        <td>${formatearFecha(taller.fecha)}</td>
        <td>${taller.hora_inicio} - ${taller.horario_fin}</td>
        <td>
          <button class="btn btn-sm btn-primary editar-taller" data-id="${taller.id}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-sm btn-danger eliminar-taller" data-id="${taller.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
    
    totalRegistros.textContent = talleres.length;
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.editar-taller').forEach(btn => {
      btn.addEventListener('click', () => editarTaller(btn.dataset.id));
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
  
  // Función para editar un taller
  async function editarTaller(id) {
    const taller = talleres.find(t => t.id == id);
    
    if (taller) {
      // Llenar el formulario con los datos del taller
      document.getElementById('editar-id').value = taller.id;
      document.getElementById('editar-titulo').value = taller.titulo;
      document.getElementById('editar-descripcion').value = taller.descripcion;
      document.getElementById('editar-encargado').value = taller.encargado;
      document.getElementById('editar-correo').value = taller.correo_encargado;
      document.getElementById('editar-fecha').value = taller.fecha;
      document.getElementById('editar-hora-inicio').value = taller.hora_inicio;
      document.getElementById('editar-hora-fin').value = taller.horario_fin;
      
      // Mostrar el modal
      if (editarTallerModal) {
        editarTallerModal.show();
      } else {
        // Fallback si bootstrap no está disponible
        document.getElementById('editarTallerModal').style.display = 'block';
      }
    }
  }
  
  // Función para guardar los cambios de un taller
  async function guardarCambiosTaller() {
    const id = document.getElementById('editar-id').value;
    
    const tallerActualizado = {
      titulo: document.getElementById('editar-titulo').value,
      descripcion: document.getElementById('editar-descripcion').value,
      encargado: document.getElementById('editar-encargado').value,
      correo_encargado: document.getElementById('editar-correo').value,
      fecha: document.getElementById('editar-fecha').value,
      hora_inicio: document.getElementById('editar-hora-inicio').value,
      horario_fin: document.getElementById('editar-hora-fin').value
    };
    
    try {
      // Validar que la hora de fin sea posterior a la hora de inicio
      if (tallerActualizado.hora_inicio >= tallerActualizado.horario_fin) {
        alert('La hora de finalización debe ser posterior a la hora de inicio.');
        return;
      }
      
      const { error } = await supabase
        .from('talleres')
        .update(tallerActualizado)
        .eq('id', id);
      
      if (error) throw error;
      
      // Cerrar el modal
      if (editarTallerModal) {
        editarTallerModal.hide();
      } else {
        // Fallback si bootstrap no está disponible
        document.getElementById('editarTallerModal').style.display = 'none';
      }
      
      // Recargar talleres
      cargarTalleres();
      
      alert('Taller actualizado correctamente');
      
    } catch (error) {
      console.error('Error al actualizar taller:', error);
      alert('Error al actualizar el taller. Por favor, intente de nuevo.');
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
  
  // Event listener para guardar cambios
  if (guardarCambiosBtn) {
    guardarCambiosBtn.addEventListener('click', guardarCambiosTaller);
  }
  
  // Cargar talleres al iniciar
  cargarTalleres();
});