import type CategoriaDTO from "../dto/CategoriaDTO";

const API_URL = 'http://localhost:3000/categorias';

export class CategoriaRequests {
  static async listarTodas(): Promise<CategoriaDTO[]> {
    try {
      const response = await fetch(API_URL);
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
      const response = await fetch(API_URL, {
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