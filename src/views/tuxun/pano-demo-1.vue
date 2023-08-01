<template>
  <div id="viewer" class="viewer"></div>
</template>

<script>
import { loadScript } from 'vue-plugin-load-script';

export default {
  name: "pano-demo",

  data() {
    return {}
  },
  created() {
    loadScript('https://chaofun.oss-cn-hangzhou.aliyuncs.com/st_v1/js_test_v5.js').then(() => {
    // loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDvx5IM2bbHnOb4sY-0aISwH8bAxH7ecS4&v=3.52&libraries=places,drawing&language=en&region=us').then(() => {
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
            keyboardShortcuts: false,
            dragging: false,
            draggable: false,
            panControlOptions: {
              position: google.maps.ControlPosition.BOTTOM_LEFT,
            },
          }
      );

      this.viewer.setPano("L3R1lbWhOPWNlIE2tcgO1A");
    });
  },
  methods: {
    init() {

    },
  }
}
</script>

<style lang="scss" scoped>
.viewer {
  width: 100vw;
  height: 100vh;
}
</style>
