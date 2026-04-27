import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminModal from '../../components/AdminModal/AdminModal';
import { obtenerProductos, eliminarProducto, obtenerTrabajadores, eliminarTrabajador, iniciarSesion } from '../../api'; 
import './AdminPage.css';

function AdminPage() {
  // --- ESTADOS DE SEGURIDAD (LOGIN) ---
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [credenciales, setCredenciales] = useState({ username: '', password: '' });
  const [errorLogin, setErrorLogin] = useState('');

  // --- ESTADOS DEL PANEL ---
  const [view, setView] = useState('productos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [itemAEditar, setItemAEditar] = useState(null);

  // --- NUEVOS ESTADOS PARA LOS FILTROS DE BÚSQUEDA ---
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroPrecioMin, setFiltroPrecioMin] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');

  const navigate = useNavigate();

  // 1. Al cargar la página, revisamos la memoria
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario_virtual_store');
    if (usuarioGuardado) setUsuarioLogueado(JSON.parse(usuarioGuardado));
  }, []);

  // 2. Cargar datos
  const cargarDatos = async () => {
    if (view === 'productos') {
      const datos = await obtenerProductos();
      setInventory(datos);
    } else if (view === 'trabajadores' && usuarioLogueado?.is_superuser) {
      const datos = await obtenerTrabajadores();
      setTrabajadores(datos);
    }
  };

  useEffect(() => {
    if (usuarioLogueado) cargarDatos();
  }, [view, usuarioLogueado]);

  // --- LÓGICA DE LOGIN Y LOGOUT ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorLogin('');
    try {
      const usuario = await iniciarSesion(credenciales);
      setUsuarioLogueado(usuario);
      localStorage.setItem('usuario_virtual_store', JSON.stringify(usuario));
    } catch (error) {
      setErrorLogin('Usuario o contraseña incorrectos. Intenta de nuevo.');
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario_virtual_store');
    setUsuarioLogueado(null);
    setCredenciales({ username: '', password: '' });
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleEliminarProducto = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
      if (await eliminarProducto(id)) cargarDatos();
    }
  };

  const handleEliminarTrabajador = async (id, nombre, isSuperuser) => {
    if (isSuperuser) return alert("⚠️ No puedes eliminar a un Dueño / Super Administrador por seguridad.");
    if (window.confirm(`¿Estás seguro de despedir al trabajador "${nombre}"?`)) {
      if (await eliminarTrabajador(id)) cargarDatos();
    }
  };

  const abrirEdicion = (item) => {
    setItemAEditar(item);
    setIsModalOpen(true);
  };

  // --- LÓGICA MATEMÁTICA DE FILTROS ---
  // Extraemos una lista de las categorías únicas que existen actualmente en el inventario
  const categoriasUnicas = [...new Set(inventory.map(item => item.categoria_nombre || 'General'))].sort();

  // Filtramos el inventario en tiempo real según lo que se haya escrito en la barra
  const inventoryFiltrado = inventory.filter(item => {
    const matchNombre = item.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const catName = item.categoria_nombre || 'General';
    const matchCategoria = filtroCategoria === '' || catName === filtroCategoria;
    
    const precio = parseFloat(item.precio_venta);
    const matchMin = filtroPrecioMin === '' || precio >= parseFloat(filtroPrecioMin);
    const matchMax = filtroPrecioMax === '' || precio <= parseFloat(filtroPrecioMax);
    
    return matchNombre && matchCategoria && matchMin && matchMax;
  });


  // ==========================================
  // PANTALLA 1: LOGIN
  // ==========================================
  if (!usuarioLogueado) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f6fa' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#2f3542', marginBottom: '10px' }}>Acceso Restringido</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>Ingresa tus credenciales de empleado</p>
          
          {errorLogin && <div style={{ background: '#ff7675', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '0.9rem' }}>{errorLogin}</div>}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Usuario" value={credenciales.username} onChange={e => setCredenciales({...credenciales, username: e.target.value})} style={{ padding: '12px', border: '1px solid #d1d8e0', borderRadius: '6px', fontSize: '1rem' }} required />
            <input type="password" placeholder="Contraseña" value={credenciales.password} onChange={e => setCredenciales({...credenciales, password: e.target.value})} style={{ padding: '12px', border: '1px solid #d1d8e0', borderRadius: '6px', fontSize: '1rem' }} required />
            <button type="submit" style={{ padding: '12px', background: '#a29bfe', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Iniciar Sesión</button>
          </form>
          
          <button onClick={() => navigate('/')} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#74b9ff', cursor: 'pointer', textDecoration: 'underline' }}>← Volver a la Tienda</button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PANTALLA 2: DASHBOARD
  // ==========================================
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo"><h2>Virtual<span>Admin</span></h2></div>
        
        <div style={{ padding: '15px', textAlign: 'center', background: '#f1f2f6', margin: '0 15px 20px 15px', borderRadius: '8px' }}>
          <strong style={{ display: 'block', color: '#2f3542' }}>{usuarioLogueado.username}</strong>
          <span style={{ fontSize: '0.8rem', color: usuarioLogueado.is_superuser ? '#d63031' : '#74b9ff', fontWeight: 'bold' }}>
            {usuarioLogueado.is_superuser ? '💎 Dueño' : '👤 Vendedor'}
          </span>
        </div>

        <nav className="admin-sidebar__nav">
          <ul>
            <li className={view === 'productos' ? 'active' : ''} onClick={() => setView('productos')}>📦 Productos</li>
            {usuarioLogueado.is_superuser && (
              <li className={view === 'trabajadores' ? 'active' : ''} onClick={() => setView('trabajadores')}>👥 Trabajadores</li>
            )}
          </ul>
          
          <div className="admin-sidebar__footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/" className="btn-exit-admin">👁️ Ver Tienda</Link>
            <button onClick={handleCerrarSesion} style={{ background: '#ff7675', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{view === 'productos' ? 'Gestión de Productos' : 'Gestión de Trabajadores'}</h1>
          <button className="btn-add-main" onClick={() => { setItemAEditar(null); setIsModalOpen(true); }}>
            {view === 'productos' ? '+ Nuevo Producto' : '+ Nuevo Trabajador'}
          </button>
        </header>

        {view === 'productos' ? (
          <section className="admin-inventory">
            <div className="inventory-header"><h2>Inventario Actual ({inventoryFiltrado.length})</h2></div>
            
            {/* --- NUEVA BARRA DE BÚSQUEDA Y FILTROS --- */}
            <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', border: '1px solid #d1d8e0', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="🔍 Buscar por nombre..." 
                value={filtroNombre} 
                onChange={(e) => setFiltroNombre(e.target.value)} 
                style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', flexGrow: 1, minWidth: '200px' }}
              />
              
              <select 
                value={filtroCategoria} 
                onChange={(e) => setFiltroCategoria(e.target.value)} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
              >
                <option value="">Todas las Categorías</option>
                {categoriasUnicas.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  type="number" 
                  placeholder="Min $" 
                  value={filtroPrecioMin} 
                  onChange={(e) => setFiltroPrecioMin(e.target.value)} 
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '80px' }}
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Max $" 
                  value={filtroPrecioMax} 
                  onChange={(e) => setFiltroPrecioMax(e.target.value)} 
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '80px' }}
                />
              </div>

              <button 
                onClick={() => { setFiltroNombre(''); setFiltroCategoria(''); setFiltroPrecioMin(''); setFiltroPrecioMax(''); }}
                style={{ padding: '8px 12px', background: '#ffeaa7', color: '#2d3436', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                title="Limpiar filtros"
              >
                Limpiar
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {/* AHORA USAMOS 'inventoryFiltrado' EN LUGAR DE 'inventory' */}
                  {inventoryFiltrado.length > 0 ? (
                    inventoryFiltrado.map(item => (
                      <tr key={item.id} onClick={() => abrirEdicion(item)} style={{ cursor: 'pointer' }} title="Ver detalles">
                        <td><strong>{item.nombre}</strong></td><td>{item.categoria_nombre || 'General'}</td><td>${item.precio_venta}</td>
                        <td><span className={`status-pill ${item.estado_disponible ? 'disponible' : 'agotado'}`}>{item.estado_disponible ? 'Disponible' : 'Oculto'}</span></td>
                        <td>
                          <button className="btn-edit" onClick={(e) => { e.stopPropagation(); abrirEdicion(item); }}>✔</button>
                          <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleEliminarProducto(item.id, item.nombre); }}>❌</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
                        No se encontraron productos que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="admin-workers">
            <div className="inventory-header"><h2>Equipo de Trabajo</h2></div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>Usuario</th><th>Nombre Completo</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead>
                <tbody>
                  {trabajadores.map(worker => (
                    <tr key={worker.id} onClick={() => abrirEdicion(worker)} style={{ cursor: 'pointer' }}>
                      <td><strong>{worker.username}</strong></td><td>{worker.first_name || 'Sin nombre'}</td><td>{worker.email}</td>
                      <td><span className={`status-pill ${worker.is_superuser ? 'disponible' : 'agotado'}`}>{worker.is_superuser ? '💎 Dueño' : '👤 Vendedor'}</span></td>
                      <td>
                        <button className="btn-edit" onClick={(e) => { e.stopPropagation(); abrirEdicion(worker); }}>✔</button>
                        <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleEliminarTrabajador(worker.id, worker.username, worker.is_superuser); }}>❌</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={view} recargarDatos={cargarDatos} dataAEditar={itemAEditar} />
    </div>
  );
}

export default AdminPage;