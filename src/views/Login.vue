<template>
  <v-container >
    <v-parallax id="squid"  
      jumbotron
      :src="require('../assets/iconfinder_Squid.svg')"
      height="1200"
      >
      <v-layout  column>
      
        <v-card width="500px" class="mt-1 mx-a">
          <v-card-title>
            <h1>Login here!</h1>
          </v-card-title>
          <v-card-text>
            <v-form class="pa-2" ref="form" v-model="valid">
              <v-text-field
                v-model="alias"
                color="teal"
                :rules="aliasRules"
                label="Alias"
                prepend-icon="mdi-account-circle"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                color="teal"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                label="Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              @click="login();loader = 'loading'"
              :loading="loading"
              :disabled="!valid || loading"
            >
              login
            </v-btn>
          </v-card-actions>
        </v-card>
        
        
      </v-layout>
      </v-parallax>
  </v-container>
  
</template>

<script>
export default {
  name: "login",
  components: {
    
  },

  data: () => ({
    valid: true,
    alias: '@',
    aliasRules: [
      v => !!v || 'Alias is required',
      v => /^@+\w*/.test(v) || 'Alias must begin with \'@\''
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => v.length >= 8 || 'Min 8 characters'
    ],
    showPassword: false,
    error: "",
    loader: null,
    loading: false,
  }),

  watch: {
    loader () { 
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 2000)

      this.loader = null
    },
  },

  methods: {
    async login() {
      try {
        this.error = await this.$store.dispatch("login", {
        alias: this.alias,
        password: this.password
      });
        if (this.error == "") {
          this.$router.push('feed');
        }
      } catch (error) {
        console.log(error);
      }
    },

    clear() {
      this.$refs.form.reset()
    },

  }
};


</script>

<style scoped>


h1 {padding: 40px;}
form {
  border-radius: 10px;
  padding: 70px;
}

</style>