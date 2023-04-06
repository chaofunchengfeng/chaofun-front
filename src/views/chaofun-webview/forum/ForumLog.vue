<template>
  <div>
    <div  v-for="(item, index) in list">
      <div v-if="item.action=='delete_post'" class="zan">
        <div class="item">
          <span v-if="item.user" @click.stop="toUser(item.user)" class="username user_name">【{{item.user.userName}}】</span>
          <span>删除了</span>
          <span v-if="item.targetUser" @click.stop="toUser(item.targetUser)" class="username user_name">【{{item.targetUser.userName}}】</span>
          <span>的帖子</span>
          <span v-if="item.post.title"  @click="toDetail(item.post)" class="tiezi_title">【{{item.post.title.length>15?item.post.title.slice(0,15)+'...':item.post.title}}】</span>
        </div>
      </div>

      <div v-if="item.action=='delete_comment'" class="zan">
        <div class="item">
          <span v-if="item.user" @click.stop="toUser(item.user)" class="username user_name">【{{item.user.userName}}】</span>
          <span>删除了</span>
          <span v-if="item.targetUser" @click.stop="toUser(item.targetUser)" class="username user_name">【{{item.targetUser.userName}}】</span>
          <span>在的帖子</span>
          <span @click="toDetail(item.post)" class="tiezi_title">【{{item.post.title.length>15?item.post.title.slice(0,15)+'...':item.post.title}}】</span>
          <span>下的评论</span>
          <span v-if="item.comment.text" @click="toDetail(item.post)" class="tiezi_title">【{{item.comment.text.length>15?item.comment.text.slice(0,50)+'...':item.comment.text}}】</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as api from '@/api/api'

export default {
  name: "ForumLog",
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      list: [],
    }
  },

  created() {
    if (this.forumId0) {
      this.forumId = this.forumId0;
    } else {
      this.forumId = this.$route.query.forumId;
    }
    this.forumLogList();
  },

  methods: {
    forumLogList() {
      api.getByPath('/api/v0/forum/listLogs', { 'forumId': this.forumId, 'pageSize': 50 }).then((res) => {
        console.log('123');
        this.list = res.data;
      })
    },
    toDetail(item){
      // this.$router.push({name: 'articleDetail',params:{postId: item.post.postId}})
      let routeData = this.$router.resolve({
        name: "articleDetail",
        params: {postId: item.post.postId},
      });
      window.open(routeData.href, '_blank');
    },
  }
}
</script>

<style scoped>

</style>
