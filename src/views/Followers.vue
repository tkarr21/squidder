<template>
  <div>
    <v-row>
      <v-col>
        <v-card-text><v-btn class="pa-1 ma-1" rounded >Followers</v-btn>
          <span  v-for="(foll, i) in followers" :key="`A-${i}`">
            <v-btn class="pa-1 ma-1" rounded >
              <router-link :to="{ name: 'userpage', params: { alias: foll }}">{{foll}} </router-link>
            </v-btn>
          </span>
        </v-card-text>
      </v-col>
    </v-row>
    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </div>
</template>

<script>


export default {
  name: 'followers',

  components: {
    
  },

  data() {
    return {

    }
  },

  created() {
    this.$store.dispatch("getFollowers", {
      alias: this.$route.params.alias
    });
  },

  methods: {
    async infiniteHandler($state) {
      try {
        const len = this.followers.length;

        await this.sleep(3000);

        await this.$store.dispatch("addFollowers", {
          alias: this.$route.params.alias
        });
        if (len < this.followers.length) {
          $state.loaded()
        }
        else {
          $state.complete()
        }
      } catch (err) {
        console.log(err);
      }
    },

    sleep(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
  },


  computed: {
    followers() {
      return this.$store.state.followers;
    }
  }
}
</script>
