import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify';
import Amplify, * as AmplifyModules from 'aws-amplify';
import { AmplifyPlugin } from 'aws-amplify-vue';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig, {
  // OPTIONAL - if your API requires authentication 
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: awsconfig.aws_cognito_identity_pool_id,
    // REQUIRED - Amazon Cognito Region
    region: awsconfig.aws_cognito_region,
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: awsconfig.aws_user_pools_id,
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: awsconfig.aws_user_pools_web_client_id,
  }
});
Vue.use(AmplifyPlugin, AmplifyModules);

import InfiniteLoading from 'vue-infinite-loading';
Vue.use(InfiniteLoading, { /* options */ });



Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
