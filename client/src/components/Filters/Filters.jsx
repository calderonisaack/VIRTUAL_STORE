import { useState, useEffect } from 'react';
import { obtenerCategorias } from '../../api';

function Filters({ onFilterChange }) {
  const [categoriasTodas, setCategoriasTodas] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState([]); // Memoria para saber cuáles están abiertas
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  // 1. Al cargar, traemos TODAS las categorías reales de Django
  useEffect(() => {
    obtenerCategorias().then(data => {
      setCategoriasTodas(data);
    });
  }, []);

  // 2. Lógica para marcar/desmarcar casillas
  const handleCategoriaChange = (nombreCategoria) => {
    let nuevasSeleccionadas = [...categoriasSeleccionadas];
    
    if (nuevasSeleccionadas.includes(nombreCategoria)) {
      nuevasSeleccionadas = nuevasSeleccionadas.filter(cat => cat !== nombreCategoria);
    } else {
      nuevasSeleccionadas.push(nombreCategoria);
    }
    
    setCategoriasSeleccionadas(nuevasSeleccionadas);
    if (onFilterChange) onFilterChange({ categorias: nuevasSeleccionadas, precioMin, precioMax });
  };

  // 3. Lógica para Abrir/Cerrar la lista de subcategorías
  const toggleExpandir = (idPadre) => {
    if (categoriasExpandidas.includes(idPadre)) {
      // Si está abierta, la cerramos
      setCategoriasExpandidas(categoriasExpandidas.filter(id => id !== idPadre));
    } else {
      // Si está cerrada, la abrimos
      setCategoriasExpandidas([...categoriasExpandidas, idPadre]);
    }
  };

  // 4. Aplicar Filtro de Precio
  const handlePrecioSubmit = (e) => {
    e.preventDefault();
    if (onFilterChange) onFilterChange({ categorias: categoriasSeleccionadas, precioMin, precioMax });
  };

  // Filtramos solo las categorías principales para construir el menú inicial
  const categoriasPadre = categoriasTodas.filter(c => !c.categoria_padre);

  return (
    <aside className="filters-sidebar">
      <h3 style={{ borderBottom: '2px solid #a29bfe', paddingBottom: '10px', marginBottom: '20px' }}>
        Filtrar por
      </h3>

      {/* --- BLOQUE DE CATEGORÍAS TIPO ACORDEÓN --- */}
      <div className="filter-group" style={{ marginBottom: '25px' }}>
        <h4 style={{ marginBottom: '10px' }}>Categorías</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          
          {categoriasPadre.map(padre => {
            // Buscamos si este padre tiene subcategorías
            const subcategorias = categoriasTodas.filter(c => c.categoria_padre === padre.id);
            const tieneSubcategorias = subcategorias.length > 0;
            const estaAbierta = categoriasExpandidas.includes(padre.id);

            return (
              <li key={padre.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  
                  {/* Casilla de la Categoría Principal */}
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={categoriasSeleccionadas.includes(padre.nombre)}
                      onChange={() => handleCategoriaChange(padre.nombre)}
                    />
                    {padre.nombre}
                  </label>

                  {/* Botón para desplegar solo si tiene subcategorías */}
                  {tieneSubcategorias && (
                    <button 
                      onClick={() => toggleExpandir(padre.id)}
                      style={{ 
                        background: 'none', border: 'none', cursor: 'pointer', 
                        fontSize: '0.8rem', color: '#74b9ff', padding: '0 5px' 
                      }}
                    >
                      {estaAbierta ? '▲' : '▼'}
                    </button>
                  )}
                </div>

                {/* --- LISTA DE SUBCATEGORÍAS (Se muestra si está abierta) --- */}
                {tieneSubcategorias && estaAbierta && (
                  <ul style={{ listStyle: 'none', paddingLeft: '24px', margin: '5px 0 0 0' }}>
                    {subcategorias.map(sub => (
                      <li key={sub.id} style={{ marginBottom: '6px' }}>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#57606f', fontSize: '0.9rem' }}>
                          <input 
                            type="checkbox" 
                            checked={categoriasSeleccionadas.includes(sub.nombre)}
                            onChange={() => handleCategoriaChange(sub.nombre)}
                          />
                          {sub.nombre}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}

        </ul>
      </div>

      {/* --- BLOQUE DE PRECIOS --- */}
      <div className="filter-group" style={{ marginBottom: '25px' }}>
        <h4 style={{ marginBottom: '10px' }}>Precio</h4>
        <form onSubmit={handlePrecioSubmit} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input 
            type="number" 
            placeholder="Mín" 
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Máx" 
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            style={{ padding: '6px 12px', background: '#74b9ff', border: 'none', borderRadius: '4px', color: 'black', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Ir
          </button>
        </form>
      </div>

      {/* --- BLOQUE DE OPINIONES --- */}
      <div className="filter-group">
        <h4 style={{ marginBottom: '10px' }}>Opinión de clientes</h4>
        <div style={{ marginBottom: '5px', cursor: 'pointer' }}>
          <span style={{ color: '#f1c40f' }}>⭐⭐⭐⭐</span>⭐ & más
        </div>
        <div style={{ cursor: 'pointer' }}>
          <span style={{ color: '#f1c40f' }}>⭐⭐⭐</span>⭐⭐ & más
        </div>
        <small style={{ color: '#7f8c8d', display: 'block', marginTop: '10px' }}>
          (Calificaciones en desarrollo)
        </small>
      </div>
    </aside>
  );
}

export default Filters;