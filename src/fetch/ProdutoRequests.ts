// src/fetch/ProdutoRequests.ts
import type { ProdutoDTO } from "../dto/ProdutoDTO";

const URL_BASE = "http://localhost:3000/produtos"; // Ajuste o endpoint conforme sua API

export class ProdutoRequests {
  // Listar todos os produtos
  static async listarTodos(): Promise<ProdutoDTO[]> {
    const resposta = await fetch(URL_BASE);
    if (!resposta.ok) throw new Error("Erro ao buscar produtos.");
    return await resposta.json();
  }

  // Cadastrar um novo produto
  static async cadastrar(produto: ProdutoDTO): Promise<boolean> {
    try {
      const resposta = await fetch(URL_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      return resposta.ok;
    } catch (error) {
      console.error("Erro no cadastro de produto:", error);
      return false;
    }
  }

  // Atualizar produto existente pelo código
  static async atualizar(codigo: string, produto: Partial<ProdutoDTO>): Promise<boolean> {
    try {
      const resposta = await fetch(`${URL_BASE}/${codigo}`, {
        method: "PUT", // Ou "PATCH", dependendo do seu backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      return resposta.ok;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      return false;
    }
  }

  // Deletar produto pelo código
  static async deletar(codigo: string): Promise<boolean> {
    try {
      const resposta = await fetch(`${URL_BASE}/${codigo}`, {
        method: "DELETE",
      });

      return resposta.ok;
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      return false;
    }
  }
}