<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goHome" round>首页</el-button>
      <el-button @click="openSearch" round>搜索添加</el-button>
    </div>
    <div style=" margin: auto; margin-top: 4rem; width: 640px;max-width: 100%;padding: 10px;">
      <div v-for="(item,index) in friends" :key="index" class="list" @click="toUser(item)">
        <img :src="imgOrigin+item.icon + '?x-oss-process=image/resize,h_80/quality,q_75'" alt=""
             style="width: 40px; height: 40px; border-radius: 100%;margin: 0 5px;">
        <span style="flex: 1;">{{ item.userName }}</span>
        <span style="width: 120px;text-align: right;">积分：{{ item.rating }}</span>
      </div>
      <div class="footer">
      </div>
    </div>

    <div v-if="searchOpen" class="search">
        <section class="section" style="display: block;overflow:scroll; overscroll-behavior: contain; height: 100%;  scrollbar-width: none;">
          <div style="font-size: 20px; color: white; padding-top: 2rem">用户搜索<el-button type="primary" style="margin-left: 10px" @click="closeSearch" round>关闭</el-button></div>
          <el-input v-model="keyword"
                    :autofocus="true"
                    @input="search"
                    placeholder="搜索用户, 支持uid搜索"
                    style="margin-top: 2rem; max-width: 100%; margin-bottom: 20px"></el-input>
          <div v-for="(item, index) in this.users" class="user" >
            <div @click.stop="openUser(item)" style="display: flex;  justify-content: space-between;">
              <div style="height: 100%;display: flex; color: white">
                <div style="padding-bottom: 5px">
                  {{item.userName}} (uid: {{item.userId}})
                </div>
              </div>
            </div>
            <div style="margin-top: 1px; width: 100%;height: 1px; background-color: white;margin-bottom: 8px"></div>
          </div>
        </section>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import {tuxunJump, tuxunOpen} from './common';


export default {
  name: 'tuxunRank',
  components: {},
  data() {
    return {
      friends: [],
      searchOpen: false,
      users: [],
      keyword: '',
      timer: 0
    };
  },
  created() {
  },
  mounted() {
    this.getFriends();
  },
  methods: {
    getFriends() {
      api.getByPath('/api/v0/tuxun/friend/list').then(res => {
        this.friends = res.data;
      });
    },
    toUser(item) {
      tuxunJump('/tuxun/user/' + item.userId);
    },
    openUser(item) {
      tuxunOpen('/tuxun/user/' + item.userId);
    },

    goHome() {
      tuxunJump('/tuxun/');
    },
    openSearch() {
      this.searchOpen = true;
      this.search(this.keyword);
    },
    closeSearch() {
      this.searchOpen = false;
    },
    search(keyword) {
      api.getSearchUser({'keyword': keyword, 'pageNum': 1}).then((res) => {
        this.users = res.data.data;

      });
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-input__inner {
  background-color: rgba(255, 255, 255, 0.247);
  color: white;
}
.search {
  position: fixed;
  z-index: 2012;
  height: 100%;
  width: 100%;
  //color: ;
  top: 0;
  background-color: #090723;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;


  .back_home {
    position: fixed;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 500;
  }

  .section{
    width: 60%;
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .section::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
  }

  .user {
    cursor: pointer;
    &:hover {
      background-color: grey;
    }
  }

}
.container {
  width: 100%;
  min-height: 100%;
  background-color: #090723;
  .back_home {
    position: fixed;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 500;
  }
}
div {
  color: white;
}
.list {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 2px 0;
  padding: 2px 4px;
  border-bottom: 1px solid #f9f9f9;

  &:hover {
    background-color: grey;
  }
}

.podium {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 30%;
}
.footer {
  height: 10rem;
}

@media only screen and (max-width: 768px) {
  .container {
    .top-left {
      padding-left: 1rem;
      padding-top: 1rem;
    }
  }
  .cover {
    .section {
      width: 90%;
    }
  }
}
</style>
