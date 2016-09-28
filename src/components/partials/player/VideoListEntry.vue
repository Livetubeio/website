<template>
<div class="row video-entry" :class="{'video-entry--active': active}">
  <div class="col-s4">
    {{ video.title }}
  </div>
</div>
</template>

<script>
export default {
  props: ['video', 'activeVideo'],
  computed: {
    active() {
      return this.video.ytid === this.activeVideo
    }
  }
}
</script>
