<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button v-else @click="goHome" size="small" round>首页</el-button>
      <el-button v-if="manager" @click="changeNormal" size="small" round>回到浏览模式</el-button>
      <el-button v-else @click="changeManager" size="small" round>开启管理模式</el-button>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import {tuxunJump, tuxunOpen} from './common';


import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

export default {
  name: 'tuxun-maps-distribute',
  data() {
    return {
      gameId: null,
      map: null,
      mapsId: null,
      history: null,
      deleteOn: false,
      manager: false,
      markers:[],
    };
  },
  created() {
    window.aFun = this.delete;
  },
  mounted() {
    this.history = history;
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2lqaWFuenkiLCJhIjoiY2w3b2lobGhyMHJ0NTN2bnZpaDhseWJjaCJ9.wxEifLVemNWxe1GKqmUnPw';
    var url = 'https://maprastertile-drcn.dbankcdn.cn/display-service/v1/online-render/getTile/CN.23.04.11.00/{z}/{x}/{y}/?language=zh&p=46&scale=2&mapType=ROADMAP&presetStyleId=standard&key=DAEDANitav6P7Q0lWzCzKkLErbrJG4kS1u%2FCpEe5ZyxW5u0nSkb40bJ%2BYAugRN03fhf0BszLS1rCrzAogRHDZkxaMrloaHPQGO6LNg==';
    var tileSize = 512;
    const map = new mapboxgl.Map({
      attributionControl: false,
      container: 'map', // container ID
      // style: 'mapbox://styles/mapbox/streets-v11', // style URL
      style: {
        "version": 8,
        "sources": {
          "raster-tiles": {
            "type": "raster",
            "tiles": [url],
            "tileSize": tileSize
          }
        },
        "layers": [{
          "id": "simple-tiles",
          "type": "raster",
          "source": "raster-tiles",
          "minZoom": 0,
          "maxZoom": 18
        }]
      },
      zoom: 2, // starting zoom
      minZoom: 0,
      maxZoom: 18,
      dragRotate: false,
      preferCanvas: true,
    }).addControl(new mapboxgl.AttributionControl({
      compact: false,
      customAttribution: '华为地图 GS（2022）2885号'
    }), 'bottom-left');

    map.on('load', () => {
      document.getElementsByClassName('mapboxgl-ctrl-logo')[0].style.display = 'none';
    });
    this.map = map;
    this.mapsId = this.$route.query.mapsId;
    this.get();
  },
  methods: {
    get() {
      api.getByPath('/api/v0/tuxun/maps/listSimplePano', {mapsId: this.mapsId}).then(res => {
        if (res.success) {
          this.addMarker(res.data);
        }
      });
    },

    delete(id) {
      this.$confirm('此操作将删除该街景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.getByPath('/api/v0/tuxun/maps/deletePano', {containId: id}).then(res=>{
          this.get();
        });
      }).catch(() => {

      });
    },
    addMarker(data) {
      var group = [];
      this.markers.forEach(v => {
        v.remove();
      });
      var shouldFit = true;
      if (this.markers.length > 0) {
        shouldFit = false;
      }
      this.markers = [];

      this.map.loadImage( this.imgOrigin + 'biz/1662830770348_9499340182724556af66f2b42846135b_0.png',
          (error, image) => {
            if (error) throw error;
            this.map.addImage('custom-marker', image);
          }
      );


      var bounds = new mapboxgl.LngLatBounds();

      var features=[];
      for (var i in data) {
        var finder=data[i];
        features.push({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [
              finder.lng, finder.lat
            ]
          },
          'properties': {
            // "marker-symbol": "marker-15",
            'finder': finder
          }
        });
        bounds.extend([finder.lng, finder.lat])
      }

      this.map.addSource('points', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': features
        }
      });

      // Add a symbol layer
      this.map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
          'icon-image': 'custom-marker',
          'icon-anchor': 'bottom',
          'icon-size': 0.7,
          'icon-allow-overlap':true
        }
      });


      this.map.on('click', 'points', (e) => {
        const finder=eval("(" + e.features[0].properties.finder + ")");
        const coordinates = e.features[0].geometry.coordinates.slice();

        if (!this.manager) {
          this.toPanorama(finder);
        }  else {
          new mapboxgl.Popup().setLngLat(coordinates)
              .setHTML('<p style="cursor: pointer; color: red" onclick="aFun('+ finder.containId + ')">删除</p>')
              .addTo(this.map);
        }

      });

      console.log(group);

      if (shouldFit) {
        this.map.fitBounds(bounds, {padding: {top: 10, bottom:25, left: 15, right: 5}});
      }
    },

    toPanorama(latlng) {
      // console.log(round);
      if (!latlng.source || !latlng.panoId ) {
        this.$toast('该街景暂不支持跳转');
        return;
      }
      if (latlng.source === 'baidu_pano') {
        tuxunOpen('https://maps.baidu.com/#panoid=' + latlng.panoId + '&panotype=street&pitch=0&l=13&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=' + latlng.panoId);
      } else {
        if (latlng.panoId.indexOf('AF') === 0) {
          tuxunOpen('https://www.google.com/maps/@0.0,0.0,3a,75y,90t/data=!3m7!1e1!3m5!1s' + latlng.panoId +  '!2e10!3e11!7i8192!8i4096');
        } else {
          tuxunOpen('https://www.google.com/maps/@?api=1&map_action=pano&pano=' + latlng.panoId);
        }
      }
    },
    goHome() {
      tuxunJump('https://tuxun.fun/');
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('https://tuxun.fun/');
      }
    },
    changeManager() {
      this.manager = true;
    },
    changeNormal() {
      this.manager = false;
    },

  }
};
</script>

<style lang="scss" scoped>

.container {
  position: absolute;
  width: 100%;
  height: 100%;
  .maps {
    position: absolute;
    width: 100%;
    height: 100%;
    //width: 50%;
    //height: 50%;
  }
  .back_home {
    position: fixed;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 500;
  }
}
</style>
