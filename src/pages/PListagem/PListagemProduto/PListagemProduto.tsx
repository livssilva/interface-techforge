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
              <th>ID Produto</th>
              <th>ID Categoria</th>
              <th>Código</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço Unitário</th>
              <th>Qtd. Disponível</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((prod: any, index) => {
              const idProduto = prod.id_produto ?? prod.id ?? "-";
              const idCategoria = prod.id_categoria ?? prod.categoriaId ?? prod.categoria_id ?? "-";
              const codigo = prod.codigo ?? prod.codigo_produto ?? "-";
              const nome = prod.nome ?? "-";
              const descricao = prod.descricao ?? "-";
              const preco = formatarPreco(prod.preco_unitario ?? prod.preco);
              const qtdDisponivel = prod.quantidade_disponivel ?? prod.quantidadeEstoque ?? prod.quantidade ?? 0;

              return (
                <tr key={idProduto !== "-" ? idProduto : index}>
                  <td>{idProduto}</td>
                  <td>{idCategoria}</td>
                  <td>{codigo}</td>
                  <td>{nome}</td>
                  <td>{descricao}</td>
                  <td>R$ {preco}</td>
                  <td>{qtdDisponivel}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PListagemProduto;