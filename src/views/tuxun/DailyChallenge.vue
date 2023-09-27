<template>
  <div class="container">

  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from './common';
import * as api from '../../api/api';

export default {
  name: 'DailyChallenge',

  data() {
    return {
      challengeId: undefined,
      gameData: undefined,
      rank: undefined,
      dailyChallengeRank: null,
      dailyChallengeTotalPlayers: null,
      dailyChallengePercent: null,
      showBegin: false,
      type: 'china',
      rankType: 'friend',
      total: null,

    };
  },

  created() {
    window.location.href = 'https://new.tuxun.fun/daily-challenge';
  },

  methods: {
    initSelfRank() {
      api.getByPath('/api/v0/tuxun/challenge/getGameInfo', {'day': '1', type: this.type}).then(res => {
        console.log(res.data);
        if (res.success) {
          if (res.data) {
            this.gameData = res.data;
            this.challengeId = res.data.challengeId;
            this.getDailyChallengeRank();
          }
        } else {
          this.showBegin = true;
        }
      });
    },
    reload() {
      this.rankType = 'friend';
      this.init();
    },
    init() {
      setTimeout(() => {
        if ( this.$route.query.type !== this.type) {
          this.$router.replace({query: {type: this.type}});
        }
      }, 100);
      this.gameData = null;
      this.showBegin = false;
      this.challengeId = null;
      this.dailyChallengeRank = null;
      this.dailyChallengePercent = null;
      this.dailyChallengeTotalPlayers = null;
      this.total = null;
      this.rank = null;

      this.initSelfRank();

      api.getByPath('/api/v0/tuxun/challenge/getDailyChallengeId', {type: this.type}).then(res => {
        if (res.data) {
          this.challengeId = res.data;
          this.getTotal();
          this.getRank();
        }
      });
    },
    getDailyChallengeRank() {
      api.getByPath('/api/v0/tuxun/challenge/getDailyChallengeRank', {'challengeId': this.challengeId, 'gameId': this.gameData ? this.gameData.id : null }).then(res=>{
        this.dailyChallengeRank = res.data.rank;
        this.dailyChallengePercent = res.data.percent;
        this.dailyChallengeTotalPlayers = res.data.total;
      });
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    beginCall() {
      this.doLoginStatus().then(res => {
        console.log(res);
        if (res) {

          api.getByPath('/api/v0/tuxun/challenge/start', {'gameId': this.gameData.id}).then(res => {
            this.gameData = res.data;
            tuxunJump('/tuxun/challenge?challengeId=' + this.gameData.challengeId);
          });
        }
      });
    },
    begin() {
      this.doLoginStatus().then(res => {
        console.log(res);
        if (res) {
          this.beginCall();
        }
      });
      // window.location.href =
    },
    again() {
      tuxunJump( '/tuxun/challenge?challengeId=' + this.gameData.challengeId);
    },

    getTotal() {
      api.getByPath('/api/v0/tuxun/challenge/rankTotal', {challengeId: this.challengeId}).then(res=>{
        if (res.success) {
          this.total = res.data;
        }
      });
    },
    getRank() {
      var path = '/api/v0/tuxun/challenge/rankNew';
      if (this.rankType === 'friend') {
        path = '/api/v0/tuxun/challenge/rankFriend';
      }
      api.getByPath(path, {challengeId: this.challengeId}).then(res=>{
        if (res.success) {
          this.rank = res.data.rank;
        }
      });
    },
    toUser(user) {
      tuxunJump( '/tuxun/user/' + user.userId);
    },

    getDate() {  //当前时间格式化处理
      var str = '';
      var date = new Date();
      str += date.getFullYear() + '年 '; //获取年份
      str += date.getMonth() + 1  + '月 '; //获取月份
      str += date.getDate() + '日'; //获取日
      return str;
    },
    toReplay() {
      tuxunJump('/tuxun/replay?gameId=' + this.gameData.id);
    },
    share() {
      // var input = document.createElement('textarea');

      // document.body.appendChild(input);
      // input.select();
      // var result = document.execCommand('copy');
      // document.body.removeChild(input);
      // this.$toast("复制成功");

      var textarea = document.createElement('textarea');
      var text = '';
      if (this.type === 'world') {
        text = '图寻 ' + this.getDate().replaceAll(' ', '') + '\r\n每日挑战-全球\r\n我的得分：' + this.gameData.player.totalScore + '\r\n' + this.getEmoji() + '\r\n排名: ' +  this.dailyChallengeRank + '/' + this.dailyChallengeTotalPlayers + '\r\nhttps://tuxun.fun/daily_challenge?type=world';
      } else {
        text = '图寻 ' + this.getDate().replaceAll(' ', '') + '\r\n每日挑战-中国\r\n我的得分：' + this.gameData.player.totalScore + '\r\n' + this.getEmoji() +  '\r\n排名: ' +  this.dailyChallengeRank + '/' + this.dailyChallengeTotalPlayers + '\r\nhttps://tuxun.fun/daily_challenge?type=china';
      }

      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$toast('复制成功，去分享吧！');

    },
    getEmoji() {
      var emoji = '';
      this.gameData.player.roundResults.forEach(v => {
        if (v.score <= 1000) {
          emoji += ' 🟥';
        } else if (v.score <= 2000) {
          emoji += ' 🟧';
        } else if (v.score <= 3000) {
          emoji += ' 🟨';
        } else if (v.score <= 4000) {
          emoji += ' 🟩';
        } else if (v.score < 5000) {
          emoji += ' 🟦';
        } else if (v.score === 5000) {
          emoji += ' 🌈';
        }
      });
      return emoji;
    }
  }

};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color:  $tuxunBackgroundColor;

  .main_content {
    height: 100%;
    width: 100%;
    justify-content: center;
    text-align: center;
    //align-items: center;

    .top {
      width: 100%;
      padding-top: 2rem;
      //display: flex;
      justify-content: center;

      .nav {
        color: white;
        font-size: 48px;
        font-weight: bold;
        padding-top: 3rem;
      }
      div {
        color: floralwhite;
      }
      .tooltip {
        display: none;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 5px;
        padding: 8px;
        background-color: #333;
        color: #fff;
        border-radius: 4px;
        white-space: nowrap;
        font-size: 14px;
      }
      .hover-target {
        position: relative;
      }

      .hover-target:hover .tooltip,
      .hover-target.active .tooltip {
        display: block;
      }
      .score {
        font-size: 32px;
        color: white;
      }
      .total {
        padding-top: 1rem;
      }
      .time {
        font-size: 32px;
        color: gold;
      }
      .hint {
        color: gray;
        padding-bottom: 2rem;
      }
      .rank {
        padding-top: 2rem;
        font-size: 16px;
        color: darkgray;
      }
      .tab_container {
        width: 50%;
        margin: auto;
        padding-top: 0rem;
        padding-bottom: 2rem;
        color: black;

        .tab {
          width: 100%;
          display: flex;
          .choose {
            cursor: pointer;
            display: flex;
            text-align: center;
            justify-content: center;
            align-items: center;
            align-content: center;
            width: 50%;
            height: 50px;
            font-size: 24px;
            color: gold;
            background-color: #3590FF;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          .normal {
            cursor: pointer;
            color: black ;
            display: flex;
            text-align: center;
            justify-content: center;
            align-items: center;
            align-content: center;
            border-width: 1px;
            border-color: red;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            height: 50px;
            width: 50%;
            font-size: 24px;
            background-color: white;
          }
        }
      }
      .rank_container {
        padding-top: 2rem;
        padding-bottom: 5rem;
        margin: auto;
        width: 50%;

        .item {
          display: flex;
          justify-content: space-between;
          padding: 5px;
          border-bottom: 1px solid #f1f1f1;
          // height: 60px;
          // box-sizing: border-box;
          overflow: hidden;

          .left {
            flex: 1;
            display: flex;

            .number {
              //position: absolute;
              text-align: end;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              font-size: 16px;
              margin-right: 8px;
            }
            img {
              flex: 0 0 40px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
              vertical-align: middle;
            }

            .title {
              font-size: 16px;
            }

            .desc {
              width: 180px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #888;
              font-size: 13px;
            }

            .info {
              display: flex;
              flex-direction: column;
              justify-content: space-around;

            }
          }

          .right {
            flex: 0 0 60px;
            // line-height: 40px;
            text-align: center;
            font-size: 12px;

            p {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .main_content {
      .top {
        .rank_container {
          width: 90%;
        }
        .tab_container {
          width: 90%;
        }
      }
    }
  }
}
</style>
