<template>
  <div >
    <div v-if="this.displayAdd" class="ycovers ">
      <div class="ycontainer">
        <div style="">
          <div style="margin:10px 0px; align-items: center">
            <div style="align-content: center">匹配模式：</div>
            <div>
              <el-radio-group v-model="containType">
                <div style="padding-top: 10px">
                  <el-radio label="equal">完全匹配</el-radio>
                </div>
                <div style="padding-top: 10px">
                  <el-radio label="contain_and">多关键词同时匹配</el-radio>
                </div>
                <div style="padding-top: 10px">
                  <el-radio label="contain_or">多关键词只要有一个匹配</el-radio>
                </div>
              </el-radio-group>
            </div>

          </div>
          <div style="margin:10px 0px;display: flex; align-items: center">
            <div style="align-content: center">匹配词：</div>
          </div>
          <div style="margin:10px 0px;display: flex; align-items: center">
            <input style="width: 100%" v-model="checkWord"  placeholder="多关键词使用逗号分割"/>
          </div>

          <textarea class="text" v-model="responseText" style="background: #f9f9f9;width: 260px;" placeholder="请输入自动回复内容"/>

          <div style="margin:20px 0px;display: flex;">
            <el-button @click="toAdd" type="success">确认</el-button>
            <el-button @click="cancelAdd" type="success">取消</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div @click="add" class="btns">添加自动回复规则</div>
    </div>
    <div v-for="(item,index) in lists" :key="index" class="item">
      <div style="max-width: 75%;">
      <div > 关键词：{{item.checkWord}} </div>
      <div v-if="item.containType === 'equal'"> 匹配模式：完全匹配</div>
        <div v-if="item.containType === 'contain_and'">匹配模式：多关键词同时匹配</div>
        <div v-if="item.containType === 'contain_or'">匹配模式：多关键词只要有一个匹配</div>
      <div> 自动回复: {{item.responseText}} </div>
      </div>
      <div style="display: flex; justify-content: space-between;width: 20%">
        <div @click="toDelete(item, index)">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import {forumRemoveRule} from '../../../api/api';

export default {
  name: 'tag',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      displayAdd: false,
      params: {},
      forumId: '',
      lists:[],
      checkWord: '',
      responseText: '',
      containType: 'equal',
      orderNumber: 0,
      modInfo: {
        money: 0.0,
        past24HPosts: 0,
        past24HVotes: 0,
        rank: 0
      }
    };
  },
  props: {
    forumId0: {
      type: String,
      default() {
        return null;
      }
    }
  },
  created() {
    if (this.forumId0) {
      this.forumId = this.forumId0;
    } else {
      this.forumId = this.$route.query.forumId;
    }
    this.getForumRules();
  },

  methods: {
    toAdd() {
      if (this.checkWord !== '') {
        api.postByPath('/api/v0/forum/addResponseWord', {forumId: this.forumId, containType: this.containType, checkWord: this.checkWord, responseText: this.responseText}).then((res) => {
          if (res.success) {
            this.$toast('添加成功');
            this.displayAdd = false;
            this.getForumRules();
          } else {
            this.$toast(res.errorMessage);
          }
        });
      }
    },
    cancelAdd() {
      this.displayAdd = false;
    },
    add() {
      this.displayAdd = true;
    },
    toModify() {
      this.$toast('暂不支持');
    },
    toDelete(item, index) {
      this.$confirm('是否确定删除该规范吗？', '提示', {
        type: 'warning',
        // position: center,
      }).then(() => {
        api.getByPath('/api/v0/forum/removeResponseWord', {forumId: this.forumId, id: item.id}).then((res) => {
          this.getForumRules();
        });
      });
    },
    getForumRules() {
      api.getByPath('/api/v0/forum/listResponseWords', { forumId: this.forumId }).then((res) => {
        this.lists = res.data;
        // this.load()
      });
    }
  }
};

</script>

<style lang="scss" scoped>
.ycovers {
  position: fixed;
  z-index: 20;
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
    min-height: 200px;
  }
}
.item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f1f1f1;
  overflow: hidden;
}
.bottom{
  left: 0;
  right: 0;
  padding: 4px 10px 10px;
  .btns{
    width: 80%;
    margin: 0 auto;
    line-height: 44px;
    background: #FF9300;
    color: #fff;
    border-radius: 30px;
    text-align: center;
    font-size: 16px;
  }
}
input{
  height: 44px;
  outline: none;
  border: 1px solid #ededed;
  background: #f9f9f9;
  font-size: 15px;
  padding-left: 10px;
  border-radius: 8px;
}
</style>
<style lang="scss">
.el-message-box{
  width: 90vw;
  max-width: 400px;
}
</style>