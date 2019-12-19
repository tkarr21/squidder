<template>
  <v-container
    class="pa-2"
    fluid
  >
    
    <v-card
      class="mx-auto"
      max-width="600"
    >
      <v-img 
        class="white--text"
        :src="user.profile"
      >

      <v-card-title class="pa-2 align-right">
        {{user.name}} {{user.alias}}
      </v-card-title>

      </v-img>
        <v-card-actions 
          class="pa-2"
        >
          <div class="flex-grow-1"></div>
          
          <!-- TODO add follow functionality -->  
          
          <v-btn
            icon
            @click="show = !show"
          >
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions> 

      

      <v-expand-transition>
        <div v-show="show">
          <v-row>
            <v-col>
              <v-card-text>
                <v-btn class="pa-1 ma-1" rounded >
                <router-link :to="{ name: 'followers', params: { alias: user.alias}}">Followers</router-link>
                </v-btn>
                <!--span v-for="(foll, i) in user.followers" :key="`A-${i}`">
                  <v-btn class="pa-1 ma-1" rounded>
                    <router-link :to="{ name: 'userpage', params: { alias: foll }}">{{foll}} </router-link>
                  </v-btn>
                </span-->
              </v-card-text>
            </v-col>

            <v-col>
              <v-card-text>
                <v-btn class="pa-1 ma-1" rounded >
                <router-link :to="{ name: 'following', params: { alias: user.alias}}">Following</router-link>
                </v-btn>
                <!--span v-for="(fwing, i) in user.followings" :key="`B-${i}`">
                  <v-btn class="pa-1 ma-1" rounded>
                    <router-link :to="{ name: 'userpage', params: { alias: fwing }}">{{fwing}} </router-link>
                  </v-btn>
                </span-->
              </v-card-text>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
    </v-card>

      

    <v-row>
      <v-col
        v-for="(stat, i) in profstat" 
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
  name: 'profile',
  
  components: {
    StatusCard
  },

  data() {
    return {
      show: false,
      error: "",
      alreadyFollow: false,
    }
  },

  async created() {

    await this.$store.dispatch("getProfStat");

  },

  computed: {
    
    user() {
      return this.$store.state.user;
    },

    profstat() {
      return this.$store.state.profstat;
    }
  },



  

  methods: {
    async infiniteHandler($state) {
      try {
        const len = this.profstat.length;

        await this.sleep(5000);
        
        await this.$store.dispatch("addProfStat");
        if (len < this.profstat.length) {
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