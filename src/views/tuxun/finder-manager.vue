<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goFinder" size="small" round>寻景首页</el-button>
      <el-button @click="goHome" size="small" round>图寻首页</el-button>
      <el-button @click="finderUpload" size="small" type="primary" round>投稿</el-button>
    </div>

    <div class="top-info top-info-big">
      管理投稿
    </div>

  </div>
</template>

<script>
import * as api from '@/api/api';
import 'viewerjs/dist/viewer.css'
import { api as viewerApi } from "v-viewer"

import {tuxunJump, tuxunOpen} from './common';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

export default {
  name: "finder",
  data() {
    return {
      history: null,
      map: null,
      userId: null,
      type: null,
      userProfile: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
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
        center: [106.0, 38.0],
        zoom: 2, // starting zoom
        minZoom: 0,
        maxZoom: 18,
        dragRotate: false,
      }).addControl(new mapboxgl.AttributionControl({
        compact: false,
        customAttribution: '华为地图 GS（2022）2885号'
      }), 'bottom-left');

      map.on('load', () => {
        document.getElementsByClassName('mapboxgl-ctrl-logo')[0].style.display = 'none';

        // map.addLayer(
        //     {
        //       id: 'country-boundaries',
        //       source: {
        //         type: 'vector',
        //         url: 'mapbox://mapbox.country-boundaries-v1',
        //       },
        //       'source-layer': 'country_boundaries',
        //       type: 'fill',
        //       paint: {
        //         'fill-color': '#d2361e',
        //         'fill-opacity': 0.4,
        //       },
        //     },
        // );
      });

      this.map = map;

      if (this.type === 'manager') {
        this.doLoginStatus().then((res) => {
          if (res) {
            this.getList();
          }
        });
      } else {
        this.getList();
      }
    },
    getList() {
      var group = [];
      api.getByPath( '/api/v0/finder/listOwn').then(res=>{
        if (res.success) {
          for (var i in res.data) {
            var finder = res.data[i];
            if (!finder.img) {
              continue;
            }

            const marker = new mapboxgl.Marker({color: '#FFD326', scale: 0.7})
                .setLngLat([finder.lng, finder.lat])
                .addTo(this.map)

            marker.finder = finder;
            marker.getElement().addEventListener('click', function (e) {

              tuxunJump('https://tuxun.fun/finder-upload?type=modify&id=' + marker.finder.id);
            }.bind(this));
            group.push([finder.lat, finder.lng]);
          }
        }
      });
      if (this.userId) {
        this.map.fitBounds(group)
      }
    },
    finderUpload() {
      api.postByPath('/api/v0/finder/add').then((res) => {
        if (res.success) {
          tuxunJump('/tuxun/finder-upload?id=' + res.data.id);
        }
      });
    },
    finderShow(id) {
      api.getByPath('/api/v0/tuxun/finder/show', {id: id}).then(res => {
        if (res.success) {
        }
      });
    },
    goHome() {
      tuxunJump('/tuxun/')
    },
    goFinder() {
      tuxunJump('/tuxun/event')
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.mapbox-logo{ display: none; } .mapboxgl-ctrl-logo { display: none !important; } .mapbox-improve-map { display: none; } .mapboxgl-ctrl-compass { display: none; }
.mapboxgl-control-container {
  display: none !important;
}
.container {
  position: absolute;
  width: 100%;
  height: 100%;

  .top-info {
    z-index: 20000;
    width: 100%;
    position: absolute;
    margin: 0 auto;
    margin-top: 3rem;
    font-size: 1.2rem;
    font-weight: bold;
    pointer-events: none;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    text-align: center;
    justify-content: center;
  }
  .top-info-big {
    font-size: 32px;
  }
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
