<template>
<div id="video-search" class="modal bottom-sheet">
  <div class="modal-content">
    <input @keyup="search" v-model="query" type="search" class="video-search-bar" placeholder="Search YouTube">

    <video-search-result :result="result" v-for="result in results"></video-search-result>

  </div>
</div>
</template>

<script>
import SimpleYT from 'simple-youtube'
import VideoSearchResult from './VideoSearchResult.vue'
import _ from 'lodash'

export default {
  data() {
    return {
      query: null,
      results: []
    }
  },
  methods: {
    search: _.throttle(function() {
      if (!this.query || this.query.length <= 2) {
        return
      }
      SimpleYT({
        key: 'AIzaSyCZkM0D-k7Vi2cU-SlwBQx7aKGNRyqO-Xs',
        term: this.query,
        number: 20
      }, (videos) => {
        this.results = videos
      })
    }, 1000)
  },
  components: {
    VideoSearchResult
  }
}
</script>
