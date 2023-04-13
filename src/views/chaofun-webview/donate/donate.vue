<template>
  <div style="width: 100%;">
    <div style="max-width: 640px; margin: 0 auto;">
      <donateDetail :forumId="forumId" />
    </div>
  </div>
</template>

<script>
import donateDetail from '_c/donate/donateDetail';

export default {
  name: 'donate',
  data() {
    return {
      forumId: ''
    };
  },
  components: { donateDetail },
  created() {
    this.forumId = this.$route.query.forumId;
  }
};
</script>

<style scoped>

</style>