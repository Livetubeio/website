const API_ROOT = 'https://livetube.yoforaride.com/'

/* global $ */
import User from './User'
export default {
  addVideo(channel, ytid) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      $.ajax({
        method: 'POST',
        url: API_ROOT + 'channels/' + channel + '/videos',
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
  notifyVideoEnded(channel) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      $.ajax({
        method: 'POST',
        url: API_ROOT + 'channels/' + channel + '/update',
        headers: {
          'X-LIVETUBE-AUTH': idToken,
          'X-GITHUB-AUTH': User.credential.accessToken
        }
      })
    })
  },
  notifyLogin() {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      $.ajax({
        method: 'POST',
        url: API_ROOT + 'login',
        headers: {
          'X-LIVETUBE-AUTH': idToken,
          'X-GITHUB-AUTH': User.credential.accessToken
        }
      })
    })
  },
  setPlayerState(channel, state, videoTime) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      $.ajax({
        method: 'PUT',
        processData: false,
        url: API_ROOT + 'channels/' + channel,
        data: JSON.stringify({
          playerstate: state,
          video_time: parseInt(videoTime),
          changed_at: parseInt(window.ServerDate.now())
        }),
        headers: {
          'X-LIVETUBE-AUTH': idToken,
          'X-GITHUB-AUTH': User.credential.accessToken
        }
      })
    })
  },
  setActiveVideo(channel, index) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      console.log(idToken)
      $.ajax({
        method: 'PUT',
        processData: false,
        url: API_ROOT + 'channels/' + channel,
        data: JSON.stringify({
          active: index,
          video_time: 0,
          changed_at: parseInt(window.ServerDate.now())
        }),
        headers: {
          'X-LIVETUBE-AUTH': idToken,
          'X-GITHUB-AUTH': User.credential.accessToken
        }
      })
    })
  },
  removeVideo(channel, index) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      $.ajax({
        method: 'DELETE',
        processData: false,
        url: API_ROOT + 'channels/' + channel + '/videos/' + index,
        headers: {
          'X-LIVETUBE-AUTH': idToken,
          'X-GITHUB-AUTH': User.credential.accessToken
        }
      })
    })
  },
  getCurrentTime() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        processData: false,
        url: API_ROOT + 'servertime'
      }).then((data) => {
        resolve(JSON.parse(data)['timestamp'])
      }).fail(() => {
        reject()
      })
    })
  }
}
