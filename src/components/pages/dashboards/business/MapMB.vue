<template>
  <div>
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';

export default {
  mounted() {
    this.map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    // Adicione um marcador (overlay)
    const marker = new Overlay({
      position: fromLonLat([0, 0]),
      element: document.createElement('div'),
    });
    this.map.addOverlay(marker);

    // Abra uma popup quando o marcador é clicado
    marker.getElement().addEventListener('click', () => {
      alert('Clique no marcador!');
    });
  },
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
