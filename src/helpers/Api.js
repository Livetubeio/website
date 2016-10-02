const API_ROOT = 'https://livetubeio-16323.appspot.com/'

/* global $ */
export default {
  addVideo(channel, ytid) {
    $.post(API_ROOT + 'videos', JSON.stringify({
      channel: channel,
      ytid: ytid
    }))
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
