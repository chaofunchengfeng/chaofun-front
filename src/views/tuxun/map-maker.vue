<template>
  <div class="container">
    <div id="map" class="maps"></div>
  </div>
</template>

<script>
import { loadScript } from 'vue-plugin-load-script';

export default {
  name: "map-maker",
  data() {
    return {}
  },
  mounted() {
    setTimeout(()=> {
      this.init();
    }, 1000);
  },
  methods: {
    init() {
      loadScript('https://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=zKNqeLQ9Iwn60ptcZSuyywbnfk6yOKof&services=20230613170744').then(() => {
        var map = new BMapGL.Map('map', {
          maxZoom: 21,
        });
        var point = new BMapGL.Point(116.403850, 39.913795);
        map.centerAndZoom(point, 10);
        map.enableScrollWheelZoom();

// 添加全景图层
        map.addTileLayer(new BMapGL.PanoramaCoverageLayer());

// 添加全景控件
//         var stCtrl = new BMapGL.PanoramaControl();
//         stCtrl.setOffset(new BMapGL.Size(0, 0));
//         map.addControl(stCtrl);
      });
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
