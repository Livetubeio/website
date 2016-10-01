<template>
<div>
  <div :id="elementId"></div>
</div>
</template>

<script>
'use strict'
import EventBus from 'eventbusjs'

const container = {
  scripts: [],
  YT: null,

  run() {
    this.scripts.forEach((callback) => {
      callback(window.YT)
    })
    this.scripts = []
  },

  register(callback) {
    if (window.YT && window.YT.Player) {
      Vue.nextTick(() => {
        callback(window.YT)
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
    onMuteAll() {
      this.shouldMute = true
      if (typeof this.player !== 'undefined' && this.player && this.player.mute) {
        this.player.mute()
      }
    },
    onUnMuteAll() {
      this.shouldMute = false
      if (typeof this.player !== 'undefined' && this.player && this.player.unMute) {
        this.player.unMute()
      }
    },
    setSize() {
      this.player.setSize(this.playerWidth || '640', this.playerHeight || '390')
    },
    update(videoId) {
      if (!this.player) {
        return
      }
      let name = 'cueVideoById'
      if (this.player.getPlayerState() === 1) {
        name = 'loadVideoById'
      }
      if (this.player[name]) {
        this.player[name](videoId)
      }
    }
  },
  mounted() {
    container.register((YouTube) => {
      var {
        playerHeight: height = '390',
        playerWidth: width = '640',
        playerVars = {
          autoplay: 0,
          start: 0
        },
        videoId
      } = this

      EventBus.addEventListener('muteall', this.onMuteAll)
      EventBus.addEventListener('unmuteall', this.onUnMuteAll)

      this.player = new YouTube.Player(this.elementId, {
        height,
        width,
        playerVars,
        videoId,
        events: {
          onReady: (event) => {
            const {
              playerVars = {autoplay: 0}
            } = this
            const name = `${playerVars.autoplay ? 'load' : 'cue'}VideoById`
            this.player[name](this.videoId)
            console.log(name)
            this.$emit('ready', event.target)
            if (this.shouldMute) {
              this.player.mute()
            }
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
    EventBus.removeEventListener('muteall', this.onMuteAll)
    EventBus.removeEventListener('unmuteall', this.onUnMuteAll)
    delete this.player
  }
}
</script>
