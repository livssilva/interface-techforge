import type { ProdutoDTO } from "../dto/ProdutoDTO";

const API_URL = 'http://localhost:3000/produtos';

export class ProdutoRequests {
  static async listarTodos(): Promise<ProdutoDTO[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar produtos.');
      
      const dados = await response.json();
      return Array.isArray(dados) ? dados : [];
    } catch (error) {
      console.error('Erro em ProdutoRequests.listarTodos:', error);
      throw error;
    }
  }

  static async cadastrar(produto: Partial<ProdutoDTO>): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
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