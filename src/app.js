// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, deleteFragments,postFragments,getUserFragmentsById,getUserFragmentsViaExpand,putFragments } from './api';
import { ConsoleLogger } from '@aws-amplify/core';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postRequestBtn = document.querySelector('#postrequest');
  const putRequestBtn = document.querySelector('#putrequest');
  const deleteRequestBtn = document.querySelector('#deleterequest');
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

    const fragmentsData = await getUserFragments(user);
    const fragmentsDataList = fragmentsData.fragments;

    updateSelectBar(fragmentsDataList)
  };
  putRequestBtn.onclick = async ()=>{
    const putResult =  await putFragments(user);
  };
  deleteRequestBtn.onclick = async () => {
    try { 
      await deleteFragments(user);

      // update select bar after every successful delete
      const fragmentsData = await getUserFragments(user);
      const fragmentsDataList = fragmentsData.fragments;

      updateSelectBar(fragmentsDataList)

    } catch(err) {
      console.log(err)
    }
  }
  getExpandRequestBtn.onclick = async () => {
    await getUserFragmentsViaExpand(user);
  };
  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
   // Do an authenticated request to the fragments API server and log the result
   
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

  const fragmentsData = await getUserFragments(user);
  const fragmentsDataList = fragmentsData.fragments;
  console.log("fragments data")
  console.log(fragmentsDataList)

  updateSelectBar(fragmentsDataList)

  

  

  // Populate select bar for put request

  
  
}

function createSelectBar(fragmentsDataList) {
  var selectList = document.createElement("select");

  //Create and append the options
  for (var i = 0; i < fragmentsDataList.length; i++) {
    var option = document.createElement("option");
    option.value = fragmentsDataList[i];
    option.text = fragmentsDataList[i];
    selectList.appendChild(option);
  }
  return selectList
}

function updateSelectBar(fragmentsDataList) {
  var selectListDelete = createSelectBar(fragmentsDataList)
  selectListDelete.id = "deleteRequestId"
  var selectListPut = createSelectBar(fragmentsDataList)
  selectListPut.id = "putRequestId"
  
  // Populate select bar for delete request
  const deleteRequestElement = document.querySelector('#deleteRequestInput');
  deleteRequestElement.removeChild(deleteRequestElement.firstChild)
  console.log(deleteRequestElement)
  deleteRequestElement.appendChild(selectListDelete)

  // Populate select bar for put request
  const putRequestElement = document.querySelector('#putRequestInput');
  putRequestElement.removeChild(putRequestElement.firstChild)
  console.log(putRequestElement)
  putRequestElement.appendChild(selectListPut)
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);