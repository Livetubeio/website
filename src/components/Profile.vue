<template>
<div>
  <div class="container">
    <div class="row">
      <div class="col-s12">
        <h1>All about you</h1>
        <ul>
          <li v-for="repo in repos">{{ repo.name }}</li>
        </ul>

      </div>
    </div>
  </div>
</div>
</template>

<script>
/* global $ */
import User from '../helpers/User'
export default {
  data() {
    return {
      repos: []
    }
  },
  created() {
    console.log(User.credential)
    $.get('https://api.github.com/user?access_token=' + User.credential.accessToken).then((userdata) => {
      $.get(userdata.repos_url).then((repos) => {
        this.repos = repos
      })
    })
  }
}
</script>
