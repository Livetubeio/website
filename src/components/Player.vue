<template>
<div class="player-wrapper">
  <div class="container">
    <div class="row">
      <div class="col-s12">
        <div class="card">
          <youtube class="main-player" :video-id="activeVideo"></youtube>
          <a href="#video-search" class="search-trigger btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></a>
          <div class="card-content">
            <span class="card-title">Video List</span>
            <video-list-entry @click.native="selectVideo(video)" v-for="video in videos" :active-video="activeVideo" :video="video"></video-list-entry>
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

export default {
  data() {
    return {
      videos: [
        {
          title: 'Calvin Harris - This is What You Came For',
          length: 238,
          ytid: 'kOkQ4T5WO9E'
        },
        {
          title: 'twenty one pilots: Heathens (from Suicide Squad: The Album) [OFFICIAL VIDEO]',
          length: 217,
          ytid: 'UprcpdwuwCg'
        }
      ],
      activeVideo: 'kOkQ4T5WO9E'
    }
  },
  methods: {
    selectVideo(video) {
      console.log(video)
      this.activeVideo = video.ytid
    }
  },
  components: {
    VideoListEntry,
    Youtube
  }
}
</script>
