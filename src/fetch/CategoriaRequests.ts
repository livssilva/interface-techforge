import type CategoriaDTO from '../dto/CategoriaDTO';

const BASE_URL = 'http://localhost:3000';

export class CategoriaRequests {
  // GET usa o PLURAL: /categorias
  static async listarTodas(): Promise<CategoriaDTO[]> {
    try {
      const response = await fetch(`${BASE_URL}/categorias`);
      if (!response.ok) throw new Error('Erro ao buscar categorias.');
      
      const dados = await response.json();
      return Array.isArray(dados) ? dados : [];
    } catch (error) {
      console.error('Erro em CategoriaRequests.listarTodas:', error);
      throw error;
    }
  }

  static async cadastrar(categoria: Partial<CategoriaDTO>): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/categoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria)
      });
      return response.ok;
    } catch (error) {
      console.error('Erro em CategoriaRequests.cadastrar:', error);
      return false;
    }
  }
}