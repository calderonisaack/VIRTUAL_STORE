import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2>Virtual<span>Store</span></h2>
      </Link>
      
      <div className="header__search">
        <input type="text" placeholder="Busca productos, marcas y más..." />
        <button type="button">Buscar</button>
      </div>

      <nav className="header__nav">
        <div className="header__cart">
          <span>🛒</span>
          <span className="cart-count">0</span>
        </div>

        <Link to="/admin" className="header__login" style={{ textDecoration: 'none' }}>
          Panel Admin
        </Link>
      </nav>
    </header>
  );
}

export default Header;