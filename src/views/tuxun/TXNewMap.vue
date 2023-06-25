<template>
<div class="container">
  <div id="map" class="maps"></div>
</div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// import "https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise";
export default {
  name: 'TuxunNewMap',
  mounted() {
    var map = L.map('map').setView([51.505, -0.09], 3);
    var url = 'https://map.chao-fan.com/tile230411/s2_z{z}_x{x}_y{y}.jpeg';
    if(this.ISPHONE){
      url = 'https://map.chao-fan.com/tile230411/s1_z{z}_x{x}_y{y}.jpeg';
    }
    L.tileLayer(url, {
      maxZoom: 18,
      minZoom: 0,
    }).addTo(map);

    L.circle([89, 0.0], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([-89, 0.0], {color: 'red', radius: 3000000}).addTo(map);
    L.circle([-30.60009387355006, -127.44140625], {color: 'red', radius: 4000000}).addTo(map);
    L.circle([24.653381399664, -180.859375], {color: 'red', radius: 3300000}).addTo(map);
    L.circle([28.653381399664, -160.859375], {color: 'red',  radius: 3500000}).addTo(map);

    L.circle([18.646245142670608, 140.09765625], {color: 'red', radius: 1500000}).addTo(map);
    L.circle([-34.59704151614416, -16.5234375], {color: 'red', radius: 2500000}).addTo(map);
    L.circle([-23.56398712845123, 81.2109375], {color: 'red', radius: 3000000}).addTo(map);
    L.circle([28.80289258670676, -40.2421875], {color: 'red', radius: 2000000}).addTo(map);
    L.circle([45.80289258670676, -30.2421875], {color: 'red', radius: 1500000}).addTo(map);

    L.circle([30.14512718337613, -65.37890625], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([-6.664607562172573, -2.109375], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([-1.9332268264771106, -20.71875], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([81.67242422726376, 174.375], {color: 'red', radius: 1300000}).addTo(map);
    L.circle([4.5654735507102915, -37.08984375], {color: 'red', radius: 800000}).addTo(map);
    L.circle([14.604847155053898, -118.125], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([5.266007882805498, -100.546875], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([-50.17689812200105, 120.95703125], {color: 'red', radius: 1500000}).addTo(map);
    L.circle([-46.558860303117186, 39.0234375], {color: 'red', radius: 1500000}).addTo(map);
    L.circle([-49.724479188712984, 13.0078125], {color: 'red', radius: 1500000}).addTo(map);
    L.circle([-60.178867663282, 153.984375], {color: 'red', radius: 1500000}).addTo(map);
    L.circle([-63.39152174400882, -178.2421875], {color: 'red', radius: 1500000}).addTo(map);
    L.circle([72.71190310803662, 1.7578125], {color: 'red', radius: 630000}).addTo(map);
    L.circle([9.102096738726456, 61.69921875], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([-4.214943141390639, 47.6259765625], {color: 'red', radius: 600000}).addTo(map);
    L.circle([13.43468021529728, 87.01484375], {color: 'red', radius: 600000}).addTo(map);

    L.circle([71.30079291637452, 117.7734375], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([71.30079291637452, 140.7734375], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([63.23362741232569, 100.36328125], {color: 'red', radius: 1000000}).addTo(map);
    L.circle([60.13098770917023, 162.0703125], {color: 'red', radius: 1500000}).addTo(map);
    L.circle([75.67219739055291, 58.15234375], {color: 'red', radius: 1000000}).addTo(map);

    map.on('click', (e) => {
      this.$toast( e.latlng.wrap().lat + ', ' + e.latlng.wrap().lng);
        var input = document.createElement('input');
        input.setAttribute('value', e.latlng.wrap().lat + ', ' + e.latlng.wrap().lng);
        document.body.appendChild(input);
        input.select();
        var result = document.execCommand('copy');
        document.body.removeChild(input);
    });



  },
  methods: {

  }
};

</script>

<style lang="scss" scoped>

.container {
  position: absolute;
  width: 100%;
  height: 100%;
  .maps {
    position: absolute;
    width: 100%;
    height: 100%;
    //width: 50%;
    //height: 50%;
  }
}
</style>
