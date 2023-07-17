<template>
  <div class="container">
    <div id="viewer"  style="position: absolute; width: 100%; height: 100%"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button v-else @click="goReplay" size="small" round>返回复盘</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
      <el-button @click="toReport" size="small"  round> 坏题反馈 </el-button>
      <el-button v-if="roundData" size="mini"  @click="reset" round> 回到原点</el-button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import * as api from '../../api/api';
import {Viewer} from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';
import { CompassPlugin} from 'photo-sphere-viewer/dist/plugins/compass';
import { MarkersPlugin} from 'photo-sphere-viewer/dist/plugins/markers';
import { VirtualTourPlugin } from 'photo-sphere-viewer/dist/plugins/virtual-tour';
import 'photo-sphere-viewer/dist/plugins/compass.css';
import 'photo-sphere-viewer/dist/plugins/virtual-tour.css';
import 'photo-sphere-viewer/dist/plugins/markers.css';
import { loadScript } from 'vue-plugin-load-script';
import {tuxunJump, tuxunOpen} from './common';

export default {
  name: 'ReplayPanorama',
  data() {
    return {
      gameId: null,
      round: null,
      roundData: null,
      history: null,
      gameData: null,
      image: null,
      viewer: null
    };
  },
  mounted() {
    this.history = history;
    THREE.Cache.enabled = false;
    this.gameId = this.$route.query.gameId;
    this.round = this.$route.query.round;
    document.title = '第' + this.round + '轮复盘';
    this.get();
  },
  methods: {
    get() {
      this.doLoginStatus().then((res) => {
        if (res) {
          api.getByPath('/api/v0/tuxun/solo/get', {gameId: this.gameId}).then(res => {
            console.log(res.data);
            if (res.success) {
              this.roundData = res.data.rounds[this.round - 1];
              this.render(this.roundData);
            }
          });
        }
      });
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    goBack() {
      window.history.back();
    },
    toReport() {
      api.getByPath('/api/v0/tuxun/game/report', {panoId: this.round.panoId}).then(res => {
        this.$toast('反馈成功');
      });
    },
    goReplay() {
      tuxunJump('/tuxun/replay?gameId=' + this.gameId);
    },
    render(round) {
      console.log(round);
      if (!this.viewer) {
        document.head.insertAdjacentHTML('beforeend', '<style>a[href^="http://maps.google.com/maps"]{display:none !important}a[href^="https://maps.google.com/maps"]{display:none !important}.gmnoprint a, .gmnoprint span, .gm-style-cc {display:none;}</style>');
        this.sharePanoId = this.$route.query.pano;
        loadScript('https://i.chao-fan.com/streetview/js-tuxun-v3.js').then(() => {
          this.viewer = new google.maps.StreetViewPanorama(
              document.getElementById('viewer'), {
                fullscreenControl: false,
                panControl: true,
                addressControl: false,
                imageDateControl: false,
                motionTracking: false,
                motionTrackingControl: false,
                streetViewControl: false,
                showRoadLabels: false,
                scaleControl: false,
                zoomControl: false,
                panControlOptions: {
                  position: google.maps.ControlPosition.BOTTOM_LEFT,
                },
              }
          );
          this.setGoogle(round);
        });
      } else {
        this.setGoogle(round);
      }
    },
    reset() {
      this.setGoogle(this.roundData);
    },
    setGoogle(round) {
      this.viewer.setPano(round.panoId);
      if (round.vHeading) {
        this.viewer.setPov({
          heading: round.vHeading,
          pitch: round.vPitch,
        });
      } else if (!round.pan) {
        this.viewer.setPov({
          heading: 0,
          pitch: round.vPitch,
        });
      }

      if (round.vZoom) {
        this.viewer.setZoom(round.vZoom);
      } else {
        this.viewer.setZoom(0);
      }

      this.viewer.setVisible(true);
      setTimeout(() => {
        this.viewer.setZoom(0);
      }, 50);
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  .back_home {
    position: fixed;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 500;
  }
}
</style>
