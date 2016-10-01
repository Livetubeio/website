<template>
<div>
  <div class="container">
    <div class="row">
      <div class="col-s12">
        <h1>Your repositories</h1>
        <div class="collection">
          <router-link :to="'/player/' + repo.full_name" class="collection-item" v-for="repo in repos">{{ repo.name }}</a>
        </div>

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
    $.get('https://api.github.com/user?access_token=' + User.credential.accessToken).then((userdata) => {
      $.get(userdata.repos_url).then((repos) => {
        this.repos = repos
      })
    })
  }
}
</script>
