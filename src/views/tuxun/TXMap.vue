<template>
  <div>
    <div v-show="showMap" id="map-container" :class="[{'bm-view-container': !ISPHONE}, {'bm-view-container-phone': ISPHONE && showMap}, {'bm-view-container-phone-hidden': ISPHONE && !showMap}]" @mouseover="mapMouseOver" @mouseout="mapMouseOut">
      <div v-if="!this.isMapSmall && !ISPHONE" style="text-align: left">
        <el-button size="small" @click="mapBig" round>放大</el-button>
        <el-button size="small" @click="mapSmall" round>缩小</el-button>
        <el-button size="small" v-if="!mapPin" @click="mapPin = true" round>固定大小</el-button>
        <el-button size="small" v-if="mapPin" @click="mapPin = false" round>解除固定</el-button>
      </div>
      <div id="map" :class="[{'bm-view': !ISPHONE}, {'bm-view-phone': ISPHONE}]" @mouseover="mapMouseOver" @mouseout="mapMouseOut"></div>
    </div>
    <div class="map-position">
      <el-button v-if="showMap" @click="setMapVisible(false)" round>隐藏位置</el-button>
      <el-button v-else @click="setMapVisible(true)" round>显示位置</el-button>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './SmoothWheelZoom';

export default {
  name: 'tuxun-map',
  props: {
    marker: {
      type: Object
    }
  },
  data() {
    return {
      url: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/v0/tuxun`,
      map: null,
      needSmall: false,
      maxMapWidth: '40%',
      maxMapHeight: '60%',
      isMapSmall: true,
      mapPin: false,
      currentMarker: null,
      showMap: false,
    };
  },
  watch: {
    marker(value) {
      if (value && this.map) {
        this.addChooseMarker(value);
      }
    }
  },
  mounted() {
    this.initMap();
    this.$EventBus.$on('setMapVisible', (show) => {
      this.setMapVisible(show);
    });
  },
  methods: {
    setMapVisible(show) {
      this.showMap = show;
      show && setTimeout(function () {
        this.map.invalidateSize();
      }.bind(this), 100);
    },
    mapBig() {
      this.maxMapWidth = '68%';
      this.maxMapHeight = '85%';
      this.changeMapBig();
    },
    mapSmall() {
      this.maxMapWidth = '40%';
      this.maxMapHeight = '60%';
      this.changeMapBig();
    },
    changeMapBig() {
      this.isMapSmall = false;
      this.needSmall = false;
      var element = document.getElementById('map-container');
      element.style.width = this.maxMapWidth;
      element.style.height = this.maxMapHeight;
      element.style.opacity = 1.0;
      setTimeout(() => {
        this.map.invalidateSize();
      }, 5);
    },
    mapMouseOver() {
      if (!window.matchMedia('(hover: none)').matches && document.body.clientWidth > 678 && !this.mapPin) {
        this.changeMapBig();
      }
    },
    mapMouseOut() {
      if (!window.matchMedia('(hover: none)').matches && document.body.clientWidth > 678 && !this.mapPin) {
        this.needSmall = true;
        setTimeout(() => {
          if (this.needSmall) {
            this.needSmall = false;
            this.isMapSmall = true;
            var element = document.getElementById('map-container');
            element.style.width = '25%';
            element.style.height = '35%';
            element.style.opacity = 0.7;
            if (this.map) {
              this.map.invalidateSize();
            }
          }
        }, 750);
      }
    },
    initMap() {
      if (!this.map) {
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
        map.attributionControl.setPrefix('华为地图');
        map.attributionControl.addAttribution('GS（2022）2885号');

        var url = 'https://map2.chao-fan.com/tile230411/s2_z{z}_x{x}_y{y}.jpeg';
        L.tileLayer(url, {
          maxZoom: 18,
          minZoom: 1,
        }).addTo(map);

        this.map = map;
        this.addChooseMarker(this.marker);
        this.map.invalidateSize();
      }
    },
    addChooseMarker(marker) {
      if (!marker) {
        return;
      };
      if (this.currentMarker) {
        this.currentMarker.remove();
      }
      var options = JSON.parse(JSON.stringify(L.Icon.Default.prototype.options));
      options.iconUrl = this.imgOrigin + 'biz/1662830770348_9499340182724556af66f2b42846135b_0.png';
      options.iconRetinaUrl = this.imgOrigin + 'biz/1662830707508_d7e5c8ce884a4fb692096396a5405f5b_0.png';
      this.currentMarker = L.marker([marker.lat, marker.lng], {icon: new L.Icon(options)}).addTo(this.map);
      this.map.panTo([marker.lat, marker.lng]);
      this.map.setZoomAround(5);
      setTimeout(() => {
        this.map.invalidateSize();
      }, 50);
    },
  }
};
</script>

<style lang="scss" scoped>
.leaflet-container {
  cursor: crosshair !important;
}
.bm-view-container {
  position: absolute;
  padding-right: 2rem;
  padding-bottom: 1.5rem;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 35%;
  opacity: 0.7;
  z-index: 5000;
  display:flex;
  flex-flow:column nowrap;
  overflow:hidden;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .bm-view {
    flex: 1;
  }
}
.bm-view-container-phone {
  position: absolute;
  width: 100%;
  height: 40%;
  bottom: 0;
  right: 0;
  z-index: 5000;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .bm-view-phone {
    width: 100%;
    height: 100%;
  }
}
.bm-view-container-phone-hidden {
  position: absolute;
  width: 100%;
  height: 40%;
  bottom: 0;
  right: 0;
  z-index: 5000;
  visibility: hidden;

  .bm-view-phone{
    width: 100%;
    height: 100%;
  }
}
@media  (any-hover:none) {
  .bm-view-container {
    width: 40%;
    height: 40%;
    opacity: 1;
  }
}
.map-position {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 5000;
}
</style>
