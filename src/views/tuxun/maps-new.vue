<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" round>首页</el-button>
    </div>
    <div class="nav">
      练习题库-最新
    </div>
    <!--    <div class="tab-container">-->
    <!--      <div class="tab">-->
    <!--        <div class="tab-item">一天</div>-->
    <!--        <div class="tab-item">一周</div>-->
    <!--        <div class="tab-item">一个月</div>-->
    <!--        <div class="tab-item">所有时间</div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="game_entrance">
      <div class="grid_main">
        <div v-for="(item, index) in pagedata" :key="index" @click.stop="toMapsDetail(item)"  :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover || 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" class="card">
          <div class="title">
            {{item.name}}
          </div>
          <div class="players" v-if="item.pcount">
            地点: {{item.pcount}}
          </div>
          <div class="players">
            人次: {{item.players}}
          </div>
          <div v-if="item.difficulty" class="players">
            难度: {{item.difficulty}}
          </div>
          <div>
            <el-button style="background-color: unset; color: white" @click.stop="toMaps(item)" type="primary"  round>探索<span style="color: gold">(VIP)</span></el-button>
          </div>
          <div class="card-top-right">可移动</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from './common';
import * as api from '../../api/api';
import {countBy} from 'lodash';
export default {
  name: 'maps-hot',
  data() {
    return {
      pagedata: null,
    };
  },
  created() {
    this.history = history;
    this.list();
  },
  methods: {
    list() {
      api.getByPath('/api/v0/tuxun/maps/listNew', {count: 100}).then(res => {
        if (res.success) {
          this.pagedata = res.data;
          this.pagedata.forEach(function (item) {
            this.addDifficulty(item);
          }.bind(this));
        }
      });
    },
    addDifficulty(item){
      if (item.avgScore === null) {
        item.difficulty = '中等';
      } else if (item.avgScore <= 5000) {
        item.difficulty = '非常难';
      } else if (item.avgScore <= 10000) {
        item.difficulty = '难';
      } else if (item.avgScore <= 15000) {
        item.difficulty = '中等';
      } else if (item.avgScore <= 20000) {
        item.difficulty = '简单';
      } else {
        item.difficulty = '非常简单';
      }
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
    toMaps(item){
      this.doLoginStatus().then(res => {
        console.log(res);
        if (res) {
          api.getByPath('/api/v0/tuxun/vip/check').then(res=>{
            if (res.data) {
              tuxunJump('/tuxun/maps-start?mapsId=' + item.id);
            } else {
              this.$vip();
            }
          });
        }
      });
    },
    toMapsDetail(item, type) {
      tuxunJump('/tuxun/maps_detail?mapsId=' + item.id );
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color: #090723;

  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .top-right {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-right: 1rem;
  }

  section {
    padding-top: 3rem;
    display: block;
  }
  .tab-container {
    width: 100%;
    justify-content: center;
    align-items: center;
    align-content: center;
    text-align: center;
    justify-items: center;
    .tab {
      display: flex;
      width: 40%;
      align-self: center;
    }
  }
  .game_entrance {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 80rem;
    margin-top: 3rem;
    margin-bottom: 5rem;

    .grid_main {
      display: grid;
      grid-row-gap: 1.5rem;
      grid-column-gap: 1.5rem;
      grid-template-columns: repeat(3, 1fr);

      .card {
        cursor: pointer;
        position: relative;
        border-radius: 1rem;
        background-color: rgb(25,26,46, 0.9);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 100%;
        box-sizing: border-box;
        box-radius: 1rem;
        flex-direction: column;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        padding: 2rem 2rem 2rem 2rem;
        min-height: 110px;
        .title {
          font-size: 1.5rem;
          color: white;
          font-weight: 700;
          padding-bottom: 0.2rem;
        }
        .describe {
          color: yellow;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .players {
          color: white;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .card-top-right {
          position: absolute;
          right: 2px;
          top: 2px;
          color: white;
          font-weight: bold;
          font-size: 16px;
          padding-left: 5px;
          padding-right: 5px;
          background-color: #3590FF;
        }
        &:hover {
          transform: scale(1.03);
        }
      }
    }
  }
}
@media only screen and (max-width: 768px) {
  .container {
    .game_entrance {
      .grid_main {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
}
</style>
