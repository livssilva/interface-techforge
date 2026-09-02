import { Link } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <span className="navbar-logo">
          💻 TechForge
        </span>
        <Link to="/" className="navbar-link">
          Início
        </Link>
        <Link to="/produtos" className="navbar-link">
          Produtos
        </Link>
        <Link to="/categorias" className="navbar-link">
          Categorias
        </Link>
        <Link to="/movimentacoes" className="navbar-link">
          Movimentações
        </Link>
      </div>

      <div className="navbar-right">
        <button className="btn-entrar">Entrar</button>
      </div>
    </header>
  );
}

export default Navbar;