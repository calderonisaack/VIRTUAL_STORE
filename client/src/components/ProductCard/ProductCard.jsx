import { Link } from 'react-router-dom';
import './ProductCard.css';

// Ahora recibimos el objeto 'producto' completo desde HomePage
function ProductCard({ producto }) {
  // Extraemos los campos exactos tal como los definiste en models.py
  const { id, nombre, precio_venta, imagen, permite_al_por_mayor } = producto;

  // Si en Django no subiste foto, ponemos esta de relleno para que el diseño no se rompa
  const urlImagen = imagen ? imagen : "https://via.placeholder.com/200?text=Sin+Imagen";

  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-card__image">
          <img src={urlImagen} alt={nombre} />
        </div>
        
        <div className="product-card__info">
          <h3>{nombre}</h3>
          
          <div className="product-card__rating">
            {/* Dejamos las estrellas estáticas por ahora para no perder el diseño */}
            ⭐⭐⭐⭐⭐ 
          </div>
          
          {/* Pequeño aviso visual para los clientes mayoristas */}
          {permite_al_por_mayor && (
             <span style={{ fontSize: '0.75rem', backgroundColor: '#a29bfe', color: 'white', padding: '2px 6px', borderRadius: '4px', marginBottom: '8px', display: 'inline-block' }}>
                Venta al por mayor disponible
             </span>
          )}
          
          <div className="product-card__price-section">
            <span className="current-price">${precio_venta}</span>
          </div>
          
          <button className="btn-view-more">Ver detalles</button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;