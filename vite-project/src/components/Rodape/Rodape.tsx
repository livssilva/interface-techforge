import "./Rodape.css";

export function Rodape() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <span className="footer-title">TechForge</span>
        <p className="footer-text">
          Sistema Integrado de Gestão de Estoque e Movimentações
        </p>
        <p className="footer-copy">
          &copy; {anoAtual} TechForge. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Rodape;