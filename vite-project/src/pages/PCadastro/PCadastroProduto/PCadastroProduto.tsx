// src/pages/PCadastro/PCadastroProduto/PCadastroProduto.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProdutoRequests } from "../../../fetch/ProdutoRequests";
import "./PCadastroProduto.css";

const OPCOES_PRODUTOS = [
  "Teclado Mecânico",
  "Mouse Gamer",
  "Monitor 24\"",
  "Headset Stereo",
  "Gabinete ATX",
  "Placa de Vídeo",
  "Memória RAM 16GB",
  "SSD 1TB"
];

const OPCOES_CATEGORIAS = [
  "Periféricos",
  "Hardware",
  "Monitores",
  "Armazenamento",
  "Acessórios"
];

export function PCadastroProduto() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  
  // Estado para controlar o sucesso do cadastro
  const [cadastradoComSucesso, setCadastradoComSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nome || !categoria) {
      alert("Por favor, selecione o produto e a categoria.");
      return;
    }

    setCarregando(true);

    const novoProduto: any = {
      nome,
      categoria,
      preco_unitario: Number(precoUnitario)
    };

    const sucesso = await ProdutoRequests.cadastrar(novoProduto);

    setCarregando(false);

    if (sucesso) {
      setCadastradoComSucesso(true);
    } else {
      alert("Erro ao cadastrar produto. Tente novamente.");
    }
  };

  return (
    <main className="cadastro-container">
      <div className="cadastro-card">
        {cadastradoComSucesso ? (
          /* Tela exibida APÓS o cadastro com sucesso */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h2 style={{ color: "#34d399", marginBottom: "12px" }}>
              ✓ Produto Cadastrado com Sucesso!
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
              O item foi adicionado ao seu banco de dados.
            </p>
            
            <button 
              onClick={() => navigate("/produtos")} 
              className="btn-salvar"
              style={{ width: "100%", cursor: "pointer" }}
            >
              ← Voltar para a Listagem de Produtos
            </button>
          </div>
        ) : (
          /* Formulário de Cadastro */
          <>
            <Link to="/produtos" style={{ color: "#38bdf8", textDecoration: "none" }}>
              ← Voltar para Listagem
            </Link>
            <h2 style={{ margin: "16px 0" }}>Cadastrar Novo Produto</h2>

            <form onSubmit={handleSubmit} className="cadastro-form">
              <div className="form-group">
                <label>Selecione o Produto:</label>
                <select 
                  required 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)}
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
                <label>Selecione a Categoria:</label>
                <select 
                  required 
                  value={categoria} 
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">-- Escolha uma categoria --</option>
                  {OPCOES_CATEGORIAS.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Preço Unitário (R$):</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={precoUnitario} 
                  onChange={(e) => setPrecoUnitario(e.target.value)} 
                  placeholder="0.00"
                />
              </div>

              <button type="submit" className="btn-salvar" disabled={carregando}>
                {carregando ? "Cadastrando..." : "Cadastrar Produto"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default PCadastroProduto;