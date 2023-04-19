<template>
  <div :class="{normal: 'user',small: 'user-small'}[size]" role="user">
    <el-dropdown trigger="click" @command="handleCommand" placement="top">
      <el-avatar :src="imgOrigin + user.icon" class="avatar"></el-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="isOwner" icon="el-icon-refresh" :command="`transfer:${user.userId}`">转移房主</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="userName">{{user.userName}} <span v-if="isOwner">(房主)</span></div>
  </div>
</template>

<script>
/**
 * User:
 * {"userId":122422,"userName":"潘祖红(pang)","icon":"f58b7f52d7c801ba0806e2125a776a44.png","ups":0,"followers":0,"focused":false,"gmtCreate":null,"gmtModified":null,"focus":0,"desc":null,"userTag":null}
 */
 
import * as api from '../../api/api';
export default {
  name: 'tuxun-user',
  props: {
    user: {
      type: Object,
      default(){
        return {};
      }
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal' // small, normal(default), large
    }
  },
  methods: {
    handleCommand(command) {
      if (command.indexOf('transfer:') > -1) {
        api.getByPath('/api/v0/tuxun/party/changeHost', {userId: command.split(':')[1]}).then(res=>{
          this.pagedata = res.data;
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