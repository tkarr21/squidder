

export default class User {
  
  constructor(name, alias, filePath) {
    this.name = name;
    this.alias = alias;
    //profile pic
    this.profile = filePath;
    /*this.followers = [];
    this.followings = [];*/
    
  };

  /*addFollower(alias) {
    this.followers.push(alias);
  }
  addFollowee(alias) {
    this.followings.push(alias);
  }*/

}

