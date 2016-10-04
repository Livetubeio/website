const API_ROOT = 'http://134.60.117.8:8080/'

/* global $ */
import User from './User'
export default {
  addVideo(channel, ytid) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      $.ajax({
        method: 'POST',
        url: API_ROOT + '/channels/' + channel + '/videos',
        data: JSON.stringify({
          ytid: ytid
        }),
        headers: {
          'X-LIVETUBE-AUTH': idToken,
          'X-GITHUB-AUTH': User.credential.accessToken
        }
      })
    })
  },
  setPlayerState(channel, state) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      $.ajax({
        method: 'PUT',
        processData: false,
        url: API_ROOT + 'channels/' + channel,
        data: JSON.stringify({
          playerstate: state
        }),
        headers: {
          'X-LIVETUBE-AUTH': idToken,
          'X-GITHUB-AUTH': User.credential.accessToken
        }
      })
    })
  },
  setActiveVideo(channel, ytid) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      console.log(idToken)
      $.ajax({
        method: 'PUT',
        processData: false,
        url: API_ROOT + 'channels/' + channel,
        data: JSON.stringify({
          active: ytid
        }),
        headers: {
          'X-LIVETUBE-AUTH': idToken,
          'X-GITHUB-AUTH': User.credential.accessToken
        }
      })
    })
  }
}
