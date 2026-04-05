import './Filters.css';

function Filters() {
  return (
    <aside className="filters">
      <h3 className="filters__title">Filtrar por</h3>
      
      <div className="filters__group">
        <h4>Categorías</h4>
        <ul>
          <li><input type="checkbox" id="cat1" /> <label htmlFor="cat1">Case</label></li>
          <li><input type="checkbox" id="cat2" /> <label htmlFor="cat2">Cargadores</label></li>
          <li><input type="checkbox" id="cat3" /> <label htmlFor="cat3">Audifonos</label></li>
          <li><input type="checkbox" id="cat4" /> <label htmlFor="cat4">Accesorios</label></li>
        </ul>
      </div>

      <div className="filters__group">
        <h4>Precio</h4>
        <div className="filters__price">
          <input type="number" placeholder="Mín" />
          <span>-</span>
          <input type="number" placeholder="Máx" />
          <button type="button">Ir</button>
        </div>
      </div>

      <div className="filters__group">
        <h4>Opinión de clientes</h4>
        <ul className="filters__rating">
          <li>⭐⭐⭐⭐ & más</li>
          <li>⭐⭐⭐ & más</li>
        </ul>
      </div>
    </aside>
  );
}

export default Filters;