

export default class Status {
  constructor(op, name, prof_pic, text, attachment) {
    //the original poster data
    this.op = op; //i.e. alias
    this.name = name;//their name
    this.prof_pic = prof_pic;//url to prof img

    //the status data
    this.textTokens = text.split(" ");
    this.attachment = attachment;
  }
}
