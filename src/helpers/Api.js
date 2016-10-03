const API_ROOT = 'https://livetubeio-16323.appspot.com/'

/* global $ */
export default {
  addVideo(channel, ytid) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      $.ajax({
        method: 'POST',
        url: API_ROOT + 'videos',
        data: JSON.stringify({
          channel: channel,
          ytid: ytid
        }),
        headers: {
          'X-LIVETUBE-AUTH': idToken
        }
      })
    })
  },
  setPlayerState(channel, state) {
    window.firebase.auth().currentUser.getToken().then((idToken) => {
      console.log(idToken)
      $.ajax({
        method: 'PUT',
        processData: false,
        url: API_ROOT + 'channels',
        data: JSON.stringify({
          channel: channel,
          playerstate: state
        }),
        headers: {
          'X-LIVETUBE-AUTH': idToken
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
        url: API_ROOT + 'channels',
        data: JSON.stringify({
          channel: channel,
          active: ytid
        }),
        headers: {
          'X-LIVETUBE-AUTH': idToken
        }
      })
    })
  }
}
