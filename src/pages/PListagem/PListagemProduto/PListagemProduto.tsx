// src/pages/PListagem/PListagemProduto/PListagemProduto.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProdutoRequests } from "../../../fetch/ProdutoRequests";
import type {ProdutoDTO} from "../../../dto/ProdutoDTO";
import "./PListagemProduto.css";

export function PListagemProduto() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  const carregarProdutos = async () => {
    setCarregando(true);
    setErro(false);
    try {
      const dados = await ProdutoRequests.listarTodos();
      console.log("Dados recebidos da API /produtos:", dados);
      setProdutos(dados);
    } catch (error) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const formatarPreco = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const handleEditar = (id: number | string) => {
    navigate(`/cadastro/produto?id=${id}`);
  };

  const handleDeletar = async (id: number | string) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const sucesso = await ProdutoRequests.deletar(id);

      if (sucesso) {
        setProdutos((prev) =>
          prev.filter((p: any) => (p.id_produto ?? p.id) !== id)
        );
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
                <th>ID PRODUTO</th>
                <th>NOME</th>
                <th>CATEGORIA</th>
                <th>PREÇO</th>
                <th>ESTOQUE</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((prod: any, index) => {
                const idProd = prod.id_produto ?? prod.id ?? prod.idProduto ?? "-";
                const nome = prod.nome_produto ?? prod.nome ?? "-";
                const categoria = prod.categoria_nome ?? prod.categoria ?? prod.id_categoria ?? "-";
                const preco = formatarPreco(prod.preco_unitario ?? prod.preco ?? 0);
                const estoque = prod.quantidade_estoque ?? prod.estoque ?? prod.quantidade ?? 0;

                return (
                  <tr key={idProd !== "-" ? idProd : index}>
                    <td>{idProd}</td>
                    <td>{nome}</td>
                    <td>{categoria}</td>
                    <td>R$ {preco}</td>
                    <td>{estoque}</td>
                    <td>
                      <div className="coluna-acoes">
                        <button 
                          className="btn-acao btn-atualizar"
                          onClick={() => handleEditar(idProd)}
                        >
                          Atualizar
                        </button>
                        <button 
                          className="btn-acao btn-deletar"
                          onClick={() => handleDeletar(idProd)}
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
    </div>
  );
}

export default PListagemProduto;