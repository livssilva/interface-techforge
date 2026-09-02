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
}