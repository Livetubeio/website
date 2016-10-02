<template>
<div>
  <div class="player-wrapper">
    <div class="background-drop" :style="{'background-image': 'url(' + backgroundImage + ')'}"></div>
    <div class="container">
      <div class="row">
        <div class="col-s12">
          <div class="card" v-if="channeldata">
            <youtube :player-vars="{controls: 0, autoplay: 0}" @ready="playerReady" class="main-player" :video-id="channeldata.active"></youtube>
            <a href="#" class="search-trigger btn-floating btn-large waves-effect waves-light red" @click.prevent="showVideoSearch"><i class="material-icons">add</i></a>
            <div class="card-content">
              <video-list-entry v-for="(video, index) in videos" :active-video="channeldata.active" :channel="channel" :index="index" :video="video"></video-list-entry>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="controls">
      <div class="progress" :style="{width: progress + '%'}"></div>
      <i class="material-icons dp48 player-control" @click="prevVideo">skip_previous</i>
      <i class="material-icons dp48 play-toggle" @click="toggleVideo">{{ playToggleIcon }}</i>
      <i class="material-icons dp48 player-control" @click="nextVideo">skip_next</i>
      <div class="volume-wrapper">
        <i class="material-icons" @click="toggleVolume">{{ volumeIcon }}</i>
        <div class="volume-container">
          <div id="volume"></div>
        </div>
      </div>
    </div>

    <video-search :channel="channel"></video-search>
  </div>
</div>
</template>

<script>
/* global $ */
/* eslint no-unused-vars: 0 */
import VideoListEntry from './partials/player/VideoListEntry'
import Youtube from './partials/player/Youtube'
import VideoSearch from './partials/player/VideoSearch'
import noUiSlider from 'nouislider'
import Vue from 'vue'
import EventBus from 'eventbusjs'
import Api from '../helpers/Api'

import db from '../helpers/Firebase'

export default {
  created() {
    this.channel = this.getChannelName()
    EventBus.dispatch('setTitle', window.atob(this.channel))
    this.setupFirebase()

    if (window.localStorage.getItem('volume') !== null) {
      this.volume = window.localStorage.getItem('volume', 100)
    }

    this.startTimeline()

    EventBus.addEventListener('addvideo', (data) => {
      // this.$firebaseRefs.videos.push(data.target)
      Api.addVideo(this.channel, data.target.ytid)
    })

    this.$watch('channeldata', () => {
      this.setPlayerState()
    })

    Vue.nextTick(() => {
      var slider = document.getElementById('volume')
      noUiSlider.create(slider, {
        start: this.volume,
        step: 1,
        range: {
          'min': 0,
          'max': 100
        }
      })
      slider.noUiSlider.on('update', (values) => {
        this.volume = parseInt(values[0])
        this.setVolume()
      })
    })
  },
  destroyed() {
    this.stopTimeline()
    EventBus.dispatch('setTitle', null)
  },
  data() {
    return {
      channel: null,
      player: null,
      volume: 100,
      timelineInterval: null,
      progress: 0,
      channeldata: {},
      videos: []
    }
  },
  methods: {
    setupFirebase() {
      this.$bindAsObject('channeldata', db.ref('channels/' + this.channel))
      this.$bindAsArray('videos', db.ref('channels/' + this.channel + '/videos'))
    },
    getChannelName() {
      if (this.$route.params.owner) {
        return window.btoa(this.$route.params.owner + '/' + this.$route.params.channel)
      } else {
        return window.btoa(this.$route.params.channel)
      }
    },
    toggleVideo() {
      if (this.channeldata.playerstate === 1) {
        // Pause the video
        this.player.pauseVideo()
        Api.setPlayerState(this.channel, 2)
      } else {
        // Play the video
        Api.setPlayerState(this.channel, 1)
      }
    },
    setPlayerState() {
      if (this.channeldata.playerstate === 1) {
        if (this.player) {
          this.player.playVideo()
        }
      } else {
        if (this.player) {
          this.player.pauseVideo()
        }
      }
    },
    playerReady(player) {
      this.player = player
      this.setPlayerState()
      this.setVolume()
      this.player.addEventListener('onStateChange', (event) => {
        if (event.data === 0) {
          this.nextVideo()
        }
        if (event.data === 1) {
          this.channeldata.playerstate = 1
        }
        if (event.data === 2) {
          this.channeldata.playerstate = 2
        }
      })
    },
    showVideoSearch() {
      $('#video-search').openModal()
      $('#video-search .video-search-bar').focus()
    },
    setVolume() {
      window.localStorage.setItem('volume', this.volume)
      if (this.player) {
        this.player.setVolume(this.volume)
      }
    },
    startTimeline() {
      this.timelineInterval = window.setInterval(() => {
        if (this.player) {
          this.progress = (this.player.getCurrentTime() / this.player.getDuration()) * 100
        }
      }, 100)
    },
    stopTimeline() {
      if (this.timelineInterval) {
        window.clearInterval(this.timelineInterval)
      }
    },
    nextVideo() {
      if (!this.videos) {
        return
      }
      // Search the current video
      let current = this.videos.find((video) => {
        return video.ytid === this.channeldata.active
      })
      if (!current) {
        // Couldn't find the active video, go to the first one.
        this.channeldata.active = this.videos[0].ytid
        return
      }

      let nextPosition = this.videos.indexOf(current) + 1
      if (nextPosition === this.videos.length) {
        // This was the last video, go to the first one.
        this.channeldata.active = this.videos[0].ytid
        return
      }

      // Go to the next video
      this.channeldata.active = this.videos[nextPosition].ytid
    },
    prevVideo() {
      if (!this.videos) {
        return
      }
      // Search the current video
      let current = this.videos.find((video) => {
        return video.ytid === this.channeldata.active
      })
      if (!current) {
        // Couldn't find the active video, go to the first one.
        this.channeldata.active = this.videos[0].ytid
        return
      }

      let nextPosition = this.videos.indexOf(current) - 1
      if (nextPosition === -1) {
        // This was the first video, go to the last one.
        this.channeldata.active = this.videos[this.videos.length - 1].ytid
        return
      }

      // Go to the next video
      this.channeldata.active = this.videos[nextPosition].ytid
    },
    toggleVolume() {
      if (this.volume === 0) {
        this.volume = 100
      } else {
        this.volume = 0
      }
      document.getElementById('volume').noUiSlider.set(this.volume)
    }
  },
  computed: {
    backgroundImage() {
      if (!this.channeldata.active) {
        return ''
      }
      return 'https://img.youtube.com/vi/' + this.channeldata.active + '/0.jpg'
    },
    volumeIcon() {
      if (this.volume === 0) {
        return 'volume_off'
      }
      return 'volume_up'
    },
    playToggleIcon() {
      if (this.channeldata.playerstate === 1) {
        return 'pause_circle_filled'
      } else {
        return 'play_circle_filled'
      }
    }
  },
  components: {
    VideoListEntry,
    Youtube,
    VideoSearch
  }
}
</script>
