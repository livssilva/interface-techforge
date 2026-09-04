import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovimentacaoRequests } from "../../../fetch/MovimentacaoRequests";
import type MovimentacaoDTO from "../../../dto/MovimentacaoDTO";
import "./PListagemMovimentacao.css";

export function PListagemMovimentacao() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  const carregarMovimentacoes = async () => {
    setCarregando(true);
    setErro(false);
    try {
      const dados = await MovimentacaoRequests.listarTodas();
      console.log("Dados recebidos da API /movimentacoes:", dados);
      setMovimentacoes(dados);
    } catch (error) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMovimentacoes();
  }, []);

  const formatarData = (dataRaw: any) => {
    if (!dataRaw) return "-";
    const data = new Date(dataRaw);
    return isNaN(data.getTime()) ? "-" : data.toLocaleDateString("pt-BR");
  };

  const formatarPreco = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const handleEditar = (id: number | string) => {
    navigate(`/cadastro/movimentacao?id=${id}`);
  };

  const handleDeletar = async (id: number | string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta movimentação?")) return;

    try {
      const sucesso = await MovimentacaoRequests.deletar(id);

      if (sucesso) {
        setMovimentacoes((prev) =>
          prev.filter((m: any) => (m.id_movimentacao ?? m.id) !== id)
        );
      } else {
        alert("Erro ao excluir a movimentação.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor para exclusão.");
    }
  };

  if (carregando) return <p className="mensagem-status">Carregando movimentações...</p>;
  if (erro) return <p className="mensagem-erro">Erro ao conectar com o servidor na porta 3000.</p>;

  return (
    <div className="container-listagem">
      <div className="header-listagem">
        <h2>Histórico de Movimentações</h2>
        <button 
          className="btn-cadastrar" 
          onClick={() => navigate("/cadastro/movimentacao")}
        >
          + Cadastrar Movimentação
        </button>
      </div>

      {movimentacoes.length === 0 ? (
        <p className="mensagem-status">Nenhuma movimentação registrada.</p>
      ) : (
        <div className="tabela-responsive">
          <table className="tabela-movimentacoes">
            <thead>
              <tr>
                <th>ID MOVIMENTAÇÃO</th>
                <th>ID PRODUTO</th>
                <th>TIPO</th>
                <th>QUANTIDADE</th>
                <th>VALOR TOTAL</th>
                <th>DATA</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((mov: any, index) => {
                const idMov = mov.id_movimentacao ?? mov.id ?? mov.idMovimentacao ?? "-";
                const idProd = mov.id_produto ?? mov.produtoId ?? mov.produto_id ?? "-";
                const tipo = (mov.tipo ?? "ENTRADA").toUpperCase();
                const quantidade = mov.quantidade ?? mov.qtd ?? 0;
                const valorTotal = formatarPreco(mov.valor_total ?? mov.valorTotal ?? mov.preco_total ?? 0);
                const data = formatarData(mov.data_movimentacao ?? mov.data);

                return (
                  <tr key={idMov !== "-" ? idMov : index}>
                    <td>{idMov}</td>
                    <td>{idProd}</td>
                    <td>
                      <span className={tipo === 'ENTRADA' ? 'badge-entrada' : 'badge-saida'}>
                        {tipo}
                      </span>
                    </td>
                    <td>{quantidade}</td>
                    <td>R$ {valorTotal}</td>
                    <td>{data}</td>
                    <td>
                      <div className="coluna-acoes">
                        <button 
                          className="btn-acao btn-atualizar"
                          onClick={() => handleEditar(idMov)}
                        >
                          Atualizar
                        </button>
                        <button 
                          className="btn-acao btn-deletar"
                          onClick={() => handleDeletar(idMov)}
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

export default PListagemMovimentacao;