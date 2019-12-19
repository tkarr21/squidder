import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import User from "../model/user.js";
import Status from "../model/status.js";
import SquidFacade from "../applogic/SquidFacade.js";


Vue.use(Vuex);

export default new Vuex.Store({
  
  state: {
    facade: new SquidFacade(),

    user: null,
    stalkee: null,
    status: null,

    profstat: [],
    profnum: null,

    pagestat: [],
    pagenum: null,

    feedstat: [],
    feednum: null,

    hashstat: [],
    hashnum: null,

    followers: [],
    followersnum: null,

    following: [],
    followingnum: null,
    
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setStalkee(state, stalkee) {
      state.stalkee = stalkee;
    },
    setStatus(state, status) {
      state.status = status;
    },

    setFeedStat(state, feedstat) {
      state.feedstat = feedstat;
    },
    setFeedNum(state, feednum) {
      state.feednum = feednum;
    },
    addFeedStat(state, feedstat) {
      state.feedstat = [...state.feedstat, ...feedstat];
    },

    setProfStat(state, profstat) {
      state.profstat = profstat;
    },
    setProfNum(state, profnum) {
      state.profnum = profnum;
    },
    addProfStat(state, profstat) { 
      state.profstat = [...state.profstat, ...profstat]
    },
    

    setPageStat(state, pagestat) {
      state.pagestat = pagestat;
    },
    setPageNum(state, pagenum) {
      state.pagenum = pagenum;
    },
    addPageStat(state, pagestat) {
      state.pagestat = [...state.pagestat, ...pagestat]
    },

    setHashStat(state, hashstat) {
      state.hashstat = hashstat;
    },
    setHashNum(state, hashnum) {
      state.hashnum = hashnum;
    },
    addHashStat(state, hashstat) {
      state.hashstat = [...state.hashstat, ...hashstat]
    },
    
    setFollowers(state, followers) {
      state.followers = followers;
    },
    setFollowersNum(state, followersnum) {
      state.followersnum = followersnum;
    },
    addFollowers(state, followers) {
      state.followers = [...state.followers, ...followers]
    },

    setFollowing(state, following) {
      state.following = following;
    },
    setFollowingNum(state, followingnum) {
      state.followingnum = followingnum;
    },
    addFollowing(state, following) {
      state.following = [...state.following, ...following]
    }

  },
  actions: {

    async register(context, data) {
      try {
        // call facade
        let resp = await this.state.facade.register(
          data.file,
          data.name,
          data.alias,
          data.password
        );
        
        
        if (resp instanceof User) {
          context.commit("setUser", resp);
          return "";
        }
        
        return 'user not set';

      } catch (error) {
        console.log(error);
        return error
      }
    },

    async login(context, data) {
      try {
        
        let resp = await this.state.facade.login(data.alias, data.password);
        if (resp instanceof User) {
          context.commit("setUser", resp);
          return "";
        }
      
      } catch (error) {
        return error;
      }
    },

    async logout(context) {
      try {

        await this.state.facade.logout();

        context.commit("setUser", null);
        context.commit("setStalkee", null);
        context.commit("setStatus", null);
        context.commit("setFeedStat", []);
        context.commit("setProfStat", []);
        context.commit("setPageStat", []);
        context.commit("setHashStat", []);
        context.commit("setFollowers", []);
        context.commit("setFollowing", []);
        
        return "";
      } catch (error) {
        return error;
      }
    },

    async makeStatus(context, data) {
      try {
        let resp = await this.state.facade.makeStatus(data.status, data.attachment, this.state.user);
        
        
      } catch (error) {
        console.log(error);
      }
    },

    async uploadPro(context, data) {
      try {

        await this.state.facade.uploadPro(data.file, this.state.user.alias);
      } catch (error) {
        console.log(error)
        return error;
      }
    },

    async getStalkee(context, data) {
      try {

        let stalkee = await this.state.facade.getUser(data.alias);
        context.commit("setStalkee", stalkee);
        
      } catch (error) {
        console.log(error);
      }
    },

    


    async getFeed(context) {
      try {
        //set num to 0 (like reloading the page)
        context.commit('setFeedNum', null);
        

        let resp = await this.state.facade.getFeed(this.state.user.alias, this.state.feednum);
        context.commit("setFeedStat", resp.stat);
        context.commit("setFeedNum", resp.lastkey);
      } catch (error) {
        console.log(error);
      }
    },

    async addFeed(context) {
      try {
        // when null, the db pagination is done
        if (this.state.feednum == null) { return; }

        let resp = await this.state.facade.getFeed(this.state.user.alias, this.state.feednum);
        context.commit("addFeedStat", resp.stat);
        context.commit("setFeedNum", resp.lastkey);
      } catch (err) {
        console.log(err);
      }
    },

    async getProfStat(context) {
      try {
        
        //set num to 0 (like reloading the page)
        context.commit('setProfNum', null);

        let resp = await this.state.facade.getStory(this.state.user.alias, this.state.profnum);

        context.commit("setProfStat", resp.stat);
        context.commit('setProfNum', resp.lastkey);

        
      } catch (err) {
        console.log(err);
      }
    },

    async addProfStat(context) {
      try {
        
        // when null, the db pagination is done
        if (this.state.profnum == null) { return; }
        
        let resp = await this.state.facade.getStory(this.state.user.alias, this.state.profnum);

        
        context.commit("addProfStat", resp.stat);
        context.commit('setProfNum', resp.lastkey);

        
      } catch (err) {
        console.log(err);
      }
    },


    async getPageStat(context, data) {

      try {

        //set num to 0 (like reloading the page)
        context.commit('setPageNum', null);

        let resp = await this.state.facade.getStory(data.alias, this.state.pagenum);
        
        context.commit("setPageStat", resp.stat);
        context.commit('setPageNum', resp.lastkey);
      } catch (err) {
        console.log(err);
      }
    },

    async addPageStat(context, data) {
      try {

        // when null, the db pagination is done
        if (this.state.pagenum == null) { return; }

        let resp = await this.state.facade.getStory(data.alias, this.state.pagenum);

        context.commit("addPageStat", resp.stat);
        context.commit("setPageNum", resp.lastkey);
      } catch (err) {
        console.log(err);
      }
      
    },

    async getHash(context, data) {
      try {
        
        //set num to 0 (like reloading the page)
        context.commit('setHashNum', null);

        let resp = await this.state.facade.getTagging(data.tag, this.state.hashnum);
        
        context.commit("setHashStat", resp.stat);
        context.commit('setHashNum', resp.lastkey);
      } catch (err) {
        console.log(err);
      }
    },

    async addHash(context, data) {
      try {

        // when null, the db pagination is done
        if (this.state.hashnum == null) { return; }

        const resp = await this.state.facade.getTagging(data.tag, this.state.hashnum);

        context.commit("addHashStat", resp.stat);
        context.commit('setHashNum', resp.lastkey);
      } catch (err) {
        console.log(err);
      }
    },

    async getFollowers(context, data) {

      //set num to 0 (like reloading the page)
      context.commit('setFollowersNum', null);

      const resp = await this.state.facade.getFollowers(data.alias, this.state.followersnum);


      context.commit('setFollowers', resp.fol);
      context.commit('setFollowersNum', resp.lastkey);
    },

    async addFollowers(context, data) {
      try {

        // when null, the db pagination is done
        if (this.state.followersnum == null) { return; }

        const resp = await this.state.facade.getFollowers(data.alias, this.state.followersnum);

        context.commit('addFollowers', resp.fol);
        context.commit('setFollowersNum', resp.lastkey);
      } catch (err) {
        console.log(err);
      }
    },

    

    async getFollowing(context, data) {
      try {
        
        //set num to 0 (like reloading the page)
        context.commit('setFollowingNum', null);

        const resp = await this.state.facade.getFollowing(data.alias, this.state.followingnum);

        context.commit('setFollowing', resp.fol);
        context.commit('setFollowingNum', resp.lastkey);
      } catch (err) {
        console.log(err);
      }
    },


    async addFollowing(context, data) {
      try {
        
        // when null, the db pagination is done
        if (this.state.followingnum == null) { return; }

        const resp = await this.state.facade.getFollowing(data.alias, this.state.followingnum);

        context.commit('addFollowing', resp.fol);
        context.commit('setFollowingNum', resp.lastkey);
      } catch (err) {
        console.log(err);
      }
    },

    async follow(context, data) {
      try {
        await this.state.facade.followUser(this.state.user.alias, data.alias);
      } catch (err) {
        console.log(err);
      }
    },

    async unfollow(context, data) {
      try {
        await this.state.facade.unFollowUser(this.state.user.alias, data.alias);
      } catch (err) {
        console.log(err);
      }
    },
  }
});
