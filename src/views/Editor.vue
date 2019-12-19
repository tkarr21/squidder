<template>
  <v-container>
    <v-layout column>
    
      <v-card  class="mt-1 pa-0">
        <v-card-title align-center class="pa-2">
          <v-flex class="display-1 text-xs-center my-5">What do you want to share with your Followers?</v-flex>
        </v-card-title>
      </v-card>

      <v-card width="600" class="my-2">
        
        <v-card-text class="pa-2">
          <v-form class="pa-2" ref="form" v-model="valid">
            <v-textarea
              class="pt-1"
              v-model="status"
              color="teal"
              counter="150"
              :rules="statusRules"
              required
              >
                <template v-slot:label>
                  <div>
                    Status <small>(what are you up to?)</small>
                  </div>
                </template>
            </v-textarea>
            <v-text-field
              color="teal" 
              v-model="url"
              label="Attach a photo or gif using it's a url"
              >
              </v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
          :loading="loading"
          :disabled="!valid || loading"
          @click="submit();loader='loading'"
          >
            Post!
          </v-btn>
          <v-btn 
            @click="clear"
          >
          clear
          </v-btn>
        </v-card-actions>
      </v-card>

      <div class="flex-grow-1"></div>
      <v-card  width="650" class="mt-1 pa-0">
        <v-card-title align-center class="pa-2">
          <v-flex class=" text-xs-center my-5">Want to change your Profile pic? Upload a new one here!</v-flex>
        </v-card-title>
      </v-card>

      <v-card width="600" class="my-2">
        
        <v-card-text class="pa-2">
          <v-form class="pa-2" v-model="valid">
            
            <v-file-input 
              color="teal" 
              @change="secondFileChanged"
              chips
              label="Attach a photo"
              >
            </v-file-input>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
          :loading="loading2"
          :disabled="loading2"
          @click="upload();loader='loading2'"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>


    </v-layout>
  </v-container>
</template>

<script>



  export default {
    name: "editor",
    components: {
      
    },

    data : () => ({
      valid: false,
      status: '',
      statusRules: [
        v => !!v || 'a status can\'t be blank!'
      ],

      profileFile: null,
      url: "",
      loader: null,
      loading2: false,
      loading: false,
      error: "",
    }),

    watch: {
      loader() { 
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 2000)

        this.loader = null
      },
    },



    methods:{
      async submit() {
        try {

          this.error = await this.$store.dispatch("makeStatus", { 
            status: this.status, 
            attachment: this.url
            });
          
          if (this.error == "") {
            this.$router.push('feed');
          }
        } catch (error) {
          console.log(error)
        }
      },

      async upload() {
        try {
          

          this.error = await this.$store.dispatch("uploadPro", {
            file: this.file
          });

          if (this.error == "") {
            this.$router.push('feed');
          }
        } catch (error) {
          console.log(error);
        }
      },

      fileChanged(event) {
        this.file = event
      },

      secondFileChanged(event) {
        this.file = event
      },


      clear() {
        //console.log("clearing");
        this.$refs.form.reset();
      },
    }
  }
</script>
