<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goFinder" v-if="userId" size="small" round>寻景首页</el-button>
      <el-button @click="goHome" size="small" round>图寻首页</el-button>
      <el-button @click="finderUpload" size="small" type="primary" round>投稿</el-button>
      <el-button @click="toManager" size="small"  round>管理投稿</el-button>
    </div>

    <div v-if="userProfile" class="top-info">
      {{userProfile.userAO.userName}} 的投稿
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
      userProfile: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.history = history;
      this.userId = this.$route.query.userId;
      if (this.userId) {
        api.getByPath('/api/v0/tuxun/getProfile', {userId: this.userId}).then(res=>{
          this.userProfile = res.data;
        });
      }
      mapboxgl.accessToken = 'pk.eyJ1IjoiY2lqaWFuenkiLCJhIjoiY2w3b2lobGhyMHJ0NTN2bnZpaDhseWJjaCJ9.wxEifLVemNWxe1GKqmUnPw';
      var url = 'https://map.chao-fan.com/tile230411/s2_z{z}_x{x}_y{y}.jpeg';
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
      });

      this.map = map;
      this.getList();
    },
    getList() {
      var group = [];
      api.getByPath('/api/v0/finder/list', {userId: this.userId}).then(res=>{
        if (res.success) {
          for (var i in res.data) {
            var finder = res.data[i];
            if (!finder.img) {
              continue;
            }

            const marker = new mapboxgl.Marker({color: '#FFD326', scale: 0.7})
                .setLngLat([finder.lng, finder.lat])
                .addTo(this.map)
            if (!this.userId) {
              const popup = new mapboxgl.Popup()
                  .setHTML('<a href="https://tuxun.fun/finder?userId=' + finder.user.userId + '" target="_blank">' + finder.user.userName + '</a>')
              marker.setPopup(popup);
            }

            marker.finder = finder;
            marker.getElement().addEventListener('click', function (e) {
              this.finderShow(marker.finder.id);
              const $viewer = viewerApi({
                options: {
                  toolbar: true,
                  url: 'data-source',
                  initialViewIndex: 0
                },
                images: [{'src': this.imgOrigin + marker.finder.img, 'data-source': this.imgOrigin + marker.finder.img}]
              })
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
    toManager() {
      this.doLoginStatus().then((res) => {
        if (res) {
          tuxunJump('/tuxun/finder-manager');
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

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
