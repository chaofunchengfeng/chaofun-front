<template>
  <div>
    <div style="position: absolute; width: 100%; height: 100%" id="viewer"></div>
    <div class="confirm">
      剩余 {{totalCount}}
      <el-button @click="check" style="white-space: pre-line;">加入题库(空格键)</el-button>
      <el-button @click="deleteQ"  style="white-space: pre-line;">删除题目(删除键)</el-button>
      <el-button @click="next"  style="white-space: pre-line;">黑屏刷新</el-button>
    </div>
    <div v-if="this.mapsName" class="info">
      用户投稿练习题库：{{this.mapsName}}
    </div>
    <div v-if="this.nation" class="location" >
      {{this.nation}}
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { loadScript } from 'vue-plugin-load-script';

import BaiduMap from 'vue-baidu-map';
import { mapGetters } from 'vuex';
import * as api from '../../api/api';
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'GZPIvvSbzgo188vmBGwPOtU2ZCHDhkry'
});
export default {
  name: 'TXAmin',
  data () {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3,
      lng: null,
      lat: null,
      targetLng: null,
      targetLat: null,
      map: null,
      BMap: null,
      confirmed: false,
      polylinePath: null,
      returnResult: true,
      mapsName: undefined,
      distance: null,
      image: null,
      id: null,
      queryId: null,
      viewer: null,
      index: -1,
      totalCount: null,
      nation: null,
      mapsid: undefined,
      headingMap: {},
    };

  },
  mounted() {
    // if (!location.host.includes('tuxun.fun') && !location.host.includes('8099')) {
    //   window.location.href = 'https://tuxun.fun/admin';
    // }
    this.queryId = this.$route.query.id;
    this.mapsid = this.$route.query.mapsid;

    console.log(this.queryId);
    let self = this;
    document.onkeydown = function(event){
      console.log('hahah');
      var e = event || window.event || arguments.callee.caller.arguments[0];
      console.log(e);
      //
      // if(e && e.keyCode==37){//左
      //     self.last()
      // }
      if(e && e.keyCode == 32){//上
        self.check();
      }
      // if(e && e.keyCode==39){//右
      //     self.next()
      // }

      if(e && e.keyCode == 8){//下
          self.deleteQ();
      }
    };

    this.doLoginStatus().then((res) => {
      this.next();
    });
  },
  methods: {
    handler ({BMap, map}) {
      console.log(BMap, map);
      this.center.lng = 106.0;
      this.center.lat = 38.8;
      this.zoom = 5;
      this.map = map;
      this.BMap = BMap;

    },

    click(e) {
      if (!this.confirmed) {
        console.log(e);
        console.log('123');

        // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        console.log(e.Bg);
        this.lng = e.point.lng;
        this.lat = e.point.lat;
      }
    },
    deleteQ() {
        api.getByPath('/api/v0/tuxun/game/delete', {panoId: this.panoId}).then(res => {
          this.index = this.index - 1;
          if (this.queryId !== null && this.queryId) {
            window.close();
          } else {
            this.next();
          }
        });
    },

    last() {
      this.index  = this.index - 2 ;
      this.next();
    },

    check() {
      if (this.queryId !== null && this.queryId) {
        window.close();
        return;
      }
      api.getByPath('/api/v0/tuxun/game/check', {id: this.id}).then(res => {
        this.index = this.index - 1;
        this.next();
      });
    },

    next() {
      this.doLoginStatus().then(res => {
        console.log(res);
        if (res) {
          this.confirmed = false;
          this.returnResult = true;
          this.polylinePath = false;
          this.lng = null;
          this.lat = null;
          this.targetLat = null;
          this.targetLng = null;
          this.image = null;
          this.distance = null;
          this.index = this.index + 1;
          if (this.queryId !== null && this.queryId) {
            api.getByPath('/api/v0/tuxun/game/getContent', {id: this.queryId}).then(res => {
                  this.image = res.data.content;
                  this.panoId = res.data.panoId;
                  this.id = res.data.id;
                  this.totalCount = res.data.totalCount;
                }
            );
          } else {
            api.getByPath('/api/v0/tuxun/game/generateQueue', {index: this.index, mapsId: this.mapsid}).then(res => {
                  this.id = res.data.id;
                  this.panoId = res.data.panoId;
                  this.totalCount = res.data.totalCount;
                  this.mapsName = res.data.mapsName;
                  this.nation = res.data.nation;
                  this.headingMap[this.panoId] = res.data.heading;
                  this.setPano();
                }
            );
          }
        }
      });
    },

    setPano() {
      if (!this.viewer) {
        document.head.insertAdjacentHTML('beforeend', '<style>a[href^="http://maps.google.com/maps"]{display:none !important}a[href^="https://maps.google.com/maps"]{display:none !important}.gmnoprint a, .gmnoprint span, .gm-style-cc {display:none;}</style>');
        this.sharePanoId = this.$route.query.pano;
        loadScript('https://chaofun.oss-cn-hangzhou.aliyuncs.com/st_v1/js_test_v5.js').then(() => {
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
              this.getPanoInfo(this.viewer.getPano());
            }
          });
          this.viewer.addListener('status_changed', () => {
            console.log(this.viewer.getStatus());
            if (this.viewer.getStatus() && this.viewer.getStatus() !== 'OK') {
              api.getByPath("/api/v0/tuxun/client/report", {panoId: this.viewer.getPano(), status: this.viewer.getStatus(), page: 'tuxun_pano_filter'}).then(res => {
              });
            }
          });
          this.setGoogle(this.panoId);
        });
      } else {
        this.setGoogle(this.panoId);
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
    getCustomPanorama(pano) {
      console.log(pano);
      if (pano.length === 27) {
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
    getPanoInfo(pano) {
      api.getByPath('/api/v0/tuxun/mapProxy/getPanoInfo', {pano: pano}).then(res => {
        this.viewer.setLinks(res.data.links);
        // this.centerHeading = res.data.heading;
        this.headingMap[res.data.pano] = res.data.centerHeading;
        if (res.data.links) {
          res.data.links.forEach((item) => {
            this.preloadImage(item.pano);
            this.headingMap[item.pano] = item.centerHeading;
          });
        }
        // console.log(this.centerHeading);
      });
    },
    setGoogle(panoId) {
      this.viewer.setPano(panoId);
      this.viewer.setVisible(true);
      setTimeout(() => {
        this.viewer.setZoom(0);
      }, 50);
    },
    preloadImage(pano) {
      var img = new Image();
      img.src = 'https://map.chao-fan.com/bd/thumb/' + pano;
    },

    mapReady(e) {
      console.log('hahah');
      console.log(e);
      this.map = e;
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  z-index: 5000;
  font-size: 32px;
  position: absolute;
  left: 2rem;
  right: 2rem;
  -webkit-text-stroke: 0.5px white;
}
.im-view {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  object-fit: contain;
}
.bm-view {
  position: absolute;
  width: 40%;
  height: 100%;
  bottom: 0;
  right: 0;
}

.confirm {
  position: absolute;
  z-index: 5000;
  bottom: 30px;
  right: 30px;
}
.location {
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding-left: 1rem;
  z-index: 5000;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
</style>
