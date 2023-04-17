<template>
  <div   style="width: 100%; height: 100%; display: flex;flex-direction: column; ">
    <div class="back_home">
      <div v-if="!ISPHONE" class="middle-title">炒饭宇宙</div>
      <div @click="goHome" class="left-title">
        <div >图寻</div>
        <div v-if="ISPHONE" class="desc">炒饭宇宙</div>
      </div>
      <div class="button">
        <!--      <el-button type="primary" @click="goHome" size="mini" round>首页</el-button>-->
        <el-button type="primary" @click="change" size="large" round>换一个</el-button>
<!--        <el-button  @click="shareLink" size="large" round>分享街景</el-button>-->
      </div>
    </div>
    <div id="viewer" class="container" style=""></div>
  </div>
</template>

<script>
import { loadScript } from 'vue-plugin-load-script';
import * as api from '../../api/api';
import {tuxunJump, tuxunOpen} from './common';
export default {
  name: 'pano-gallary',
  data() {
    return {
      panorama: null,
      tuxunPid: null,
      location: null,
      marker: null,
      url: null
    };
  },
  mounted() {
    document.head.insertAdjacentHTML('beforeend', '<style>a[href^="http://maps.google.com/maps"]{display:none !important}a[href^="https://maps.google.com/maps"]{display:none !important}.gmnoprint a, .gmnoprint span, .gm-style-cc {display:none;}</style>');
    this.tuxunPid = this.$route.query.id;
    loadScript('https://i.chao-fan.com/streetview/js-tuxun.js').then(() => {
      this.init();
    });
  },
  methods: {

    init() {
      this.panorama = new google.maps.StreetViewPanorama(
          document.getElementById('viewer'), {
            fullscreenControl:false,
            panControl:false,
            addressControl: false,
            imageDateControl: true,
            motionTrackingControl:false,
            streetViewControl:true,
          }
      );
      this.panorama.registerPanoProvider(this.getCustomPanorama);
      this.change();

    },
    getCustomPanoramaTileUrl(pano, zoom, tileX, tileY) {
      return this.url;
    },
    getCustomPanorama(pano) {
      return {
        location: {
          pano: pano,
        },
        links: [],
        // The text for the copyright control.
        copyright: 'Imagery (c) 2010 Google',
        // The definition of the tiles for this panorama.
        tiles: {
          tileSize: new google.maps.Size(6144, 3072),
          worldSize: new google.maps.Size(6144, 3072),
          // The heading in degrees at the origin of the panorama
          // tile set.
          centerHeading: 0,
          getTileUrl: this.getCustomPanoramaTileUrl,
        },
      };
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    change() {
      api.getByPath('/api/v0/pano/random', ).then(res => {
        if (res.success) {
          this.url = res.data.imageName;
        }
        this.panorama.setPano( res.data.id.toString());
        this.panorama.setZoom(0);
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.back_home {
  background-color: #1C1C2E;
  width: 100%;
  //position: absolute;
  color: white;
  display: flex;
  justify-content: space-between;
  position: relative;

  .left-title {
    font-size: 28px;
    font-weight: bold;
    margin: 0.5rem;
    cursor: pointer;
    .desc {
      font-weight: normal;
      font-size: 16px;
    }
    &:hover {
      transform: scale(1.03);
    }
  }
  .middle-title {
    font-size: 28px;
    font-weight: bold;
    margin: 0.5rem;
    position: absolute;
    height: 100%;
    width: 100%;
    text-align: center;
    justify-content: center;
    justify-items: center;
    pointer-events: none;
  }
  .button {
    align-items: center;
    display: flex;
    height: 100%;
    float: right;
  }
}
.container {
  align-items: stretch;
  flex-grow: 1;
}
.location {
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  bottom: 1rem;
  padding-left: 1rem;
  z-index: 500;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.more {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;

  background-color: #D8DADB;
  z-index: 500;
  .more-item {
    padding-right: 1rem;
    padding-left: 1rem;
    font-size: 10px;
    cursor: pointer;
    &:hover {
      color: -webkit-link;
      text-decoration: underline;
    }
  }
}
</style>
