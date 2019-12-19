<template>
  <v-container v-if="user && stalkee"
    class="pa-2"
    fluid
  >
    
      <v-card
        class="mx-auto"
        max-width="600"
      >
        <v-img 
          class="white--text"
          :src="stalkee.profile"
        >

        <v-card-title class="pa-2 align-right">
          {{stalkee.name}} {{stalkee.alias}}
        </v-card-title>

        </v-img>
        
          <v-card-actions 
            class="pa-2"
          >

            
            <div class="flex-grow-1"></div>
            
            <!-- TODO add follow functionality -->  
            

            <v-btn
              :disabled="user == stalkee"
              text
              color="purple"
              @click="follow()"
            >
            <span class="mr-2">Follow</span>
            </v-btn>
            <v-btn
              :disabled="user == stalkee"
              text
              color="purple"
              @click="unfollow()"
            ><span class="mr-2">unFollow</span>
            </v-btn>
            
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
                  <router-link :to="{ name: 'followers', params: { alias: stalkee.alias}}">Followers</router-link>
                  </v-btn>
                  <!--span  v-for="(foll, i) in stalkee.followers" :key="`A-${i}`">
                    <v-btn class="pa-1 ma-1" rounded >
                      <router-link :to="{ name: 'userpage', params: { alias: foll }}">{{foll}} </router-link>
                    </v-btn>
                  </span-->
                </v-card-text>
              </v-col>
              <v-col>
                <v-card-text>
                  <v-btn class="pa-1 ma-1" rounded >
                  <router-link :to="{ name: 'following', params: { alias: stalkee.alias}}">Following</router-link>
                  </v-btn>
                  <!--span v-for="(fwing, i) in stalkee.followings" :key="`B-${i}`">
                    <v-btn class="pa-1 ma-1" rounded >
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
        v-for="(stat, i) in pagestat" 
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
  name: 'userpage',

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
    
    
    await this.getStalkee();
    await this.checkMatch();
    await this.getStalkeeStats();
    
  },

  

  computed: {
    stalkee() {
      return this.$store.state.stalkee;
    },

    user() {
      return this.$store.state.user;
    },

    pagestat() {
      return this.$store.state.pagestat;
    },

  },

  



  methods:{

    async getStalkee() {

      try {
        this.error = await this.$store.dispatch("getStalkee", {
          alias: this.$route.params.alias
        });
        
        
      } catch (error) {
        console.log(error);
      }
    },

    checkMatch() {
      
      /*console.log("checking match!");
      console.log(this.$route.params.alias);
      console.log(this.stalkee.alias);
      console.log(this.user.alias);*/
      
      if (this.$route.params.alias == this.user.alias) {
        console.log("pushing profile!");
        
        this.$router.push({ path: '/profile'});
        
      }
    },

    async getStalkeeStats() {
      try {
        this.error = await this.$store.dispatch("getPageStat", {
          alias: this.$route.params.alias
        });
        //Soft reloads the page
        
        //this.$router.go();
      } catch (error) {
        console.log(error);
      }
    },

    async follow() {
      try {
        await this.$store.dispatch('follow', {
          alias: this.stalkee.alias
        })
      } catch (err) {
        console.log(err);
      }
    },

    async unfollow() {
      try {
        
        await this.$store.dispatch('unfollow', {
          alias: this.stalkee.alias
        });
      } catch (err) {
        console.log(err);
      }
    },

    async infiniteHandler($state) {
      try {
        const len = this.pagestat.length;

        await this.sleep(3000);

        await this.$store.dispatch("addPageStat", {
          alias: this.stalkee.alias
        });
        if (len < this.pagestat.length) {
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