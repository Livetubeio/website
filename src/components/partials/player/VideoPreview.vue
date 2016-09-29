<template>
  <youtube :player-vars="{controls: 0}" :player-width="320" :player-height="180" :video-id="ytid"></youtube>
</template>

<script>
import Youtube from './Youtube'
export default {
  props: ['ytid'],
  components: {
    Youtube
  }
}
</script>
