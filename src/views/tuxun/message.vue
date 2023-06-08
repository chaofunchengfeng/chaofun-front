<template>
  <div class="container">
    <div class="back_home">
<!--      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>-->
      <el-button @click="goHome"  round>首页</el-button>
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
      </div>
    </div>
    <div v-if="list.length === 0" class="no_message"> 暂无消息 </div>
  </div>
</template>

<script>
import * as api from '../../api/api';
import {tuxunJump} from "./common";
export default {
  name: "message",
  data() {
    return {
      history: null,
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
  background-color: #090723;


  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .message_container {
    padding-top: 3rem;
    width: 40%;
    margin: auto;
  }

  .add_friend {
    color: white;
    padding-bottom: 1rem;
    text-align: left;
    .user-name {
      font-weight: bold;
      cursor: pointer;
      size: 32px;
    }
    .approve {
      color: green;
    }
    .reject {
      color: indianred;
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
