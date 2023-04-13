<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length > 1" size="small" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'my',
  data() {
    return {
      history: null,
    };
  },

  mounted() {
    this.history = history;
  },

  methods: {
    goHome() {
      window.location.href = '/scratch';
    },
  }

};
</script>

<style scoped>

</style>
