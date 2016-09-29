<template>
<div class="player-wrapper">
  <div class="container">
    <div class="row">
      <div class="col-s12">
        <div class="card" v-if="channeldata">
          <youtube @ready="playerReady" class="main-player" :video-id="channeldata.active"></youtube>
          <a href="#video-search" class="search-trigger btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></a>
          <div class="card-content">
            <span class="card-title">{{ channel }}</span>
            <video-list-entry @click.native="selectVideo(video)" v-for="video in channeldata.videos" :active-video="channeldata.active" :video="video"></video-list-entry>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="controls">
    <div class="progress" style="width: 67%;"></div>
    <i class="material-icons dp48 play-toggle" @click="toggleVideo">{{ playToggleIcon }}</i>
    <input type="range" id="volume" value="50">
  </div>

  <div id="video-search" class="modal bottom-sheet">
    <div class="modal-content">
      <h4>Modal Header</h4>
      <p>A bunch of text</p>
    </div>
  </div>
</div>
</template>

<script>
import VideoListEntry from './partials/player/VideoListEntry'
import Youtube from './partials/player/Youtube'
import Firebase from 'firebase'

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

    this.$watch('channeldata', () => {
      if (this.channeldata.playerstate === 1) {
        this.playToggleIcon = 'pause_circle_filled'
        this.player.playVideo()
      } else {
        this.player.pauseVideo()
        this.playToggleIcon = 'play_circle_filled'
      }
    })
  },
  data() {
    return {
      channel: null,
      player: null,
      playToggleIcon: 'pause_circle_filled'
    }
  },
  firebase: function() {
    return {
      // simple syntax, bind as an array by default
      channeldata: {
        source: db.ref('channels/' + this.$route.params.channel),
        asObject: true
      }
    }
  },
  methods: {
    selectVideo(video) {
      // this.channeldata.set('active', video.ytid)
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
    playerReady(player) {
      this.player = player
    }
  },
  components: {
    VideoListEntry,
    Youtube
  }
}
</script>
