<template>
  <div class="container">
    <el-dialog title="提交街景" :visible.sync="submitPanoramaShow" :append-to-body="true">
      <el-form :model="form">
        <el-form-item>
          <div>
            街景链接:一行一条，支持百度街景和Google街景
            <a target="_blank" href="https://www.yuque.com/chaofun/tuxun/added">点击跳转教程</a>
          </div>
          <div>
            也支持 map-making.app 的 json 字符串, 请直接粘贴
          </div>
          <el-input type="textarea" :autosize="{ minRows: 4}"
                    v-model="panoramaSubmitForm.links" autocomplete="off"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideSubmitPanorama()">取 消</el-button>
        <el-button type="primary" @click="submitPano()">确 定</el-button>
      </div>
    </el-dialog>

    <div class="back_home" >
      <el-button v-if="history && history.length !== 1" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" round>首页</el-button>
    </div>

    <div style="display: flex">
      <div class="left">
        <div v-if="name" class="nav">
          {{this.name}}
        </div>
        <div v-if="mapsData && mapsData.desc" class="describe">
          {{mapsData.desc}}
        </div>
        <div class="list_container">
          <div style="margin-top: 1rem; font-size: 20px; color: white">
            街景列表
          </div>
          <div v-if="status" style="font-size: 12px; color: white; padding-bottom: 6px"> (总数: {{status.total ? status.total : 0 }}, 已发布: {{status.publish ? status.publish : 0 }}, 待发布: {{status.ready ? status.ready: 0 }}, 待审核: {{status.wait_check ? status.wait_check: 0 }} 准备中: {{status.crawling ? status.crawling : 0 }}, 准备失败: {{status.crawler_fail ? status.crawler_fail : 0 }})</div>
          <div style="color: white">快捷键：1 上一个街景，2 下一个街景, 删除键 删除选中街景 </div>
          <div style="width: 100%; justify-items: left; align-content: flex-start">
            <el-pagination
                background
                layout="prev, pager, next"
                style="padding-bottom: 20px;"
                :current-page.sync="current"
                @current-change="handleCurrentChange"
                :page-size="1000"
                :total="total">
            </el-pagination>
          </div>

          <div v-for="(item, index) in panos" :key="index" class="list_item" style="display: flex;justify-content: space-between; overflow: auto;">
            <div style="display: flex; color: white">
              <div  v-if="chooseIndex === index"  style="color: gold">{{item.panoId}}</div>
              <div v-else @click="showPano(item, index)">{{item.panoId}}</div>
              <div v-if="item.status === 'crawling'" class="status" style="color: yellow">准备中</div>
              <div v-if="item.status === 'publish'" class="status" style="color: green">已发布</div>
              <div v-if="item.status === 'wait_check'" class="status" style="color: pink">待图寻审核</div>
              <div v-if="item.status === 'crawler_success' || item.status === 'ready'" class="status" style="color: white">待发布</div>
              <div v-if="item.status === 'crawler_fail'" class="status" style="color: red">准备失败</div>
            </div>
            <div style="color: white" @click="deletePano(item)">删除</div>
          </div>
        </div>
      </div>
      <div class="right">
        <div id="viewer" style="width: 100%; height: 70vh"></div>
        <div id="map" style="width: 100%; height: 30vh"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from './common';
import * as api from '@/api/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './SmoothWheelZoom';
import { loadScript } from 'vue-plugin-load-script';


export default {
  name: 'MapsCreate',
  data() {
    return {
      name: '',
      panos: [],
      mapsId: null,
      chooseItem: null,
      status: null,
      history: null,
      chooseIndex: null,
      total: 1000,
      current: 1,
      pageCount: 1,
      submitPanoramaShow: false,
      mapsData: null,
      choose: 0,
      panorama: null,
      headingMap: {},
      form: {
        applyModReason: '',
      },
      panoramaSubmitForm: {
        links: '',
      },
    };
  },
  mounted() {
    this.history = history;
    this.mapsId = this.$route.query.mapsId;
    this.getMapsName();
    this.getPanos(true);
    this.initMap();
    this.initPano();

    document.onkeydown = function(event){
      var e = event || window.event || arguments.callee.caller.arguments[0];
      console.log(e.keyCode);
      if(e && e.keyCode === 8){
        console.log('1231231');
        this.deletePano(this.chooseItem);
      }

      if (e && e.keyCode === 50) {
        if (this.chooseItem) {
          if (this.chooseIndex + 1 < this.panos.length) {
            this.chooseIndex += 1;
            this.chooseItem = this.panos[this.chooseIndex];
            this.showPano(this.chooseItem, this.chooseIndex)
          } else {
          }
        } else if (this.panos.length > 0){
          this.chooseIndex = 0;
          this.chooseItem = this.panos[this.chooseIndex];
          this.showPano(this.chooseItem, this.chooseIndex)
        }

      }

      if (e && e.keyCode === 49) {
        if (this.chooseItem) {
          if (this.chooseIndex !== 0) {
            this.chooseIndex -= 1;
            this.chooseItem = this.panos[this.chooseIndex];
            this.showPano(this.chooseItem, this.chooseIndex)
          }
        } else if (this.panos.length > 0){
          this.chooseIndex = 0;
          this.chooseItem = this.panos[this.chooseIndex];
          this.showPano(this.chooseItem, this.chooseIndex)
        }
      }
    }.bind(this);

  },
  methods: {
    initMap() {
      var map = L.map('map', {
        attributionControl: true,
        worldCopyJump: true,
        coordType: 'gcj02',
        scrollWheelZoom: false, // disable original zoom function
        smoothWheelZoom: true,  // enable smooth zoom
        smoothSensitivity: 5,   // zoom speed. default is 1
        maxBoundsViscosity: 1.0, maxBounds:  [[-90,-540],   [90,540]]}).setView([38.8, 106.0], 2);
      map.scrollWheelZoom = true;
      map.attributionControl.setPosition('bottomleft');
      map.attributionControl.setPrefix('华为地图');
      map.attributionControl.addAttribution('GS（2022）2885号');
      var url = 'https://map.chao-fan.com/tile230411/s2_z{z}_x{x}_y{y}.jpeg';
      L.tileLayer(url, {
        maxZoom: 18,
        minZoom: 1,
      }).addTo(map);
      this.map = map;
      this.map.invalidateSize();
    },
    initPano() {
      loadScript('https://i.chao-fan.com/streetview/js-tuxun-v3.js').then(() => {
        this.panorama = new google.maps.StreetViewPanorama(
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
        this.panorama.registerPanoProvider(this.getCustomPanorama);

        this.viewer.addListener('pano_changed', () => {
          console.log('pano_changed');
          if (this.viewer.getPano().length === 27) {
            this.getPanoInfo(this.panorama.getPano(), false);
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
            centerHeading: this.headingMap[pano],
            getTileUrl: this.getCustomPanoramaTileUrl,
          },
        };
      }
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    getMapsName() {
      api.getByPath('/api/v0/tuxun/maps/get', {mapsId: this.mapsId}).then(res=>{
        this.name = res.data.name;
        this.mapsData = res.data;
      });
    },
    getStauts() {
      api.getByPath('/api/v0/tuxun/maps/status', {mapsId: this.mapsId}).then(res=>{
        this.status = res.data;
      });
    },
    getPanos(pageChange) {
      api.getByPath('/api/v0/tuxun/maps/listPanoV1', {mapsId: this.mapsId, page: this.current}).then(res=>{
        this.panos = res.data.list;
        this.total = res.data.total;
        if (this.chooseIndex !== null) {
          if (pageChange) {
            this.chooseIndex = 0;
            this.chooseItem = this.panos[this.chooseIndex];
            this.showPano(this.chooseItem, this.chooseIndex)
          } else {
            this.chooseItem = this.panos[this.chooseIndex];
            this.showPano(this.chooseItem, this.chooseIndex);
          }
        } else {
          this.chooseIndex = 0;
          this.chooseItem = this.panos[this.chooseIndex];
          this.showPano(this.chooseItem, this.chooseIndex)
        }
        this.getStauts();
      });
    },
    publish() {
      api.getByPathLongTimeout('/api/v0/tuxun/maps/publish', {mapsId: this.mapsId}).then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/my_maps');
        }
      });
    },
    toDistribute() {
      tuxunJump('/tuxun/maps_distribute?mapsId=' + this.mapsId);
    },
    getPanoInfo(pano, set) {
      api.getByPath('/api/v0/tuxun/mapProxy/getPanoInfo', {pano: pano}).then(res => {
        this.panorama.setLinks(res.data.links);
        // this.centerHeading = res.data.heading;
        this.headingMap[res.data.pano] = res.data.heading;
        if (res.data.links) {
          res.data.links.forEach((item) => {
            this.preloadImage(item.pano);
            this.headingMap[item.pano] = item.centerHeading;
          });
        }
        if (set) {
          this.panorama.setPano(pano);
          this.panorama.setPov({
            heading: this.chooseItem.heading,
            pitch: this.chooseItem.pitch,
          });
        }
        // console.log(this.centerHeading);
      })
    },
    preloadImage(pano) {
      var img = new Image();
      img.src = 'https://map.chao-fan.com/bd/thumb/' + pano;
    },
    showPano(item, index) {
      this.chooseItem = item;
      this.chooseIndex = index;
      if (item.source === 'baidu_pano') {
        this.getPanoInfo(item.panoId, true);
      } else {
        this.panorama.setPano(item.panoId);
        this.panorama.setPov({
          heading: item.heading,
          pitch: item.pitch,
        });
      }

      if (this.marker) {
        this.marker.remove()
      }
      this.marker = L.marker([item.lat, item.lng], {icon: new L.Icon.Default()}).addTo(this.map);
      this.map.setView([item.lat, item.lng], 8);
    },
    addPano() {
      this.submitPanoramaShow = true;
    },
    hideSubmitPanorama() {
      this.submitPanoramaShow = false;
    },
    handleCurrentChange() {
      this.getPanos(true);
    },
    deletePano(item) {
      api.getByPath('/api/v0/tuxun/maps/deletePano', {containId: item.id}).then(res=>{
        this.getPanos();
      });
    },
    toGuid() {
      tuxunOpen('https://www.yuque.com/ucun5p/kfw26e/ttqiucknz7sifo5u');
    },
    modify() {
      tuxunJump('/tuxun/maps_create?mapsId=' + this.mapsId);
    },
    goBaidu() {
      tuxunJump('/tuxun/map-maker?mapsId=' + this.mapsId);
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
  }
};
</script>

<style lang="scss" scoped>

.container {
  position: absolute;
  width: 100%;
  padding-bottom: 10rem;
  min-height: 120%;
  text-align: center;
  background-color: #090723;
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .left {
    width: 40%;
    .describe {
      color: yellow;
      font-size: 1rem;
      font-weight: 700;
    }

    .nav {
      color: white;
      font-size: 48px;
      font-weight: bold;
      padding-top: 3rem;
    }


    .list_container {
      width: 60%;
      margin: 0 auto;

      .list_item {
        &:hover {
          background-color: grey;
        }
      }

    }

    .status {
      padding-left: 10px;
    }
  }
  .right {
    position: fixed;
    right: 0;
    width: 60%;
    height: 100vh;
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .list_container {
      width: 90%;
      max-width: 90%;
      margin: auto;
    }
  }
}
</style>
