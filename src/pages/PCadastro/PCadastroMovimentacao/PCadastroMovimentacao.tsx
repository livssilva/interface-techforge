import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovimentacaoRequests } from '../../../fetch/MovimentacaoRequests';
import './PCadastroMovimentacao.css';

type TipoMovimentacao = "ENTRADA" | "SAIDA";

const OPCOES_TIPO: { label: string; value: TipoMovimentacao }[] = [
  { label: "Entrada", value: "ENTRADA" },
  { label: "Saída", value: "SAIDA" }
];

const OPCOES_PRODUTOS = [
  "Teclado Mecânico RGB",
  "Mouse Sem Fio 16000 DPI",
  "Monitor 24\" 144Hz",
  "SSD NVMe 1TB",
  "Headset 7.1 Surround",
  "Cadeira Gamer Ergonomica"
];

interface FormState {
  produtoId: string;
  tipo: TipoMovimentacao | '';
  quantidade: number;
  data: string;
  observacao: string;
}

export function PCadastroMovimentacao() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>({
    produtoId: '',
    tipo: '',
    quantidade: 1,
    data: new Date().toISOString().split('T')[0],
    observacao: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.tipo) {
      alert("Selecione o tipo de movimentação.");
      return;
    }

    if (formData.quantidade <= 0) {
      alert("Informe uma quantidade válida maior que zero.");
      return;
    }

    // Criamos o objeto pronto no formato exato esperado pela API
    const payload = {
      produtoId: formData.produtoId,
      tipo: formData.tipo as TipoMovimentacao,
      quantidade: formData.quantidade,
      data: formData.data,
      observacao: formData.observacao
    };

    const sucesso = await MovimentacaoRequests.cadastrar(payload);

    if (sucesso) {
      alert("Movimentação registrada com sucesso!");
      navigate('/movimentacoes');
    } else {
      alert("Erro ao registrar movimentação. Verifique os dados e a conexão com a API.");
    }
  };

  return (
    <main className="form-main-container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form-card">
          <h1 className="form-title">Registrar Movimentação</h1>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="produtoId">Produto</label>
              <select
                name="produtoId"
                id="produtoId"
                required
                value={formData.produtoId}
                onChange={handleChange}
              >
                <option value="">-- Escolha um produto --</option>
                {OPCOES_PRODUTOS.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipo">Tipo de Movimentação</label>
                <select
                  name="tipo"
                  id="tipo"
                  required
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value="">-- Escolha o tipo --</option>
                  {OPCOES_TIPO.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantidade">Quantidade</label>
                <input
                  type="number"
                  name="quantidade"
                  id="quantidade"
                  min="1"
                  required
                  value={formData.quantidade || ''}
                  onChange={handleChange}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="data">Data</label>
              <input
                type="date"
                name="data"
                id="data"
                required
                value={formData.data}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="observacao">Observação</label>
              <textarea
                name="observacao"
                id="observacao"
                rows={3}
                value={formData.observacao}
                onChange={handleChange}
                placeholder="Motivo da saída/entrada..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              REGISTRAR MOVIMENTAÇÃO
            </button>
            <button
              type="button"
              onClick={() => navigate('/movimentacoes')}
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

export default PCadastroMovimentacao;