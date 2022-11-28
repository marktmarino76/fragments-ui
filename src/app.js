// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, postFragments,getUserFragmentsById,getUserFragmentsViaExpand } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postRequestBtn = document.querySelector('#postrequest');
  const getExpandRequestBtn= document.querySelector('#getexpandrequest');
  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };
  postRequestBtn.onclick = async () => {
    //Sends post request to create a new fragment
    const postResult =  await postFragments(user);
    //Console log the ID of the newly created fragment
    console.log("POST RESULT ID: " + postResult.fragment.id);
    //Get that newly created fragment by a GET /:ID request
    //  await getUserFragmentsById(user,postResult.fragment.id);
  };
  getExpandRequestBtn.onclick = async () => {
    await getUserFragmentsViaExpand(user);
  };
  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
   // Do an authenticated request to the fragments API server and log the result

   await getUserFragments(user);
   
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    postRequestBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);