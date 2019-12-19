<template>

<div>
  
  <router-link
    :to="{ name: 'solostat', params: { post: statject }}">
    <v-card 
      class="mt-1 mx-a"
      max-width="500"
      min-width="200"
    >
      <v-img 
        v-if="statject.attachment != '' "
        class="white--text"
        :src="statject.attachment"
      >
        <v-card-title>
          <v-row> 
            <v-avatar
            left
            class="mx-3"
            > <!-- represent.filePath, https://cdn.vuetifyjs.com/images/cards/mountain.jpg-->
              <v-img :src="statject.prof_pic" />
            </v-avatar>
            <span class="mr-3">{{statject.name}} </span>
            <router-link 
              id="attach" :to="{ name: 'userpage', params: { alias: statject.op }}"> {{statject.op}}</router-link>
          </v-row>
        </v-card-title>
      </v-img>
      <v-card-title v-else>
        <v-row> 
          <v-avatar
          left
          class="mx-3"
          > <!-- represent.filePath, https://cdn.vuetifyjs.com/images/cards/mountain.jpg require('@/assets/IMG_0729.jpeg')-->
            <v-img :src="statject.prof_pic" />
          </v-avatar>
          <span class="mr-3">{{statject.name}} </span>
          <router-link 
            :to="{ name: 'userpage', params: { alias: statject.op }}"> {{statject.op}}</router-link>
        </v-row>
      </v-card-title>

    
      <v-card-text>
      <span v-for="(token, i) in statject.textTokens" :key="`F-${i}`">
        <span v-if="token.charAt(0) == '@'">
          <router-link :to="{ name: 'userpage', params: { alias: token }}">{{token}} </router-link>
        </span>
        <span v-else-if="token.charAt(0) == '#'">
          <router-link :to="{ name: 'tagging', params: { tag: token }}">{{token}} </router-link>
        </span>
        <span v-else>{{token}} </span>
      </span>
      </v-card-text>
    </v-card>
  </router-link>
</div>
</template>



<script>
import moment from "moment";
import Status from "../../model/status.js";
import User from "../../model/user.js";

export default {
  name: "StatusCard",
  props: {
    statject: Status,
  },

  data() {
    return {
      represent: null
    };
  },

  created() {
   /* //console.log("in create method");//"https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
    if (this.$props.op == null) {

      //this.props.
      
      //let dummyUser = new User("kc", "@mic_drop", "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg");
      
      //this.represent = dummyUser;//await getOp();
    }
    else {
      this.represent = this.$props.op;
    }*/
  },

  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), "days") < 15)
        return moment(date).fromNow();
      else return moment(date).format("d MMMM YYYY");
    },

    /*async getOp() {
      //console.log("getting op for status card")
      try {
        this.error = await this.$store.dispatch("getStalkee",
          this.props.statject.op);
      } catch (error) {
        console.log(error);
      }
    },*/
  }

}
</script>

<style>
#attach {
  color:white;
}
</style>