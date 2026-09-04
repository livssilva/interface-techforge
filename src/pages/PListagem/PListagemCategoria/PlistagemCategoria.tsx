// src/pages/PListagem/PListagemCategoria/PListagemCategoria.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriaRequests } from "../../../fetch/CategoriaRequests";
import type CategoriaDTO from "../../../dto/CategoriaDTO";
import "./PListagemCategoria.css";

export function PListagemCategoria() {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  // Estados do Modal de Edição
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaDTO | null>(null);
  const [nomeEdit, setNomeEdit] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarCategorias = async () => {
    setCarregando(true);
    setErro(false);
    try {
      const dados = await CategoriaRequests.listarTodas();
      setCategorias(dados);
    } catch (error) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleAbrirEditar = (cat: CategoriaDTO) => {
    setCategoriaEditando(cat);
    setNomeEdit(cat.nome || "");
  };

  const handleFecharModal = () => {
    setCategoriaEditando(null);
    setNomeEdit("");
  };

  const handleSalvarAtualizacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoriaEditando || !categoriaEditando.id_categoria) return;

    const id = categoriaEditando.id_categoria;
    setSalvando(true);

    try {
      const dadosAtualizados: Partial<CategoriaDTO> = {
        nome: nomeEdit,
      };

      const sucesso = await CategoriaRequests.atualizar(id, dadosAtualizados);

      if (sucesso) {
        setCategorias((prev) =>
          prev.map((c) =>
            c.id_categoria === id ? { ...c, nome: nomeEdit } : c
          )
        );
        handleFecharModal();
      } else {
        alert("Erro ao atualizar a categoria.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const sucesso = await CategoriaRequests.deletar(id);
      if (sucesso) {
        setCategorias((prev) => prev.filter((c) => c.id_categoria !== id));
      } else {
        alert("Erro ao excluir a categoria.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor para exclusão.");
    }
  };

  if (carregando) return <p className="mensagem-status">Carregando categorias...</p>;
  if (erro) return <p className="mensagem-erro">Erro ao conectar com o servidor na porta 3000.</p>;

  return (
    <div className="container-listagem">
      <div className="header-listagem">
        <h2>Listagem de Categorias</h2>
        <button 
          className="btn-cadastrar" 
          onClick={() => navigate("/cadastro/categoria")}
        >
          + Cadastrar Categoria
        </button>
      </div>

      {categorias.length === 0 ? (
        <p className="mensagem-status">Nenhuma categoria registrada.</p>
      ) : (
        <div className="tabela-responsive">
          <table className="tabela-listagem">
            <thead>
              <tr>
                <th>ID CATEGORIA</th>
                <th>NOME</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat, index) => {
                const idCat = cat.id_categoria;

                return (
                  <tr key={idCat ?? index}>
                    <td>{idCat ?? "-"}</td>
                    <td>{cat.nome}</td>
                    <td>
                      <div className="coluna-acoes">
                        <button 
                          className="btn-acao btn-atualizar"
                          onClick={() => handleAbrirEditar(cat)}
                        >
                          Atualizar
                        </button>
                        <button 
                          className="btn-acao btn-deletar"
                          onClick={() => handleDeletar(idCat)}
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

      {/* Bloquinho / Modal de Edição */}
      {categoriaEditando && (
        <div className="modal-overlay" onClick={handleFecharModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Atualizar Categoria #{categoriaEditando.id_categoria}</h3>
              <button className="btn-fechar" onClick={handleFecharModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSalvarAtualizacao}>
              <div className="form-group">
                <label>Nome da Categoria:</label>
                <input
                  type="text"
                  value={nomeEdit}
                  onChange={(e) => setNomeEdit(e.target.value)}
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

export default PListagemCategoria;