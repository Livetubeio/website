<template>
<div class="player-wrapper">
  <div class="container">
    <div class="row">
      <div class="col-s12">
        <div class="card" v-if="channeldata">
          <youtube class="main-player" :video-id="channeldata.active"></youtube>
          <a href="#video-search" class="search-trigger btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></a>
          <div class="card-content">
            <span class="card-title">asd {{ channeldata.position }}</span>
            <video-list-entry @click.native="selectVideo(video)" v-for="video in channeldata.videos" :active-video="channeldata.active" :video="video"></video-list-entry>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="controls">
    <div class="progress" style="width: 67%;"></div>
    <i class="material-icons dp48 play-toggle">pause_circle_filled</i>
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
  ready() {
    this.$watch('channeldata.active', () => {
      console.log(this.channeldata.active)
    })
  },
  data() {
    return {
      activeVideo: 'kOkQ4T5WO9E',
      channel: 'livetubeio'
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
    }
  },
  components: {
    VideoListEntry,
    Youtube
  }
}
</script>
