// src/app/models/map.model.ts
export type LayerType = 'GEOJSON' | 'WMS' | 'TILE' | 'VECTOR' | 'WFS';

export interface LayerMetadata {
  opacity?: number;
  minZoom?: number;
  maxZoom?: number;
  attribution?: string;
  [key: string]: any;
}

export interface LayerStyle {
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  weight?: number;
  opacity?: number;
  [key: string]: any;
}

export interface Layer {
  id: number;
  title: string;
  description?: string;
  url: string;
  layer_type: LayerType;
  is_active: boolean;
  order: number;
  metadata: LayerMetadata;
  style: LayerStyle;
  // Campos específicos do MapLayer
  is_visible?: boolean;
  opacity?: number;
}

export interface LayersCollection {
  layers: Layer[];
  focusFeatureUrl?: string;
  center?: [number, number]; // [lon, lat]
  zoom?: number;
}

export interface MapData {
  id: number;
  titulo: string;
  descricao: string;
  slug: string;
  centroide?: string;
  center_lon?: number;
  center_lat?: number;
  initial_zoom: number;
  is_published: boolean;
  layers_data: LayersCollection;
}

export interface MapListItem {
  id: number;
  slug: string;
  titulo: string;
  descricao?: string;
  layers_count: number;
}
