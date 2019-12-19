<template>

  <v-container
    class="pa-2"
    fluid
  >

  <v-card max-width="400" class="mt-1 pa-0">
      <v-card-title align-center class="pa-2">
        <v-flex class="display-1 text-xs-center my-5">{{requestedTag}}</v-flex>
      </v-card-title>
    </v-card>

    <v-row>
      <v-col
        v-for="(stat, i) in hashstat" 
        :key="i"
        :flex="6"
      >
      <status-card
        :statject="stat"
      ></status-card>


      </v-col>
    </v-row>
    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </v-container>

</template>

<script>

import StatusCard from '@/components/StatusCard.vue';

export default {
  name: 'tagging',
  components: {
    StatusCard
  },

  data () {
    return {
      requestedTag: "",
      error: "",
    }
  },

  computed: {
    hashstat() {
      return this.$store.state.hashstat;
    }
  },

  async created() {
    this.requestedTag = this.$route.params.tag;
    await this.getTheHash();
  },

  methods: {
    

    async getTheHash() {
      try {
        this.error = await this.$store.dispatch("getHash", {
          tag: this.$route.params.tag
        });
      } catch (error) {
        console.log(error);
      }
    },

    async infiniteHandler($state) {
      try {
        const len = this.hashstat.length;

        await this.sleep(3000);

        await this.$store.dispatch("addHash", {
          tag: this.$route.params.tag
        });
        if (len < this.hashstat.length) {
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

  }
}
</script>