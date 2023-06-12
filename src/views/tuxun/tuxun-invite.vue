<template>
  <div class="cover">
    <div class="ycovers">
      <div >
        <div style="text-align: right">
          <el-button @click="closeInner" style="margin-right: 40px">关闭</el-button>
        </div>
        <div class="ycontainer">
          <div style="margin-bottom: 20px; font-size: 20px">邀请好友</div>
          <div @click="inviteInner(item.userId)" v-for="(item, index) in friends" class="friend">
            <img :src="imgOrigin+item.icon + '?x-oss-process=image/resize,h_80/quality,q_75'" alt=""
                 style="width: 40px; height: 40px; border-radius: 100%;margin: 0 5px;">
            <span style="flex: 1;">{{ item.userName }}</span>
            <span style="width: 120px;text-align: right;">积分：{{ item.rating }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api';
export default {
  name: "tuxun-invite",
  props: {
    close: Function,
    invite: Function,
  },
  data() {
    return {
      cancelImg: require('@/assets/images/icon/cancel1.png'),
      friends: [],
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      api.getByPath('/api/v0/tuxun/friend/list').then(res => {
        this.friends = res.data;
      });
    },
    closeInner() {
      this.close();
    },
    inviteInner(userId) {
      this.invite(userId);
    }
  }
}
</script>

<style lang="scss" scoped>
.ycovers {
  position: fixed;
  z-index: 2012;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;

  .ycontainer {
    background: #fff;
    width: 400px;
    max-width: 90%;
    // height: 350px;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    position: relative;
    min-height: 330px;
    max-height: 80vh;
    overflow: auto;
    .cancel{
      position: absolute;
      top: 14px;
      right: 14px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      z-index: 10;
    }
  }



  .friend {
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
}
</style>
