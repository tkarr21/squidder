import Amplify, { API, Auth, Storage } from 'aws-amplify';
import User from '../model/user.js';
import Status from '../model/status';
import { signUp, signIn, signOut } from '../applogic/auth.js';
import awsconfig from '../src/aws-exports';



export default class SquidFacade {

  /**
   * token data field is set 
  */
  constructor() {
    this.token = '';
  }

  configAmp() {
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
      },
    });
  }

  paginParams(alias, cursor) {
    
    let params =  {
      queryStringParameters: {
        "alias": alias,
        "key": null
      },
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }

    if (cursor) {
      params.queryStringParameters.key = cursor;
    }

    return params;
  }

  

  async register(file, name, alias, password) { 

    this.configAmp();
    
    try {
      
      //sign up into cognito user pool
      await signUp(alias, password);
      await signIn(alias, password);

      this.token = (await Auth.currentSession()).getIdToken().getJwtToken();

      //uploading to s3
      const { type: mimeType } = file;
      const key = `images/` + alias;
      //for referencing from db
      const encoded = 'images/' + encodeURIComponent(alias);
      const url = `https://${awsconfig.aws_user_files_s3_bucket}.s3-${awsconfig.aws_user_files_s3_bucket_region}.amazonaws.com/public/${encoded}`;
      
      //upload profile pic to s3
      await Storage.put(key, file, {
        contentType: mimeType,
        cacheControl: 'no-cache'
      });

      let myInit = {
        body:
        {
          "name": name,
          "alias": alias,
          "fileurl": url
        },
        headers: { Authorization: `Bearer ${this.token}` }
      }
      
      //call to api gateway
      await API.post('mainappapi', '/register', myInit);
      
      // login the user
      return await this.login(alias, password);

    } catch (err) {
      console.log(err);
      return null;
    }
  };
    
  async login(alias, password) {
    //call to auth
    //call to api gateway
    this.configAmp();
    try {

      // sign into cognito
      await signIn(alias, password);
      this.token = (await Auth.currentSession()).getIdToken().getJwtToken();

      let myInit = {
        body:
        {
          "alias": alias
        },
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }

      // get user data from dynamoDb
      const resp = await API.post('mainappapi', '/login', myInit);

      console.log(resp);
      return new User(resp.name, resp.alias, resp.fileurl);

    } catch (err) { 
      console.log(err);
      return `Unable to login ${alias}`;
    }
  };

  async logout() {
    try {

      //sign out of cognito
      this.token = null;
      signOut();

    } catch (err) {
      console.log(err)
    }
  };

  async makeStatus(content, url, user) {
    try {
      let body = {
        "status": content,
        "alias": user.alias,
        "name": user.name,
        "fileurl": user.profile,
        "timestamp": Date.now()
      } 

      if (url != null) {
        body.attachment = url;
      }
      
      let myInit = {
        body: body,
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
      
      let resp = await API.post('mainappapi', '/status', myInit);
      
    } catch (err) {
      console.log(err);
    }
  };

  async uploadPro(file, alias) {
    
    this.configAmp();
    try { 

      const { type: mimeType } = file;
      const key = `images/` + alias;
      
      //put in new (copy over old)
      await Storage.put(key, file, {
        contentType: mimeType,
        cacheControl: 'no-cache'
      });
    }
    catch (err) {
      console.log(err);
    }
  };

  async getUser(alias) {
    
    try {
      
      let myInit = {
        queryStringParameters: {
          "alias": alias,
        },
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }

      // get user data from dynamoDb
      const resp = await API.get('mainappapi', '/user', {
        queryStringParameters: {
          "alias": alias,
        },
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      return new User(resp.name, resp.alias, resp.fileurl);

    } catch (err) {
      console.log(err); 
    }
  };
  
  

  async getFollowers(alias, cursor) { 
    try {

      //request api gateway
      let resp = await API.get('mainappapi', '/follower', this.paginParams(alias, cursor));

      //make follower lis
      let list = [];
      resp.follower.forEach(foll => {
        list.push(foll.subject);
      });

      //return key and list
      return {
        lastkey: resp.key,
        fol: list
      }
    }
    catch (err) {
      console.log(err);
    }
  };


  async getFollowing(alias, cursor) { 
    try {

      //request api gateway
      let resp = await API.get('mainappapi', '/following', this.paginParams(alias, cursor));
      
      //make following list
      let list = [];
      resp.following.forEach(foll => {
        list.push(foll.alias);
      });

      //return key and list
      return {
        lastkey: resp.key,
        fol: list
      }
    }
    catch (err) {
      console.log(err);
    }
  };


  async getFeed(alias, cursor) {

    this.configAmp();
    try {

      //request api gateway
      let resp = await API.get('mainappapi', '/feed', this.paginParams(alias, cursor));

      //make feed list
      let list = [];
      resp.status.forEach(stat => {
        list.push(new Status(stat.subject, stat.name, stat.fileurl, stat.status, (stat.attachment != null ? stat.attachment : '')));
      });

      //return key and list
      return {
        lastkey: resp.key,
        stat: list
      }
    }
    catch (err) {
      console.log(err);
    }
  };



  async getStory(alias, cursor) { 
    try {

      //request api gateway
      let resp = await API.get('mainappapi', '/story', this.paginParams(alias, cursor));

      //make story list
      let list = [];
      resp.status.forEach(stat => {
        list.push(new Status(stat.alias, stat.name, stat.fileurl, stat.status, (stat.attachment != null ? stat.attachment : '')));
      });

      //return key and list
      return {
        lastkey: resp.key,
        stat: list
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  async getTagging(tag, cursor) { 
    try {

      //request api gateway
      let resp = await API.get('mainappapi', '/tagging', this.paginParams(tag, cursor));

      //make tagging list
      let list = [];
      resp.status.forEach(stat => {
        list.push(new Status(stat.alias, stat.name, stat.fileurl, stat.status, (stat.attachment != null ? stat.attachment : '')));
      });

      //return key and list
      return {
        lastkey: resp.key,
        stat: list
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  async followUser(alias, toFollow) {
    try {
      const data = {
        body: {
          "alias": alias,
          "subject": toFollow
        },
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }

      await API.post('mainappapi', '/follower', data);
    }
    catch (err) {
      console.log(err);
    }
  };

  async unFollowUser(alias, toUnfollow) {
    try {
      const data = {
        body: {
          "alias": alias,
          "subject": toUnfollow
        },
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }

      await API.del('mainappapi', '/follower', data);

    }
    catch (err) {
      console.log(err);
    }
  };
}
