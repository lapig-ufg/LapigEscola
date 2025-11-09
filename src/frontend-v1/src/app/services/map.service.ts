/**
 * Map Service
 * Gerencia mapas OpenLayers com suporte a múltiplas camadas
 */

import { Injectable, ElementRef } from '@angular/core';
import OLMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { Layer, LayerStyle } from '@/models';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: OLMap;
  private layersById = new Map<string, any>();

  /**
   * Inicializa o mapa OpenLayers
   */
  initializeMap(container: ElementRef, center: [number, number] = [-47.9292, -15.7801], zoom: number = 4): OLMap {
    this.map = new OLMap({
      target: container.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom
      })
    });

    return this.map;
  }

  /**
   * Atualiza camadas do mapa baseado em dados da API
   */
  updateLayers(layers: Layer[]): void {
    if (!this.map) {
      console.error('Mapa não inicializado');
      return;
    }

    // Remove camadas antigas (exceto OSM base)
    const currentLayers = this.map.getLayers().getArray().slice(1);
    currentLayers.forEach(layer => this.map!.removeLayer(layer));
    this.layersById.clear();

    // Adiciona novas camadas
    layers
      .filter(layer => layer.is_active !== false)
      .sort((a, b) => a.order - b.order)
      .forEach(layerConfig => {
        const olLayer = this.createLayer(layerConfig);
        if (olLayer) {
          this.map!.addLayer(olLayer);
          this.layersById.set(layerConfig.id?.toString() || '', olLayer);
        }
      });
  }

  /**
   * Cria camada OpenLayers baseado na configuração
   */
  private createLayer(config: Layer): any {
    switch (config.layer_type) {
      case 'GEOJSON':
        return this.createGeoJSONLayer(config);
      case 'WMS':
        return this.createWMSLayer(config);
      case 'TILE':
        return this.createTileLayer(config);
      default:
        console.warn(`Tipo de camada não suportado: ${config.layer_type}`);
        return null;
    }
  }

  /**
   * Cria camada GeoJSON
   */
  private createGeoJSONLayer(config: Layer): VectorLayer<any> {
    const source = new VectorSource({
      url: config.url,
      format: new GeoJSON()
    });

    return new VectorLayer({
      source: source,
      style: this.createStyle(config.style),
      opacity: 0.8
    });
  }

  /**
   * Cria camada WMS
   */
  private createWMSLayer(config: Layer): TileLayer<any> {
    const params: any = {
      LAYERS: config.metadata?.['LAYERS'] || 'default',
      TILED: true
    };

    const source = new TileWMS({
      url: config.url,
      params: params,
      serverType: 'geoserver'
    });

    return new TileLayer({
      source: source,
      opacity: 0.8
    });
  }

  /**
   * Cria camada Tile (XYZ)
   */
  private createTileLayer(config: Layer): TileLayer<any> {
    const source = new XYZ({
      url: config.url
    });

    return new TileLayer({
      source: source,
      opacity: 0.8
    });
  }

  /**
   * Cria estilo para features vetoriais
   */
  private createStyle(styleConfig?: LayerStyle): Style {
    if (!styleConfig) {
      return new Style({
        fill: new Fill({ color: 'rgba(238, 238, 238, 0.2)' }),
        stroke: new Stroke({ color: '#3399CC', width: 2 })
      });
    }

    return new Style({
      fill: styleConfig.fill ? new Fill({ color: styleConfig.fill.color }) : undefined,
      stroke: styleConfig.stroke ? new Stroke({
        color: styleConfig.stroke.color,
        width: styleConfig.stroke.width
      }) : undefined,
      image: styleConfig.marker ? new Circle({
        radius: styleConfig.marker.radius,
        fill: new Fill({ color: styleConfig.marker.color })
      }) : undefined
    });
  }

  /**
   * Ajusta view do mapa para mostrar uma feature GeoJSON
   */
  async fitToFeatureUrl(url: string): Promise<void> {
    if (!this.map || !url) return;

    try {
      const response = await fetch(url);
      const geojson = await response.json();

      const format = new GeoJSON();
      const features = format.readFeatures(geojson, {
        featureProjection: 'EPSG:3857'
      });

      if (features.length > 0) {
        const extent = features[0].getGeometry()?.getExtent();
        if (extent) {
          this.map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 1000
          });
        }
      }
    } catch (error) {
      console.error('Erro ao ajustar view para feature:', error);
    }
  }

  /**
   * Destrói o mapa e limpa recursos
   */
  destroyMap(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = undefined;
      this.layersById.clear();
    }
  }

  /**
   * Retorna instância do mapa (se existir)
   */
  getMap(): OLMap | undefined {
    return this.map;
  }
}
