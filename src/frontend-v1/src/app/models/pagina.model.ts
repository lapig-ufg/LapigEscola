/**
 * Interfaces de Dados - Páginas e Navegação
 * Gerado a partir do OpenAPI spec da API LapigEscola
 */

export interface MenuItemSchema {
  label: string;
  slug?: string;
  anchor_id: string;
  order: number;
  icon?: string;
}

export interface PaginaEstatica {
  id?: number;
  titulo: string;
  slug?: string;
  resumo?: string;
  conteudo: string;
  imagem?: string;
  created_at?: string;
  updated_at?: string;
}
