<template>
  <div id="app">
    <edt></edt>
  </div>
</template>

<script>
import '../src/assets/css/base.css'
import edt from '../src/components/editor'

export default {
  name: 'App',
  components: {
    edt
  },
  mounted () {
    // this.$router.push('/editor')
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
}
</style>
