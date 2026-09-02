import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProdutoRequests } from "../../../fetch/ProdutoRequests";
import type { ProdutoDTO } from "../../../dto/ProdutoDTO";
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
        <p className="mensagem-status">Nenhum produto cadastrado.</p>
      ) : (
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Estoque</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((prod: any, index) => (
              <tr key={prod.id || prod.codigo_produto || index}>
                <td>{prod.id ?? prod.codigo_produto ?? "-"}</td>
                <td>{prod.nome}</td>
                <td>{prod.categoriaId ?? prod.categoria ?? "-"}</td>
                <td>{prod.quantidadeEstoque ?? prod.quantidade ?? 0}</td>
                <td>R$ {formatarPreco(prod.preco ?? prod.preco_unitario)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PListagemProduto;