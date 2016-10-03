<template>
<div>
  <div class="container">
    <h1>Hi {{ user.displayName }}</h1>
    <p>Choose one of your repositories and join it's Livetube channel.</p>
    <div class="row">
      <div class="col s12 m6">
        <h1>Your repositories</h1>
        <div class="collection">
          <router-link :to="'/player/' + repo.full_name" class="collection-item" v-for="repo in sortedRepos">
            {{ repo.full_name }}
            <div class="secondary-content" v-if="repo.fork">
              <div class="chip">
                Fork
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="col s12 m6">
        <h1>Your organizations</h1>
        <template v-for="org in orgs">
          <h2><img class="org-avatar" :src="org.avatar_url">{{ org.login }}</h2>
          <div class="collection" v-if="org.repos">
            <router-link :to="'/player/' + repo.full_name" class="collection-item" v-for="repo in org.repos">
              {{ repo.full_name }}
              <div class="secondary-content" v-if="repo.fork">
                <div class="chip">
                  Fork
                </div>
              </div>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</div>
</template>

<script>
/* global $ */
import User from '../helpers/User'
import _ from 'lodash'
import Vue from 'vue'
export default {
  data() {
    return {
      repos: [],
      orgs: [],
      user: {}
    }
  },
  created() {
    this.user = User.user
    $.get('https://api.github.com/user?access_token=' + User.credential.accessToken).then((userdata) => {
      $.get(userdata.repos_url + '?access_token=' + User.credential.accessToken).then((repos) => {
        this.repos = repos
      })
      $.get(userdata.organizations_url + '?access_token=' + User.credential.accessToken).then((orgs) => {
        this.orgs = orgs
        this.orgs.forEach((org, idx) => {
          $.get(org.repos_url + '?access_token=' + User.credential.accessToken).then((repos) => {
            Vue.set(this.orgs[idx], 'repos', repos)
          })
        })
      })
    })
  },
  computed: {
    sortedRepos() {
      return _.sortBy(this.repos, 'fork', 'created_at')
    }
  }
}
</script>
