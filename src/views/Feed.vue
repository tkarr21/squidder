<template>
  <v-container>
    <v-layout column>
    
    <v-img
      
      id="squid"
      
      
      :src="require('../assets/iconfinder_Squid.svg')"
      max-height="200"
      width="70%"
      >
      <v-card max-width=580 class="mt-10">
        <v-card-title align-center class="pa-2">
          <v-flex class="display-1 text-xs-center pa-3">See what's happening on Squidder!</v-flex>
        </v-card-title>
      </v-card>
    
    </v-img>
    <v-row>
      <v-col
        v-for="(stat, i) in feedstat" 
        :key="`D-${i}`"
        :flex="6"
      >
      
      <status-card
        :statject="stat"
      ></status-card>

      
      </v-col>
      <infinite-loading @infinite="infiniteHandler"></infinite-loading>
    </v-row>
    

    </v-layout>
  </v-container>
</template>

<script>

import StatusCard from '@/components/StatusCard.vue';
import Status from "../../model/status.js";

export default {
  name: "feed",
  components: {
    StatusCard
  },

  data() {
    return {
      error: ""
    }
  },



  async created() {
    
    await this.getFeedStat();
  },

  computed: {
    feedstat() {
      return this.$store.state.feedstat;
    }
    
  },

  methods: {
    fake() {
      let list = [];
      let fake = new Status("There are no spices, where are the chips? did you not tell them that they are the lords chips @tk #nacho", "", "@kc");
      let fake1 = new Status("It is my turn #nacho to sing @tk at the party", "asdfads", "@kc");
      list.push(fake);
      list.push(fake1);

      this.statlist = list;
    },

    async getFeedStat() {
      try {
        this.error = await this.$store.dispatch("getFeed");
        
      } catch (error) {
        console.log(error);
      }
    },

    async infiniteHandler($state) {
      try {
        const len = this.feedstat.length;

        await this.sleep(3000);
        
        await this.$store.dispatch("addFeed");
        if (len < this.feedstat.length) {
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
};
</script>
