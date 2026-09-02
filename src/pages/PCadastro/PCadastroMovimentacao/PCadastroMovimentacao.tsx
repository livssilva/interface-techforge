import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MovimentacaoRequests } from "../../../fetch/MovimentacaoRequests";
import "./PCadastroMovimentacao.css";

export function PCadastroMovimentacao() {
  const navigate = useNavigate();
  const [idProduto, setIdProduto] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  
  // Estado para controlar o sucesso do cadastro
  const [cadastradoComSucesso, setCadastradoComSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!idProduto || !quantidade) {
      alert("Por favor, preencha o ID do produto e a quantidade.");
      return;
    }

    setCarregando(true);

    const novaMovimentacao: any = {
      id_produto: Number(idProduto),
      tipo,
      quantidade: Number(quantidade),
      observacao
    };

    const sucesso = await MovimentacaoRequests.cadastrar(novaMovimentacao);

    setCarregando(false);

    if (sucesso) {
      setCadastradoComSucesso(true);
    } else {
      alert("Erro ao cadastrar movimentação. Tente novamente.");
    }
  };

  return (
    <main className="cadastro-container">
      <div className="cadastro-card">
        {cadastradoComSucesso ? (
          /* Tela exibida APÓS o cadastro com sucesso */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h2 style={{ color: "#34d399", marginBottom: "12px" }}>
              ✓ Movimentação Registrada com Sucesso!
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
              A movimentação de estoque foi atualizada no banco de dados.
            </p>
            
            <button 
              onClick={() => navigate("/movimentacoes")} 
              className="btn-salvar"
              style={{ width: "100%", cursor: "pointer" }}
            >
              ← Voltar para o Histórico de Movimentações
            </button>
          </div>
        ) : (
          /* Formulário de Cadastro */
          <>
            <Link to="/movimentacoes" style={{ color: "#38bdf8", textDecoration: "none" }}>
              ← Voltar para Histórico
            </Link>
            <h2 style={{ margin: "16px 0" }}>Cadastrar Nova Movimentação</h2>

            <form onSubmit={handleSubmit} className="cadastro-form">
              <div className="form-group">
                <label>ID do Produto:</label>
                <input 
                  type="number"
                  required 
                  value={idProduto} 
                  onChange={(e) => setIdProduto(e.target.value)}
                  placeholder="Ex: 1"
                />
              </div>

              <div className="form-group">
                <label>Tipo de Movimentação:</label>
                <select 
                  required 
                  value={tipo} 
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="ENTRADA">ENTRADA</option>
                  <option value="SAIDA">SAÍDA</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantidade:</label>
                <input 
                  type="number" 
                  min="1"
                  required 
                  value={quantidade} 
                  onChange={(e) => setQuantidade(e.target.value)} 
                  placeholder="Quantidade de itens"
                />
              </div>

              <div className="form-group">
                <label>Observação (Opcional):</label>
                <input 
                  type="text" 
                  value={observacao} 
                  onChange={(e) => setObservacao(e.target.value)} 
                  placeholder="Ex: Nota fiscal Nº 1234 / Ajuste de inventário"
                />
              </div>

              <button type="submit" className="btn-salvar" disabled={carregando}>
                {carregando ? "Cadastrando..." : "Registrar Movimentação"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default PCadastroMovimentacao;