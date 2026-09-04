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

  static async buscarPorId(id: number | string): Promise<ProdutoDTO | null> {
    try {
      const response = await fetch(`${BASE_URL}/produto/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar produto.');

      return await response.json();
    } catch (error) {
      console.error('Erro em ProdutoRequests.buscarPorId:', error);
      return null;
    }
  }

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

  static async atualizar(id: number | string, produto: Partial<ProdutoDTO>): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/produto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
      });
      return response.ok;
    } catch (error) {
      console.error('Erro em ProdutoRequests.atualizar:', error);
      return false;
    }
  }

  // DELETE usa o SINGULAR: /produto/:id
  static async deletar(id: number | string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/produto/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Erro em ProdutoRequests.deletar:', error);
      return false;
    }
  }
}