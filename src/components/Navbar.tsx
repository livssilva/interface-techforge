import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Middleware/AuthMiddleware"; // Importa a autenticação
import "./Navbar.css";

export function Navbar() {
  const { autenticado, logout } = useAuth();
  const navigate = useNavigate();

  const handleSair = () => {
    logout(); // Encerra a sessão
    navigate("/"); // Redireciona para a tela inicial/welcome
  };

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <span className="navbar-logo">
          💻 TechForge
        </span>
        <Link to="/home" className="navbar-link">
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
        {autenticado && (
          <button className="btn-entrar" onClick={handleSair}>
            Sair
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;