import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProdutoRequests } from '../../../fetch/ProdutoRequests';
import './PCadastroProduto.css';

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

interface ProdutoDTO {
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoriaId: string;
}

export function PCadastroProduto() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProdutoDTO>({
    nome: '',
    descricao: '',
    preco: 0,
    quantidadeEstoque: 0,
    categoriaId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco' || name === 'quantidadeEstoque' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.preco <= 0) {
      alert("Informe um preço válido maior que zero.");
      return;
    }

    const sucesso = await ProdutoRequests.cadastrar(formData);
    
    if (sucesso) {
      alert("Produto cadastrado com sucesso!");
      navigate('/produtos');
    } else {
      alert("Erro ao cadastrar produto. Verifique os dados e a conexão com a API.");
    }
  };

  return (
    <main className="form-main-container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form-card">
          <h1 className="form-title">Cadastro de Produto</h1>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="nome">Nome do Produto</label>
              <input
                type="text"
                name="nome"
                id="nome"
                required
                minLength={3}
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Teclado Mecânico RGB"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preco">Preço (R$)</label>
                <input
                  type="number"
                  name="preco"
                  id="preco"
                  step="0.01"
                  min="0"
                  required
                  value={formData.preco || ''}
                  onChange={handleChange}
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantidadeEstoque">Quantidade Inicial</label>
                <input
                  type="number"
                  name="quantidadeEstoque"
                  id="quantidadeEstoque"
                  min="0"
                  required
                  value={formData.quantidadeEstoque || ''}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="categoriaId">Categoria</label>
              <select
                name="categoriaId"
                id="categoriaId"
                required
                value={formData.categoriaId}
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

            <div className="form-group full-width">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                name="descricao"
                id="descricao"
                rows={3}
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Detalhes do produto..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              CADASTRAR PRODUTO
            </button>
            <button
              type="button"
              onClick={() => navigate('/produtos')}
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

export default PCadastroProduto;