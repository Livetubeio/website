<template>
<div class="row video-entry" :class="{'video-entry--active': active}">
  <div class="col s1" style="width: 40px;height:22px;">
    <span class="index-indicator">{{ parseInt(index) + 1 }}</span>
    <i class="material-icons play-icon dp48">play_arrow</i>
  </div>
  <div class="col s10">
    {{ video.title }}
  </div>
  <div class="col s1"><i class="more-icon material-icons right">more_vert</i></div>
</div>
</template>

<script>
export default {
  props: ['video', 'activeVideo', 'index'],
  computed: {
    active() {
      return this.video.ytid === this.activeVideo
    }
  }
}
</script>
