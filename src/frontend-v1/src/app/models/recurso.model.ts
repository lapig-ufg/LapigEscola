/**
 * Interfaces de Dados - Recursos Educacionais
 * Gerado a partir do OpenAPI spec da API LapigEscola
 */

export interface SchemaCuriosidade {
  titulo: string;
  resumo: string;
  imagem?: string;
  id: number;
}

export interface Curiosidade {
  id?: number;
  tema: number;
  titulo: string;
  resumo?: string;
  texto: string;
  imagem?: string;
  tags: number[];
  created_at?: string;
  updated_at?: string;
}

export interface SchemaPedagogia {
  titulo: string;
  resumo: string;
  imagem?: string;
  file?: string;
  id: number;
}

export interface RecursoPedagogico {
  id?: number;
  tema: number;
  tipo: string;
  titulo: string;
  resumo?: string;
  texto: string;
  imagem?: string;
  file?: string;
  link_externo?: string;
  created_at?: string;
  updated_at?: string;
}
