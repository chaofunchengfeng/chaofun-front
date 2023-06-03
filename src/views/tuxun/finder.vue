<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goFinder" v-if="userId" size="small" round>寻景首页</el-button>
      <el-button @click="goHome" size="small" round>图寻首页</el-button>
      <el-button v-if="!userId" @click="finderUpload" size="small" type="primary" round>投稿</el-button>
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
      api.getByPath('/api/v0/finder/list', {userId: this.userId}).then(res=>{
        if (res.success) {
          for (var i in res.data) {
            var finder = res.data[i];
            if (!finder.img) {
              continue;
            }
            var options = JSON.parse(JSON.stringify(L.Icon.Default.prototype.options));
            options.iconUrl = this.imgOrigin + 'biz/1662830770348_9499340182724556af66f2b42846135b_0.png';
            options.iconRetinaUrl = this.imgOrigin + 'biz/1662830707508_d7e5c8ce884a4fb692096396a5405f5b_0.png';
            // circleMarker 不好点击
            var marker = L.marker([finder.lat, finder.lng],  {icon: new L.Icon(options)}).addTo(this.map);

            marker.finder = finder;
            var popup = null;
            if (!this.userId) {
              popup = L.popup()
                  .setContent('<a href="https://tuxun.fun/finder?userId=' + finder.user.userId + '" target="_blank">' + finder.user.userName + '</a>')

              marker.bindPopup(popup);
              marker.on('mouseover', function (e) {
                e.target.openPopup();
                e.target.clickOpen = false;
              });
              marker.on('mouseout', function (e) {
                if (!e.target.clickOpen) {
                  setTimeout(() => {
                    e.target.closePopup();
                  }, 2000);
                }
              });
            }
            marker.on('click', function (e) {
              console.log(e);
              if (!this.userId) {
                e.target.clickOpen = true;
                e.target.openPopup();
              }

              api.getByPath('/api/v0/finder/show', {id: e.target.finder.id}).then(res=>{
              });

              const $viewer = viewerApi({
                options: {
                  navbar: false,
                  toolbar: false,
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
    goFinder() {
      tuxunJump('/tuxun/finder')
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
