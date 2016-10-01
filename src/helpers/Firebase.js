import Firebase from 'firebase'
var firebaseApp = Firebase.initializeApp({
  apiKey: 'AIzaSyCZkM0D-k7Vi2cU-SlwBQx7aKGNRyqO-Xs',
  authDomain: 'livetubeio-16323.firebaseapp.com',
  databaseURL: 'https://livetubeio-16323.firebaseio.com',
  storageBucket: '',
  messagingSenderId: '204608398113'
})
var db = firebaseApp.database()

export default db
