<template>
  <div>
    <div v-if="testSet.has('123')">
      测试成功动态绑定
    </div>

    <div v-if="testSetHas">
      测试成功Computed
    </div>
  </div>


</template>

<script>
export default {
  name: "tuxun-playground",
  computed: {
    testSetHas() {
      console.log('1231231');
      return this.testSet.has('123')
    }
  },
  data() {
    return {
      testSet: new Set()
    }
  },
  created() {
    setTimeout(() => {
      this.testSet.add('123');
      console.log(this.testSet)
    }, 3000)
  },
  methods: {
    init() {

    },
  }
}
</script>

<style lang="scss" scoped>

</style>
