/* global firebase */
/* global $ */
import EventBus from 'eventbusjs'
import _ from 'lodash'
export default {
  user: null,
  credential: null,
  repos: null,
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
  },
  checkAuth(channel) {
    return new Promise((resolve, reject) => {
      if (this.repos) {
        if (_.find(this.repos, ({full_name}) => full_name === channel)) {
          resolve(true)
          return
        } else {
          resolve(false)
          return
        }
      }

      let collections = []
      // Fetch the user's repositories
      $.get('https://api.github.com/user?access_token=' + this.credential.accessToken).then((userdata) => {
        collections.push($.get(userdata.repos_url + '?access_token=' + this.credential.accessToken))
        // Fetch the user's organizations
        $.get(userdata.organizations_url + '?access_token=' + this.credential.accessToken).then(orgs => {
          // Add all organization's repositories to our collection of repositories
          orgs.forEach((org, idx) => {
            collections.push($.get(org.repos_url + '?access_token=' + this.credential.accessToken))
          })

          // Fetch the data from our collection
          Promise.all(collections).then(values => {
            // Add all repositories
            this.repos = []
            values.forEach(repoList => {
              this.repos = this.repos.concat(repoList)
            })
            // Check if the user is allowed to edit the given repo
            if (_.find(this.repos, ({full_name}) => full_name === channel)) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      })
    })
  }
}
