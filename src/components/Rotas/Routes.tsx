import { Routes, Route } from "react-router-dom";
import PHome from "../../pages/PHome/PHome";
import PListagemProduto from "../../pages/PListagem/PListagemProduto/PListagemProduto";
import PCadastroProduto from "../../pages/PCadastro/PCadastroProduto/PCadastroProduto";
import PListagemCategoria from "../../pages/PListagem/PListagemCategoria/PlistagemCategoria";
import PCadastroCategoria from "../../pages/PCadastro/PCadastroCategoria/PCadastroCategoria";
import PListagemMovimentacao from "../../pages/PListagem/PListagemMovimentacao/PListagemMovimentacao";
import PCadastroMovimentacao from "../../pages/PCadastro/PCadastroMovimentacao/PCadastroMovimentacao";

export function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<PHome />} />
      <Route path="/produtos" element={<PListagemProduto />} />
      <Route path="/cadastro/produto" element={<PCadastroProduto />} /> {/* Rota de Cadastro */}
      <Route path="/categorias" element={<PListagemCategoria />} />
      <Route path="/movimentacoes" element={<PListagemMovimentacao />} />
      <Route path="/cadastro/movimentacao" element={<PCadastroMovimentacao />} />
      <Route path="/cadastro/categoria" element={<PCadastroCategoria />} /> {/* Rota de Cadastro */}
    </Routes>
  );
}

export default Rotas;