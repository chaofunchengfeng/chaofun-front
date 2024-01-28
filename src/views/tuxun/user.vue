<template>
  <div :class="{normal: 'user',small: 'user-small'}[size]" role="user">
    <el-dropdown trigger="click" @command="handleCommand" placement="top">
      <el-avatar :src="imgOrigin + user.icon" class="avatar"></el-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="enableShowUserTooltip" :disabled="isHost" icon="el-icon-refresh" command="transfer">转移房主</el-dropdown-item>
        <el-dropdown-item v-if="enableShowUserTooltip" :disabled="isHost" icon="el-icon-refresh" command="onlooker">强制围观</el-dropdown-item>
        <el-dropdown-item v-if="enableShowUserTooltip" :disabled="isHost" icon="el-icon-refresh" command="kickoff">踢出派对</el-dropdown-item>
        <el-dropdown-item icon="el-icon-user" command="toUser">查看首页</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="userName">{{user.userName}} <span v-if="isHost">(房主)</span> <span v-if="isCaptain">(队长)</span></div>
  </div>
</template>

<script>
/**
 * User:
 * {"userId":122422,"userName":"潘祖红(pang)","icon":"f58b7f52d7c801ba0806e2125a776a44.png","ups":0,"followers":0,"focused":false,"gmtCreate":null,"gmtModified":null,"focus":0,"desc":null,"userTag":null}
 */

import * as api from '../../api/api';
import {tuxunJump} from "./common";

export default {
  name: 'tuxun-user',
  props: {
    user: {
      type: Object,
      default(){
        return {};
      }
    },
    partyData: {
      type: Object,
      default(){
        return null;
      }
    },
    teamData: {
      type: Object,
      default(){
        return null;
      }
    },
    size: {
      type: String,
      default: 'normal' // small, normal(default), large
    }
  },
  computed: {
    enableShowUserTooltip: {
      get() {
        if (this.partyData) {
          return this.$store.state.user.userInfo.userId === this.partyData.host.userId;
        } else {
          return false;
        }
      }
    },
    isHost: {
      get() {
        if (this.partyData) {
          return this.user.userId === this.partyData.host.userId;
        } else {
          return false;
        }
      }
    },

    isCaptain: {
      get() {
        if (this.teamData) {
          return this.user.userId === this.teamData.captain.userId;
        } else {
          return false;
        }
      }
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'transfer') {
        api.getByPath('/api/v0/tuxun/party/changeHost', {userId: this.user.userId}).then(res=>{
          this.pagedata = res.data;
        });
      } else if (command === 'toUser') {
        tuxunJump('https://tuxun.fun/user/' + this.user.userId);
      } else if (command === 'onlooker') {
        api.getByPath('/api/v0/tuxun/party/hostChangeOnlooker', {userId: this.user.userId}).then(res=>{
          this.pagedata = res.data;
        });
      } else if (command === 'kickoff') {
        this.$confirm('你确定要踢出TA吗，踢出后TA无法再加入这个派对？', '', {
          confirmButtonText: '确定',
          callback: action => {
            if (action == 'confirm') {
              api.getByPath('/api/v0/tuxun/party/hostChangeLeave', {userId: this.user.userId}).then(res=>{
                this.pagedata = res.data;
              });
            }
          }
        });
      }
    }
  }
};
</script>

<style type='text/scss' lang='scss' scoped>
  .user {
    display: block;
    margin: 10px;
    .avatar {
      width: 75px;
      height: 75px;
      margin: 0 auto;
      justify-content: center;
      display: flex;
      cursor: pointer;
    }

    .userName {
      margin-top: 1rem;
      font-size: 12px;
    }
  }
  .user-small {
    display: block;
    margin: 10px;
    .avatar {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      justify-content: center;
      display: flex;
      cursor: pointer;
    }

    .userName {
      margin-top: 1rem;
      font-size: 10px;
    }
  }
</style>
