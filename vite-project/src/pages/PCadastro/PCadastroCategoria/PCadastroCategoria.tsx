import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoriaRequests } from "../../../fetch/CategoriaRequests";
import "../PCadastroProduto/PCadastroProduto.css";

const OPCOES_CATEGORIAS = [
  "Periféricos",
  "Hardware",
  "Monitores",
  "Armazenamento",
  "Acessórios",
  "Redes",
  "Cadeiras Gamer",
  "Áudio"
];

export function PCadastroCategoria() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  
  // Estado para controlar o sucesso do cadastro
  const [cadastradoComSucesso, setCadastradoComSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nome) {
      alert("Por favor, selecione ou digite o nome da categoria.");
      return;
    }

    setCarregando(true);

    const novaCategoria: any = {
      nome
    };

    const sucesso = await CategoriaRequests.cadastrar(novaCategoria);

    setCarregando(false);

    if (sucesso) {
      setCadastradoComSucesso(true);
    } else {
      alert("Erro ao cadastrar categoria. Tente novamente.");
    }
  };

  return (
    <main className="cadastro-container">
      <div className="cadastro-card">
        {cadastradoComSucesso ? (
          /* Tela exibida APÓS o cadastro com sucesso */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h2 style={{ color: "#34d399", marginBottom: "12px" }}>
              ✓ Categoria Cadastrada com Sucesso!
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
              A categoria foi adicionada ao seu banco de dados.
            </p>
            
            <button 
              onClick={() => navigate("/categorias")} 
              className="btn-salvar"
              style={{ width: "100%", cursor: "pointer" }}
            >
              ← Voltar para a Listagem de Categorias
            </button>
          </div>
        ) : (
          /* Formulário de Cadastro */
          <>
            <Link to="/categorias" style={{ color: "#38bdf8", textDecoration: "none" }}>
              ← Voltar para Listagem
            </Link>
            <h2 style={{ margin: "16px 0" }}>Cadastrar Nova Categoria</h2>

            <form onSubmit={handleSubmit} className="cadastro-form">
              <div className="form-group">
                <label>Selecione a Categoria:</label>
                <select 
                  required 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)}
                >
                  <option value="">-- Escolha uma categoria --</option>
                  {OPCOES_CATEGORIAS.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-salvar" disabled={carregando}>
                {carregando ? "Cadastrando..." : "Cadastrar Categoria"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default PCadastroCategoria;