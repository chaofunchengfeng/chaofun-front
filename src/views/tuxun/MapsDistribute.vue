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
    var url = 'https://map.chao-fan.com/tile/s2_z{z}_x{x}_y{y}.png';
    var tileSize = 512;
    if(this.ISPHONE) {
      url = 'https://map.chao-fan.com/tile/s1_z{z}_x{x}_y{y}.png';
      tileSize = 256;
    }
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
        console.log(res.data);
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

      for (var i in data) {
        var latlng = data[i];
        const marker = new mapboxgl.Marker({color: '#FFD326'})
            .setLngLat([latlng.lng, latlng.lat])
            .addTo(this.map)

        marker.latlng = latlng;
        var popup = new mapboxgl.Popup({ autoClose: false, closeOnClick: false , autoPan: false})
            .setHTML('<p style="cursor: pointer; color: red" onclick="aFun('+ latlng.containId + ')">删除</p>')
        // .setLatLng([latlng.lat, latlng.lng]);

        marker.setPopup(popup);

        marker.getElement().addEventListener('click', function (e) {
          if (!this.manager) {
            this.toPanorama(marker.latlng);
          }  else {
            marker.getPopup().togglePopup();
          }
        }.bind(this));
        this.markers.push(marker);
        group.push([latlng.lng, latlng.lat]);
      };

      if (shouldFit) {
        this.map.fitBounds(group);
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
      tuxunJump('/tuxun/');
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
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
