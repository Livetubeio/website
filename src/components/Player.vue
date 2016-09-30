<template>
<div class="player-wrapper">
  <div class="background-drop" :style="{'background-image': 'url(' + backgroundImage + ')'}"></div>
  <div class="container">
    <div class="row">
      <div class="col-s12">
        <div class="card" v-if="channeldata">
          <youtube :player-vars="{controls: 0}" @ready="playerReady" class="main-player" :video-id="channeldata.active"></youtube>
          <a href="#" class="search-trigger btn-floating btn-large waves-effect waves-light red" @click.prevent="showVideoSearch"><i class="material-icons">add</i></a>
          <div class="card-content">
            <span class="card-title">{{ channel }}</span>
            <video-list-entry @click.native="selectVideo(video)" v-for="(video, index) in videos" :active-video="channeldata.active" :index="index" :video="video"></video-list-entry>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="controls">
    <div class="progress" :style="{width: progress + '%'}"></div>
    <i class="material-icons dp48 player-control" @click="nextVideo">skip_previous</i>
    <i class="material-icons dp48 play-toggle" @click="toggleVideo">{{ playToggleIcon }}</i>
    <i class="material-icons dp48 player-control" @click="nextVideo">skip_next</i>
    <div class="volume-wrapper">
      <i class="material-icons" @click="toggleVolume">{{ volumeIcon }}</i>
      <div class="volume-container">
        <div id="volume"></div>
      </div>
    </div>
  </div>

  <video-search></video-search>
</div>
</template>

<script>
/* global $ */
/* eslint no-unused-vars: 0 */
import VideoListEntry from './partials/player/VideoListEntry'
import Youtube from './partials/player/Youtube'
import VideoSearch from './partials/player/VideoSearch'
import Firebase from 'firebase'
import noUiSlider from 'nouislider'
import Vue from 'vue'
import EventBus from 'eventbusjs'

var firebaseApp = Firebase.initializeApp({
  apiKey: 'AIzaSyCZkM0D-k7Vi2cU-SlwBQx7aKGNRyqO-Xs',
  authDomain: 'livetubeio-16323.firebaseapp.com',
  databaseURL: 'https://livetubeio-16323.firebaseio.com',
  storageBucket: '',
  messagingSenderId: '204608398113'
})
var db = firebaseApp.database()

export default {
  created() {
    this.channel = this.$route.params.channel

    if (window.localStorage.getItem('volume') !== null) {
      this.volume = window.localStorage.getItem('volume', 100)
    }

    this.startTimeline()

    EventBus.addEventListener('addvideo', (data) => {
      this.$firebaseRefs.videos.push(data.target)
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
  },
  data() {
    return {
      channel: null,
      player: null,
      volume: 100,
      timelineInterval: null,
      progress: 0,
      playToggleIcon: 'pause_circle_filled'
    }
  },
  firebase: function() {
    return {
      // simple syntax, bind as an array by default
      channeldata: {
        source: db.ref('channels/' + this.$route.params.channel),
        asObject: true
      },
      videos: db.ref('channels/' + this.$route.params.channel + '/videos')
    }
  },
  methods: {
    selectVideo(video) {
      db.ref('channels/' + this.$route.params.channel + '/active').set(video.ytid)
    },
    toggleVideo() {
      if (this.channeldata.playerstate === 1) {
        // Pause the video
        this.player.pauseVideo()
        db.ref('channels/' + this.$route.params.channel + '/playerstate').set(2)
      } else {
        // Play the video
        db.ref('channels/' + this.$route.params.channel + '/playerstate').set(1)
      }
    },
    setPlayerState() {
      if (this.channeldata.playerstate === 1) {
        this.playToggleIcon = 'pause_circle_filled'
        if (this.player) {
          this.player.playVideo()
        }
      } else {
        if (this.player) {
          this.player.pauseVideo()
        }
        this.playToggleIcon = 'play_circle_filled'
      }
    },
    playerReady(player) {
      this.player = player
      this.setPlayerState()
      this.setVolume()
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
      }, 1000)
    },
    stopTimeline() {
      if (this.timelineInterval) {
        window.stopInterval(this.timelineInterval)
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
    }
  },
  components: {
    VideoListEntry,
    Youtube,
    VideoSearch
  }
}
</script>
