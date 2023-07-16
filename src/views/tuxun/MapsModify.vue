<template>
  <div class="container">
    <el-dialog title="提交街景" :visible.sync="submitPanoramaShow" :append-to-body="true">
      <el-form :model="form">
        <el-form-item>
          <div>
            街景链接:一行一条，支持百度街景和Google街景
            <a target="_blank" href="https://www.yuque.com/chaofun/tuxun/added">点击跳转教程</a>
          </div>
          <div>
            也支持 map-making.app 的 json 字符串, 请直接粘贴
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
      <el-button v-if="history && history.length !== 1" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" round>首页</el-button>
      <el-button type="primary" @click="publish" round>发布</el-button>
      <el-button @click="exportJson" round>导出</el-button>
      <el-button v-if="!ISPHONE" @click="toFilter" round>筛选</el-button>
    </div>

    <div v-if="name" class="nav">
      {{this.name}}
    </div>
    <div v-if="mapsData && mapsData.desc" class="describe">
      {{mapsData.desc}}
    </div>
    <el-button @click="modify">修改基础信息</el-button>
    <div style="padding-bottom: 2rem"></div>
    <el-button @click="toDistribute" >查看题库分布</el-button>
    <el-button @click="goBaidu">百度地图添加</el-button>
    <el-button @click="addPano">链接/JSON添加</el-button>
    <div style="color: white">发布题库需要题库中有5个状态为已发布或者待发布状态的街景，当系统检测到题库中有5个Google官方街景，会自动将题库标记为「可移动」</div>
    <div style="color: white">注：异步上传，请刷新查看进度，请勿使用脚本提交</div>
    <div class="list_container">
      <div style="margin-top: 1rem; font-size: 20px; color: white">
        街景列表
      </div>
      <div v-if="status" style="font-size: 12px; color: white; padding-bottom: 6px"> (总数: {{status.total ? status.total : 0 }}, 已发布: {{status.publish ? status.publish : 0 }}, 待发布: {{status.ready ? status.ready: 0 }}, 待审核: {{status.wait_check ? status.wait_check: 0 }} 准备中: {{status.crawling ? status.crawling : 0 }}, 准备失败: {{status.crawler_fail ? status.crawler_fail : 0 }})</div>
      <div style="width: 100%; justify-items: left; align-content: flex-start">
        <el-pagination
            background
            layout="prev, pager, next"
            style="padding-bottom: 20px;"
            :current-page.sync="current"
            @current-change="handleCurrentChange"
            :page-size="1000"
            :total="total">
        </el-pagination>
      </div>

      <div v-for="(item, index) in panos" :key="index" class="list_item" style="display: flex;justify-content: space-between; overflow: auto ">
        <div style="display: flex; color: white">
          <div @click="toPano(item)">{{item.panoId}}</div>
          <div v-if="item.status === 'crawling'" class="status" style="color: yellow">准备中</div>
          <div v-if="item.status === 'publish'" class="status" style="color: green">已发布</div>
          <div v-if="item.status === 'wait_check'" class="status" style="color: pink">待图寻审核</div>
          <div v-if="item.status === 'crawler_success' || item.status === 'ready'" class="status" style="color: white">待发布</div>
          <div v-if="item.status === 'crawler_fail'" class="status" style="color: red">准备失败</div>
        </div>
        <div style="color: white" @click="deletePano(item.id)">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from './common';
import * as api from '@/api/api';

export default {
  name: 'MapsCreate',
  data() {
    return {
      name: '',
      panos: [],
      mapsId: null,
      status: null,
      history: null,
      total: 1000,
      current: 1,
      pageCount: 1,
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
    this.checkVip();
    this.mapsId = this.$route.query.mapsId;
    this.getMapsName();
    this.getPanos();

    setInterval(() => {
      this.getPanos();
    }, 10000 );
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
      api.getByPath('/api/v0/tuxun/maps/listPanoV1', {mapsId: this.mapsId, page: this.current}).then(res=>{
        this.panos = res.data.list;
        this.total = res.data.total;
        this.getState();
      });
    },
    publish() {
      api.getByPathLongTimeout('/api/v0/tuxun/maps/publish', {mapsId: this.mapsId}).then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/my_maps');
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
    handleCurrentChange() {
      this.getPanos();
    },
    exportJson() {
      window.open(location.origin + '/api/v0/tuxun/maps/export?mapsId=' + this.mapsId,'_self');
    },
    toFilter() {
      tuxunJump('/tuxun/maps-filter?mapsId=' + this.mapsId);
    },
    submitPano() {
      api.postByPath('/api/v0/tuxun/maps/userAddPanorama',
          {links: this.panoramaSubmitForm.links, mapsId: this.mapsId}).then(res=>{
        if (res.success) {
          this.$toast('提交成功, 谢谢你！');
        }
        this.panoramaSubmitForm.links = '';
        this.submitPanoramaShow = false;
        this.getPanos();
      });
    },
    deletePano(id) {
      this.$confirm('此操作将删除该街景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.getByPath('/api/v0/tuxun/maps/deletePano', {containId: id}).then(res=>{
          this.getPanos();
        });
      }).catch(() => {

      });
    },
    toPano(item) {
      if (item.source === 'baidu_pano') {
        tuxunOpen('https://maps.baidu.com/#panoid=' + item.panoId + '&panotype=street&pitch=0&l=13&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=' + item.panoId);
      } else {
        if (item.panoId.indexOf('AF') === 0) {
          tuxunOpen('https://www.google.com/maps/@0.0,0.0,3a,75y,90t/data=!3m7!1e1!3m5!1s' + item.panoId +  '!2e10!3e11!7i8192!8i4096');
        } else {
          tuxunOpen('https://www.google.com/maps/@?api=1&map_action=pano&pano=' + item.panoId);
        }
      }
    },
    toGuid() {
      tuxunOpen('https://www.yuque.com/ucun5p/kfw26e/ttqiucknz7sifo5u');
    },
    modify() {
      tuxunJump('/tuxun/maps_create?mapsId=' + this.mapsId);
    },
    goBaidu() {
      tuxunJump('/tuxun/map-maker?mapsId=' + this.mapsId);
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

  }
  .status {
    padding-left: 10px;
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .list_container {
      width: 90%;
      max-width: 90%;
      margin: auto;
    }
  }
}
</style>
