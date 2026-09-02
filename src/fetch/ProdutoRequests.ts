import type { ProdutoDTO } from "../dto/ProdutoDTO";

const BASE_URL = 'http://localhost:3000';

export class ProdutoRequests {
  // GET usa o PLURAL: /produtos
  static async listarTodos(): Promise<ProdutoDTO[]> {
    try {
      const response = await fetch(`${BASE_URL}/produtos`);
      if (!response.ok) throw new Error('Erro ao buscar produtos.');
      
      const dados = await response.json();
      return Array.isArray(dados) ? dados : [];
    } catch (error) {
      console.error('Erro em ProdutoRequests.listarTodos:', error);
      throw error;
    }
  }

  // POST usa o SINGULAR: /produto
  static async cadastrar(produto: Partial<ProdutoDTO>): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/produto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
      });
      return response.ok;
    } catch (error) {
      console.error('Erro em ProdutoRequests.cadastrar:', error);
      return false;
    }
  }
}