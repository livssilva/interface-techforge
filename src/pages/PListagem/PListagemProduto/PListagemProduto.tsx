// src/pages/PListagem/PListagemProduto/PListagemProduto.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProdutoRequests } from "../../../fetch/ProdutoRequests";
import type { ProdutoDTO } from "../../../dto/ProdutoDTO";
import "./PListagemProduto.css";

export function PListagemProduto() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  // Estados do Modal de Edição
  const [produtoEditando, setProdutoEditando] = useState<ProdutoDTO | null>(null);
  const [nomeEdit, setNomeEdit] = useState("");
  const [categoriaEdit, setCategoriaEdit] = useState("");
  const [precoEdit, setPrecoEdit] = useState<number | string>("");
  const [quantidadeEdit, setQuantidadeEdit] = useState<number>(0);
  const [salvando, setSalvando] = useState(false);

  const carregarProdutos = async () => {
    setCarregando(true);
    setErro(false);
    try {
      const dados = await ProdutoRequests.listarTodos();

      // Ordena por código/ID crescente para garantir que o cadastro mais recente fique no fim da lista
      const ordenados = [...dados].sort((a, b) => {
        const idA = Number(a.codigo_produto) || 0;
        const idB = Number(b.codigo_produto) || 0;
        return idA - idB;
      });

      setProdutos(ordenados);
    } catch (error) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const formatarPreco = (val: number | string) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const handleAbrirEditar = (prod: ProdutoDTO) => {
    setProdutoEditando(prod);
    setNomeEdit(prod.nome);
    setCategoriaEdit(prod.categoria);
    setPrecoEdit(prod.preco_unitario);
    setQuantidadeEdit(prod.quantidade_disponivel);
  };

  const handleFecharModal = () => {
    setProdutoEditando(null);
    setNomeEdit("");
    setCategoriaEdit("");
    setPrecoEdit("");
    setQuantidadeEdit(0);
  };

  const handleSalvarAtualizacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoEditando) return;

    const codigo = produtoEditando.codigo_produto;
    setSalvando(true);

    try {
      const dadosAtualizados: Partial<ProdutoDTO> = {
        ...produtoEditando,
        nome: nomeEdit,
        categoria: categoriaEdit,
        preco_unitario: Number(precoEdit),
        quantidade_disponivel: Number(quantidadeEdit),
      };

      const sucesso = await ProdutoRequests.atualizar(codigo, dadosAtualizados);

      if (sucesso) {
        setProdutos((prev) =>
          prev.map((p) =>
            p.codigo_produto === codigo
              ? {
                  ...p,
                  nome: nomeEdit,
                  categoria: categoriaEdit,
                  preco_unitario: Number(precoEdit),
                  quantidade_disponivel: Number(quantidadeEdit),
                }
              : p
          )
        );
        handleFecharModal();
      } else {
        alert("Erro ao atualizar o produto.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (codigo: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const sucesso = await ProdutoRequests.deletar(codigo);
      if (sucesso) {
        setProdutos((prev) => prev.filter((p) => p.codigo_produto !== codigo));
      } else {
        alert("Erro ao excluir o produto.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor para exclusão.");
    }
  };

  if (carregando) return <p className="mensagem-status">Carregando produtos...</p>;
  if (erro) return <p className="mensagem-erro">Erro ao conectar com o servidor na porta 3000.</p>;

  return (
    <div className="container-listagem">
      <div className="header-listagem">
        <h2>Catálogo de Produtos</h2>
        <button 
          className="btn-cadastrar" 
          onClick={() => navigate("/cadastro/produto")}
        >
          + Cadastrar Produto
        </button>
      </div>

      {produtos.length === 0 ? (
        <p className="mensagem-status">Nenhum produto registrado.</p>
      ) : (
        <div className="tabela-responsive">
          <table className="tabela-listagem">
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>NOME</th>
                <th>CATEGORIA</th>
                <th>PREÇO</th>
                <th>DISPONÍVEL</th>
                <th>MÍNIMO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((prod, index) => {
                const codigo = prod.codigo_produto;
                const preco = formatarPreco(prod.preco_unitario);

                return (
                  <tr key={codigo || index}>
                    <td>{codigo}</td>
                    <td>{prod.nome}</td>
                    <td>{prod.categoria}</td>
                    <td>R$ {preco}</td>
                    <td>{prod.quantidade_disponivel}</td>
                    <td>{prod.quantidade_minima}</td>
                    <td>
                      <div className="coluna-acoes">
                        <button 
                          className="btn-acao btn-atualizar"
                          onClick={() => handleAbrirEditar(prod)}
                        >
                          Atualizar
                        </button>
                        <button 
                          className="btn-acao btn-deletar"
                          onClick={() => handleDeletar(codigo)}
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Edição */}
      {produtoEditando && (
        <div className="modal-overlay" onClick={handleFecharModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Atualizar Produto #{produtoEditando.codigo_produto}</h3>
              <button className="btn-fechar" onClick={handleFecharModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSalvarAtualizacao}>
              <div className="form-group">
                <label>Nome do Produto:</label>
                <input
                  type="text"
                  value={nomeEdit}
                  onChange={(e) => setNomeEdit(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria:</label>
                <input
                  type="text"
                  value={categoriaEdit}
                  onChange={(e) => setCategoriaEdit(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Preço Unitário (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  value={precoEdit}
                  onChange={(e) => setPrecoEdit(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantidade Disponível:</label>
                <input
                  type="number"
                  value={quantidadeEdit}
                  onChange={(e) => setQuantidadeEdit(Number(e.target.value))}
                  required
                />
              </div>

              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={handleFecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar" disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PListagemProduto;