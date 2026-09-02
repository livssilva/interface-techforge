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
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((prod) => (
              <tr key={prod.codigo_produto}>
                <td>{prod.codigo_produto ?? "-"}</td>
                <td>{prod.nome}</td>
                <td>{prod.categoria}</td>
                <td>R$ {Number(prod.preco_unitario).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PListagemProduto;