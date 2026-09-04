// src/fetch/ProdutoRequests.ts
import type { ProdutoDTO } from "../dto/ProdutoDTO";

const URL_BASE_PLURAL = "http://localhost:3000/produtos";
const URL_BASE_SINGULAR = "http://localhost:3000/produto";

export class ProdutoRequests {
  // GET /produtos (Plural)
  static async listarTodos(): Promise<ProdutoDTO[]> {
    try {
      const resposta = await fetch(URL_BASE_PLURAL);
      if (!resposta.ok) throw new Error(`Status HTTP: ${resposta.status}`);
      return await resposta.json();
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      throw error;
    }
  }

  // POST /produto (Singular)
  static async cadastrar(produto: ProdutoDTO): Promise<boolean> {
    try {
      const payload = {
        ...produto,
        preco_unitario: Number(produto.preco_unitario),
        quantidade_disponivel: Number(produto.quantidade_disponivel),
        quantidade_minima: Number(produto.quantidade_minima),
      };

      const resposta = await fetch(URL_BASE_SINGULAR, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resposta.ok) {
        const erroDetalhes = await resposta.text();
        console.error(`Erro no cadastro (${resposta.status}):`, erroDetalhes);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro na requisição de cadastro:", error);
      return false;
    }
  }

  // PUT /produto/:id (Singular)
  static async atualizar(idOuCodigo: string | number, produto: Partial<ProdutoDTO>): Promise<boolean> {
    try {
      const payload = {
        ...produto,
        preco_unitario: produto.preco_unitario !== undefined ? Number(produto.preco_unitario) : undefined,
        quantidade_disponivel: produto.quantidade_disponivel !== undefined ? Number(produto.quantidade_disponivel) : undefined,
        quantidade_minima: produto.quantidade_minima !== undefined ? Number(produto.quantidade_minima) : undefined,
      };

      const resposta = await fetch(`${URL_BASE_SINGULAR}/${idOuCodigo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resposta.ok) {
        const erroDetalhes = await resposta.text();
        console.error(`Erro ao atualizar (${resposta.status}):`, erroDetalhes);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro na requisição de atualização:", error);
      return false;
    }
  }

  // DELETE /produto/:id (Singular)
  static async deletar(idOuCodigo: string | number): Promise<boolean> {
    try {
      const resposta = await fetch(`${URL_BASE_SINGULAR}/${idOuCodigo}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        const erroDetalhes = await resposta.text();
        console.error(`Erro ao deletar (${resposta.status}):`, erroDetalhes);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro na requisição de exclusão:", error);
      return false;
    }
  }
}