<template>
  <div id="info-tile-section" class="py-10">
    <div class="text-h4 my-5">{{ title }}</div>
    <div class="text-body1">{{ description }}</div>
  </div>
</template>
<script>
export default {
  name: 'InfoTileComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
}
</script>
<style lang="less">
#info-tile-section {
  text-align: center;
}
</style>
