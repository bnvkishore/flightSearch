<template>
  <v-app-bar id="header-section" color="#FFFFFF" fixed app>
    <img src="~assets/images/logo.png" class="logo" height="100%" />
  </v-app-bar>
</template>
<script>
export default {
  name: 'HeaderComponent',
}
</script>
<style lang="less">
#header-section {
  .logo {
    @media only screen and (max-width: 600px) {
      display: block;
      margin: auto;
      width: 75%;
    }
  }
}
</style>
