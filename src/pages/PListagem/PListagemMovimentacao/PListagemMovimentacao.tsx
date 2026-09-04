// src/pages/PListagem/PListagemMovimentacao/PListagemMovimentacao.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovimentacaoRequests } from "../../../fetch/MovimentacaoRequests";
import type MovimentacaoDTO from "../../../dto/MovimentacaoDTO";
import "./PListagemMovimentacao.css";

export function PListagemMovimentacao() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  // Estados do Modal de Edição
  const [movEditando, setMovEditando] = useState<MovimentacaoDTO | null>(null);
  const [tipoEdit, setTipoEdit] = useState<'ENTRADA' | 'SAIDA'>("ENTRADA");
  const [quantidadeEdit, setQuantidadeEdit] = useState<number>(0);
  const [observacaoEdit, setObservacaoEdit] = useState<string>("");
  const [salvando, setSalvando] = useState(false);

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

  const formatarData = (dataRaw?: Date | string) => {
    if (!dataRaw) return "-";
    const data = new Date(dataRaw);
    return isNaN(data.getTime()) ? "-" : data.toLocaleDateString("pt-BR");
  };

  const handleAbrirEditar = (mov: MovimentacaoDTO) => {
    setMovEditando(mov);
    setTipoEdit(mov.tipo);
    setQuantidadeEdit(mov.quantidade);
    setObservacaoEdit(mov.observacao || "");
  };

  const handleFecharModal = () => {
    setMovEditando(null);
    setTipoEdit("ENTRADA");
    setQuantidadeEdit(0);
    setObservacaoEdit("");
  };

  const handleSalvarAtualizacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movEditando || !movEditando.id_movimentacao) return;

    const id = movEditando.id_movimentacao;
    setSalvando(true);

    try {
      const dadosAtualizados: Partial<MovimentacaoDTO> = {
        ...movEditando,
        tipo: tipoEdit,
        quantidade: Number(quantidadeEdit),
        observacao: observacaoEdit,
      };

      const sucesso = await MovimentacaoRequests.atualizar(id, dadosAtualizados);

      if (sucesso) {
        setMovimentacoes((prev) =>
          prev.map((m) =>
            m.id_movimentacao === id
              ? {
                  ...m,
                  tipo: tipoEdit,
                  quantidade: Number(quantidadeEdit),
                  observacao: observacaoEdit,
                }
              : m
          )
        );
        handleFecharModal();
      } else {
        alert("Erro ao atualizar a movimentação.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Tem certeza que deseja excluir esta movimentação?")) return;

    try {
      const sucesso = await MovimentacaoRequests.deletar(id);
      if (sucesso) {
        setMovimentacoes((prev) => prev.filter((m) => m.id_movimentacao !== id));
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
                <th>DATA</th>
                <th>OBSERVAÇÃO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((mov, index) => {
                const idMov = mov.id_movimentacao;
                const idProd = mov.id_produto;
                const data = formatarData(mov.data_movimentacao);

                return (
                  <tr key={idMov ?? index}>
                    <td>{idMov ?? "-"}</td>
                    <td>{idProd}</td>
                    <td>
                      <span className={mov.tipo === 'ENTRADA' ? 'badge-entrada' : 'badge-saida'}>
                        {mov.tipo}
                      </span>
                    </td>
                    <td>{mov.quantidade}</td>
                    <td>{data}</td>
                    <td>{mov.observacao || "-"}</td>
                    <td>
                      <div className="coluna-acoes">
                        <button 
                          className="btn-acao btn-atualizar"
                          onClick={() => handleAbrirEditar(mov)}
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

      {/* Modal de Edição */}
      {movEditando && (
        <div className="modal-overlay" onClick={handleFecharModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Atualizar Movimentação #{movEditando.id_movimentacao}</h3>
              <button className="btn-fechar" onClick={handleFecharModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSalvarAtualizacao}>
              <div className="form-group">
                <label>Tipo de Movimentação:</label>
                <select
                  value={tipoEdit}
                  onChange={(e) => setTipoEdit(e.target.value as 'ENTRADA' | 'SAIDA')}
                >
                  <option value="ENTRADA">ENTRADA</option>
                  <option value="SAIDA">SAÍDA</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantidade:</label>
                <input
                  type="number"
                  value={quantidadeEdit}
                  onChange={(e) => setQuantidadeEdit(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Observação:</label>
                <textarea
                  value={observacaoEdit}
                  onChange={(e) => setObservacaoEdit(e.target.value)}
                  rows={3}
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

export default PListagemMovimentacao;