<template>
  <div class="container">
      <div v-if="!ISPHONE" class="padding"></div>
    <div class="content">
        <div class="nav">
            <img src="./rank.png" alt="">
            <span>24 小时版块排名(24小时内帖子获赞)</span>
        </div>
      <div>暂不支持</div>

    </div>
    <div v-if="!ISPHONE" class="padding"></div>

  </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api';
export default {
  name: 'Home',
  components: {

  },
  data(){
      return {
          pagedata: []
      };
  },
  created(){
  },
  mounted(){
    document.title = '24 小时版块排名';
  },
  methods:{

  },
};
</script>
<style scoped lang="scss">
.container{
    // height: ;
    padding-top: 0;
    height: 100vh;
}
.padding{
    height: 60px;
}
.content{
    max-width: 750px;
    margin: 0 auto;
    background: #fff;
    .item{
        display: flex;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid #f1f1f1;
        // height: 60px;
        // box-sizing: border-box;
        overflow: hidden;
        cursor: pointer;
        .left{
            flex: 1;
            display: flex;
            img{
                flex: 0 0 40px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
                vertical-align: middle;
            }
            .title{
                font-size: 16px;
            }
            .desc{
                width: 180px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #888;
                font-size: 13px;
            }
            .info{
                display: flex;
                flex-direction: column;
                justify-content: space-around;

            }
        }
        .right{
            // flex: 0 0 180px;
            // line-height: 40px;
            // text-align: center;
            font-size: 12px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            p{
                font-size: 14px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                text-align: right;
            }
            .p2{
                font-size: 13px;
                margin-top: 4px;
                text-align: right;
            }
        }
        &:hover{
            .left .desc{
                color: #FF9300;
            }
            color: #FF9300;
        }
    }
}
.nav{
    padding: 20px;
    img{
        width: 24px;
        height: 24px;
        vertical-align: middle;
        margin-right: 10px;
    }
    font-size: 18px;
}
</style>
