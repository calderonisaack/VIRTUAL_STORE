import './Hero.css';
import heroImg from '../../assets/spider.png'; 

function Hero() {
  return (
    <div className="hero">
      <div className="hero__overlay">
        {}
        <div className="hero__image" style={{ backgroundImage: `url(${heroImg})` }}></div>
      </div>
      
      <div className="hero__container">
        <div className="hero__content">
          <h1>Las Mejores Ofertas<br />están en <span>Virtual Store</span></h1>
          <p>Encuentra tecnología,mucho más con precios increíbles.</p>
          <button className="hero__btn">Ver Novedades</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;