<template>
  <div >
    <div class="bottom">
      <el-input v-model="tableName" placeholder="请输入标题"></el-input>
      <el-input v-model="tableDesc" placeholder="请输入表格描述"></el-input>
      <el-input   type="textarea" :rows="10" v-model="tableData"  placeholder="请输入表格内容"></el-input>
      <div @click="add" class="btns">存储表格</div>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/api';
  import {banlist, forumAddBan, postByPath} from '../../../api/api';

  export default {
    name: 'mod_manager',
    // components: { adminDashboard, editorDashboard },
    data() {
      return {
        displayAdd: false,
        keyword: '',
        restaurants: [],
        state: '',
        params: {},
        forumId: '',
        userIdToBan: null,
        lists:[],
        timeout:  null,
        tableName: '',
        tableData: '',
        tableDesc: '',
        tableId: null,
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
      this.getTable();
    },

    mounted() {
    },

    methods: {
      add() {
        if (this.tableName == null || this.tableName === '') {
          this.$toast('标题不能为空');
        } else  if (this.tableData == null || this.tableData === '') {
          this.$toast('表格内容不能为空');
        } else {
          api.postByPath('/api/v0/forum/table/set', {'forumId': this.forumId, 'id': this.tableId, 'name': this.tableName, 'data': this.tableData, 'desc': this.tableDesc}
          ).then((res) => {
            if (res.success) {
              this.$toast('成功');
              this.getBanList();
            } else {
              this.$toast(res.errorMessage);
            }
          });
        }
      },

      getTable() {
        api.getByPath('/api/v0/forum/table/list', { forumId: this.forumId }).then((res) => {
          // this.$toast(stringires));
          if (res.data == null || res.data.length == 0) {
            return;
          }

          this.tableName = res.data[0]['name'];
          this.tableId = res.data[0]['id'];
          api.getByPath('/api/v0/forum/table/get', { tableId: res.data[0]['id'] }).then((res1) => {
            this.tableData = res1.data.data;
            this.tableDesc = res1.data.desc;
          });
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