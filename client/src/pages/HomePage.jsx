import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Filters from '../components/Filters/Filters';
import ProductCard from '../components/ProductCard/ProductCard';
import Pagination from '../components/Pagination/Pagination';
import Footer from '../components/Footer/Footer';
import './HomePage.css';

function HomePage() {
  const products = [
    { id: 1, name: "Smartphone Pro 14 - 256GB", price: 899, oldPrice: 999, rating: 5, image: "https://via.placeholder.com/200" },
    { id: 2, name: "Audífonos Noise Cancelling", price: 150, rating: 4, image: "https://via.placeholder.com/200" },
    { id: 3, name: "Reloj Inteligente Sport v2", price: 199, oldPrice: 250, rating: 4, image: "https://via.placeholder.com/200" },
    { id: 4, name: "Laptop Ultrabook 13\"", price: 1200, rating: 5, image: "https://via.placeholder.com/200" },
    { id: 5, name: "Teclado Mecánico RGB", price: 75, oldPrice: 95, rating: 4, image: "https://via.placeholder.com/200" },
    { id: 6, name: "Mouse Gamer Ergonómico", price: 45, rating: 5, image: "https://via.placeholder.com/200" },
  ];

  return (
    <div className="home-page">
      <Header />
      <Hero />
      
      <div className="main-layout">
        <Filters />
        
        <section className="products-section">
          <div className="products-header">
            <span>Mostrando {products.length} productos</span>
            <select className="sort-select">
              <option>Ordenar por: Destacados</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
            </select>
          </div>

          <div className="products-grid">
            {products.map(prod => (
              <ProductCard key={prod.id} {...prod} />
            ))}
          </div>

          <Pagination />
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;