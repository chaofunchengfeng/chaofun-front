<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="!tuxunApp" @click="goHome" round>首页</el-button>
    </div>

    <div class="main">
<!--      <div @click="goTeam" class="card">-->
<!--        <div class="title">组队匹配</div>-->
<!--        <div class="describe">和朋友合作战胜对手</div>-->
<!--      </div>-->
      <div @click="goXJ" class="card">
          <div class="title">寻景</div>
          <div class="describe">地图标点分享图片，在线旅游</div>
      </div>
<!--      <div @click="goPano" class="card">-->
<!--        <div class="title">炒饭宇宙</div>-->
<!--        <div class="describe">通过文本生成全景世界</div>-->
<!--      </div>-->
    </div>
  </div>

</template>

<script>
import {tuxunJump} from "./common";

export default {
  name: "tuxun-library",
  data() {

  },
  created() {

  },
  methods: {
    goHome() {
      tuxunJump('/tuxun/')
    },
    goPano() {
      tuxunJump('/tuxun/pano-gallary')
    },
    goTeam() {
      tuxunJump('/tuxun/team')
    },
    goXJ() {
      tuxunJump('/tuxun/event');
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color:  $tuxunBackgroundColor;

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
  .main {
    width: 40%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
    .card {
      cursor: pointer;
      position: relative;
      border-radius: 1rem;
      background-color: #2b2f3a;
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
      padding: 2rem;
      min-height: 110px;
      margin-top: 2rem;
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

@media only screen and (max-width: 768px) {
  .container {
    .main {
      width: 80%;
    }
  }
}

</style>
