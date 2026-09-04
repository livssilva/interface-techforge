// src/pages/PListagem/PListagemCategoria/PListagemCategoria.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriaRequests } from "../../../fetch/CategoriaRequests";
import type CategoriaDTO from "../../../dto/CategoriaDTO";
import "./PListagemCategoria.css";

export function PListagemCategoria() {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  const carregarCategorias = async () => {
    setCarregando(true);
    setErro(false);
    try {
      const dados = await CategoriaRequests.listarTodas();
      console.log("Dados recebidos da API /categorias:", dados);
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

  const handleEditar = (id: number | string) => {
    navigate(`/cadastro/categoria?id=${id}`);
  };

  const handleDeletar = async (id: number | string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const sucesso = await CategoriaRequests.deletar(id);

      if (sucesso) {
        setCategorias((prev) =>
          prev.filter((c: any) => (c.id_categoria ?? c.id) !== id)
        );
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
                <th>DESCRIÇÃO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat: any, index) => {
                const idCat = cat.id_categoria ?? cat.id ?? cat.idCategoria ?? "-";
                const nome = cat.nome_categoria ?? cat.nome ?? "-";
                const descricao = cat.descricao ?? cat.desc ?? "-";

                return (
                  <tr key={idCat !== "-" ? idCat : index}>
                    <td>{idCat}</td>
                    <td>{nome}</td>
                    <td>{descricao}</td>
                    <td>
                      <div className="coluna-acoes">
                        <button 
                          className="btn-acao btn-atualizar"
                          onClick={() => handleEditar(idCat)}
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
    </div>
  );
}

export default PListagemCategoria;