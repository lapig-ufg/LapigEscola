/**
 * Interfaces de Dados - Conteúdo
 * Gerado a partir do OpenAPI spec da API LapigEscola
 */

export interface Conteudo {
  id?: number;
  tema: number;
  titulo: string;
  texto: string;
  resumo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ImagemGaleria {
  id?: number;
  order: number;
  tema: number;
  imagem: string;
  titulo: string;
  resumo?: string;
  tags: number[];
}

export interface VideoEducativo {
  id?: number;
  tema: number;
  titulo: string;
  resumo?: string;
  url_video: string;
  thumbnail?: string;
  duracao?: string;
  ordem?: number;
}
