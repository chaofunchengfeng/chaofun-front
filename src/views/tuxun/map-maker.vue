<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button  @click="saveAndBack" size="small" round>添进题库({{panoIds.length}})</el-button>
    </div>
    <div class="top-right">
      <el-button  @click="keep" size="small" round>保留</el-button>
    </div>
    <div id="viewer" class="pano"></div>
    <div id="map" class="maps"></div>
  </div>
</template>

<script>
import { loadScript } from 'vue-plugin-load-script';
import * as api from "../../api/api";
import VueResource from 'vue-resource'


export default {
  name: "map-maker",
  data() {
    return {
      viewer: null,
      history: null,
      tempMarker: null,
      panoId: null,
      panoIds: [],
      saveMarkers: [],
      headingMap: {},
      marker: null,
      mapsId: null,
      map: null
    }
  },
  mounted() {
    this.history = history;
    this.mapsId = this.$route.query.mapsId;
    setTimeout(()=> {
      this.init();
    }, 1000);
  },
  methods: {
    getPano(x, y) {
      this.$http.get('https://mapsv0.bdimg.com/?qt=qsdata&x=' + x +'&y=' + y + '&radius=1000').then(function (res) {
        this.getPanoInfo(res.data.content.id, true);
      });
    },
    init() {
      loadScript('https://api.map.baidu.com/getscript?type=webgl&v=2.0&ak=8SxUOHa0BBxGTH0aWmjXM2OqDB26AG7S&services=20230613170744').then(() => {
        var map = new BMapGL.Map('map', {
          maxZoom: 21,
        });
        var point = new BMapGL.Point(116.403850, 39.913795);
        map.centerAndZoom(point, 10);
        map.enableScrollWheelZoom();

        map.addTileLayer(new BMapGL.PanoramaCoverageLayer());


        this.map = map;
        this.map.addEventListener('click', function(e) {
          console.log(e);
          this.getPano(e.point.lng, e.point.lat);
                       // 将标注添加到地图中
        }.bind(this));

      });

      loadScript('https://i.chao-fan.com/streetview/js-tuxun-v1.js').then(() => {
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
            this.getPanoInfo(this.viewer.getPano(), false);
          }
        });
        this.viewer.addListener('status_changed', () => {
          console.log(this.viewer.getStatus());
          if (this.viewer.getStatus() && this.viewer.getStatus() !== 'OK') {
            api.getByPath("/api/v0/tuxun/client/report", {panoId: this.viewer.getPano(), status: this.viewer.getStatus(), page: 'tuxun_pano_filter'}).then(res => {
            });
          }
        });
      });
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
    getCustomPanorama(pano, zoom,tileX,tileY,callback) {
      console.log('getCustomPanorama');
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
    setGoogle(panoId) {
      this.viewer.setPano(panoId);
      this.viewer.setVisible(true);
      setTimeout(() => {
        this.viewer.setZoom(0);
      }, 50);
    },
    getPanoInfo(pano, set) {
      this.panoId = pano;
      api.getByPath('/api/v0/tuxun/mapProxy/getPanoInfo', {pano: pano}).then(res => {
        console.log(res);
        this.viewer.setLinks(res.data.links);
        // this.centerHeading = res.data.heading;
        this.headingMap[res.data.pano] = res.data.heading;
        if (res.data.links) {
          res.data.links.forEach((item) => {
            this.preloadImage(item.pano);
            this.headingMap[item.pano] = item.centerHeading;
          });
        }

        if (set) {
          this.setGoogle(pano);
        }

        if (this.saveMarkers.indexOf(this.marker) === -1 && this.marker) {
          this.marker.remove();
        }
        this.marker = new BMapGL.Marker(new BMapGL.Point(res.data.bd09Lng, res.data.bd09Lat));
        this.map.addOverlay(this.marker);

      });
    },
    preloadImage(pano) {
      var img = new Image();
      img.src = 'https://map.chao-fan.com/bd/thumb/' + pano;
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
    goHome() {
      tuxunJump('/tuxun/')
    },
    keep() {
      if (this.panoId) {
        this.panoIds.push(this.panoId);
        this.saveMarkers.push(this.marker);
      }
    },
    saveAndBack() {
      if (this.panoIds.length === 0) {
        this.$toast('你没有保留街景');
      } else {
        api.getByPath('/api/v0/tuxun/maps/mapAddPano', {panoIds: this.panoIds.join(","), platform: 'baidu_pano', mapsId: this.mapsId}).then(res => {
          if (res.success) {
            this.$toast('添加成功')
            setTimeout(()=> {
              window.history.back();
            }, 1000);
          }
        });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "https://api.map.baidu.com/res/webgl/10/bmap.css";

.container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;

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
  .pano{
    width: 60%;
    height: 100%;
  }
  .maps {
    width: 40%;
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

  .top-right {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 500;
  }
}
@media only screen and (max-width: 768px) {
  .container {
    display: block;
    .pano {
      width: 100%;
      height: 60%;
    }

    .maps {
      width: 100%;
      height: 40%;
    }
  }
}
</style>
