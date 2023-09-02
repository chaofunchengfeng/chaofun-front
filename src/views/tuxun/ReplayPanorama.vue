<template>
  <div class="container">
    <div id="viewer"  style="position: absolute; width: 100%; height: 100%"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goReplay" size="small" round>返回复盘</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
      <el-button @click="showReport = true" size="small"  round> 坏题反馈 </el-button>
      <el-button v-if="roundData" size="mini"  @click="reset" round> 回到原点</el-button>
    </div>
    <report-pano v-if="gameData && showReport" :maps-id="gameData.mapsId" :pano-id="panoId" @hide="showReport = false"></report-pano>
  </div>
</template>

<script>
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

import ReportPano from  './component/report-pano'
import RoundInfo from "./component/round-info";
import EmojiSender from "./EmojiSender";
import Matching from "./Matching";
import GameHeaderTitle from "./component/game-header-title";
export default {
  name: 'ReplayPanorama',
  components: {ReportPano},

  data() {
    return {
      gameId: null,
      round: null,
      roundData: null,
      history: null,
      gameData: null,
      image: null,
      viewer: null,
      showReport: false,
      panoId: null,
      headingMap: {},
      baiduPanos: new Set(),
    };
  },
  mounted() {
    this.history = history;
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
              this.gameData = res.data;
              if (res.data.type === 'infinity') {
                this.roundData = res.data.rounds[0];
              } else {
                this.roundData = res.data.rounds[this.round - 1];
              }
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
        loadScript('https://i.chao-fan.com/st_v2/js_test_v5.js').then(() => {
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

          this.viewer.registerPanoProvider(this.getCustomPanorama);
          this.viewer.addListener('pano_changed', () => {
            console.log('pano_changed');
            if (this.viewer.getPano().length === 27) {
              this.getBaiduPanoInfo(this.viewer.getPano());
            }
          });

          this.viewer.addListener('status_changed', () => {
            console.log(this.viewer.getStatus());
            if (this.viewer.getStatus() && this.viewer.getStatus() !== 'OK') {
              api.getByPath("/api/v0/tuxun/client/report", {
                panoId: this.viewer.getPano(),
                status: this.viewer.getStatus(),
                page: 'tuxun_pano_filter'
              }).then(res => {
              });
            }
          });

          this.setPanoId(round);
        });
      } else {
        this.setPanoId(round);
      }
    },

    getCustomPanorama(pano) {
      console.log(pano);
      if (this.baiduPanos.has(pano)) {
        return {
          location: {
            pano: pano,
          },
          links: [],
          // The text for the copyright control.
          copyright: 'baidu',
          // The definition of the tiles for this panorama.
          tiles: {
            tileSize: new google.maps.Size(512, 512),
            worldSize: new google.maps.Size(8192, 4096),
            // The heading in degrees at the origin of the panorama
            centerHeading: this.headingMap[pano] ?? 0,
            getTileUrl: this.getCustomPanoramaTileUrl,
          },
        };
      }
    },

    getCustomPanoramaTileUrl(pano, zoom, tileX, tileY) {
      zoom = zoom += 1;
      if (zoom === 1) {
        return (
            'https://map.chao-fan.com/bd/thumb/' + pano
        );
      }
      return (
          'https://mapsv1.bdimg.com/?qt=pdata&sid=' + pano + '&pos=' + tileY + '_' + tileX + '&z=' + zoom
      );

    },

    reset() {
      this.setPanoId(this.roundData);
    },

    setPanoId(round) {
      this.panoId = round.panoId;
      if (round.source === 'baidu_pano') {
        this.getBaiduPanoInfo(round.panoId, true, round);
      } else if (round.source === 'tuxun_pano') {
        this.setViewer(round, round.originPanoId);
      } else {
        this.setViewer(round);
      }
    },

    getBaiduPanoInfo(pano, set, round) {
      this.baiduPanos.add(pano);
      api.getByPath('/api/v0/tuxun/mapProxy/getPanoInfo', {pano: pano}).then(res => {
        // this.centerHeading = res.data.heading;
        this.headingMap[res.data.pano] = res.data.centerHeading;
        if (res.data.links) {
          res.data.links.forEach((item) => {
            this.baiduPanos.add(pano);
            this.preloadImage(item.pano);
            this.headingMap[item.pano] = item.centerHeading;
          });
        }
        if (set) {
          this.setViewer(round);
        }
        setTimeout(() => {
          this.viewer.setLinks(res.data.links);
        }, 100)
        // console.log(this.centerHeading);
      });
    },
    preloadImage(pano) {
      var img = new Image();
      img.src = 'https://map.chao-fan.com/bd/thumb/' + pano;
    },

    setViewer(round, panoId) {
      if (panoId) {
        this.viewer.setPano(panoId);
      } else {
        this.viewer.setPano(round.panoId);
      }
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
