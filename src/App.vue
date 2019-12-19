<template>
  <v-app>
    
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Squidder</span>
        <span class="font-weight-light">SOCIAL</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user">
        
        <v-tooltip bottom color="green">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              text icon color="green"
              to="/feed"  
            >
              <v-icon>mdi-comment-multiple-outline</v-icon>
          
            </v-btn>
          </template>
          <span>Feed</span>
        </v-tooltip>

        <v-tooltip bottom color="purple">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              text icon color="purple"
              to="/profile"
            >
              <v-icon>mdi-comment-account</v-icon>
          
            </v-btn>
          </template>
          <span>Story</span>
        </v-tooltip>

        <!--"{ name: 'userpage', params: { alias: user.alias }}"  -->
        <!--v-btn
          text
          to="/followers"
        >
          <span class="mr-2">Followers</span>
        </v-btn>

        <v-btn
          text
          to="/following"
        >
          <span class="mr-2">Following</span>
        </v-btn-->
        

        <v-tooltip bottom color="blue">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              text icon color="blue"
              to="/editor"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Editor</span>
        </v-tooltip>


        <v-tooltip bottom color="red">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              text icon color="red"
              @click.stop="dialog = true"
            >
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
          <span>Logout</span>
        </v-tooltip>

        <v-dialog
          v-model="dialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">Are you sure you want to log out?</v-card-title>

            <v-card-text>
              Logging out will exit your current session and will require you to log back in if you want to continue browsing SquidderSocial
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>

              <v-btn
                color="red"
                text
                @click="dialog = false;logout()"
              >
                yes
              </v-btn>

              <v-btn
                color="green darken-1"
                text
                @click="dialog = false"
              >
                no
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>



        </div>
      <div v-else>
        <v-btn
          text
          to="/"
        >
          <span class="mr-2">Login</span>
        </v-btn>
        <v-btn
          text
          to="/register"
        >
          <span class="mr-2">Register</span>
        </v-btn>

      </div> 
    </v-app-bar>
    
    <v-content transition="slide-x-transition">
      <router-view :key="$route.fullPath"></router-view>
    </v-content>
    
  </v-app>
</template>

<script>


export default {
  name: 'App',
  components: {
    
  },
  data: () => ({
    dialog: false,
    error: "",
    
  }),


  computed: {
    user() {
      return this.$store.state.user;
    },
  },

  watch: {
    user(newVal) {
      if (newVal == null) {
        this.$router.push({ path: '/' });
        
      } 
    }
  },

  methods: {
    async logout() {
      try {
        this.error = await this.$store.dispatch("logout");

        if (this.error === "") {
          this.$router.push({ path: '/'});
        }
      } catch (error) {
        console.log(error);
      }
      
    }
  }
};
</script>


<style>

a {
  text-decoration: none;
}



</style>