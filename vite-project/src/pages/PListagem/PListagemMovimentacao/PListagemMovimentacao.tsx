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
        <table className="tabela-movimentacoes">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Produto</th>
              <th>Tipo</th>
              <th>Qtd</th>
              <th>Data</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((mov) => (
              <tr key={mov.id_movimentacao}>
                <td>{mov.id_movimentacao ?? "-"}</td>
                <td>{mov.id_produto}</td>
                <td>
                  <span className={mov.tipo === 'ENTRADA' ? 'badge-entrada' : 'badge-saida'}>
                    {mov.tipo}
                  </span>
                </td>
                <td>{mov.quantidade}</td>
                <td>
                  {mov.data_movimentacao ? new Date(mov.data_movimentacao).toLocaleDateString('pt-BR') : "-"}
                </td>
                <td>{mov.observacao ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PListagemMovimentacao;