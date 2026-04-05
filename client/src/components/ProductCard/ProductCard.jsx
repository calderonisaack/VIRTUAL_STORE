import './ProductCard.css';

function ProductCard({ image, name, price, oldPrice, rating }) {
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  return (
    <div className="product-card">
      {discount && <span className="product-card__badge">-{discount}%</span>}
      
      <div className="product-card__image">
        <img src={image} alt={name} />
      </div>

      <div className="product-card__info">
        <h3 className="product-card__name">{name}</h3>
        <div className="product-card__rating">
          {"⭐".repeat(rating)}
          <span className="rating-count">(120)</span>
        </div>
        
        <div className="product-card__price-container">
          <span className="product-card__price">${price}</span>
          {oldPrice && <span className="product-card__old-price">${oldPrice}</span>}
        </div>

        <button className="product-card__btn">Agregar al carrito</button>
      </div>
    </div>
  );
}

export default ProductCard;