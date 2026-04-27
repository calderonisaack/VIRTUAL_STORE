import { useState, useEffect } from 'react';
import { 
  crearProducto, actualizarProducto, obtenerCategorias, crearCategoria, 
  actualizarCategoria, eliminarCategoria, obtenerLotes, registrarLoteInventario, 
  crearTrabajador, actualizarTrabajador 
} from '../../api';
import './AdminModal.css';

function AdminModal({ isOpen, onClose, type, recargarDatos, dataAEditar }) {
  // --- ESTADOS PARA PRODUCTOS ---
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({ 
    nombre: '', descripcion: '', caracteristicas: '', precio_compra: '', 
    precio_venta: '', stock: '', permite_al_por_mayor: false, 
    precio_mayorista: '', estado_disponible: true 
  });
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [infoStock, setInfoStock] = useState({ cantidad: 0, fecha: 'Sin registro', dias: 0 });
  const [catPadreId, setCatPadreId] = useState('');
  const [catSubId, setCatSubId] = useState('');

  // --- ESTADOS PARA TRABAJADORES ---
  const [workerData, setWorkerData] = useState({ 
    username: '', first_name: '', email: '', password: '', is_superuser: false 
  });

  // --- CARGA INICIAL ---
  useEffect(() => {
    if (isOpen && type === 'productos') {
      obtenerCategorias().then(data => setCategorias(data));
    }
  }, [isOpen, type]);

  useEffect(() => {
    if (type === 'productos') {
      if (dataAEditar) {
        setFormData({
          nombre: dataAEditar.nombre || '', descripcion: dataAEditar.descripcion || '', 
          caracteristicas: dataAEditar.caracteristicas || '', precio_compra: dataAEditar.precio_compra || '', 
          precio_venta: dataAEditar.precio_venta || '', stock: '', 
          permite_al_por_mayor: dataAEditar.permite_al_por_mayor || false, 
          precio_mayorista: dataAEditar.precio_mayorista || '', estado_disponible: dataAEditar.estado_disponible !== false
        });
        
        obtenerLotes().then(todosLosLotes => {
          const lotes = todosLosLotes.filter(l => l.producto === dataAEditar.id);
          if (lotes.length > 0) {
              lotes.sort((a, b) => new Date(a.fecha_ingreso) - new Date(b.fecha_ingreso));
              const stockTotal = lotes.reduce((acc, lote) => acc + (lote.cantidad_disponible || 0), 0);
              const dias = lotes[0].dias_en_stock !== undefined ? lotes[0].dias_en_stock : Math.floor((new Date() - new Date(lotes[0].fecha_ingreso)) / (1000 * 60 * 60 * 24));
              setInfoStock({ cantidad: stockTotal, fecha: lotes[0].fecha_ingreso, dias: dias >= 0 ? dias : 0 });
          } else { 
            setInfoStock({ cantidad: 0, fecha: 'Sin registro', dias: 0 }); 
          }
        });
        
        if (categorias.length > 0) {
          const catGuardada = categorias.find(c => c.id === dataAEditar.categoria);
          if (catGuardada) {
            if (catGuardada.categoria_padre) { 
              setCatPadreId(catGuardada.categoria_padre); 
              setCatSubId(catGuardada.id); 
            } else { 
              setCatPadreId(catGuardada.id); 
              setCatSubId(''); 
            }
          }
        }
      } else {
        setFormData({ 
          nombre: '', descripcion: '', caracteristicas: '', precio_compra: '', 
          precio_venta: '', stock: '', permite_al_por_mayor: false, 
          precio_mayorista: '', estado_disponible: true 
        });
        setCatPadreId(''); setCatSubId(''); setInfoStock({ cantidad: 0, fecha: 'Sin registro', dias: 0 });
      }
    } else if (type === 'trabajadores') {
      if (dataAEditar) {
        setWorkerData({ 
          username: dataAEditar.username, first_name: dataAEditar.first_name, 
          email: dataAEditar.email, password: '', is_superuser: dataAEditar.is_superuser 
        });
      } else {
        setWorkerData({ username: '', first_name: '', email: '', password: '', is_superuser: false });
      }
    }
  }, [dataAEditar, isOpen, type, categorias]);

  if (!isOpen) return null;

  // --- MANEJADORES DE CAMBIOS ---
  const handleChangeProd = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') setArchivoImagen(files[0]);
    else setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleChangeWorker = (e) => {
    const { name, value, type, checked } = e.target;
    setWorkerData({ ...workerData, [name]: type === 'checkbox' ? checked : value });
  };

  // --- MANEJADORES DE CATEGORÍAS ---
  const handlePadreChange = (e) => { setCatPadreId(e.target.value); setCatSubId(''); };
  
  const handleNuevoPadre = async () => {
    const nombre = window.prompt("Nombre de la Categoría Principal:");
    if (!nombre) return;
    try {
      const nueva = await crearCategoria({ nombre, descripcion: "", categoria_padre: null });
      setCategorias([...categorias, nueva]); setCatPadreId(nueva.id); setCatSubId('');
    } catch (e) { alert("Error al crear la categoría."); }
  };

  const handleEditarPadre = async () => {
    const cat = categorias.find(c => c.id === parseInt(catPadreId));
    const nuevoNombre = window.prompt("Editar nombre:", cat.nombre);
    if (nuevoNombre && nuevoNombre !== cat.nombre) {
      try {
        const act = await actualizarCategoria(cat.id, { nombre: nuevoNombre, descripcion: cat.descripcion, categoria_padre: null });
        setCategorias(categorias.map(c => c.id === cat.id ? act : c));
      } catch (e) { alert("Error al editar."); }
    }
  };

  const handleEliminarPadre = async () => {
    const cat = categorias.find(c => c.id === parseInt(catPadreId));
    if (window.confirm(`⚠️ ¿Seguro que deseas eliminar "${cat.nombre}"?`)) {
      try {
        await eliminarCategoria(cat.id);
        setCategorias(categorias.filter(c => c.id !== cat.id));
        setCatPadreId(''); setCatSubId('');
      } catch (e) { alert("No se pudo eliminar."); }
    }
  };

  const handleNuevaSub = async () => {
    const nombre = window.prompt("Nombre de la Subcategoría:");
    if (!nombre) return;
    try {
      const nueva = await crearCategoria({ nombre, descripcion: "", categoria_padre: parseInt(catPadreId) });
      setCategorias([...categorias, nueva]); setCatSubId(nueva.id);
    } catch (e) { alert("Error al crear subcategoría."); }
  };

  const handleEditarSub = async () => {
    const cat = categorias.find(c => c.id === parseInt(catSubId));
    const nuevoNombre = window.prompt("Editar nombre:", cat.nombre);
    if (nuevoNombre && nuevoNombre !== cat.nombre) {
      try {
        const act = await actualizarCategoria(cat.id, { nombre: nuevoNombre, descripcion: cat.descripcion, categoria_padre: parseInt(catPadreId) });
        setCategorias(categorias.map(c => c.id === cat.id ? act : c));
      } catch (e) { alert("Error al editar."); }
    }
  };

  const handleEliminarSub = async () => {
    const cat = categorias.find(c => c.id === parseInt(catSubId));
    if (window.confirm(`⚠️ ¿Seguro que deseas eliminar "${cat.nombre}"?`)) {
      try {
        await eliminarCategoria(cat.id);
        setCategorias(categorias.filter(c => c.id !== cat.id)); setCatSubId('');
      } catch (e) { alert("No se pudo eliminar."); }
    }
  };

  // --- GUARDAR DATOS ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === 'trabajadores') {
      if (!workerData.username.trim() || !workerData.email.trim()) return alert("El Usuario y Correo son obligatorios.");
      if (!dataAEditar && !workerData.password) return alert("Debe asignar una contraseña al nuevo trabajador.");

      const payload = {
        username: workerData.username, first_name: workerData.first_name, 
        email: workerData.email, is_superuser: workerData.is_superuser
      };
      if (workerData.password) payload.password = workerData.password; 

      try {
        if (dataAEditar) {
          await actualizarTrabajador(dataAEditar.id, payload);
          alert("¡Trabajador actualizado!");
        } else {
          await crearTrabajador(payload);
          alert("¡Trabajador contratado con éxito!");
        }
        if (recargarDatos) recargarDatos(); onClose();
      } catch (error) { alert("Error al guardar. Verifica que el Usuario no exista ya."); }
      return; 
    }

    // Guardar Producto
    const categoriaFinal = catSubId ? catSubId : catPadreId;
    if (!formData.nombre.trim() || !categoriaFinal || formData.precio_compra === '' || formData.precio_venta === '' || !formData.caracteristicas.trim()) return alert("⚠️ Faltan campos obligatorios");
    
    const payload = new FormData();
    payload.append('nombre', formData.nombre); payload.append('descripcion', formData.descripcion || ""); 
    payload.append('caracteristicas', formData.caracteristicas); 
    payload.append('precio_compra', parseFloat(String(formData.precio_compra).replace(',', '.'))); 
    payload.append('precio_venta', parseFloat(String(formData.precio_venta).replace(',', '.'))); 
    payload.append('categoria', parseInt(categoriaFinal)); 
    payload.append('permite_al_por_mayor', formData.permite_al_por_mayor); 
    payload.append('estado_disponible', formData.estado_disponible);
    if (formData.permite_al_por_mayor) payload.append('precio_mayorista', parseFloat(String(formData.precio_mayorista).replace(',', '.')));
    if (archivoImagen) payload.append('imagen', archivoImagen);

    try {
      if (dataAEditar) { 
        await actualizarProducto(dataAEditar.id, payload); 
        alert("¡Producto actualizado!"); 
      } else {
        const nuevo = await crearProducto(payload);
        if (parseInt(formData.stock) > 0) {
          await registrarLoteInventario({ 
            producto: nuevo.id, cantidad_ingresada: parseInt(formData.stock), 
            cantidad_disponible: parseInt(formData.stock), fecha_ingreso: new Date().toISOString().split('T')[0] 
          });
        }
        alert("¡Producto creado!");
      }
      if (recargarDatos) recargarDatos(); onClose(); 
    } catch (error) { alert(`⚠️ Django rechazó los datos:\n${error.message}`); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '700px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
        <header className="modal-header">
          <h2>{dataAEditar ? `Editar ${type === 'productos' ? 'Producto' : 'Trabajador'}` : `Nuevo ${type === 'productos' ? 'Producto' : 'Trabajador'}`}</h2>
          <button type="button" className="btn-close" onClick={onClose}>&times;</button>
        </header>

        {dataAEditar && type === 'productos' && (
           <div style={{ background: '#f8f9fa', border: '1px solid #d1d8e0', borderRadius: '8px', padding: '15px', marginBottom: '25px' }}>
             <h3 style={{ marginTop: 0, color: '#2f3542', fontSize: '1.1rem', borderBottom: '2px solid #a29bfe', paddingBottom: '8px', marginBottom: '15px' }}>📊 Resumen de Inventario</h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
               <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #55efc4' }}><span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>Stock Disponible</span><strong style={{ display: 'block', fontSize: '1.2rem', color: '#000' }}>{infoStock.cantidad} u.</strong></div>
               <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #74b9ff' }}><span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>Días en Bodega</span><strong style={{ display: 'block', fontSize: '1.2rem', color: '#000' }}>{infoStock.dias} días</strong></div>
               <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #a29bfe' }}><span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>Fecha Ingreso</span><strong style={{ display: 'block', fontSize: '1.1rem', color: '#000' }}>{infoStock.fecha}</strong></div>
               <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #ffeaa7' }}><span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>Precios (Comp/Vent/May)</span><strong style={{ display: 'block', fontSize: '1.1rem', color: '#000' }}>${formData.precio_compra} / ${formData.precio_venta} {formData.permite_al_por_mayor ? `/ $${formData.precio_mayorista}` : ''}</strong></div>
             </div>
           </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          {type === 'productos' ? (
            <>
              {/* --- FORMULARIO DE PRODUCTOS --- */}
              <div className="form-group">
                <label>Nombre del Producto *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChangeProd} placeholder="Ej. Pantalón de Lino" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría Principal *</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <select value={catPadreId} onChange={handlePadreChange} style={{ flexGrow: 1 }}>
                      <option value="">Seleccione...</option>
                      {categorias.filter(c => !c.categoria_padre).map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleNuevoPadre} title="Nueva Categoría" style={{ padding: '0 10px', background: '#74b9ff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                    {catPadreId && (
                      <>
                        <button type="button" onClick={handleEditarPadre} title="Editar Nombre" style={{ padding: '0 8px', background: '#ffeaa7', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️</button>
                        <button type="button" onClick={handleEliminarPadre} title="Eliminar Categoría" style={{ padding: '0 8px', background: '#ff7675', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>❌</button>
                      </>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Subcategoría (Opcional)</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <select value={catSubId} onChange={e => setCatSubId(e.target.value)} disabled={!catPadreId} style={{ flexGrow: 1, backgroundColor: !catPadreId ? '#f1f2f6' : 'white' }}>
                      <option value="">{catPadreId ? 'Seleccione...' : 'Elija principal primero'}</option>
                      {categorias.filter(c => c.categoria_padre === parseInt(catPadreId)).map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleNuevaSub} disabled={!catPadreId} title="Nueva Subcategoría" style={{ padding: '0 10px', background: catPadreId ? '#a29bfe' : '#ccc', border: 'none', borderRadius: '4px', cursor: catPadreId ? 'pointer' : 'not-allowed', color: 'white', fontWeight: 'bold' }}>+</button>
                    {catSubId && (
                      <>
                        <button type="button" onClick={handleEditarSub} title="Editar Nombre" style={{ padding: '0 8px', background: '#ffeaa7', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️</button>
                        <button type="button" onClick={handleEliminarSub} title="Eliminar Subcategoría" style={{ padding: '0 8px', background: '#ff7675', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>❌</button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group"><label>Precio Compra ($) *</label><input type="number" step="0.01" name="precio_compra" value={formData.precio_compra} onChange={handleChangeProd} /></div>
                <div className="form-group"><label>Precio Venta ($) *</label><input type="number" step="0.01" name="precio_venta" value={formData.precio_venta} onChange={handleChangeProd} /></div>
              </div>

              <div className="form-row" style={{ alignItems: 'center', background: '#f5f6fa', padding: '10px', borderRadius: '6px' }}>
                <div className="form-group" style={{ flexDirection: 'row', gap: '10px', marginBottom: 0 }}>
                  <input type="checkbox" name="permite_al_por_mayor" id="mayorista" checked={formData.permite_al_por_mayor} onChange={handleChangeProd} style={{ cursor: 'pointer' }}/>
                  <label htmlFor="mayorista" style={{ marginBottom: 0, cursor: 'pointer' }}>¿Al por mayor?</label>
                </div>
                {formData.permite_al_por_mayor && (
                  <div className="form-group" style={{ marginBottom: 0 }}><input type="number" step="0.01" name="precio_mayorista" value={formData.precio_mayorista} onChange={handleChangeProd} placeholder="Precio Mayorista *" /></div>
                )}
              </div>

              <div className="form-group"><label>Descripción</label><input type="text" name="descripcion" value={formData.descripcion} onChange={handleChangeProd} placeholder="Opcional..." /></div>
              <div className="form-group"><label>Características *</label><input type="text" name="caracteristicas" value={formData.caracteristicas} onChange={handleChangeProd} placeholder="Ej. Talla M, Color Azul..." /></div>

              <div className="form-row">
                <div className="form-group"><label>Stock Inicial {dataAEditar ? '(Ver Dashboard)' : '*'}</label><input type="number" name="stock" value={formData.stock} onChange={handleChangeProd} placeholder="0" disabled={!!dataAEditar} /></div>
                <div className="form-group"><label>Subir Imagen (Opcional)</label><input type="file" name="imagen" accept="image/*" onChange={handleChangeProd} style={{ background: '#ffffff' }} /></div>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', gap: '10px' }}>
                <input type="checkbox" name="estado_disponible" id="estado" checked={formData.estado_disponible} onChange={handleChangeProd} style={{ cursor: 'pointer' }} />
                <label htmlFor="estado" style={{ marginBottom: 0, cursor: 'pointer' }}>Visible al público</label>
              </div>
            </>
          ) : (
            <>
              {/* --- FORMULARIO DE TRABAJADORES --- */}
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de Usuario (Para Iniciar Sesión) *</label>
                  <input type="text" name="username" value={workerData.username} onChange={handleChangeWorker} placeholder="Ej: carlos_ventas" required />
                </div>
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input type="text" name="first_name" value={workerData.first_name} onChange={handleChangeWorker} placeholder="Ej: Carlos Ruiz" />
                </div>
              </div>

              <div className="form-group">
                <label>Correo Electrónico *</label>
                <input type="email" name="email" value={workerData.email} onChange={handleChangeWorker} placeholder="carlos@tienda.com" required />
              </div>

              <div className="form-group">
                <label>Contraseña {dataAEditar && '(Déjalo en blanco si no quieres cambiarla)'}</label>
                <input type="password" name="password" value={workerData.password} onChange={handleChangeWorker} placeholder="********" />
              </div>

              <div className="form-group" style={{ background: '#f5f6fa', padding: '15px', borderRadius: '8px' }}>
                <label style={{ marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Nivel de Acceso (Rol)</label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input type="radio" name="is_superuser" checked={workerData.is_superuser === false} onChange={() => setWorkerData({...workerData, is_superuser: false})} />
                    👤 Vendedor (Puede editar inventario)
                  </label>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#d63031' }}>
                    <input type="radio" name="is_superuser" checked={workerData.is_superuser === true} onChange={() => setWorkerData({...workerData, is_superuser: true})} />
                    💎 Dueño (Acceso total)
                  </label>
                </div>
                <small style={{ color: 'gray', marginTop: '8px', display: 'block' }}>* Los dueños son los únicos que podrán acceder a la pestaña de trabajadores.</small>
              </div>
            </>
          )}

          <footer className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Guardar</button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default AdminModal;