<template>
<nav class="main-nav">
  <div class="nav-wrapper">
    <span class="brand-logo"><router-link to="/">Livetube.io</router-link><span v-if="subtitle" class="subtitle"> / {{ subtitle }}</span></span>
    <ul id="nav-mobile" class="right hide-on-med-and-down">
      <li>
        <a href="https://sopamo.typeform.com/to/EmMHSq" target="_blank" class="top-channel-link">Feedback</a>
      </li>
      <li>
        <router-link to="/about" class="top-channel-link">About</router-link>
      </li>
      <li v-if="!user">
        <div id="firebaseui-auth-container"></div>
      </li>
      <li v-if="user" class="profile-link">
        <router-link to="/profile"><img class="avatar" :src="user.photoURL"></router-link>
      </li>
    </ul>
  </div>
</nav>
</template>

<script>
/* global firebase */
/* global firebaseui */
import EventBus from 'eventbusjs'
import User from '../../helpers/User'
export default {
  data() {
    return {
      user: null,
      subtitle: null
    }
  },
  created() {
    EventBus.addEventListener('setTitle', ({target}) => {
      console.log(target)
      this.subtitle = target
    })
    EventBus.addEventListener('authchange', ({
      target
    }) => {
      this.user = target
    })

    window.setTimeout(() => {
      if (!this.user) {
        this.setupLoginUI()
      }
    }, 1000)
  },
  methods: {
    setupLoginUI() {
      // FirebaseUI config.
      var uiConfig = {
        'signInSuccessUrl': '/',
        'signInOptions': [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GithubAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        'tosUrl': '<your-tos-url>',
        'signInFlow': 'popup',
        'callbacks': {
          'signInSuccess': function(currentUser, credential, redirectUrl) {
            User.user = currentUser
            User.setCredential(credential)
            EventBus.dispatch('authchange', currentUser)
            return false
          }
        }
      }

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth())
        // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig)
    }
  }
}
</script>
