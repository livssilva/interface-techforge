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

  if (carregando) return <p className="mensagem-status">Carregando categorias...</p>;
  if (erro) return <p className="mensagem-erro">Erro ao conectar com o servidor na porta 3000.</p>;

  return (
    <div className="container-listagem">
      <div className="header-listagem">
        <h2>Lista de Categorias</h2>
        <button 
          className="btn-cadastrar" 
          onClick={() => navigate("/cadastro/categoria")}
        >
          + Cadastrar Categoria
        </button>
      </div>

      {categorias.length === 0 ? (
        <p className="mensagem-status">Nenhuma categoria encontrada.</p>
      ) : (
        <table className="tabela-categorias">
          <thead>
            <tr>
              <th>ID Categoria</th>
              <th>Nome</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat: any, index) => {
              const idCategoria = cat.id_categoria ?? cat.id ?? cat.idCategoria ?? "-";
              const nome = cat.nome ?? cat.nomeCategoria ?? "-";
              const descricao = cat.descricao ?? cat.descricao_categoria ?? "-";

              return (
                <tr key={idCategoria !== "-" ? idCategoria : index}>
                  <td>{idCategoria}</td>
                  <td>{nome}</td>
                  <td>{descricao}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PListagemCategoria;