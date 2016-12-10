<template>
<div class="fullheight">
  <empty-channel v-if="hasLoaded && videoCount === 0" :channel="channel" :can-edit="canEdit"></empty-channel>
  <div v-if="hasLoaded && videoCount > 0" class="player-wrapper">
    <div class="background-wrapper">
      <div class="background-drop" :style="{'background-image': 'url(' + backgroundImage + ')'}"></div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-s12">
          <div class="card" v-if="channeldata">
            <youtube v-if="activeVideoId" :player-vars="{controls: 0, autoplay: 0}" @ready="playerReady" class="main-player" :video-id="activeVideoId"></youtube>
            <div class="player-overlay" @click="toggleVolume"></div>
            <a v-if="canEdit" class="search-trigger btn-floating btn-large waves-effect waves-light red" @click.prevent="showVideoSearch"><i class="material-icons">add</i></a>

            <div class="card-content">
              <video-list-entry v-if="index != '.key'" v-for="(video, index) in videos" :video-key="index" :active-video="channeldata.active" :channel="channel" :index="videoPosition(index)" :video="video" :can-edit="canEdit"></video-list-entry>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="controls" :class="{'cant-edit': !canEdit}">
      <div class="progress" :style="{width: progress + '%'}"></div>
      <i v-if="canEdit" class="material-icons dp48 player-control" @click="prevVideo">skip_previous</i>
      <i v-if="canEdit" class="material-icons dp48 play-toggle" @click="toggleVideo">{{ playToggleIcon }}</i>
      <i v-if="canEdit" class="material-icons dp48 player-control" @click="nextVideo">skip_next</i>
      <div class="volume-wrapper">
        <i class="material-icons" @click="toggleVolume">{{ volumeIcon }}</i>
        <div class="volume-container">
          <div id="volume"></div>
        </div>
      </div>
    </div>

    <video-search v-if="canEdit" :channel="channel"></video-search>
  </div>
</div>
</template>

<script>
/* global $ */
/* eslint no-unused-vars: 0 */
import VideoListEntry from './partials/player/VideoListEntry'
import Youtube from './partials/player/Youtube'
import VideoSearch from './partials/player/VideoSearch'
import EmptyChannel from './partials/player/EmptyChannel'
import noUiSlider from 'nouislider'
import Vue from 'vue'
import EventBus from 'eventbusjs'
import Api from '../helpers/Api'
import User from '../helpers/User'

import db from '../helpers/Firebase'

export default {
  data() {
    return {
      channel: null,
      player: null,
      volume: 100,
      timelineInterval: null,
      progress: 0,
      channeldata: {},
      videos: [],
      canEdit: false,
      hasLoaded: false
    }
  },
  created() {
    this.channel = this.getChannelName()
    EventBus.dispatch('setTitle', window.atob(this.channel))
    this.setupFirebase()

    User.checkAuth(window.atob(this.channel)).then((isAllowed) => {
      this.canEdit = isAllowed
    })

    if (window.localStorage.getItem('volume') !== null) {
      this.volume = window.localStorage.getItem('volume', 100)
    }

    this.startTimeline()

    EventBus.addEventListener('addvideo', (data) => {
      // this.$firebaseRefs.videos.push(data.target)
      Api.addVideo(this.channel, data.target.ytid)
    })

    this.$watch('channeldata', () => {
      Vue.nextTick(() => {
        this.setPlayerState()
      })
    })
    this.$watch('videos', () => {
      if (!this.videoCount) {
        return
      }
      // If we don't have an active video yet, set the first video to the active one
      if (!this.channeldata.active) {
        Api.setActiveVideo(this.channel, Object.keys(this.videos)[0])
        Api.setPlayerState(this.channel, 1, 0)
      }

      // Enabled the volume slider
      Vue.nextTick(() => {
        var slider = document.getElementById('volume')
        noUiSlider.create(slider, {
          start: this.volume,
          step: 1,
          range: {
            min: 0,
            max: 100
          }
        })
        slider.noUiSlider.on('update', (values) => {
          this.volume = parseInt(values[0])
          this.setVolume()
        })
      })
    })
  },
  destroyed() {
    this.stopTimeline()
    EventBus.dispatch('setTitle', null)
  },
  methods: {
    setupFirebase() {
      this.$watch('channeldata', () => {
        if (this.channeldata && typeof this.channeldata['.key'] !== 'undefined') {
          this.hasLoaded = true
        }
      })
      this.$bindAsObject('channeldata', db.ref('channels/' + this.channel))
      this.$bindAsObject('videos', db.ref('channels/' + this.channel + '/videos'))
    },
    videoPosition(index) {
      return Object.keys(this.videos).indexOf(index)
    },
    getChannelName() {
      if (this.$route.params.owner) {
        return window.btoa(this.$route.params.owner + '/' + this.$route.params.channel)
      } else {
        return window.btoa(this.$route.params.channel)
      }
    },
    toggleVideo() {
      console.log('playertime', this.player.getCurrentTime())
      if (this.channeldata.playerstate === 1) {
        // Pause the video
        this.player.pauseVideo()
        Api.setPlayerState(this.channel, 2, this.player.getCurrentTime())
      } else {
        // Play the video
        Api.setPlayerState(this.channel, 1, this.player.getCurrentTime())
      }
    },
    setPlayerState() {
      if (this.channeldata.playerstate === 1) {
        if (this.player) {
          this.player.seekTo(this.getRealVideoPosition(), true)
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
          Api.notifyVideoEnded(this.channel)
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

      let nextVideo = null
      let lastVideo = null
      $.each(this.videos, (idx, video) => {
        if (lastVideo === this.channeldata.active && idx !== '.key') {
          nextVideo = idx
        }
        lastVideo = idx
      })
      if (!nextVideo) {
        // This was the last video, go to the first one.
        Api.setActiveVideo(this.channel, Object.keys(this.videos)[0])
        return
      }
      // Go to the next video
      Api.setActiveVideo(this.channel, nextVideo)
    },
    prevVideo() {
      if (!this.videos) {
        return
      }

      let nextVideo = null
      let lastVideo = null
      $.each(this.videos, (idx, video) => {
        if (idx === this.channeldata.active) {
          nextVideo = lastVideo
        }
        lastVideo = idx
      })
      if (!nextVideo) {
        // This was the first video, go to the last one.
        Api.setActiveVideo(this.channel, Object.keys(this.videos)[Object.keys(this.videos).length - 2])
        return
      }

      // Go to the next video
      Api.setActiveVideo(this.channel, nextVideo)
    },
    toggleVolume() {
      if (this.volume === 0) {
        this.volume = 100
      } else {
        this.volume = 0
      }
      document.getElementById('volume').noUiSlider.set(this.volume)
    },
    getRealVideoPosition() {
      let videoTime = this.channeldata.video_time
      let diff = (window.ServerDate.now() - this.channeldata.changed_at) / 1000
      diff = parseInt(diff)
      console.log(diff)
      return videoTime + diff
    }
  },
  computed: {
    backgroundImage() {
      if (!this.activeVideoId) {
        return ''
      }
      return 'https://img.youtube.com/vi/' + this.activeVideoId + '/0.jpg'
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
    },
    activeVideoId() {
      if (!this.channeldata || !this.channeldata.active || !this.videos || !this.videos[this.channeldata.active]) {
        return false
      }
      return this.videos[this.channeldata.active].ytid
    },
    videoCount() {
      if (!this.videos) {
        return 0
      }
      return Object.keys(this.videos).filter(id => id !== '.key' && id !== '.value').length
    }
  },
  components: {
    VideoListEntry,
    Youtube,
    VideoSearch,
    EmptyChannel
  }
}
</script>
