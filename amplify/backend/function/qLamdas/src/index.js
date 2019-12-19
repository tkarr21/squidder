/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

exports.handler = function (event, context) { //eslint-disable-line
  console.log(`alias = ${event.alias}`);
  console.log(`name = ${event.name}`);
  console.log(`fileurl = ${event.fileurl}`);
  console.log(`status = ${event.status}`);
  console.log(`attachment = ${event.attachment}`);
  console.log(`timestamp = ${event.timestamp}`);

  


  context.done(null, 'status added to feed'); // SUCCESS with message
};
