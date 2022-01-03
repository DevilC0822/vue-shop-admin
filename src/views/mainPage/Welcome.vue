<template>
  <div class='welcome-view'>
    Welcome
  </div>
</template>

<script>
export default {
  name:'Welcome',
  created() {
    this.$parent.$refs.breadcrumb.$el.style.display = 'none';
  },
  beforeDestroy(){
    this.$parent.$refs.breadcrumb.$el.style.display = 'block';

  }

}
</script>

<style lang="scss" scoped>

</style>