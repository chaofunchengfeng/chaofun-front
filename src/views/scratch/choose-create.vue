<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goBack" size="small" round>←返回</el-button>
<!--      <el-button @click="goHome" size="small" round>首页</el-button>-->
    </div>
    <div class="choose-container">
      <div style="width: 100%; text-align: left; font-size: 22px;padding-top: 3em">选择创建类型</div>
      <div style="background-color: gray; height: 1px; width: 100%; margin-top: 0.5em"></div>
      <div style="display: flex; margin-top: 1rem">
        <div @click="createText" class="text-create" style="padding: 2px 10px 2px 10px; cursor: pointer; border-radius: 4px; background-color: #DEF5D5">
          <div style="text-align: center; font-size: 20px;">
            文本
          </div>
        </div>
        <div></div>
        <div @click="createImage" class="img-create" style="padding: 2px 10px 2px 10px; cursor: pointer; border-radius: 4px;margin-left: 1rem;  background-color: #027BFF">
          <div style="text-align: center; font-size: 20px; ">
            图片
          </div>
        </div>
        <div @click="createClick" class="click-create" style="padding: 2px 10px 2px 5px; cursor: pointer; border-radius: 4px; margin-left: 1rem; background-color: #9B41F1">
          <div style="text-align: center; font-size: 20px; ">
            点击-文本
          </div>
        </div>
<!--        <div @click="createClickImg" class="click-create" style="padding: 2px 10px 2px 5px; cursor: pointer; border-radius: 4px; margin-left: 1rem; background-color: #DC3545">-->
<!--          <div style="text-align: center; font-size: 20px; ">-->
<!--            点击-图片-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
    <div class="draft-container">
      <div style="width: 100%; text-align: left; font-size: 22px;padding-top: 3em">编辑草稿</div>
      <div style="background-color: gray; height: 1px; width: 100%; margin-top: 0.5em;"></div>
      <div v-for="(item, index) in list" :key="index" class="draft-item">
        <div class="name" @click="modifyDraft(item)">
          {{item.name}}
        </div>
        <div class="delete" @click="deleteDraft(item)">
          删除
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as api from '../../api/api';
export default {
  name: 'choose-create',
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.listDraft();
  },
  methods:{
    createText() {
      window.location.href = '/scratch/create?type=text';
    },
    createImage() {
      window.location.href = '/scratch/create?type=image';
    },
    createClick() {
      window.location.href = '/scratch/create?type=click';
    },
    createClickImg() {
      window.location.href = '/scratch/create?type=click-img';
    },
    goHome() {
      window.location.href =  '/scratch/';
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        window.location.href =  '/scratch/';
      }
    },
    listDraft() {
      api.getByPath('/api/v0/scratch/draft/list', ).then(res => {
        if (res.success) {
          this.list = res.data;
        }
      });
    },
    modifyDraft(item) {
      window.location.href = '/scratch/modify?id=' + item.id;
    },
    deleteDraft(item) {
      this.$confirm('你确定要删除草稿吗？', '', {
        confirmButtonText: '确定',
        callback: action => {
          if (action == 'confirm') {
            api.getByPath('/api/v0/scratch/draft/delete', {id: item.id}).then(res => {
              if (res.success) {
                this.$toast('删除成功');
                this.listDraft();
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  .choose-container{
    margin: auto;
    width: 40%;
  }
  .draft-container {
    margin: auto;
    width: 40%;
    .draft-item {
      display: flex;
      margin-top: 8px;
      justify-content: space-between;
      .name {
        font-size: 16px;
        color: blue;
        cursor: pointer;
      }
    }
  }
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .text-create, .img-create .click-create {
    cursor: pointer;
    &:hover {
      transform: scale(1.03);
    }
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .choose-container {
      width: 80%;
    }
    .draft-container {
      width: 90%;
    }
  }
}

</style>
