import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ id, name, price, oldPrice, rating, image }) {
  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-card__image">
          <img src={image} alt={name} />
        </div>
        
        <div className="product-card__info">
          <h3>{name}</h3>
          
          <div className="product-card__rating">
            {"⭐".repeat(rating)}
          </div>
          
          <div className="product-card__price-section">
            <span className="current-price">${price}</span>
            {oldPrice && <span className="old-price">${oldPrice}</span>}
          </div>
          
          <button className="btn-view-more">Ver detalles</button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;