<template>
<div>
  <div class="container">
    <div class="row">
      <div class="col m12 l6">
        <img src="/img/v2banner.png" alt="LiveTube v2">
      </div>
      <div class="col m12 l6">
        <h1>Remote control & sync <br>YouTube videos</h1>
        <p class="lead">
          Supercharge your GitHub repository.<br>
          <strong>Synchronize Videos</strong> with your friends<br>
          <strong>Remote control</strong> your channel.
        </p>
        <div class="download-badges">
          <div class="download-badge">
              <router-link to="/player/livetubeio" class="btn">Join the Livetube.io channel</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <section class="frontpage-top-channels">
    <h1 style="text-align: center">Now playing</h1>
    <ul class="frontpage-top-channel-list">
      <li v-for="(channel, channelname) in randomChannels">
        <router-link :to="'/player/' + decodeChannelName(channelname)" class="top-channel-link">
            <div class="top-channel-wrapper">
                <div class="top-channel">
                    <img :src="'https://img.youtube.com/vi/' + channel.active + '/0.jpg'">

                    <div class="channel-name">
                        {{ decodeChannelName(channelname) }}
                    </div>
                </div>
            </div>
        </router-link>
    </li>
    </ul>
  </section>
  <section class="explanation-section">
    <h1 style="text-align: center">What is LiveTube?</h1>
    <div class="container">
      <div class="row">
        <section class="explanation s12 col m6">
          <h1>Listen together</h1>
          <p class="lead">
            Login with your GitHub account and activate Livetube for one or more of your repositories.<br>
            Add some videos and include your "now playing" badge to your README.md<br>
            Enjoy synchronized music with your collaborators and friends.
          </p>
        </section>
        <section class="explanation s12 col m6">
          <h1>Remote control</h1>
          <p class="lead">
            You can also use Livetube to remote control your music from your mobile device or another computer. Connect one computer to speakers and let others in your office control the music.
          </p>
        </section>
      </div>

    </div>
  </section>
  <section class="details-section">
    <h1 style="text-align: center;">Want to know more?</h1>
    <div class="container">
      <div class="row">
        <div class="col m6">
          <h2>Why did we make Livetube?</h2>

          <p>
            When you are working with multiple people it's a great plus to listen to the same music. Especially when working remote you strengthen your teamspirit by working to the same beats 🎶
          </p>
        </div>
        <div class="col m6">
          <h2>How much does Livetube cost?</h2>

          <p>
            LiveTube is completely free! Yay!
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col m6">
          <h2>Do I need a permanent internet connection</h2>

          <p>
            Yes. As we need to stream the YouTube video and also have to be connected to our synchronizing servers you always need an internet connection.
          </p>
        </div>
        <div class="col m6">
          <h2>Do I need to be in the same network to control my channel?</h2>

          <p>
            No! All you need is internet access. There is nothing to set up. Just go to <a href="https://livetube.io">Livetube.io</a> and control your channel from anywhere.
          </p>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import db from '../helpers/Firebase'
import _ from 'lodash'
export default {
  data() {
    return {}
  },
  firebase: function() {
    return {
      // simple syntax, bind as an array by default
      channels: {
        source: db.ref('channels'),
        asObject: true
      }
    }
  },
  methods: {
    decodeChannelName(base64) {
      return window.atob(base64)
    }
  },
  computed: {
    randomChannels() {
      let keys = Object.keys(this.channels)
      if (!keys) return {}

      keys = _.shuffle(keys.filter(key => key !== '.key'))
      let data = _.mapValues(this.channels, (channel, channelname) => {
        return keys.indexOf(channelname) !== -1 ? channel : false
      })
      let final = {}
      let c = 0
      _.forEach(keys, (channelname) => {
        if (data[channelname] && c < 5) {
          c++
          final[channelname] = data[channelname]
        }
      })
      if (!final) return {}

      return final
    }
  }
}
</script>
