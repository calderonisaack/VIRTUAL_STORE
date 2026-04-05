import './Pagination.css';

function Pagination() {
  return (
    <div className="pagination">
      <button className="pagination__btn" disabled>Anterior</button>
      <div className="pagination__numbers">
        <button className="pagination__num active">1</button>
        <button className="pagination__num">2</button>
        <button className="pagination__num">3</button>
        <span>...</span>
        <button className="pagination__num">10</button>
      </div>
      <button className="pagination__btn">Siguiente</button>
    </div>
  );
}

export default Pagination;