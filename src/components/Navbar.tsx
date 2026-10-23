import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Middleware/AuthMiddleware";
import { Menu, X, LogOut } from "lucide-react";
import "./Navbar.css";

export function Navbar() {
  const { autenticado, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSair = () => {
    setMenuAberto(false);
    logout();
    navigate("/");
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-header-main">
        <Link to="/home" className="navbar-logo" onClick={fecharMenu}>
          💻 TechForge
        </Link>

        <button
          type="button"
          className="navbar-toggle-btn"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav className={`navbar-menu ${menuAberto ? "aberto" : ""}`}>
        <div className="navbar-links-group">
          <Link
            to="/home"
            className={`navbar-link ${location.pathname === "/home" ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            Início
          </Link>
          <Link
            to="/produtos"
            className={`navbar-link ${location.pathname.includes("produto") ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            Produtos
          </Link>
          <Link
            to="/categorias"
            className={`navbar-link ${location.pathname.includes("categoria") ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            Categorias
          </Link>
          <Link
            to="/movimentacoes"
            className={`navbar-link ${location.pathname.includes("movimentac") ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            Movimentações
          </Link>
        </div>

        {autenticado && (
          <div className="navbar-actions">
            <button className="btn-entrar" onClick={handleSair}>
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
