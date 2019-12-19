// applogic/auth.js
import { Auth } from 'aws-amplify'
import { AmplifyEventBus } from 'aws-amplify-vue'

async function getUser() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    if (user && user.signInUserSession) {
      return user;
    }
    else {
      return null;
    }
  }
  catch (err) {
    console.log(err);
    return null;
  }
}

async function signUp(username, password) {
  try {
    const data = await Auth.signUp({
      username,
      password,
      attributes: {
        email: 'throwaway@myshorts.com',
      }
    });
    AmplifyEventBus.$emit('localUser', data.user);
    
    
    AmplifyEventBus.$emit('authState', 'signIn');
    
    return data;
  }
  catch (err) {
    console.log(err);
  }
}

async function confirmSignUp(username, code) {
  try {
    const data = await Auth.confirmSignUp(username, code);
    AmplifyEventBus.$emit('authState', 'signIn');
    return data; // 'SUCCESS'
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}

async function resendSignUp(username) {
  try {
    await Auth.resendSignUp(username);
    return 'SUCCESS';
  }
  catch (err) {
    console.log(err);
    return err;
  }
}

async function signIn(username, password) {
  try {
    const user = await Auth.signIn(username, password);
    if (user) {
      AmplifyEventBus.$emit('authState', 'signedIn');
    }
  } catch (err) {
    if (err.code === 'UserNotConfirmedException') {
      // The error happens if the user didn't finish the confirmation step when signing up
      // In this case you need to resend the code and confirm the user
      // About how to resend the code and confirm the user, please check the signUp part
    } else if (err.code === 'PasswordResetRequiredException') {
      // The error happens when the password is reset in the Cognito console
      // In this case you need to call forgotPassword to reset the password
      // Please check the Forgot Password part.
    } else if (err.code === 'NotAuthorizedException') {
      // The error happens when the incorrect password is provided
    } else if (err.code === 'UserNotFoundException') {
      // The error happens when the supplied username/email does not exist in the Cognito user pool
    } else {
      console.log(err);
    }
  }
}

async function signOut() {
  try {
    const data = await Auth.signOut();
    AmplifyEventBus.$emit('authState', 'signedOut');
    return data;
  }
  catch (err) {
    console.log(err);
    return err;
  }
}

export { getUser, signUp, confirmSignUp, resendSignUp, signIn, signOut };