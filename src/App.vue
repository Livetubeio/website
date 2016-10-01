
<style src="assets/styles/global.scss" lang="scss"></style>
<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/partials/Navbar'
export default {
  components: {
    Navbar
  }
}
</script>
