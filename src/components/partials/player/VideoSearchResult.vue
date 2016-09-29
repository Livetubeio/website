<template>
<div class="card video-result-card" @click="addvideo" @mouseenter="setPreview(true)" @mouseleave="setPreview(false)">
  <div class="card-image">
    <img :src="result.snippet.thumbnails.medium.url">
    <video-preview v-if="preview" :ytid="result.id.videoId"></video-preview>
    <div class="video-overlay"></div>
  </div>
  <div class="card-content">
    <span class="card-title">{{ result.snippet.title }}</span>
  </div>
</div>
</template>

<script>
/* global $ */
import VideoPreview from './VideoPreview.vue'
import EventBus from 'eventbusjs'

export default {
  props: ['result'],
  data() {
    return {
      preview: false
    }
  },
  methods: {
    setPreview(preview) {
      if (this.preview) {
        EventBus.dispatch('unmuteall')
      } else {
        EventBus.dispatch('muteall')
      }
      this.preview = preview
    },
    addvideo() {
      // TODO: add the video
      this.preview = false
      $('#video-search').closeModal()
    }
  },
  components: {
    VideoPreview
  }
}
</script>
