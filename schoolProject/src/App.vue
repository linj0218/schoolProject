<template>
  <div id="app">
    <router-view/>
    <loading></loading>
  </div>
</template>

<script>
  import loading from '@/components/loading'
  export default{
    components: {
      loading
    }
  }
</script>

<style>
</style>