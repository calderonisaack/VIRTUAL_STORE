import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top" onClick={() => window.scrollTo(0,0)}>
        Volver arriba
      </div>
      <div className="footer__content">
        <div className="footer__section">
          <h4>Conócenos</h4>
          <ul>
            <li>Sobre Virtual Store</li>
            <li>Trabaja con nosotros</li>
            <li>Blog</li>
          </ul>
        </div>
        <div className="footer__section">
          <h4>Ayuda</h4>
          <ul>
            <li>Tu Cuenta</li>
            <li>Mis Pedidos</li>
          </ul>
        </div>
        <div className="footer__section">
          <h4>Contacto</h4>
          <p>📧 VirtualStore@gmail.com</p>
          <p>📞 +0999999999</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2026 Virtual Store - Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;