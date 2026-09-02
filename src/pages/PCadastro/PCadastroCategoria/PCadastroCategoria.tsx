import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoriaRequests } from '../../../fetch/CategoriaRequests';
import './PCadastroCategoria.css';

const OPCOES_CATEGORIAS = [
  "Periféricos",
  "Hardware",
  "Monitores",
  "Armazenamento",
  "Acessórios",
  "Redes",
  "Cadeiras Gamer",
  "Áudio"
];

interface CategoriaDTO {
  nome: string;
}

export function PCadastroCategoria() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CategoriaDTO>({
    nome: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome) {
      alert("Por favor, selecione o nome da categoria.");
      return;
    }

    const sucesso = await CategoriaRequests.cadastrar(formData);

    if (sucesso) {
      alert("Categoria cadastrada com sucesso!");
      navigate('/categorias');
    } else {
      alert("Erro ao cadastrar categoria. Verifique os dados e a conexão com a API.");
    }
  };

  return (
    <main className="form-main-container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form-card">
          <h1 className="form-title">Cadastro de Categoria</h1>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="nome">Selecione a Categoria</label>
              <select
                name="nome"
                id="nome"
                required
                value={formData.nome}
                onChange={handleChange}
              >
                <option value="">-- Escolha uma categoria --</option>
                {OPCOES_CATEGORIAS.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              CADASTRAR CATEGORIA
            </button>
            <button
              type="button"
              onClick={() => navigate('/categorias')}
              className="btn-cancel"
            >
              VOLTAR PARA LISTAGEM
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default PCadastroCategoria;