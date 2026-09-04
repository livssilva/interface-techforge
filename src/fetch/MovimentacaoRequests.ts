import type MovimentacaoDTO from "../dto/MovimentacaoDTO";

const API_URL = 'http://localhost:3000/movimentacoes';

export class MovimentacaoRequests {
  static async listarTodas(): Promise<MovimentacaoDTO[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar movimentações.');

      const dados = await response.json();
      return Array.isArray(dados) ? dados : [];
    } catch (error) {
      console.error('Erro em MovimentacaoRequests.listarTodas:', error);
      throw error;
    }
  }

  static async buscarPorId(id: number | string): Promise<MovimentacaoDTO | null> {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error(`Erro ao buscar movimentação ${id}.`);

      const dado = await response.json();
      return dado;
    } catch (error) {
      console.error(`Erro em MovimentacaoRequests.buscarPorId (${id}):`, error);
      return null;
    }
  }

  static async cadastrar(movimentacao: Partial<MovimentacaoDTO>): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimentacao)
      });
      return response.ok;
    } catch (error) {
      console.error('Erro em MovimentacaoRequests.cadastrar:', error);
      return false;
    }
  }

  static async atualizar(id: number | string, movimentacao: Partial<MovimentacaoDTO>): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimentacao)
      });
      return response.ok;
    } catch (error) {
      console.error(`Erro em MovimentacaoRequests.atualizar (${id}):`, error);
      return false;
    }
  }

  static async deletar(id: number | string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error(`Erro em MovimentacaoRequests.deletar (${id}):`, error);
      return false;
    }
  }
}