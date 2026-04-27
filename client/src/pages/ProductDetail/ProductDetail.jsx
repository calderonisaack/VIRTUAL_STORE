import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerProductoPorId } from '../../api'; 
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams(); 
  
  const [product, setProduct] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      const datosReales = await obtenerProductoPorId(id);
      setProduct(datosReales);
      setCargando(false);
    };
    cargarProducto();
  }, [id]);

  if (cargando) {
    return (
      <div className="product-detail-page">
        <div className="detail-content-wrapper" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Cargando detalles del producto...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="detail-content-wrapper" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Producto no encontrado</h2>
          <Link to="/" style={{ color: '#74b9ff', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // --- LÓGICA DE WHATSAPP ---
  const NUMERO_VENDEDOR = "593987654321"; // Reemplazar con el número real

  const handleWhatsAppNormal = () => {
    // Hemos quitado el SKU del mensaje de WhatsApp también
    const mensaje = `¡Hola! Me interesa comprar el producto "${product.nombre}" a $${product.precio_venta}.`;
    const url = `https://wa.me/${NUMERO_VENDEDOR}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const handleWhatsAppMayorista = () => {
    const mensaje = `¡Hola! Busco comprar AL POR MAYOR el producto "${product.nombre}". ¿Me ayudas con más información?`;
    const url = `https://wa.me/${NUMERO_VENDEDOR}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  // Preparamos la imagen. Si Django envía un archivo, usamos ese link.
  // Si no hay imagen, usamos la genérica para mantener el diseño.
  const urlImagen = product.imagen ? product.imagen : "https://via.placeholder.com/500?text=Sin+Imagen";

  return (
    <div className="product-detail-page">
      <div className="detail-content-wrapper">
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link> / <span>{product.categoria_nombre || 'General'}</span> / <span>{product.nombre}</span>
        </nav>

        <div className="product-detail-container">
          <div className="product-image-section">
            {/* Dibujamos la imagen asegurando que el CSS original aplique */}
            <img src={urlImagen} alt={product.nombre} />
          </div>

          <div className="product-info-section">
            <span className="product-tag">{product.categoria_nombre || 'General'}</span>
            <h1>{product.nombre}</h1>
            <p className="product-price-large">${product.precio_venta}</p>
            
            {/* --- SECCIÓN DE INFORMACIÓN REDISEÑADA --- */}
            <div className="product-description-box" style={{ marginTop: '20px', marginBottom: '20px' }}>
              
              {/* Mostramos la descripción solo si existe */}
              {product.descripcion && (
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: '#2f3542' }}>Descripción</h3>
                  <p style={{ color: '#57606f', lineHeight: '1.5' }}>{product.descripcion}</p>
                </div>
              )}

              {/* Mostramos las características solo si existen */}
              {product.caracteristicas && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: '#2f3542' }}>Características</h3>
                  <p style={{ color: '#57606f', lineHeight: '1.5' }}>{product.caracteristicas}</p>
                </div>
              )}

              {/* Mensaje de respaldo por si el producto no tiene ni descripción ni características */}
              {!product.descripcion && !product.caracteristicas && (
                 <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Sin detalles adicionales para este producto.</p>
              )}
            </div>

            <div className="purchase-card">
              {/* Hemos eliminado el <div> que mostraba el Código SKU */}
              
              <button 
                className="btn-whatsapp-buy" 
                onClick={handleWhatsAppNormal}
                style={{ marginBottom: product.permite_al_por_mayor ? '15px' : '0' }}
              >
                Comprar por WhatsApp
              </button>

              {product.permite_al_por_mayor && (
                <button 
                  className="btn-whatsapp-buy" 
                  onClick={handleWhatsAppMayorista}
                  style={{ backgroundColor: '#a29bfe', color: 'white' }}
                >
                  🛒 Comprar al por Mayor
                </button>
              )}

              <p className="whatsapp-notice">* Compra segura vía chat directo con nuestros asesores.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;