import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminModal from '../../components/AdminModal/AdminModal';
import './AdminPage.css';

function AdminPage() {
  const [view, setView] = useState('productos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inventory = [
    { id: 1, name: "Smartphone Pro 14", category: "Electrónica", price: 899, stock: 15, status: "Disponible" },
    { id: 2, name: "Audífonos Noise Cancelling", category: "Audio", price: 150, stock: 3, status: "Bajo Stock" },
  ];

  const workers = [
    { id: 1, name: "Juan Pérez", role: "Vendedor", email: "juan@tienda.com", status: "Activo" },
    { id: 2, name: "María López", role: "Administrador", email: "maria@tienda.com", status: "Activo" },
  ];

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <h2>Virtual<span>Admin</span></h2>
        </div>
        <nav className="admin-sidebar__nav">
          <ul>
            <li 
              className={view === 'productos' ? 'active' : ''} 
              onClick={() => setView('productos')}
            >
              📦 Productos
            </li>
            <li 
              className={view === 'trabajadores' ? 'active' : ''} 
              onClick={() => setView('trabajadores')}
            >
              👥 Trabajadores
            </li>
          </ul>
          
          <div className="admin-sidebar__footer">
            <Link to="/" className="btn-exit-admin">
              👁️ Ver Tienda
            </Link>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{view === 'productos' ? 'Gestión de Productos' : 'Gestión de Trabajadores'}</h1>
          <button className="btn-add-main" onClick={() => setIsModalOpen(true)}>
            {view === 'productos' ? '+ Nuevo Producto' : '+ Nuevo Trabajador'}
          </button>
        </header>

        {view === 'productos' ? (
          <section className="admin-inventory">
            <div className="inventory-header">
              <h2>Inventario Actual</h2>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.category}</td>
                      <td>${item.price}</td>
                      <td>{item.stock} u</td>
                      <td><span className={`status-pill ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></td>
                      <td>
                        <button className="btn-edit">✔</button>
                        <button className="btn-delete">❌</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="admin-workers">
            <div className="inventory-header">
              <h2>Equipo de Trabajo</h2>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map(worker => (
                    <tr key={worker.id}>
                      <td><strong>{worker.name}</strong></td>
                      <td>{worker.role}</td>
                      <td>{worker.email}</td>
                      <td><span className="status-pill disponible">{worker.status}</span></td>
                      <td>
                        <button className="btn-edit">✔</button>
                        <button className="btn-delete">❌</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={view} 
      />
    </div>
  );
}

export default AdminPage;