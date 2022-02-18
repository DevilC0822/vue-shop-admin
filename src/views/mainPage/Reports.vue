<template>
  <div class='Reports-view'>
    <el-card class="box-card">

    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Reports',
    data() {
      return {

      }
    },
    created() {
      this.getReports()
    },
    methods: {
      async getReports() {
        const {
          data: res
        } = await this.$http({
          url: 'reports/type/1',
          method: 'get'
        })
        console.log(res)
      }

    }
  }
</script>

<style lang="scss" scoped>
  .Reports-view {
    .box-card {
      margin: 15px;
    }
  }
</style>