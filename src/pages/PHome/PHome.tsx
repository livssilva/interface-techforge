import { Link } from "react-router-dom";
import "./PHome.css";

export function PHome() {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Sistema de <span className="home-highlight">Produtos</span>
      </h1>
      <p className="home-subtitle">
        Bem-vindo ao painel de gerenciamento do catálogo.
      </p>
      <Link to="/produtos" className="home-btn">
        Clique aqui para acessar a listagem de produtos
      </Link>
    </div>
  );
}

export default PHome;