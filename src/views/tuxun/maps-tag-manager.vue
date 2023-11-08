<template>
  <div class="container">
    <div class="back_home" >
      <el-button v-if="history && history.length !== 1" @click="goBack" size="mini" round>←返回</el-button>
      <el-button @click="goHome" size="mini" round>首页</el-button>
    </div>
    <div class="main">
      <div class="left">
        <div id="map" class="map" style="width: 100%; height: 100vh"></div>
      </div>

      <div class="op">
        <div class="filter" v-show="type==='filter'">
          <div class="tag-title">标签筛选</div>
          <div class="tags" v-if="tags">
            <el-button v-for="(tag, index) in tags" :key="tag.tag" :type="chooseTag === tag.tag ? 'primary': 'normal'" size="mini" @click="changeTag(tag.tag)">
              {{tag.tag}} ({{tag.count}})
            </el-button>
          </div>
          <div style="display: block; text-align: left; padding-top: 5px">
            <el-checkbox v-model="all" @change="changeAll">全部</el-checkbox>
            <el-checkbox v-model="noTag" @change="changeNoTag">无标签</el-checkbox>
            <el-checkbox v-model="reverse" @change="changeReverse">反选</el-checkbox>
          </div>

          <div class="tag-title" style="padding-top: 10px">操作选中</div>
          <div style="text-align: left">
            <el-button @click="batchAdd=true;inputTag=null;">
              打标签
            </el-button>
            <div v-if="batchAdd" style="padding-bottom: 20px">
              <el-input v-model="inputTag" placeholder="请输入标签">
              </el-input>
              <el-button @click="addTagByFilter">确定</el-button>
              <el-button @click="batchAdd=false; inputTag = null;">取消</el-button>
            </div>
            <el-button @click="cleanTagByFilter">
              清空标签
            </el-button>
            <el-button @click="deleteByFilter">
              删除街景
            </el-button>
          </div>
        </div>

        <div class="filter" v-show="type==='choose'">
          <div style="display: flex">
            <div class="tag-title">选中</div>
            <el-button @click="cancelChoose">取消选中</el-button>
            <el-button @click="deletePano">删除街景</el-button>
          </div>
          <div v-show="type==='choose'" id="viewer"  style="height: 50vh"></div>
          <div class="tag-title">打标签:</div>
          <div>
            <el-input placeholder="新标签" v-model="inputTag"></el-input>
            <el-button @click="addInputTag">添加</el-button>
          </div>
          <div style="display: flex;  flex-wrap: wrap; ">
            <el-button v-for="(tag, index) in tags" :key="tag.tag" :type="panoTags.indexOf(tag.tag) !== -1 ? 'primary': 'normal'" size="mini" @click="panoTags.indexOf(tag.tag) !== -1 ? removeTag(tag.tag) : addTag(tag.tag)">
              {{tag.tag}}
            </el-button>
          </div>
          <div v-if=""></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as api from '@/api/api';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { loadScript } from 'vue-plugin-load-script';
import { Dialog } from 'vant';




export default {
  name: "maps-tag-manager",
  data() {
    return {
      mapsId: null,
      map: null,
      history: null,
      chooseTag: null,
      batchAdd: false,
      tags: [],
      choosePanoTags: [],
      headingMap: {},
      inputTag: null,
      chooseContainId: null,
      noTag: false,
      reverse: false,
      all: false,
      type: 'filter',
      panoTags: [],
      markers: [],
    }
  },
  mounted() {
    window.aFun = this.getTag;
    this.history = history;
    this.checkVip();
    this.mapsId = this.$route.query.mapsId;
    this.all = true;
    this.init();
  },
  methods: {
    init() {
      this.initMap();
      this.listTags();
    },

    changeAll() {
      if (this.all) {
        this.noTag = false;
        this.chooseTag = null;
        this.reverse = null;
      }
      this.filterByTags();
    },

    changeNoTag() {
      if (this.noTag) {
        this.all = false;
        this.chooseTag = null;
      }
      this.filterByTags();
    },
    changeReverse() {
      if (this.reverse) {
        this.all = false;
      } else if (!this.noTag && !this.chooseTag) {
        this.all = true;
      }
      this.filterByTags();
    },
    initMap() {
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
        zoom: 1, // starting zoom
        minZoom: 0,
        maxZoom: 18,
        dragRotate: false,
        preferCanvas: true,
      }).addControl(new mapboxgl.AttributionControl({
        compact: false,
        customAttribution: '华为地图 GS（2022）2885号'
      }), 'bottom-left');

      map.on('load', () => {
        document.getElementsByClassName('mapboxgl-ctrl-logo')[0].style.display = 'none';
      });
      this.map = map;
      this.map.loadImage( this.imgOrigin + 'biz/1662830770348_9499340182724556af66f2b42846135b_0.png',
          (error, image) => {
            if (error) throw error;
            this.map.addImage('custom-marker', image);
          }
      );
    },
    checkVip() {
      api.getByPath('/api/v0/tuxun/vip/check').then(res=>{
        if (res.data) {
        } else {
          this.$vip();
        }
      });
    },

    listTags() {
      api.getByPath('/api/v0/tuxun/maps/listTags', {mapsId: this.mapsId}).then(res => {
        this.tags = res.data;
        if (this.chooseTag && this.tags.indexOf(this.chooseTag) === -1) {
          this.chooseTag = null;
        }
        this.filterByTags();
      });
    },

    filterByTags() {
      api.getByPath('/api/v0/tuxun/maps/filterByTags', {mapsId: this.mapsId, tags: this.chooseTag, reverse: this.reverse, noTag: this.noTag, all: this.all}).then(res => {
        this.addMarker(res.data);
      });
    },


    deleteByFilter() {
      Dialog.confirm({
        title: '确认清空选中的街景吗？',
        // message: `是否确定删除帖子 【${item.postInfo.title}】？`,
        messageAlign: 'left'
      }).then(() => {
        api.getByPath('/api/v0/tuxun/maps/deleteByFilter', {mapsId: this.mapsId, tags: this.chooseTag, reverse: this.reverse, noTag: this.noTag, all: this.all}).then(res => {
          this.listTags();
        });
      })
    },

    addTagByFilter() {
      Dialog.confirm({
        title: '确认给选中的街景打标签吗？',
        // message: `是否确定删除帖子 【${item.postInfo.title}】？`,
        messageAlign: 'left'
      }).then(() => {
        api.getByPath('/api/v0/tuxun/maps/addTagByFilter', {mapsId: this.mapsId, tags: this.chooseTag, reverse: this.reverse, noTag: this.noTag, all: this.all, tag: this.inputTag}).then(res => {
          this.listTags();
        });
        this.batchAdd = false;
        this.inputTag = null;
      })
    },

    cleanTagByFilter() {
      Dialog.confirm({
        title: '确认清空选中的街景的标签吗？',
        // message: `是否确定删除帖子 【${item.postInfo.title}】？`,
        messageAlign: 'left'
      }).then(() => {
        api.getByPath('/api/v0/tuxun/maps/cleanTagByFilter', {mapsId: this.mapsId, tags: this.chooseTag, reverse: this.reverse, noTag: this.noTag, all: this.all}).then(res => {
          this.listTags();
        });
      })
    },

    addInputTag() {
      api.getByPath('/api/v0/tuxun/maps/addTag', {mapsId: this.mapsId, tag: this.inputTag, containId: this.chooseContainId}).then(res => {
        this.inputTag = null
        this.getTag()
        this.listTags();
      });
    },
    getTag() {
      api.getByPath('/api/v0/tuxun/maps/getTag', {mapsId: this.mapsId, containId: this.chooseContainId}).then(res => {
        this.panoTags = res.data;
      });
    },

    addMarker(data) {
      var group = [];
      //
      // try {
      //   this.map.removeLayer('points');
      //   this.map.removeSource('points')
      // } catch (e) {
      //
      // }

      var bounds = new mapboxgl.LngLatBounds();

      var features=[];
      for (var i in data) {
        var finder=data[i];

        if (!finder.lat && !finder.lng) {
          continue;
        }

        features.push({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [
              finder.lng, finder.lat
            ]
          },
          'properties': {
            // "marker-symbol": "marker-15",
            'finder': finder
          }
        });
        bounds.extend([finder.lng, finder.lat])
      }

      if (!this.map.getSource('points')) {
        this.map.addSource('points', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': features
          }
        });
      } else {
        this.map.getSource('points').setData( {
          'type': 'FeatureCollection',
          'features': features
        });
      }

      // Add a symbol layer
      if (!this.map.getLayer('points')) {
        this.map.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'points',
          'layout': {
            'icon-image': 'custom-marker',
            'icon-anchor': 'bottom',
            'icon-size': 0.9,
            'icon-allow-overlap': true
          }
        });
        this.map.on('click', 'points', (e) => {
          const finder=eval("(" + e.features[0].properties.finder + ")");
          const coordinates = e.features[0].geometry.coordinates.slice();
          this.showChoose(finder);
        });
      }

      try {
        this.map.fitBounds(bounds, {padding: {top: 15, bottom: 15, left: 15, right: 15}});
      } catch (e) {

      }
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

    changeTag(tag) {
      if (tag === this.chooseTag) {
        this.chooseTag = null;
        this.filterByTags()
      } else {
        this.chooseTag = tag;
        this.noTag = false;
        this.all = false;
        this.filterByTags()
      }
    },
    removeTag(tag) {
      this.panoTags = this.panoTags.filter(function(item) {
        return item !== tag;
      })
      api.getByPath('/api/v0/tuxun/maps/removeTag', {mapsId: this.mapsId, tag: tag, containId: this.chooseContainId}).then(res => {
        this.getTag()
      });
    },
    addTag(tag) {
      this.panoTags.push(tag);
      api.getByPath('/api/v0/tuxun/maps/addTag', {mapsId: this.mapsId, tag: tag, containId: this.chooseContainId}).then(res => {
        this.getTag()
      });
    },
    showChoose(item) {
      this.type = 'choose'
      this.chooseContainId = item.id;
      this.panoTags = [];
      this.getTag();
      setTimeout(() => {
        this.initPano(item);
      }, 1000)
    },
    initPano(item) {
      if (!this.panorama) {
        loadScript('https://i.chao-fan.com/st_v2/js_test_v8.js').then(() => {
          this.viewer = new google.maps.StreetViewPanorama(
              document.getElementById('viewer'), {
                fullscreenControl: false,
                panControl: true,
                panControlOptions: {position: google.maps.ControlPosition.LEFT_BOTTOM},
                addressControl: false,
                imageDateControl: true,
                motionTrackingControl: false,
                streetViewControl: true,
                zoomControlOptions: {
                  style: google.maps.ZoomControlStyle.BIG,
                  position: google.maps.ControlPosition.LEFT_BOTTOM
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

          this.setViewer(item);
        });
      } else {
        this.setViewer(item);
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
            centerHeading: this.headingMap[pano],
            getTileUrl: this.getCustomPanoramaTileUrl,
          },
        };
      }
    },
    setPanoId(round) {
      if (!round) {
        return;
      }
      this.panoId = round.panoId;
      if (round.source === 'baidu_pano') {
        if (!this.registerPanoProvider) {
          this.viewer.registerPanoProvider(this.getCustomPanorama);
          this.registerPanoProvider = true;
        }
        this.getBaiduPanoInfo(round.panoId, true, round);
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
    setViewer(round) {
      this.viewer.setPano(round.panoId);
    },
    cancelChoose(item) {
      this.type = 'filter'
      this.chooseContainId = null;
      this.listTags();
    },
    deletePano() {
      Dialog.confirm({
        title: '确认清空选中的街景吗？',
        // message: `是否确定删除帖子 【${item.postInfo.title}】？`,
        messageAlign: 'left'
      }).then(() => {
        api.getByPath('/api/v0/tuxun/maps/deletePano', {containId: this.chooseContainId}).then(res => {
          this.cancelChoose();
        });
      });
    },
    cleanTagPanos() {

    },
    // clean

  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  text-align: center;
  background-color:  $tuxunBackgroundColor;

  .back_home {
    z-index: 100;
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .main {
    display: flex;
    .left {
      width: 60%;
      display: block;
      background-color: white;
      height: 100vh;
      .pano {

      }

      .map {
        height: 100vh;
      }
    }

    .op {
      width: 40%;
      display: block;
      .filter {
        color: white;
        .tag-title {
          font-size: 24px;
          text-align: left;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;

          .tag {
            padding-right: 5px;
            padding-bottom: 5px;
          }
        }
      }
    }
  }

}
</style>
