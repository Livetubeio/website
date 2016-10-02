<template>
<div @click="activateVideo" class="row video-entry" :class="{'video-entry--active': active}">
  <div class="col s1" style="width: 40px;height:22px;">
    <span class="index-indicator">{{ parseInt(index) + 1 }}</span>
    <i class="material-icons play-icon dp48">play_arrow</i>
  </div>
  <div class="col s10">
    {{ video.title }}
  </div>
  <div class="col s1" v-if="canEdit">
    <i class="more-icon material-icons right" ref="moreicon">more_vert</i>
    <div class="more-menu z-depth-1" v-if="showMore">
      <ul>
        <li @click="deleteVideo">Delete</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
/* global $ */
import Api from '../../../helpers/Api'
export default {
  props: ['video', 'activeVideo', 'index', 'channel', 'canEdit'],
  data() {
    return {
      showMore: false
    }
  },
  created() {
    $('body').on('click', this.handleClick)
  },
  destroyed() {
    $('body').off('click', this.handleClick)
  },
  methods: {
    handleClick(e) {
      if (this.$refs.moreicon === e.target) {
        this.showMore = !this.showMore
        e.preventDefault()
        return false
      } else {
        this.showMore = false
      }
    },
    deleteVideo() {
      console.log('delete')
    },
    activateVideo(e) {
      if (this.$refs.moreicon !== e.target) {
        Api.setActiveVideo(this.channel, this.video.ytid)
      }
    }
  },
  computed: {
    active() {
      return this.video.ytid === this.activeVideo
    }
  }
}
</script>
