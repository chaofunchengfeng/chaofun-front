<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" round>首页</el-button>
    </div>

    <matching v-if="this.showMatch" @end="endMatching"/>
    <div v-else style="margin-top: 5rem">
      <el-button @click="nmMatching">
        开始固定匹配
      </el-button>
      <div style="height: 2rem"></div>
      <el-button @click="moveMatching">
        开始移动匹配(beta)
      </el-button>
    </div>
  </div>
</template>

<script>
import * as api from "../../api/api";
import {tuxunJump} from "./common";
import Matching from './Matching';


export default {
  name: "match",
  components: {Matching},
  data() {
    return {
      showMatch: false,
      notifyStatus: '',
      path: null,
      t: null,
    }
  },
  created() {
    this.init();
    // setTimeout(() => {
    //   this.notify("123 test");
    // }, 5000);
  },
  methods: {
    init() {
      var Notification = window.Notification || window.mozNotification || window.webkitNotification;
      if (Notification) {
        Notification.requestPermission(function (status) {
          this.notifyStatus = status;
        }.bind(this));
      }
    },
    goHome() {
      tuxunJump('/tuxun/')
    },
    nmMatching() {
      this.showMatch = true;
      this.path = '/api/v0/tuxun/solo/joinRandom';
      this.match();
    },
    moveMatching() {
      this.showMatch = true;
      this.path = '/api/v0/tuxun/solo/joinMoveRandom';
      this.match();
    },
    endMatching() {
      this.showMatch = false;
      clearInterval(this.t);
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
    notify(text) {
      try {
        var Notification = window.Notification || window.mozNotification || window.webkitNotification;
        if (Notification) {
          if ('granted' !== this.notifyStatus) {
          } else {
            var notify = new Notification('图寻通知', {
              dir: 'auto',
              data: '',
              lang: 'zh-CN',
              requireInteraction: false,
              // tag: ,//实例化的notification的id
              icon: 'https://i.chao-fan.com/biz/08a2d3a676f4f520cb99910496e48b4e.png?x-oss-process=image/resize,h_80/quality,q_75',//通知的缩略图,//icon 支持ico、png、jpg、jpeg格式
              body: text
            });
            notify.onclick = function (val) {
              //如果通知消息被点击,通知窗口将被激活
              parent.focus();
              window.focus();
              notify.close();
            },
            notify.onshow = function () {
              setTimeout(notify.close.bind(notify), 5000);
            };
            notify.onerror = function () {
              console.log('HTML5桌面消息出错！！！');
            };
            notify.onclose = function () {
              console.log('HTML5桌面消息关闭！！！');
            };
          }
        } else {
          console.log('您的浏览器不支持桌面消息');
        }
      } catch (e) {
      }
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
              api.getByPathLongTimeout(this.path, {interval: interval}).then(res => {
                if (res.data) {
                  if (!this.showMatch) {
                    return;
                  }
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
.container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-color: #18182A;
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 5000;
  }
}
</style>
