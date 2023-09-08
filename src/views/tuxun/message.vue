<template>
  <div class="container">
    <div class="back_home">
<!--      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>-->
      <el-button @click="goHome"  round>首页</el-button>
      <el-button @click="init"  round>刷新</el-button>
    </div>

    <div class="nav">
      消息通知
    </div>
    <div class="message_container">
      <div v-for="(item, index) in list">
        <div v-if="item.type === 'add_friend'" class="add_friend">
          <div>
            <span @click="toUser(item.sender)" class="user-name">
             {{item.sender.userName}}
            </span>
            请求加你为好友
          </div>
          <div v-if="!item.solve" style="margin-top: 5px">
            <el-button @click="approveApply(item.id)">同意</el-button>
            <el-button @click="rejectApply(item.id)">拒绝</el-button>
          </div>
          <div v-else style="margin-top: 5px">
            <div v-if="item.solveAction === 'approve'" class="approve">
              已同意
            </div>
            <div v-else-if="item.solveAction === 'reject'" class="reject">
              已拒绝
            </div>
          </div>
        </div>
        <div v-if="item.type === 'invite_party'" class="invite_party">
          <div>
            <span @click="toUser(item.sender)" class="user-name">
             {{item.sender.userName}}
            </span>
            邀请你参加
            <span @click="toParty(item.data)" class="party">派对</span>
          </div>
        </div>

        <div v-if="item.type === 'invite_team'" class="invite_party">
          <div>
            <span @click="toUser(item.sender)" class="user-name">
             {{item.sender.userName}}
            </span>
            邀请你加入队伍
            <span @click="toTeam(item.data)" class="party">队伍</span>
            一起组队匹配
          </div>
        </div>

        <div v-if="item.type === 'ban'" class="invite_party">
          <div>
            你因为 {{item.data}}
            <span v-if="item.banTimeUnit === 'day'">
              被封禁 {{item.banTime}} 天，解封时间为 {{moment(item.banUntil).format('YYYY-MM-DD HH:mm')}},
            </span>

            <span v-if="item.banTimeUnit === 'forever'">
              被永久封禁,
            </span>
            <span> 你仍然可以使用除淘汰赛，积分赛，匹配赛的练习赛等功能 </span>
          </div>
        </div>

        <div v-if="item.type === 'friend_message'" class="friend_message">
          <div>
            <span @click="toUser(item.sender)" class="user-name">
             {{item.sender.userName}}
            </span>
            给你发消息：{{item.data}}
          </div>
        </div>

        <div v-if="item.type === 'new'" class="new">
          <div>
            欢迎您来到图寻，需要了解更多信息可以查看
            <span @click="toDoc(item)" class="doc-link">
              图寻新手教程
            </span>
          </div>
        </div>

      </div>
    </div>
    <div v-if="list.length === 0" class="no_message"> 暂无消息 </div>
  </div>
</template>

<script>
import * as api from '../../api/api';
import {tuxunJump, tuxunOpen} from "./common";
import moment from 'moment';

export default {
  name: "message",
  data() {
    return {
      history: null,
      moment: moment,
      list: []
    }
  },
  created() {
    this.history = history;
    this.init();
  },
  methods: {
    init() {
      api.getByPath('/api/v0/tuxun/message/list').then(res => {
        if (res.success) {
          this.list = res.data;
          this.readAll();
        }
      });
    },
    readAll() {
      api.getByPath('/api/v0/tuxun/message/readAll').then(res => {
      });
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
    goHome() {
      tuxunJump('/tuxun/')
    },

    toTeam(code) {
      tuxunJump('/tuxun/team-join?teamId=' + code);
    },

    toParty(code) {
      tuxunJump('/tuxun/join?code=' + code);
    },
    toDoc(item) {
      tuxunOpen(item.data);
    },

    rejectApply(messageId) {
      api.getByPath('/api/v0/tuxun/message/rejectFriend', {messageId: messageId}).then(res => {
        if (res.success) {
          this.init();
        }
      });
    },
    toUser(user) {
      tuxunJump( '/tuxun/user/' + user.userId);
    },
    approveApply(messageId) {
      api.getByPath('/api/v0/tuxun/message/approveFriend', {messageId: messageId}).then(res => {
        if (res.success) {
          this.init();
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-color:  $tuxunBackgroundColor;

  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
    margin: auto;
    text-align: center;
    width: 100%;
  }
  .back_home {
    position: fixed;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 500;
  }
  .message_container {
    padding-top: 3rem;
    width: 40%;
    margin: auto;
  }

  .user-name {
    font-weight: bold;
    cursor: pointer;
  }

  .add_friend {
    color: white;
    padding-bottom: 1rem;
    text-align: left;

    .approve {
      color: green;
    }
    .reject {
      color: indianred;
    }
  }
  .invite_party {
    color: white;
    padding-bottom: 1rem;
    text-align: left;
    .party {
      font-weight: bold;
      cursor: pointer;
    }
  }

  .friend_message {
    color: white;
    padding-bottom: 1rem;
    text-align: left;
  }
  .new {
    color: white;
    padding-bottom: 1rem;
    text-align: left;
    .doc-link {
      font-weight: bold;
      cursor: pointer;
    }
  }

  .no_message {
    text-align: center;
    color: white;
    margin-top: 3rem;
    font-size: 32px;
  }
}
@media only screen and (max-width: 768px) {
.container {
  .message_container {
    width: 80%;
  }
}
}
</style>
