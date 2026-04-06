import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();

  const product = {
    id: id,
    name: "Smartphone Pro 14",
    price: 899.99,
    description: "Pantalla Super Retina XDR de 6.1 pulgadas. Sistema de cámara avanzada para mejores fotos con cualquier luz. Modo Cine ahora en 4K Dolby Vision hasta 30 fps.",
    image: "https://via.placeholder.com/500",
    stock: 10,
    category: "Electrónica"
  };

  const handleWhatsApp = () => {
    const telefono = "593987654321";
    const mensaje = `¡Hola! Me interesa el producto "${product.name}"...`;
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="product-detail-page">
      <div className="detail-content-wrapper">
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link> / <Link to="/">{product.category}</Link> / <span>{product.name}</span>
        </nav>

        <div className="product-detail-container">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-info-section">
            <span className="product-tag">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="product-price-large">${product.price}</p>
            
            <div className="product-description-box">
              <h3>Sobre este artículo</h3>
              <p>{product.description}</p>
            </div>

            <div className="purchase-card">
              <div className="product-stock-status">
                <span className="stock-dot"></span>
                Disponible: {product.stock} unidades
              </div>
              <button className="btn-whatsapp-buy" onClick={handleWhatsApp}>
                Pedir por WhatsApp
              </button>
              <p className="whatsapp-notice">* Compra segura vía chat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;