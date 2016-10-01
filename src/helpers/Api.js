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
    $.ajax({
      method: 'PUT',
      processData: false,
      url: API_ROOT + 'channels',
      data: JSON.stringify({
        channel: channel,
        playerstate: state
      })
    })
  },
  setActiveVideo(channel, ytid) {
    $.ajax({
      method: 'PUT',
      processData: false,
      url: API_ROOT + 'channels',
      data: JSON.stringify({
        channel: channel,
        active: ytid
      })
    })
  }
}
