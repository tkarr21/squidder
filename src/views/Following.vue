<template>
  <div>
    <v-row>
      <v-col>
        <v-card-text>
          <v-btn class="pa-1 ma-1" rounded >Following</v-btn>
          <span  v-for="(foll, i) in following" :key="`A-${i}`">
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

import Observer from '../components/Observer'

export default {
  name: 'following',

  components: {
    Observer,
  },

  data() {
    return {

    }
  },

  created() {
    this.$store.dispatch("getFollowing", {
      alias: this.$route.params.alias
    });
  },

  methods: {
    async infiniteHandler($state) {
      try {
        const len = this.following.length;

        await this.sleep(3000);

        await this.$store.dispatch("addFollowing",{
          alias: this.$route.params.alias
        });
        if (len < this.following.length) {
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
    following() {
      return this.$store.state.following;
    }
  }
}
</script>
