<template>

<div>
  
  
  <v-card 
    class="mx-auto"
        max-width="500"
  >
    <v-img 
      v-if="post.attachment != '' "
      class="white--text"
      :src="post.attachment"
    >
      <v-card-title>
        <v-row> 
          <v-avatar
          left
          class="mx-3"
          > <!-- represent.filePath, https://cdn.vuetifyjs.com/images/cards/mountain.jpg-->
            <v-img :src="post.prof_pic" />
          </v-avatar>
          <span class="mr-3">{{post.name}} </span>
          <router-link 
            id="attach" :to="{ name: 'userpage', params: { alias: post.op }}"> {{post.op}}</router-link>
        </v-row>
      </v-card-title>
    </v-img>
    <v-card-title v-else>
      <v-row> 
        <v-avatar
          left
          class="mx-3"
        > <!-- represent.filePath, https://cdn.vuetifyjs.com/images/cards/mountain.jpg require('@/assets/IMG_0729.jpeg')-->
          <v-img :src="post.prof_pic" />
        </v-avatar>
        <span class="mr-3">{{post.name}} </span>
        <router-link 
          :to="{ name: 'userpage', params: { alias: post.op }}"> {{post.op}}</router-link>
      </v-row>
    </v-card-title>
  <v-card-text>
    <span v-for="(token, i) in post.textTokens" :key="`G-${i}`">
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
</div>
</template>

<script>
import moment from "moment";
import Status from "../../model/status.js";

export default {
  name: "SoloStat",
  props: {
    post: Status,
  },


  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), "days") < 15)
        return moment(date).fromNow();
      else return moment(date).format("d MMMM YYYY");
    },
  }
}
</script>

<style>
#attach {
  color:white;
}
</style>