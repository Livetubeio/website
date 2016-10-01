/* global firebase */
import EventBus from 'eventbusjs'
export default {
  user: null,
  credential: null,
  setCredential(credential) {
    this.credential = credential
    window.localStorage.setItem('gh-credential', JSON.stringify(credential))
  },
  init() {
    this.credential = JSON.parse(window.localStorage.getItem('gh-credential'))
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          EventBus.dispatch('authchange', user)

          // User is signed in.
          var displayName = user.displayName
          var email = user.email
          var emailVerified = user.emailVerified
          var photoURL = user.photoURL
          var uid = user.uid
          var providerData = user.providerData
          user.getToken().then((accessToken) => {
            this.user = {
              displayName: displayName,
              email: email,
              emailVerified: emailVerified,
              photoURL: photoURL,
              uid: uid,
              accessToken: accessToken,
              providerData: providerData
            }
            resolve('Stuff worked!')
          })
        } else {
          // User is signed out.
          this.user = null
          resolve('Stuff worked!')
        }
      }, function(error) {
        console.log(error)
        resolve('Stuff worked!')
      })
    })
  }
}
