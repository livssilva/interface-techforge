import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MovimentacaoRequests } from "../../../fetch/MovimentacaoRequests";
import "../PCadastroProduto/PCadastroProduto.css";

const OPCOES_TIPO = [
  "Entrada",
  "Saída"
];

const OPCOES_PRODUTOS = [
  "Teclado Mecânico RGB",
  "Mouse Sem Fio 16000 DPI",
  "Monitor 24\" 144Hz",
  "SSD NVMe 1TB",
  "Headset 7.1 Surround",
  "Cadeira Gamer Ergonomica"
];

export function PCadastroMovimentacao() {
  const navigate = useNavigate();
  const [produtoId, setProdutoId] = useState("");
  const [tipo, setTipo] = useState("");
  const [quantidade, setQuantidade] = useState<number | "">(1);
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [observacao, setObservacao] = useState("");
  
  // Estado para controlar o sucesso do cadastro
  const [cadastradoComSucesso, setCadastradoComSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!produtoId || !tipo || !quantidade || Number(quantidade) <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    setCarregando(true);

    const novaMovimentacao: any = {
      produtoId,
      tipo,
      quantidade: Number(quantidade),
      data,
      observacao
    };

    const sucesso = await MovimentacaoRequests.cadastrar(novaMovimentacao);

    setCarregando(false);

    if (sucesso) {
      setCadastradoComSucesso(true);
    } else {
      alert("Erro ao registrar movimentação. Tente novamente.");
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
              A movimentação foi adicionada ao seu banco de dados.
            </p>
            
            <button 
              onClick={() => navigate("/movimentacoes")} 
              className="btn-salvar"
              style={{ width: "100%", cursor: "pointer" }}
            >
              ← Voltar para a Listagem de Movimentações
            </button>
          </div>
        ) : (
          /* Formulário de Cadastro */
          <>
            <Link to="/movimentacoes" style={{ color: "#38bdf8", textDecoration: "none" }}>
              ← Voltar para Listagem
            </Link>
            <h2 style={{ margin: "16px 0" }}>Registrar Movimentação</h2>

            <form onSubmit={handleSubmit} className="cadastro-form">
              <div className="form-group">
                <label>Selecione o Produto:</label>
                <select 
                  required 
                  value={produtoId} 
                  onChange={(e) => setProdutoId(e.target.value)}
                >
                  <option value="">-- Escolha um produto --</option>
                  {OPCOES_PRODUTOS.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Movimentação:</label>
                <select 
                  required 
                  value={tipo} 
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="">-- Escolha o tipo --</option>
                  {OPCOES_TIPO.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantidade:</label>
                <input 
                  type="number"
                  min="1"
                  required
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Data:</label>
                <input 
                  type="date"
                  required
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Observação:</label>
                <textarea 
                  rows={3}
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: Motivo da saída/entrada..."
                />
              </div>

              <button type="submit" className="btn-salvar" disabled={carregando}>
                {carregando ? "Registrando..." : "Registrar Movimentação"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default PCadastroMovimentacao;