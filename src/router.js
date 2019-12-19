import Vue from "vue";
import Router from "vue-router";
import Feed from "./views/Feed.vue";
import Register from "./views/Register.vue";
import Login from "./views/Login.vue";
import Editor from "./views/Editor.vue";
import Tagging from "./views/Tagging.vue";
import UserPage from "./views/UserPage.vue";
import Profile from "./views/Profile.vue";
import SoloStat from "./views/SoloStat.vue";
import Followers from "./views/Followers.vue";
import Following from "./views/Following.vue";


Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  /*scrollBehavior() {
    return { x: 0, y: 0 };
  },*/
  routes: [
    {
      path: "/userpage/:alias",
      name: "userpage",
      component: UserPage
    },
    {
      path: "/solostat",
      name: "solostat",
      component: SoloStat,
      props: true
    },
    {
      path: "/tagging/:tag", 
      name: "tagging",
      component: Tagging
    },
    {
      path: "/editor",
      name: "editor",
      component: Editor
    },
    {
      path: "/feed",
      name: "feed",
      component: Feed,
      

    },
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile
    },
    {
      path: "/followers/:alias",
      name: 'followers',
      component: Followers
    },
    {
      path: "/following/:alias",
      name: 'following',
      component: Following
    }
  ]
});
