/**
 * Interfaces de Dados - Camadas Geoespaciais
 * Gerado a partir do OpenAPI spec da API LapigEscola
 */

export type LayerType = 'GEOJSON' | 'WMS' | 'TILE' | 'VECTOR';

export interface LayerStyle {
  fill?: {
    color: string;
  };
  stroke?: {
    color: string;
    width: number;
  };
  marker?: {
    radius: number;
    color: string;
  };
}

export interface Layer {
  id?: number;
  order: number;
  title: string;
  description?: string;
  url: string;
  layer_type?: LayerType;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  style?: LayerStyle;
  temas: number[];
}

export interface LayersSchema {
  focusFeatureUrl: string;
  layers: Layer[];
}
