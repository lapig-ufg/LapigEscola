/**
 * Interfaces de Dados - Biomas e Temas
 * Gerado a partir do OpenAPI spec da API LapigEscola
 */

export interface TemaSchema {
  nome: string;
  slug: string;
  order: number;
}

export interface BiomaSchema {
  nome: string;
  slug: string;
  temas: TemaSchema[];
}

export interface Bioma {
  id?: number;
  nome: string;
  icon?: string;
  label?: string;
  slug?: string;
  geourl: string;
  descricao?: string;
  imagem?: string;
}

export interface Tema {
  id?: number;
  nome: string;
  slug: string;
  titulo?: string;
  descricao_curta?: string;
  bioma: number;
  order: number;
}
