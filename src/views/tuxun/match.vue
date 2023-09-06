<template>
  <div>

  </div>
</template>

<script>
import * as api from "../../api/api";
import {tuxunJump} from "./common";

export default {
  name: "match",
  data() {
    return {}
  },
  created() {

  },
  methods: {
    init() {

    },
    match() {
      // 每3秒发送一次心跳
      this.doLoginStatus().then((res) => {
        this.continueSend = true;
        var interval = 1500;
        this.t = setInterval(() => {
          try {
            if (this.continueSend) {
              this.continueSend = false;
              api.getByPathLongTimeout('/api/v0/tuxun/solo/joinRandom', {interval: interval}).then(res => {
                if (res.data) {
                  this.notify('您的图寻已匹配到对手，点击开始对战');
                  tuxunJump( '/tuxun/solo_game?gameId=' + res.data);
                  this.gameId = res.data;
                  this.init();
                  this.continueSend = false;
                  clearInterval(this.t);
                } else {
                  this.continueSend = true;
                }
              });
            }
          } catch (e) {
            this.continueSend = true;
          }
        }, interval);
      });
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
