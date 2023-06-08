<template>
  <div class="container">
    <div class="top-left">
      <el-button @click="goHome" round>首页</el-button>
    </div>
    <div style=" margin: auto; margin-top: 4rem; width: 640px;max-width: 100%;padding: 10px;">
      <div v-for="(item,index) in friends" :key="index" class="list" @click="toUser(item)">
        <img :src="imgOrigin+item.icon + '?x-oss-process=image/resize,h_80/quality,q_75'" alt=""
             style="width: 40px; height: 40px; border-radius: 100%;margin: 0 5px;">
        <span style="flex: 1;">{{ item.userName }}</span>
        <span style="width: 120px;text-align: right;">积分：{{ item.rating }}</span>
      </div>
      <div class="footer">
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import {tuxunJump, tuxunOpen} from './common';


export default {
  name: 'tuxunRank',
  components: {},
  data() {
    return {
      friends: [],
      timer: 0
    };
  },
  created() {
  },
  mounted() {
    this.getFriends();

    let _this = this;
    setInterval(() => {
      _this.getButtonRank();
    }, 5000);
  },
  methods: {
    getFriends() {
      api.getByPath('/api/v0/tuxun/friend/list').then(res => {
        this.friends = res.data;
      });
    },
    toUser(item) {
      tuxunJump('/tuxun/user/' + item.userId);
    },

    goHome() {
      tuxunJump('/tuxun/');
    },
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100%;
  background-color: #090723;
  .top-left {
    position: absolute;
    padding-top: 2rem;
    padding-left: 2rem;
  }
}
div {
  color: white;
}
.list {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 2px 0;
  padding: 2px 4px;
  border-bottom: 1px solid #f9f9f9;

  &:hover {
    background-color: grey;
  }
}

.podium {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 30%;
}
.footer {
  height: 10rem;
}

@media only screen and (max-width: 768px) {
  .container {
    .top-left {
      padding-left: 1rem;
      padding-top: 1rem;
    }
  }
}
</style>
