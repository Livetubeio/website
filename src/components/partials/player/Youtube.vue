<template>
<div><div :id="elementId"></div></div>
</template>

<script>
'use strict'

const container = {
  scripts: [],
  YT: null,

  run() {
    this.scripts.forEach((callback) => {
      callback(this.YT)
    })
    this.scripts = []
  },

  register(callback) {
    if (this.YT) {
      Vue.nextTick(() => {
        callback(this.YT)
      })
    } else {
      this.scripts.push(callback)
    }
  }
}

const events = {
  0: 'ended',
  1: 'playing',
  2: 'paused',
  3: 'buffering',
  5: 'queued'
}

let pid = 0

const tag = document.createElement('script')
tag.src = 'https://www.youtube.com/player_api'
const firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

window.onYouTubeIframeAPIReady = function() {
  container.YT = window.YT
  Vue.nextTick(() => {
    container.run()
  })
}

import Vue from 'vue'

export default {
  props: ['playerHeight', 'playerWidth', 'playerVars', 'videoId'],
  watch: {
    playerWidth: 'setSize',
    playerHeight: 'setSize',
    videoId: 'update'
  },
  data() {
    pid += 1
    return {
      elementId: `youtube-player-${pid}`
    }
  },
  methods: {
    setSize() {
      this.player.setSize(this.playerWidth || '640', this.playerHeight || '390')
    },
    update(videoId) {
      const name = 'loadVideoById'
      this.player[name](videoId)
    }
  },
  mounted() {
    container.register((YouTube) => {
      const {
        playerHeight: height = '390',
        playerWidth: width = '640',
        playerVars = {autoplay: 0, start: 0},
        videoId
      } = this

      this.player = new YouTube.Player(this.elementId, {
        height,
        width,
        playerVars,
        videoId,
        events: {
          onReady: (event) => {
            this.$emit('ready', event.target)
          },
          onStateChange: (event) => {
            if (event.data !== -1) {
              this.$emit(events[event.data], event.target)
            }
          },
          onError: (event) => {
            this.$emit('error', event.target)
          }
        }
      })
    })
  },
  beforeDestroy() {
    if (typeof this.player !== 'undefined' && this.player !== null) {
      this.player.destroy()
    }
    delete this.player
  }
}
</script>
