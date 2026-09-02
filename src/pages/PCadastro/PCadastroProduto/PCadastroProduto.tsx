import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProdutoRequests } from '../../../fetch/ProdutoRequests';
import { CategoriaRequests } from '../../../fetch/CategoriaRequests'; // Importante para buscar as categorias reais
import type CategoriaDTO from '../../../dto/CategoriaDTO';
import './PCadastroProduto.css';

interface FormProduto {
  codigo: string;
  nome: string;
  descricao: string;
  preco_unitario: number;
  quantidade_disponivel: number;
  id_categoria: number | string;
}

export function PCadastroProduto() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [formData, setFormData] = useState<FormProduto>({
    codigo: '',
    nome: '',
    descricao: '',
    preco_unitario: 0,
    quantidade_disponivel: 0,
    id_categoria: ''
  });

  // Busca as categorias cadastradas na API ao carregar o componente
  useEffect(() => {
    async function carregarCategorias() {
      try {
        const dados = await CategoriaRequests.listarTodas();
        setCategorias(dados);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }
    carregarCategorias();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco_unitario' || name === 'quantidade_disponivel' 
        ? Number(value) 
        : name === 'id_categoria' 
          ? Number(value) || '' 
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.preco_unitario <= 0) {
      alert("Informe um preço válido maior que zero.");
      return;
    }

    if (!formData.id_categoria) {
      alert("Selecione uma categoria válida.");
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
              <label htmlFor="codigo">Código do Produto</label>
              <input
                type="text"
                name="codigo"
                id="codigo"
                required
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Ex: PROD-001"
              />
            </div>

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
                <label htmlFor="preco_unitario">Preço (R$)</label>
                <input
                  type="number"
                  name="preco_unitario"
                  id="preco_unitario"
                  step="0.01"
                  min="0"
                  required
                  value={formData.preco_unitario || ''}
                  onChange={handleChange}
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantidade_disponivel">Quantidade Inicial</label>
                <input
                  type="number"
                  name="quantidade_disponivel"
                  id="quantidade_disponivel"
                  min="0"
                  required
                  value={formData.quantidade_disponivel || ''}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="id_categoria">Categoria</label>
              <select
                name="id_categoria"
                id="id_categoria"
                required
                value={formData.id_categoria}
                onChange={handleChange}
              >
                <option value="">-- Escolha uma categoria --</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nome}
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