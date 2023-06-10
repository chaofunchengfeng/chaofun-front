<template>
  <div>
    <label for="pacViewPlace">Go to a place: </label>
    <input type="text" id="pacViewPlace" name="pacViewPlace" placeholder="Enter a location..." style="width: 300px" />
    <div id="cesiumContainer"></div>
  </div>

<!--  <div id="cesiumContainer"></div>-->
</template>

<script>
import { loadScript } from 'vue-plugin-load-script';
export default {
  name: "photorealistic",
  data() {
    return {
      unsubscribe: null,
      viewer: null
    }
  },
  created() {
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyA7kvcRzI-rJziVKN1fpemEGZt3Z5d4d78&libraries=places').then(() => {
      this.initAutocomplete();
    });

    loadScript('https://ajax.googleapis.com/ajax/libs/cesiumjs/1.105/Build/Cesium/Cesium.js').then(() => {
      Cesium.RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;

      // Create the viewer and remove unneeded options.
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        imageryProvider: false,
        baseLayerPicker: false,
        homeButton: false,
        fullscreenButton: false,
        navigationHelpButton: false,
        vrButton: false,
        sceneModePicker: false,
        geocoder: false,
        globe: false,
        infobox: false,
        selectionIndicator: false,
        timeline: false,
        projectionPicker: false,
        clockViewModel: null,
        animation: false,
        requestRenderMode: true,
      });

      // Add 3D Tile set.
      const tileset = this.viewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({
            url: "https://tile.googleapis.com/v1/3dtiles/root.json?key=AIzaSyA7kvcRzI-rJziVKN1fpemEGZt3Z5d4d78",
            // This property is required to display attributions.
            showCreditsOnScreen: true,
          })
      );
    });
  },
  methods: {
    init() {

    },
    pointCameraAt(location, viewport, elevation) {
      const distance = Cesium.Cartesian3.distance(
          Cesium.Cartesian3.fromDegrees(
              viewport.getSouthWest().lng(), viewport.getSouthWest().lat(), elevation),
          Cesium.Cartesian3.fromDegrees(
              viewport.getNorthEast().lng(), viewport.getNorthEast().lat(), elevation)
      ) / 2;
      const target = new Cesium.Cartesian3.fromDegrees(location.lng(), location.lat(), elevation);
      const pitch = -Math.PI / 4;
      const heading = 0;
      this.viewer.camera.lookAt(target, new Cesium.HeadingPitchRange(heading, pitch, distance));
    },
    rotateCameraAround(location, viewport, elevation) {
      if(this.unsubscribe) this.unsubscribe();
      this.pointCameraAt(location, viewport, elevation);
      this.unsubscribe = this.viewer.clock.onTick.addEventListener(() => {
        this.viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z);
      });
    },
    initAutocomplete() {
      const autocomplete = new google.maps.places.Autocomplete(
          document.getElementById("pacViewPlace"), {
            fields: [
              "geometry",
              "name",
            ],
          }
      );

      autocomplete.addListener("place_changed", async () => {
        console.log('123')
        const place = autocomplete.getPlace();

        if (!(place.geometry && place.geometry.viewport && place.geometry.location)) {
          window.alert(`Insufficient geometry data for place: ${place.name}`);
          return;
        }
        // Get place elevation using the ElevationService.
        const elevatorService = new google.maps.ElevationService();
        const elevationResponse =  await elevatorService.getElevationForLocations({
          locations: [place.geometry.location],
        });

        if(!(elevationResponse.results && elevationResponse.results.length)){
          window.alert(`Insufficient elevation data for place: ${place.name}`);
          return;
        }
        const elevation = elevationResponse.results[0].elevation || 10;

        this.rotateCameraAround(
            place.geometry.location,
            place.geometry.viewport,
            elevation
        );
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "https://ajax.googleapis.com/ajax/libs/cesiumjs/1.105/Build/Cesium/Widgets/widgets.css";


</style>
