<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack"  round>←返回</el-button>
      <el-button v-if="type==='modify'" @click="deleteImg" round>删除</el-button>
    </div>
    <div v-if=" type !=='modify' " class="nav">上传投稿</div>
    <div v-else class="nav">更新投稿</div>
    <div  v-if=" type !=='modify' "  class="desc">目前只支持上传携带exif信息的图片
      <p>推荐上传自己旅行拍摄的照片（尽量不要是家周边的环境）</p>
      <p>请勿上传含有政治军事敏感信息等违规内容，每个投稿都会经过审核，违者会被封号</p>
      <p>iOS 通过浏览器上传会抹掉 exif 地理位置, Android 应该同理，可以发送到电脑再上传</p>
<!--      <p>国内坐标偏移的问题正在解决</p>-->
    </div>
    <div style="margin-top: 2rem">
      <el-upload
          :before-upload="beforeAvatarUpload"
          :data="filedata"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
          action="/api/v0/finder/upload_image"
          :disabled="type==='manager'"
          class="avatar-uploader"
          name="file">
        <img v-if="image" :src="imgOrigin + image" class="avatar">
        <i style="border: 1px solid black;" v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>

    <div v-if="lat || lng" class="latlng">
      <div class="location">
        定位
        <div></div>
        <el-button @click="openMap">地图选点</el-button>
      </div>
      <div>
        <div class="desc">经度(longitude):</div>
        <el-input v-model="lng"></el-input>
      </div>
      <div>
        <div class="desc">纬度(latitude):</div>
        <el-input v-model="lat"></el-input>
      </div>
    </div>
    <el-button v-if="type==='modify'" style="margin-top: 2rem" @click="publish" type="primary">更新</el-button>
    <el-button v-else style="margin-top: 2rem" @click="publish" type="primary">发布</el-button>

    <div v-show="showMap" class="map_container">
      <div class="top-left">
        <el-button  @click="closeMap" round>取消</el-button>
        <el-button @click="confirm" type="primary"  round>确定</el-button>
      </div>
      <div style="z-index: 10000; position: absolute; right: 1.5rem; top: 1.5rem">注: 点击地图重新定位拍摄位置</div>
      <div id="map" class="map"></div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import {tuxunJump} from "./common";

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

export default {
  name: "finder-upload",
  data() {
    return {
      history: null,
      filedata: {},
      showMap: false,
      lat: null,
      lng: null,
      tLat: null,
      tLng: null,
      marker: null,
      map: null,
      mapLoad: false,
      image: null,
      type: null,
      id: null,
    }
  },
  mounted() {
    this.history = history;
    this.filedata.id = this.$route.query.id;
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    this.initMap()
    this.init();

  },
  methods: {
    initMap() {
      mapboxgl.accessToken = 'pk.eyJ1IjoiY2lqaWFuenkiLCJhIjoiY2w3b2lobGhyMHJ0NTN2bnZpaDhseWJjaCJ9.wxEifLVemNWxe1GKqmUnPw';
      var url = 'https://map.chao-fan.com/tile231207/s2_z{z}_x{x}_y{y}.jpeg';
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
        center: [106.0, 38.0],
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

      map.on('click', (e) => {
        if (this.marker) {
          this.marker.remove();
        }
        const popup = new mapboxgl.Popup()
            .setHTML('<div>' + e.lngLat.lng.toFixed(7) + ', ' + e.lngLat.lat.toFixed(7) + '</div>');
        this.marker = new mapboxgl.Marker({color: '#FFD326'})
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .addTo(map)
        this.marker.setPopup(popup);
        this.marker.togglePopup();
        this.tLat = e.lngLat.lat;
        this.tLng = e.lngLat.lng;
      });
      this.map = map;
    },
    init() {
      api.getByPath('/api/v0/finder/get', {id: this.filedata.id}).then(res=>{
        if (res.success) {
          this.image = res.data.img;
          this.lat = res.data.lat;
          this.lng = res.data.lng;
        }
      });
    },

    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('https://tuxun.fun/');
      }
    },
    goHome() {
      tuxunJump('https://tuxun.fun/')
    },
    deleteImg() {
      api.getByPath('/api/v0/finder/delete', {id: this.id}).then(res => {
        if (res.success) {
          this.$toast('删除成功');
          tuxunJump('https://tuxun.fun/finder?userId=' + this.$store.state.user.userInfo.userId);
        }
      });
    },
    beforeAvatarUpload(file) {
      console.log(file);
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!');
        return false;
      }
      this.filedata.fileName = file.name;
      return true;
    },

    handleAvatarSuccess(res) {
      if (res.success) {
        this.image = res.data;
        this.init();
      } else {
        this.$toast(res.errorMessage);
      }
    },

    publish() {
      api.getByPath('/api/v0/finder/publish', {id: this.id, lat: this.lat, lng: this.lng}).then(res=>{
        if (res.success) {
          tuxunJump('https://tuxun.fun/finder?userId=' + res.data.userId);
        }
      });
    },
    openMap() {
      this.showMap = true;
      if (this.marker) {
        this.marker.remove();
      }
      console.log(this.lng);
      console.log(this.lat);
      // setTimeout(() => {
      const popup = new mapboxgl.Popup()
          .setHTML('<div>' + this.lng.toFixed(7) + ', ' + this.lat.toFixed(7) + '</div>');
      this.marker = new mapboxgl.Marker({color: '#FFD326'})
            .setLngLat([this.lng, this.lat])
            .addTo(this.map)
      this.marker.setPopup(popup);
      this.marker.togglePopup();

      setTimeout(() => {
        this.map.resize();
      }, 100);
    },
    closeMap() {
      this.showMap = false;
    },
    confirm() {
      if (this.tLat && this.tLng) {
        this.lat = this.tLat;
        this.lng = this.tLng;
      }
      this.showMap = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: white;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  background-color: white;

  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}

.avatar {
  width: 300px;
  height: 150px;
  object-fit: fill;
}

.container{
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-color:  $tuxunBackgroundColor;
  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }
  .desc {
    color: gray;
    padding-top: 1rem;
  }
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .latlng {
    .location {
      color: white;
      font-size: 30px;
      text-align: left;
    }
    margin: auto;
    width: 20%;
    .desc {
      text-align: left;
    }
  }
  .map_container {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:  $tuxunBackgroundColor;
    .map {
      width: 100%;
      height: 100%;
    }
    .top-left {
      position: absolute;
      padding-top: 1rem;
      padding-left: 1rem;
      z-index: 10000;
    }

  }

}

@media only screen and (max-width: 768px) {
  .container {
    .latlng {
      margin: auto;
      width: 80%;
      .desc {
        text-align: left;
      }
    }
  }
}
</style>
