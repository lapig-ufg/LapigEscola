import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { defaults as defaultControls } from 'ol/control';

// Imports de Camadas
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

// Imports de Fontes de Dados (Sources)
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';

// Imports de Estilo
import { Style, Stroke, Fill, Circle } from 'ol/style';

/**
 * Cria um objeto de estilo do OpenLayers a partir de uma configuração JSON.
 * @param {object} styleConfig - O objeto de estilo vindo da API.
 * @returns {Style} Um objeto ol/style/Style.
 */
function createStyle(styleConfig = {}) {
  const fill = styleConfig.fill ? new Fill({ color: styleConfig.fill.color || 'rgba(238, 238, 238, 0.2)' }) : undefined;

  const stroke = styleConfig.stroke ? new Stroke({
    color: styleConfig.stroke.color || '#3399CC',
    width: styleConfig.stroke.width || 2,
  }) : undefined;

  const image = styleConfig.marker ? new Circle({
    radius: styleConfig.marker.radius || 5,
    fill: new Fill({ color: styleConfig.marker.color || '#ff0000' }),
    stroke: new Stroke({ color: '#ffffff', width: 1 }),
  }) : undefined;

  return new Style({ fill, stroke, image });
}

/**
 * Composable do Vue 3 para gerenciar um mapa OpenLayers com múltiplas camadas e foco dinâmico.
 *
 * @param {import('vue').Ref<HTMLElement|null>} containerRef - Ref para o container do mapa.
 * @param {import('vue').Ref<Array<object>>} layersData - Ref para um array de configurações de camada a serem desenhadas.
 * @param {import('vue').Ref<string|null>} focusFeatureUrl - Ref para a URL de um GeoJSON usado para centralizar o mapa.
 */
export default function useOpenLayers(containerRef, layersData, focusFeatureUrl) {
  const map = ref(null);
  const managedLayers = ref([]);
  const isLoadingFocus = ref(false);

  /**
   * Inicializa o mapa base. Executado apenas uma vez.
   */

  const initializeMap = () => {
    if (!containerRef.value || map.value) return;

    map.value = new Map({
      target: containerRef.value,
      layers: [
        new TileLayer({
          source: new OSM(),
          properties: { id: 'base-osm' }
        }),
      ],
      view: new View({
        center: fromLonLat([-54, -15]), // Centro do Brasil
        zoom: 4,
      }),
      controls: defaultControls({ attribution: true, zoom: true, rotate: false }),
    });
  };

  /**
   * Limpa as camadas antigas e adiciona as novas com base nos dados.
   */
  const updateMapLayers = () => {
    if (!map.value || !layersData.value) return;

    managedLayers.value.forEach(layer => map.value.removeLayer(layer));
    managedLayers.value = [];

    layersData.value.forEach(layerConfig => {
      if (!layerConfig.is_active) return;

      let olLayer;
      const layerStyle = createStyle(layerConfig.style);

      switch (layerConfig.layer_type) {
        case 'GEOJSON':
          olLayer = new VectorLayer({
            source: new VectorSource({
              url: layerConfig.url,
              format: new GeoJSON(),
            }),
            style: layerStyle,
          });
          break;
        case 'WMS':
          olLayer = new TileLayer({
            source: new TileWMS({
              url: layerConfig.url,
              params: layerConfig.metadata || { 'LAYERS': 'your:default_layer', 'TILED': true },
              serverType: 'geoserver',
              transition: 0,
            }),
          });
          break;
        case 'TILE': // XYZ
          olLayer = new TileLayer({
            source: new XYZ({
              url: layerConfig.url,
            }),
          });
          break;
        case 'VECTOR': // Vector Tiles (MVT)
          olLayer = new VectorTileLayer({
            source: new VectorTileSource({
              format: new MVT(),
              url: layerConfig.url,
            }),
            style: layerStyle,
          });
          break;
        default:
          console.warn(`Tipo de camada desconhecido: ${layerConfig.layer_type}`);
          return;
      }

      if (olLayer) {
        olLayer.set('id', layerConfig.id);
        map.value.addLayer(olLayer);
        managedLayers.value.push(olLayer);
      }
    });
  };

  /**
   * Busca o GeoJSON de uma URL e ajusta a visão do mapa.
   */
  const fitToFeatureUrl = async () => {
    console.log(focusFeatureUrl.value)
    if (!map.value || !focusFeatureUrl.value) return;
    if (isLoadingFocus.value) return;

    isLoadingFocus.value = true;

    try {
      const response = await fetch(focusFeatureUrl.value);
      if (!response.ok) {
        throw new Error(`Falha ao buscar GeoJSON de foco: ${response.statusText}`);
      }
      const geoJsonData = await response.json();

      // MUDANÇA 1: Usar readFeatures (plural) para ler uma FeatureCollection.
      // Isso retorna um array de features do OpenLayers.
      const olFeatures = new GeoJSON().readFeatures(geoJsonData, {
        dataProjection: 'EPSG:4326', // Projeção dos dados que vêm da URL
        featureProjection: map.value.getView().getProjection(), // Projeção do mapa (normalmente 'EPSG:3857')
      });

      console.log('Features lidas:', olFeatures); // Para depuração, você verá um array aqui

      // MUDANÇA 2: Verificar se o array de features não está vazio
      if (olFeatures.length > 0) {
        // MUDANÇA 3: Pegar a primeira feature do array
        const firstFeature = olFeatures[0];
        const geometry = firstFeature.getGeometry();

        if (geometry) {
          console.log('Devo da zoom')
          map.value.getView().fit(geometry.getExtent(), {
            padding: [80, 80, 80, 80],
            duration: 1200,
            maxZoom: 14,
          });
        }
      } else {
        console.warn(`A URL de foco (${focusFeatureUrl.value}) não retornou nenhuma feature.`);
      }

    } catch (error) {
      console.error(`Erro ao processar a URL do GeoJSON de foco (${focusFeatureUrl.value}):`, error);
    } finally {
      isLoadingFocus.value = false;
    }
  };

// --- Ciclo de Vida e Watchers (AQUI ESTÁ A CORREÇÃO) ---
  onMounted(() => {
    // 1. Primeiro, SEMPRE inicializamos o mapa. Agora `map.value` existe.
    initializeMap();

    // 2. AGORA que o mapa existe, podemos chamar as funções para
    //    carregar o estado inicial dos dados.
    updateMapLayers();
    fitToFeatureUrl();
  });

  onBeforeUnmount(() => {
    if (map.value) {
      map.value.setTarget(null);
      map.value = null;
    }
  });

  // <<< MUDANÇA: Os watchers agora são responsáveis APENAS por MUDANÇAS FUTURAS,
  // não pela carga inicial. Eles funcionarão corretamente porque o mapa já existirá.
  watch(layersData, updateMapLayers, { deep: true });
  watch(focusFeatureUrl, fitToFeatureUrl); // <<< MUDANÇA: `{ immediate: true }` removido.

  return { map, isLoadingFocus };
}
