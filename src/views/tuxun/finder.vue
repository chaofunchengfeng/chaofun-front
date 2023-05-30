<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
      <el-button @click="finderUpload" size="small" type="primary" round>投稿</el-button>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import 'viewerjs/dist/viewer.css'
import { api as viewerApi } from "v-viewer"

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
      this.getList();
    },
    getList() {
      api.getByPath('/api/v0/finder/list').then(res=>{
        if (res.success) {
          for (var i in res.data) {
            var finder = res.data[i];
            if (!finder.img) {
              continue;
            }
            var options = JSON.parse(JSON.stringify(L.Icon.Default.prototype.options));
            options.iconUrl = 'https://www.google.com/maps/vt/icon/name=assets/icons/imagery/pano_outside-2-medium.png,assets/icons/imagery/pano_inside-2-medium.png&highlight=129eaf,cbf0f8?scale=1';

            options.iconRetinaUrl = 'https://www.google.com/maps/vt/icon/name=assets/icons/imagery/pano_outside-2-medium.png,assets/icons/imagery/pano_inside-2-medium.png&highlight=129eaf,cbf0f8?scale=2';
            var marker = L.circleMarker([finder.lat, finder.lng], {
              radius : 4,
              weight: 1.5,
              color  : '#149EAE',
              opacity: 0.85,
            }).addTo(this.map);

            marker.finder = finder;
            marker.on('click', function (e) {
              console.log(e);
              const $viewer = viewerApi({
                options: {
                  toolbar: true,
                  url: 'data-source',
                  initialViewIndex: 0
                },
                images: [{'src': this.imgOrigin + e.target.finder.img, 'data-source': this.imgOrigin + e.target.finder.img}]
              })

            }.bind(this));
          }
        }
      });
    },
    finderUpload() {
      api.postByPath('/api/v0/finder/add').then((res) => {
        if (res.success) {
          tuxunJump('/tuxun/finder-upload?id=' + res.data.id);
        }
      });
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
