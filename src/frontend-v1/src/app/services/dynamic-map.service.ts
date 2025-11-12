// src/app/services/dynamic-map.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { MapService } from './map.service';

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
  layers_data: {
    layers: any[];
    focusFeatureUrl?: string;
    center?: [number, number];
    zoom?: number;
  };
}

export interface MapListItem {
  id: number;
  slug: string;
  titulo: string;
  descricao?: string;
  layers_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicMapService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/maps`;

  /**
   * Busca mapa por slug
   */
  getBySlug(slug: string): Observable<MapData> {
    return this.http.get<MapData>(`${this.baseUrl}/${slug}`);
  }

  /**
   * Busca mapa por ID
   */
  getById(id: number): Observable<MapData> {
    return this.http.get<MapData>(`${this.baseUrl}/id/${id}`);
  }

  /**
   * Lista mapas para o editor
   */
  listForEditor(): Observable<MapListItem[]> {
    return this.http.get<MapListItem[]>(`${this.baseUrl}/list-for-editor`);
  }

  /**
   * Lista mapas com paginação
   */
  list(params?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Observable<{ count: number; results: MapListItem[] }> {
    return this.http.get<{ count: number; results: MapListItem[] }>(
      this.baseUrl,
      { params: params as any }
    );
  }

  /**
   * Converte os dados da API para o formato esperado pelo MapService
   * Isso mantém compatibilidade com o MapService existente
   */
  convertToLegacyFormat(mapData: MapData): {
    layers: any[];
    focusFeatureUrl?: string;
    center?: [number, number];
    zoom?: number;
  } {
    return {
      layers: mapData.layers_data.layers.map(layer => ({
        id: layer.id,
        title: layer.title,
        description: layer.description,
        url: layer.url,
        layer_type: layer.layer_type,
        is_active: layer.is_visible ?? true,
        order: layer.order,
        metadata: layer.metadata || {},
        style: layer.style || {}
      })),
      focusFeatureUrl: mapData.layers_data.focusFeatureUrl || mapData.centroide,
      center: mapData.layers_data.center ||
              (mapData.center_lon && mapData.center_lat ?
               [mapData.center_lon, mapData.center_lat] : undefined),
      zoom: mapData.layers_data.zoom || mapData.initial_zoom
    };
  }
}
