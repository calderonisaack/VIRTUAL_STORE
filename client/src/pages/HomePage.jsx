import { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Filters from '../components/Filters/Filters';
import ProductCard from '../components/ProductCard/ProductCard';
import Pagination from '../components/Pagination/Pagination';
import Footer from '../components/Footer/Footer';
import { obtenerProductos } from '../api'; 
import './HomePage.css'; 

function HomePage() {
  // Memoria original: Todos los productos como vienen de Django (Nunca se borra)
  const [products, setProducts] = useState([]);
  
  // Memoria temporal: Los productos que se muestran en pantalla tras aplicar los filtros
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Al cargar la página, traemos los datos
  useEffect(() => {
    const cargarInventario = async () => {
      const datosReales = await obtenerProductos();
      // Solo mostramos los productos que están marcados como "Disponibles al público"
      const disponibles = datosReales.filter(p => p.estado_disponible !== false);
      
      setProducts(disponibles);
      setProductosFiltrados(disponibles); // Al inicio, se muestran todos
      setCargando(false);
    };
    
    cargarInventario();
  }, []);

  // --- EL CEREBRO DE LOS FILTROS ---
  // Esta función es llamada por Filters.jsx cada vez que haces clic en algo allá
  const aplicarFiltros = (reglas) => {
    let resultado = [...products];

    // 1. Filtrar por Categoría (Revisa si la palabra principal o la subcategoría coinciden)
    if (reglas.categorias && reglas.categorias.length > 0) {
      resultado = resultado.filter(prod => {
        // Obtenemos el nombre completo de la categoría del producto (Ej: "Ropa de Hombre > Pantalón")
        const catProducto = prod.categoria_nombre || "";
        
        // El producto sobrevive si su categoría incluye el nombre de alguna de las categorías seleccionadas
        return reglas.categorias.some(catSeleccionada => catProducto.includes(catSeleccionada));
      });
    }

    // 2. Filtrar por Precio Mínimo
    if (reglas.precioMin !== '') {
      const min = parseFloat(reglas.precioMin);
      resultado = resultado.filter(prod => parseFloat(prod.precio_venta) >= min);
    }

    // 3. Filtrar por Precio Máximo
    if (reglas.precioMax !== '') {
      const max = parseFloat(reglas.precioMax);
      resultado = resultado.filter(prod => parseFloat(prod.precio_venta) <= max);
    }

    // Actualizamos la pantalla con el nuevo resultado
    setProductosFiltrados(resultado);
  };

  return (
    <div className="home-page">
      <Hero />
      
      <div className="main-layout">
        
        {/* Le pasamos a los filtros la capacidad de hablar con nuestra función aplicarFiltros */}
        <Filters onFilterChange={aplicarFiltros} />
        
        <section className="products-section">
          <div className="products-header">
            {/* Mostramos la cantidad de productos filtrados, no el total */}
            <span>Mostrando {productosFiltrados.length} productos</span>
            <select className="sort-select">
              <option>Ordenar por: Destacados</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
            </select>
          </div>

          <div className="products-grid">
            {cargando ? (
              <h3>Cargando el inventario desde la base de datos...</h3>
            ) : productosFiltrados.length > 0 ? (
              // Ahora mapeamos "productosFiltrados", no "products"
              productosFiltrados.map(prod => (
                <ProductCard key={prod.id} producto={prod} />
              ))
            ) : (
              <h3 style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }}>
                No se encontraron productos con esos filtros.
              </h3>
            )}
          </div>

          <Pagination />
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;