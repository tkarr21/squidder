<template>
  <v-container >
    <v-parallax id="squid"  
      jumbotron
      :src="require('../assets/iconfinder_Squid.svg')"
      height="1200"
      >
      <v-layout  column>
      
        <v-card width="550px" class="mt-1 mx-a">
          <v-card-title class="pa-0">
            <h1>New? Sign up!</h1>
          </v-card-title>
          <v-card-text>

            <v-form class="pa-2" ref="form" v-model="valid">
              <v-text-field
                v-model="name"
                color="teal"
                :rules="nameRules"
                label="Name"
                prepend-icon="mdi-account"
                required
              ></v-text-field>
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
                required
              ></v-text-field>
              <v-file-input 
              color="teal" 
              chips accept="image/*" 
              label="Profile pic" 
              @change="fileChanged"
              required
              ></v-file-input>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              @click="register();loader = 'loading'"
              :loading="loading"
              :disabled="!valid || loading || (file === null)"
            >
            register
            </v-btn>
            
            <v-btn 
              @click="clear"
            >
            clear
            </v-btn>
          </v-card-actions>
          
        </v-card>
        
        
      </v-layout>
    </v-parallax>
  </v-container>
</template>


<script>
  

  export default {
    name: "register",

    data: () => ({
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
      ],
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
      file: null,
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
      async register() {
        try {

          /*const formData = new FormData();
          formData.append("profile", this.file, this.file.name);
          formData.append("name", this.name);
          formData.append("alias", this.alias);
          formData.append("password", this.password);*/

          this.error = await this.$store.dispatch("register", {
            file: this.file,
            name: this.name,
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

      fileChanged(event) {
        console.log(event)
        this.file = event
      },

      clear() {
        this.$refs.form.reset()
      },
    }
  }

</script>

<style scoped>
h1 {padding: 40px;}
form {
  
  padding: 40px;
}
</style>

