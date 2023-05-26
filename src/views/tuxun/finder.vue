<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
      <el-button @click="$toast('开发中')" size="small" type="primary" round>投稿</el-button>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './SmoothWheelZoom';
import {tuxunJump, tuxunOpen} from './common';

export default {
  name: "finder",
  data() {
    return {
      history: null,
      map: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.history = history;
      var map = L.map('map', {
        attributionControl: true,
        worldCopyJump: true,
        coordType: 'gcj02',
        scrollWheelZoom: false, // disable original zoom function
        smoothWheelZoom: true,  // enable smooth zoom
        smoothSensitivity: 3,   // zoom speed. default is 1
        maxBoundsViscosity: 1.0,
        maxBounds: [[-90, -540], [90, 540]]
      }).setView([38.8, 106.0], 2);
      map.scrollWheelZoom = true;
      map.attributionControl.setPosition('bottomleft');
      map.zoomControl.setPosition('bottomright');
      map.attributionControl.setPrefix('华为地图');
      map.attributionControl.addAttribution('GS（2022）2885号');
      var url = 'https://map.chao-fan.com/tile/s2_z{z}_x{x}_y{y}.png';
      if(this.ISPHONE){
        url = 'https://map.chao-fan.com/tile/s1_z{z}_x{x}_y{y}.png';
      }
      L.tileLayer(url, {
        maxZoom: 18,
        minZoom: 1,
      }).addTo(map);
      this.map = map;
    },
    goHome() {
      tuxunJump('/tuxun/')
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
