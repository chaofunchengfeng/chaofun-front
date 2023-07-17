<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
      <el-dropdown trigger="click"  placement="bottom" style="margin-left: 10px">
        <el-button icon="el-icon-caret-right" @click="" size="small">{{choose}}</el-button>
        <el-dropdown-menu v-if="gameData" slot="dropdown">
          <el-dropdown-item @click.native="addMarker(gameData)" v-if="user">你的选择</el-dropdown-item>
          <el-dropdown-item @click.native="toAll()">全部</el-dropdown-item>
          <el-dropdown-item v-for="(item, index) in gameData.rounds" @click.native="toRound(item)">第 {{ item.round }}轮</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="z-index: 10000; position: absolute; right: 1.5rem; top: 4rem">注: 点击黄色针头查看街景</div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './SmoothWheelZoom';
import {tuxunJump, tuxunOpen} from './common';
export default {
  name: 'tuxun-replay',
  data() {
    return {
      gameId: null,
      history: null,
      gameData: null,
      markers: [],
      polylinePaths: [],
      group: [],
      choose: '全部',
      user: null,
      map: null,
    };
  },
  mounted() {
    this.history = history;
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
    map.zoomControl.setPosition('bottomright');
    map.attributionControl.setPrefix('华为地图');
    map.attributionControl.addAttribution('GS（2022）2885号');
    var url = 'http://map.chao-fan.com/tile230411/s2_z{z}_x{x}_y{y}.jpeg';
    L.tileLayer(url, {
      maxZoom: 18,
      minZoom: 1,
    }).addTo(map);
    this.map = map;
    this.gameId = this.$route.query.gameId;
    this.get();
  },
  methods: {
    get() {
      this.doLoginStatus().then((res) => {
        if (res) {
          api.getByPath('/api/v0/tuxun/solo/get', {gameId: this.gameId}).then(res => {
            if (res.success) {
              this.gameData = res.data;
              this.user = this.getUser();
              this.choose='你的选择';
              this.addMarker(res.data);
            }
          });
        }
      });
    },
    addMarker(gameData) {
      this.markers.forEach((v) => {v.remove()});
      this.polylinePaths.forEach((v) => {v.remove()});
      this.markers = [];
      this.polylinePaths = [];
      this.group = [];

      console.log('user');
      console.log(this.user);
      if (!this.user) {
        this.choose = '全部';
        this.toAll();
        return;
      }

      for (var i in gameData.rounds) {
        var round = gameData.rounds[i];
        this.drawRoundMarker(round);
      };

      if (this.user) {
        this.user.guesses.forEach(guess => {
          var marker = L.marker([guess.lat, guess.lng], {icon: new L.Icon.Default()}).bindTooltip('你的选择',
              {
                permanent: true,
                direction: 'auto'
              }).addTo(this.map);

          this.markers.push(marker);
          var latlngs = [
            [guess.lat, guess.lng],
            [gameData.rounds[guess.round - 1].lat, gameData.rounds[guess.round - 1].lng],
          ];

          var polylinePath = new L.Polyline(latlngs, {
            color: 'blue',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
          });

          polylinePath.addTo(this.map);
          this.polylinePaths.push(polylinePath);

          this.group.push([guess.lat, guess.lng]);
        });
      }

      this.map.fitBounds(this.group);
    },

    drawRoundMarker(round) {
      var options = JSON.parse(JSON.stringify(L.Icon.Default.prototype.options));
      options.iconUrl = this.imgOrigin + 'biz/1662830770348_9499340182724556af66f2b42846135b_0.png';
      options.iconRetinaUrl = this.imgOrigin + 'biz/1662830707508_d7e5c8ce884a4fb692096396a5405f5b_0.png';
      var marker = L.marker([round.lat, round.lng], {icon: new L.Icon(options)}).bindTooltip('第' + round.round + '轮',
          {
            permanent: true,
            direction: 'auto'
          }).addTo(this.map);
      marker.round = round;
      marker.on('click', function (e) {
        console.log(e);
        this.toPanorama(this.gameData.id, e.target.round);
      }.bind(this));
      this.markers.push(marker);
      this.group.push([round.lat, round.lng]);
    },

    getUser() {
      if (this.gameData != null && this.gameData.player != null && this.gameData.requestUserId === this.gameData.player.user.userId) {
        return this.gameData.player;
      }
      var user = null;
      if (this.gameData.teams && this.gameData.teams.length >= 1) {
        this.gameData.teams.forEach(team => {
          team.teamUsers.forEach(teamUser => {
            if (this.gameData.requestUserId === teamUser.user.userId) {
              user =  teamUser;
            }
          });
        });
      }
      return user;
    },


    toAll() {
      this.choose = '全部';
      this.markers.forEach((v) => {v.remove()});
      this.polylinePaths.forEach((v) => {v.remove()});
      this.markers = [];
      this.polylinePaths = [];
      this.group = [];

      for (var i in this.gameData.rounds) {
        this.toRound(this.gameData.rounds[i], true);
      };
      this.map.fitBounds(this.group);
    },

    toRound(round, all) {
      if (!all) {
        this.choose = '第' + round.round + '轮';
        this.markers.forEach((v) => {v.remove()});
        this.polylinePaths.forEach((v) => {v.remove()});
        this.markers = [];
        this.polylinePaths = [];
        this.group = [];;
      }

      this.drawRoundMarker(round);


      if (this.gameData.teams && this.gameData.teams.length >= 1) {
        for (var i in this.gameData.teams) {
          var team = this.gameData.teams[i];
          team.teamUsers.forEach(teamUser => {
            this.drawUser(teamUser, round);
          });
        }
      } else if (this.gameData.player) {
        this.drawUser(this.gameData.player, round);
      }
      if (!all) {
        this.map.fitBounds(this.group);
      }
    },

    drawUser(user, round) {
      console.log(user);
      var name = user.user.userName;
      if (this.gameData.requestUserId === user.user.userId) {
        name = '你的选择';
      }
      user.guesses.forEach(guess => {
        if (guess.round !== round.round) {
          return;
        }

        var marker = L.marker([guess.lat, guess.lng], {icon: this.getOptionUser(user.user.userId)}).bindTooltip(name,
            {
              permanent: true,
              direction: 'auto'
            }).addTo(this.map);

        var latlngs = [
          [guess.lat, guess.lng],
          [round.lat, round.lng],
        ];

        this.markers.push(marker);
        var polylinePath = new L.Polyline(latlngs, {
          color: 'blue',
          weight: 3,
          opacity: 0.5,
          smoothFactor: 1
        });
        polylinePath.addTo(this.map);
        this.polylinePaths.push(polylinePath);
        this.group.push([guess.lat, guess.lng]);
      });
    },

    toPanorama(gameId, round) {
      // console.log(round);
      if (!round.source || !round.panoId ) {
        this.$toast('该街景暂不支持跳转');
        return;
      }
      if (round.source === 'baidu_pano') {
        console.log(round.panoId);
        tuxunOpen('https://maps.baidu.com/#panoid=' + round.panoId + '&panotype=street&pitch=0&l=13&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=' + round.panoId);
      } else {
        tuxunOpen('/tuxun/replay_pano?gameId=' + gameId + '&round=' + round.round);
      }
      console.log('123');
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
    checkInTeams(team, userId) {
      for (let i = 0; i < team.users.length; i++) {
        if (team.users[i].userId === userId) {
          return true;
        }
      }
      return false;
    },
    getOptionUser(userId) {
      if (this.gameData && this.gameData.teams && this.gameData.teams.length === 2) {
        if (this.checkInTeams(this.gameData.teams[1], userId)) {
          var options = JSON.parse(JSON.stringify(L.Icon.Default.prototype.options));
          options.iconUrl = this.imgOrigin + 'front/marker-icon-green.png';
          options.iconRetinaUrl = this.imgOrigin + 'front/marker-icon-2x-green.png';
          return new L.Icon(options);
        } else {
          return new L.Icon.Default();
        }
      } else {
        return new L.Icon.Default();
      }
    },

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
  .back_home {
    position: fixed;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 500;
  }
}
</style>
