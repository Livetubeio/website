<template>
<div class="content-wrapper dark padded">
  <div v-if="canEdit">
    <div class="header">
      <h1>Nothing here yet :(</h1>
      <p>Start by adding some videos from your favorite genre.</p>
    </div>
    <div class="genres">
      <div @click="addGenre(genreid)" class="genre" v-for="(genre, genreid) in genres" :style="{'background-image': preview(genreid)}" :class="{'house-animation': genreid === 'House'}"><span class="title">{{ genreid }}</span></div>
    </div>
  </div>
  <div v-if="!canEdit">
    <h1>Nothing here yet :(</h1>
    <p>Invite the owner of this repo to add some videos:</p>
  </div>
</div>
</template>

<script>
import Api from '../../../helpers/Api'
export default {
  props: ['canEdit', 'channel'],
  data() {
    return {
      'genres': {
        'Hip-Hop': ['HMUDVMiITOU', 'gVf_4Ns3qLU', 'RgKAFK5djSk', 'knfrxj0T5NY', 'YVkUvmDQ3HY'],
        'Pop': ['YBHQbu5rbdQ', 'GKSRyLdjsPA', 'lp-EO5I60KA', '2vjPBrBU-TM', 'DK_0jXPuIr0'],
        'Rock': ['1w7OgIMMRc4', 'fJ9rUzIMcZQ', 'xTxHDk9uA4w', 'UprcpdwuwCg', 'ktvTqknDobU'],
        'Hispanic': ['-UV0QGLmYys', '6R5i6wQCOCQ', 'kkx-7fsiWgg', 'hXI8RQYC36Q', 'lBztnahrOFw'],
        'Electronic': ['kOkQ4T5WO9E', '60ItHLz5WEA', 'foE1mO2yM04', 'YqeW9_5kURI', 'EgqUJOudrcM'],
        'Country': ['zXDAYlhdkyg', '8xg3vE8Ie_E', 'NG2zyeVRcbs', 'N6Z_iyd7MIQ', '6l3ukWqRU4s'],
        'R & B': ['5WL672bjJgM', 'iOpJywrdCuQ', 'mf80C3wGRPc', 'k1niwMJLFP4', 'yw04QD1LaB0'],
        'Trap': ['knfrxj0T5NY', 'HMUDVMiITOU', 'wzMrK-aGCug', 'F8Cg572dafQ', '4wrn4Tg6_4g'],
        'Heavy Metal': ['CSvFpBOe8eY', '9jK-NcRmVcw', '3YxaaGgTQYM', 'tAGnKpE4NCI', '4tdKl-gTpZg'],
        'Soul': ['YQHsXMglC9A', 'BxuY9FET9Y4', 'y6Sxv-sUYtM', 'HaMq2nn5ac0', 'WDAd0S92Uko'],
        'House': ['EgqUJOudrcM', 'foE1mO2yM04', 'kOkQ4T5WO9E', 'GTyN-DB_v5M', 'NYhxaZXXwsg'],
        'Reggae': ['HL1UzIK-flA', 'Pw-0pbY9JeU', 'EkHTsc9PU2A', 'MUCVB-0_1H8', 'sEhy-RXkNo0'],
        'Pop-Rock': ['hT_nvWreIhg', '5Nrv5teMc9Y', 'Jwgf3wmiA04', 'xo1VInw-SKc', 'mk48xRzuNvA'],
        'Blues': ['KRzMtlZjXpU', 'ySBl9UM8iGY', 'PGc9n6BiWXA', 'ojdbDYahiCQ', 'rfE5Zsw7QrI'],
        'Classical Music': ['VFeRTANr_sw', '_4IRMYuE1hI', '1k08yxu57NA', 't3217H8JppI', '4Tr0otuiQuU'],
        'Hard Rock': ['1w7OgIMMRc4', '8SbUC-UaAxE', 'v2AC41dglnM', 'gEPmA3USJdI', 'zRIbf6JqkNc'],
        'Electronic Dance': ['6ACl8s_tBzE', 'nntGTK2Fhb0', 'xGiBiHocSZM', 'hsOqEhMumaw', 'X46t8ZFqUB4'],
        'Indie': ['8UVNT4wvIGY', '6hzrDeceEKc', 'sENM2wA_FTg', 'UAWcs5H-qgQ', 'r8OipmKFDeM'],
        'New Age': ['7wfYIMyS_dI', 'i7MLT4MmAK8', 'Rk_sAHh9s08', 'Jl8iYAo90pE', '8rWyNFiKq2A'],
        'Jazz': ['Tm88QAI8I5A', '-ScjucUV8v0', 'tWyuglGCKgE', 'KDcgOpUp2nc', '3TrSMaOZm3Y']
      }
    }
  },
  methods: {
    preview(genre) {
      return 'url(\'https://img.youtube.com/vi/' + this.genres[genre][0] + '/maxresdefault.jpg\')'
    },
    addGenre(genre) {
      this.genres[genre].forEach(video => {
        Api.addVideo(this.channel, video)
      })
    }
  }
}
</script>
