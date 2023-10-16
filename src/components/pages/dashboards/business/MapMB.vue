<template>
  <div >
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
import TileWMS from 'ol/source/TileWMS';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default {
    mounted() {
        const brazilCenter = fromLonLat([-47.687434,-14.130147]); // Coordenadas do centro do Brasil

        this.map = new Map({
            target: this.$refs.map,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                new TileLayer({
                    source: new TileWMS({
                        url: 'https://geoservicos.ibge.gov.br/geoserver/BDIA/wms',
                        params: {
                            'LAYERS': 'BDIA:gpc_geol_bioma',
                            'cql_filter': 'cd_bioma=3',
                            'FORMAT': 'image/png',
                            'TRANSPARENT': true,
                        },
                    }),
                }),
            ],
            view: new View({
                center: brazilCenter,
                zoom: 4, // Ajuste o nível de zoom conforme necessário
            }),
        });

        const iconStyle = new Style({
            image: new Icon({
                anchor: [0, 0],
                src: '/images/icons/map/point.svg', // Substitua pelo caminho da sua imagem de ícone
                size: [32, 32], // Substitua pelas dimensões reais do ícone
            }),
        });


        const markerElement = document.createElement('div');
        markerElement.classList.add('fas', 'fa-map-marker-alt', 'gcl-map-pin');
        markerElement.style.width = '32px';
        markerElement.style.height =  '32px';
        // Adicione um marcador (overlay)

        const marker = new Overlay({
            position: brazilCenter,
            element: markerElement
        });

        this.map.addOverlay(marker);

        // Crie um ícone para o marcador
        const markerIcon = new Feature({
            geometry: new Point(brazilCenter),
        });

        markerIcon.setStyle(
            iconStyle
        );

        marker.getElement().addEventListener('click', () => {
            this.onMarkerClick(); // Chame um método personalizado quando o marcador é clicado
        });

        // Adicione o marcador ao mapa
        this.map.addLayer(new VectorLayer({
            source: new VectorSource({
                features: [markerIcon],
            }),
        }));

        // Abra uma popup quando o marcador é clicado

    },
    methods: {
        onMarkerClick() {
            console.log('Clique no marcador!');
            alert('Clique no marcador!');
        },
    },
};
</script>


<style lang="scss">
.gcl-map-pin{
  font-size: 32px;
}
.map {
  width: 100%;
  height: 800px;

}
</style>
