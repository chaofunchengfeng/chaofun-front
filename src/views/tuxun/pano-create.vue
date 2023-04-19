<template>
  <div class="container">
    <el-dialog title="生成全景" :visible.sync="submitPanoramaShow" :append-to-body="true">
      <el-form :model="form">
        <el-form-item>
          <div>
            请用文字描述你想生成的宇宙, 例：鸟语花香
          </div>
          <el-input type="textarea" :autosize="{ minRows: 4}"
                    v-model="panoramaSubmitForm.links" autocomplete="off"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideSubmitPanorama()">取 消</el-button>
        <el-button type="primary" @click="submitPano()">确 定</el-button>
      </div>
    </el-dialog>

    <div class="back_home" >
      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" round>首页</el-button>
      <el-button @click="getPanos" round>刷新</el-button>
    </div>

    <div class="nav">
      炒饭宇宙-创造
    </div>
    <div class="describe">
      通过文字创造一个全景世界
    </div>
    <el-button @click="addPano" type="primary">创造</el-button>
    <div class="list_container">
      <div style="margin-top: 1rem; font-size: 20px; color: white">
        全景列表
      </div>
<!--      <div v-if="status" style="font-size: 12px; color: white; padding-bottom: 6px"> (总数: {{status.total ? status.total : 0 }}, 已发布: {{status.publish ? status.publish : 0 }}, 待发布: {{status.ready ? status.ready: 0 }}, 待审核: {{status.wait_check ? status.wait_check: 0 }} 准备中: {{status.crawling ? status.crawling : 0 }}, 准备失败: {{status.crawler_fail ? status.crawler_fail : 0 }})</div>-->
      <div v-for="(item, index) in panos" :key="index" class="list_item" style="display: flex;justify-content: space-between ">
        <div style="display: flex; color: white">
          <div @click="toPano(item)">{{item.prompt}}</div>
          <div v-if="item.status === 'wait'" class="status" style="color: yellow">准备中</div>
          <div v-if="item.status === 'publish'" class="status" style="color: green">已发布</div>
          <div v-if="item.status === 'success'" class="status" style="color: pink">成功</div>
        </div>
        <div style="display: flex">
          <div style="color: white" @click="deletePano(item.id)">删除</div>
          <div style="color: white; padding-left: 10px" @click="publish(item.id)">发布</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from './common';
import * as api from '@/api/api';

export default {
  name: 'pano-create',
  data() {
    return {
      name: '',
      panos: [],
      mapsId: null,
      status: null,
      history: null,
      submitPanoramaShow: false,
      mapsData: null,
      form: {
        applyModReason: '',
      },
      panoramaSubmitForm: {
        links: '',
      },
    };
  },
  mounted() {

    this.history = history;
    this.getPanos();
    setInterval(() => {
      this.getPanos();
    }, 10000);
  },
  methods: {
    checkVip() {
      api.getByPath('/api/v0/tuxun/vip/check').then(res=>{
        if (res.data) {
        } else {
          this.$vip();
        }
      });
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    getMapsName() {
      api.getByPath('/api/v0/tuxun/maps/get', {mapsId: this.mapsId}).then(res=>{
        this.name = res.data.name;
        this.mapsData = res.data;
      });
    },
    getStauts() {
      api.getByPath('/api/v0/tuxun/maps/status', {mapsId: this.mapsId}).then(res=>{
        this.status = res.data;
      });
    },
    getPanos() {
      api.getByPath('/api/v0/pano/list').then(res=>{
        this.panos = res.data;
      });
    },
    publish(id) {
      api.getByPath('/api/v0/pano/publish', {id: id}).then(res=>{
        if (res.success) {
          this.$toast('发布成功，待审核');
          this.getPanos();
        }
      });
    },
    toDistribute() {
      tuxunJump('/tuxun/maps_distribute?mapsId=' + this.mapsId);
    },
    addPano() {
      this.submitPanoramaShow = true;
    },
    hideSubmitPanorama() {
      this.submitPanoramaShow = false;
    },
    submitPano() {
      this.doLoginStatus().then(res=>{
        if(res){
          api.getByPath('/api/v0/pano/gene', {prompt: this.panoramaSubmitForm.links}).then(res=>{
            if (res.success) {
              this.submitPanoramaShow = false;
              this.getPanos();
            }
          });
        }
      });

    },
    deletePano(id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.getByPath('/api/v0/pano/delete', {id: id}).then(res=>{
          if (res.success) {
            this.$toast('删除成功');
            this.getPanos();
          }
        });
      }).catch(() => {

      });

    },
    toPano(item) {
      if(item.status === 'success' || item.status === 'publish' || item.status === 'publish_check') {
        tuxunJump('/tuxun/pano-preview?id=' + item.id);
      } else {
        this.$toast('全景还未生成');
      }
    },
    toGuid() {
      tuxunOpen('https://www.yuque.com/ucun5p/kfw26e/ttqiucknz7sifo5u');
    },
    modify() {
      tuxunJump('/tuxun/maps_create?mapsId=' + this.mapsId);
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
  }
};
</script>

<style lang="scss" scoped>

.container {
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color: #090723;

  .describe {
    color: yellow;
    font-size: 1rem;
    font-weight: 700;
  }

  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .list_container {
    width: 60%;
    margin: 0 auto;
    .list_item {
      &:hover {
        background-color: grey;
      }
    }

    padding-bottom: 2rem;

  }
  .status {
    padding-left: 10px;
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .list_container {
      max-width: 90%;
      margin: auto;
    }
  }
}
</style>
