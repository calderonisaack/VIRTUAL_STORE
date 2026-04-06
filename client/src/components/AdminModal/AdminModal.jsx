import './AdminModal.css';

function AdminModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h2>{type === 'productos' ? 'Añadir Nuevo Producto' : 'Registrar Trabajador'}</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </header>

        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          {type === 'productos' ? (
            <>
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input type="text" placeholder="Ej. iPhone 15 Pro" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio ($)</label>
                  <input type="number" placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Stock Inicial</label>
                  <input type="number" placeholder="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select>
                  <option>Case</option>
                  <option>Audifonos</option>
                    <option>Cargadores</option>
                  <option>Accesorios</option>
                </select>
              </div>
              <div className="form-group">
                <label>Imagen (URL)</label>
                <input type="text" placeholder="https://link-de-la-imagen.com" />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" placeholder="Ej. Carlos Ruiz" />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input type="email" placeholder="carlos@tienda.com" />
              </div>
              <div className="form-group">
                <label>Rol en la Empresa</label>
                <select>
                  <option>Vendedor</option>
                  <option>Administrador</option>
                  <option>Inventario</option>
                </select>
              </div>
            </>
          )}

          <footer className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Guardar Cambios</button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default AdminModal;