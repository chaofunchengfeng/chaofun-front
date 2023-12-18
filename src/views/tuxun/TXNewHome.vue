<template>
  <div class="container" :style="{'background-image':'linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.3)),url('+imgOrigin+ this.backgroundImage +')','background-size':'cover','background-position': 'center'}">
    <div class="game">

      <div class="top-right">
        <el-button  style="" @click="toUserHome">个人首页</el-button>
        <div style="height: 5px">
        </div>
        <el-button  @click="toFriend" >我的好友</el-button>
        <div style="height: 5px">
        </div>
        <el-button  @click="toMessage" style="position: relative" >
          消息通知
          <div v-if="message !== 0" class="point"></div>
        </el-button>
        <div style="height: 5px">
        </div>
        <el-button  @click="toRank" >积分排行</el-button>
      </div>
      <div class="top">
        <div class="top-left">
          <div style="display: flex">
            <img style=" width: 5rem; height: 3rem" :src="imgOrigin + 'biz/1658657631523_45db8dd090dc49af99f2a8a4ace01122.svg'"/>
            <div @click="toDocument" style="cursor: pointer; padding-left: 5px; text-decoration: underline; font-size: 16px; color: white;  display: inline-block; align-self: flex-end; ">教程文档</div>
          </div>
          <div style=" color: white; padding-top: 5px">探索真实世界，找到你在的位置</div>
        </div>
      </div>


<!--      <div class="normal-info">「大胆拥抱世界」</div>-->
<!--      <div style="height: 20px"></div>-->

<!--      <div class="info" @click="toFirstTournament">图寻高校争霸赛圆满收官~</div>-->
      <div class="second-info" @click="toSecond"> 玩家第七届组队赛圆满结束</div>
      <div class="second-info" @click="toTournament">【图寻联赛第二赛季】联赛第四轮报名帖 </div>


      <section class="game_entrance">
        <div class="first_session_head">单人</div>
        <div class="line"></div>
        <div class="grid_main">
          <div class="card" @click="redirectPage( '/tuxun/daily-challenge?v=1118')">
            <div class="title">
              每日挑战
            </div>
            <div class="describe">
              每天五题，神清气爽
            </div>
            <div class="card-top-right">可移动</div>
          </div>
          <div class="card" @click="redirectPage( '/tuxun/streak')">
            <div class="title">
              连胜挑战
            </div>
            <div class="describe">
              探索者，坚持到一百题啊！
            </div>
            <div class="card-top-right">可移动</div>
          </div>
          <div class="card" @click="redirectPage( '/tuxun/maps')">
            <div class="title">
              题库
            </div>
            <div class="describe">
              走遍大江南北
            </div>
            <div class="card-top-right">可移动</div>
          </div>
<!--          <div class="card" @click="redirectPage( 'https://tuxun.fun/uncover')">-->
<!--            <div class="title">-->
<!--              揭图-->
<!--            </div>-->
<!--            <div class="describe">-->
<!--              图片题，新模式-->
<!--            </div>-->
<!--            <div class="card-top-right-beta">Beta</div>-->
<!--          </div>-->
        </div>

        <div class="first_session_head">积分</div>
        <div class="line"></div>
        <div class="grid_main">

          <!--          <div class="card" @click="redirectPage( '/tuxun/team')">-->
          <!--            <div class="title">-->
          <!--              组队匹配-->
          <!--            </div>-->
          <!--            <div class="describe">-->
          <!--              刺激图寻-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="card" @click="soloMatch" >
            <div class="title">
              全球积分
            </div>
            <div class="describe">
              全球街景的积分比赛
            </div>
            <div class="card-top-right">可移动</div>
          </div>
          <div class="card" @click="toChinaMatch">
            <div class="title">
              中国积分
            </div>
            <div class="describe">
              江山如此多娇
            </div>
            <div class="card-top-right-beta">Beta</div>
          </div>
        </div>

        <div class="first_session_head">娱乐</div>
        <div class="line"></div>
        <div class="grid_main">
          <div class="card" @click="redirectPage( '/tuxun/team')">
            <div class="title">
              匹配
            </div>
            <div class="describe">
              一个人或者和朋友合作挑战对手
            </div>
          </div>
<!--          <div class="card" @click="redirectPage( '/tuxun/guoqing')">-->
<!--            <div class="title">-->
<!--              淘汰赛-->
<!--            </div>-->
<!--            <div class="describe">-->
<!--              满3人发车-->
<!--            </div>-->
<!--            <div class="card-top-right">可移动</div>-->
<!--          </div>-->
          <div class="card" @click="toParty" >
            <div class="title">
              派对
            </div>
            <div class="describe">
              邀请好友对决
            </div>
            <div class="card-top-right">可移动</div>
          </div>
          <div class="card" @click="toJoin" >
            <div class="title">
              加入派对
            </div>
            <div class="describe">
              通过派对码加入派对
            </div>
          </div>
        </div>

        <div class="first_session_head">探索</div>
        <div class="line"></div>
        <div class="grid_main">
          <div class="card" @click="redirectPage('/tuxun/event')">
            <div class="title">
              寻景
            </div>
            <div class="describe">
              寻友地图
            </div>
          </div>

          <div class="card" @click="redirectPage( '/tuxun/wonders')">
            <div class="title">
              街景奇观
            </div>
            <div class="describe">
              光怪陆离，怪奇物语
            </div>
            <div class="card-top-right">可移动</div>
          </div>

          <div class="card" @click="redirectPage( '/tuxun/random')">
            <div class="title">
              随机街景
            </div>
            <div class="describe">
              漫步孤独星球
            </div>
            <div class="card-top-right">可移动</div>
          </div>



          <!--          <div class="card" @click="redirectPage( '/tuxun/')">-->
          <!--            <div class="title">-->
          <!--              随机百度街景-->
          <!--            </div>-->
          <!--            <div class="describe">-->
          <!--              走遍神舟大陆-->
          <!--            </div>-->
          <!--            <div class="card-top-right">可移动</div>-->
          <!--          </div>-->
        </div>

          <div class="first_session_head">扩展</div>
          <div class="line"></div>
          <div class="grid_main">
            <div class="card" @click="toBilibili">
              <div class="title">
                直播/视频/教程
              </div>
              <div class="describe">
                看看图寻er们都创作了哪些内容吧
              </div>
            </div>
            <div class="card" @click="toForum()">
              <div class="title">
                讨论区
              </div>
              <div class="describe">
                一起来讨论图寻技巧吧
              </div>
            </div>
            <div class="card" @click="toMiZong()">
              <div class="title">
                网络迷踪
              </div>
              <div class="describe">
                一个发图片找地方的交流社区
              </div>
            </div>
            <div class="card" @click="toScratch()">
              <div class="title">
                炒饭小测验
              </div>
              <div class="describe">
                地理小测验，帮助你玩好图寻
              </div>
            </div>
          </div>
          <div style="display: flex;">
            <div @click="toDocument" style="cursor: pointer; color: white;font-size: medium; padding-top: 1rem; padding-right: 1rem; text-decoration:underline;">
              图寻文档
            </div>
            <div @click="toUpdate" style="cursor: pointer; color: white;font-size: medium; padding-top: 1rem; padding-right: 1rem; text-decoration:underline;">
              更新日志
            </div>
            <div @click="toMall" style="cursor: pointer; color: white;font-size: medium; padding-top: 1rem; padding-right: 1rem; text-decoration:underline;">
              商店
            </div>
            <div @click="toApp" style="cursor: pointer; color: white;font-size: medium; padding-top: 1rem; padding-right: 1rem; text-decoration:underline;">
              App
            </div>
            <!--          <div @click="window.location.href = '/tuxun/change_log'" style="color: white;font-size: medium; padding-top: 1rem; text-decoration:underline;">-->
            <!--            更新日志-->
            <!--          </div>-->
          </div>
          <div class="thx">
            <p v-if="times" class="times">总轮次数：<span style="font-size: 18px">{{times}}</span></p>
            <p>提示：如倒计时不准/卡死/黑屏，可关闭代理，系统时间对齐互联网时间再试</p>
            <p>快捷键：空格-确定选择，下一题; 空格-换一个(街景奇观/随机街景)</p>
            <p>
              积分规则：大原则是按照你和对手在一场比赛中的期望排名来算的，在积分赛中，每局会有额外的2分距离分。如果距离小于1000公里，则加2分，大于则减2分。
            </p>
            <p>
              小建议：尽量使用街景中的信息进行猜测，不借助搜索引擎，才能让你更快成为高手。
            </p>
            <p>
              特别鸣谢：猫，南山大王cf，网络迷踪版主，GeoGuessr，百度街景，Google街景，MapBox
            </p>
            <p>
              QQ群：<a target="_blank" href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=YRq8jU3MFd-ylHCFC0lcJX9npaG0FRmi&authKey=W3wNh8n8zybypY08JK4g4YCcA0o3GdiwKXFqYCff4Ejan%2BKymBCWUSwjplXsZJva&noverify=0&group_code=943507031">943507031</a>
            </p>
            <p>
              微信公众号：炒饭社区 | 开发者微博：<a target="_blank" href="https://weibo.com/u/3050203537">@此间ZY</a>
            </p>
            <p>
              地图审图号：GS（2022）2885号
            </p>
            <p>
              问题反馈：电话：15058139992，或图寻群, 可能有1个月会员奖励
            </p>
            <a target="_blank" href="https://beian.miit.gov.cn/">浙ICP备2022031450号</a>
          </div>
      </section>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api';
import {tuxunJump, tuxunOpen} from './common';

export default {
  name: 'TXNewHome',
  data() {
    return {
      times: null,
      message: 0,
      backgroundImage: 'front/farfar-peK8iXqGMzQ-unsplash.jpg?x-oss-process=image/quality,q_50'
    };
  },
  created() {
    if (!location.host.includes('tuxun.fun') && !location.host.includes('8099')) {
      window.location.href = 'https://tuxun.fun';
      return;
    }
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if (Notification) {
      Notification.requestPermission(function (status) {
      });
    }
    this.getTimesInterval();
    this.getMessage();
    this.checkShowVip();
  },

  mounted() {

  },
  methods:{
    getTimesInterval() {
      this.getTimes();
      setInterval(() => {
        this.getTimes();
      }, 5000);
    },
    getTimes() {
      api.getByPath('/api/v0/tuxun/getTotalGuess').then(res=>{
        this.times = res.data;
      });
    },
    toPage(title, path) {
      try {
        window.flutter_inappwebview.callHandler('toViewPage',{url: location.origin + path,title:title,showHeader: true});
      } catch (e) {
        tuxunJump(location.origin + path);
      }
    },
    toForum(){
      try {
        window.flutter_inappwebview.callHandler('toAppForum',{forumId: 753 + ''});
      } catch (e) {
        tuxunOpen('https://choa.fun/f/753');
      }
    },
    toMiZong(){
      try {
        window.flutter_inappwebview.callHandler('toAppForum',{forumId: 84 + ''});
      } catch (e) {
        tuxunOpen('https://choa.fun/f/84');
      }
    },

    toParty() {
      this.doLoginStatus().then((res) => {
        tuxunJump('/tuxun/social');
      });
    },

    toJoin() {
      this.doLoginStatus().then((res) => {
        tuxunJump('/tuxun/join');
      });
    },

    redirectPage(path) {
      console.log(path);
      tuxunJump(path);
      // window.location.href = path
    },

    toChinaMatch() {
      location.href = 'https://tuxun.fun/china-match?v=1118';
    },

    soloMatch() {
      location.href = 'https://tuxun.fun/world-match?v=1118'
    },
    toFriend() {
      location.href = 'https://tuxun.fun/friend?v=1118'
    },
    toMessage() {
      location.href = 'https://tuxun.fun/message?v=1118'
    },
    toRank() {
      location.href = 'https://tuxun.fun/point-rank?v=1118'
    },
    toNewSeason() {
      tuxunJump('https://www.yuque.com/chaofun/tuxun/season');
    },
    getMessage() {
      api.getByPath('/api/v0/tuxun/message/check').then(res => {
        if (res.success) {
          this.message = res.data;
        }
      });
    },
    toUserHome() {
      this.doLoginStatus().then((res) => {
        if (res) {
          tuxunJump('/tuxun/user/' + this.$store.state.user.userInfo.userId);
        }
      });
    },
    toBilibili() {
      tuxunOpen('https://search.bilibili.com/all?keyword=%E5%9B%BE%E5%AF%BB');
    },
    toScratch() {
      tuxunOpen('https://choa.fun/scratch');
    },
    toUpdate() {
      tuxunOpen('https://www.yuque.com/ucun5p/kfw26e/dp7hvxnm7tes88g7');
    },
    toMall() {
      tuxunOpen('https://tuxun.fun/mall');
    },
    toApp() {
      tuxunOpen('https://tuxun.fun/app');
    },
    toDocument() {
      tuxunOpen('https://www.yuque.com/ucun5p/tuxun');
    },
    toFirstTournament() {
      tuxunOpen('https://choa.fun/p/1281750');
    },
    toSecond() {
      tuxunJump('https://choa.fun/p/1287689');
    },
    toTournament() {
      tuxunJump('https://choa.fun/p/1287803');
    },
    toDoc() {
      tuxunOpen('https://www.yuque.com/chaofun/tuxun/vh943duu6lwuctr9');
    },
    raiseVIP(scene) {
      this.doLoginStatus().then(res=>{
        if(res){
          this.$vip(scene);
        }
      });
    },
    checkShowVip() {
      api.getByPath('/api/v0/tuxun/user/checkShowVip').then(res => {
        if (res.data) {
          this.raiseVIP(res.data);
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.el-button {
  background: rgb(0,0,0,0.3);
  border: 0px;
  color: white;
}
.container {
  height: 100%;
  width: 100%;
  background-color:  $tuxunBackgroundColor;

  .point {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
  }
  .top {
    display: flex;
    justify-content: space-between;
    .top-left {
      padding-top: 2rem;
    }
    .top-right {
      padding-top: 2rem;
    }
  }

  .game {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 80rem;
    .top-right {
      position: absolute;
      padding-top: 2rem;
      right: 2rem;
    }
    .info {
      cursor: pointer;
      color: white;
      font-size: medium;
      text-decoration:underline;
    }
    .second-info {
      cursor: pointer;
      color: white;
      font-size: medium;
      padding-top: 1rem;
      text-decoration:underline;
    }
    .normal-info {
      color: white;
      font-size: medium;
      padding-top: 2rem;
    }
    .times {
      color: white;
      padding-top: 5px;
      span: {
        color: green;
      }
    }
    section {
      padding-top: 20px;
      display: block;
    }
    .game_entrance {
      margin-top: 3%;
      .line {
        width: 100%;
        height: 2px;
        background-color: white;
        margin-bottom: 2rem;
        margin-top: 1rem;
      }
      .first_session_head {
        font-size: 24px;
        color: whitesmoke;
        font-weight: bolder;
        text-align: center;
      }
    }
  }
  .thx {
    font-size: 12px;
    color: white;
    padding-top: 40px;
    padding-bottom: 2rem;
  }
  .grid_main {
    padding-bottom: 2rem;
    display: grid;
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
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
      flex-direction: column;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      padding: 2rem;
      min-height: 110px;
      transition: .1s;
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

      .card-top-right-beta {
        position: absolute;
        right: 2px;
        top: 2px;
        color: white;
        font-weight: bold;
        font-size: 16px;
        padding-left: 5px;
        padding-right: 5px;
        background-color: sandybrown;
      }
      &:hover {
        transform: scale(1.03);
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .grid_main {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
