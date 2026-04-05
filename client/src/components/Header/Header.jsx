import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <h2>Virtual<span>Store</span></h2>
      </div>
      
      <div className="header__search">
        <input type="text" placeholder="Busca productos, marcas y más..." />
        <button type="button">Buscar</button>
      </div>

      <nav className="header__nav">
        <div className="header__cart">
          <span>🛒</span>
          <span className="cart-count">0</span>
        </div>
        <button className="header__login">Iniciar Sesión</button>
      </nav>
    </header>
  );
}

export default Header;