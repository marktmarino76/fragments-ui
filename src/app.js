// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, deleteFragments,postFragments,getUserFragmentsById,getUserFragmentsViaExpand,putFragments } from './api';
import { ConsoleLogger } from '@aws-amplify/core';
import { doc } from 'prettier';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postRequestBtn = document.querySelector('#postrequest');
  const putRequestBtn = document.querySelector('#putrequest');
  const deleteRequestBtn = document.querySelector('#deleterequest');
  const getExpandRequestBtn= document.querySelector('#getexpandrequest');
  const postDropDown= document.querySelector('#post-drop-down');
  const convertRequestBtn = document.querySelector('#convertrequest');
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
  

  let inputImage = document.querySelector('#post-image-body');
  let imageBuffer;
  inputImage.addEventListener('change',  async (event) => {
    const imageFile = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function() {
      const readResult = reader.result;
      const buffer = Buffer.from(new Uint8Array(readResult))
      imageBuffer = buffer;
    }
    reader.readAsArrayBuffer(imageFile);
  });
  postRequestBtn.onclick = async (e) => {
    e.preventDefault();
    //Sends post request to create a new fragment
    const postResult =  await postFragments(user,imageBuffer);
    //Console log the ID of the newly created fragment
    console.log("POST RESULT ID: " + postResult.fragment.id);
    const fragmentsData = await getUserFragments(user);
    const fragmentsDataList = fragmentsData.fragments;
    updateSelectBar(fragmentsDataList)
  };

  convertRequestBtn.onclick = async (e) => {
    e.preventDefault();
    //Sends post request to create a new fragment
    const convertResult =  await getUserFragmentsById(user);
    //Console log the ID of the newly created fragment
    console.log("CONVERT RESULT ID: " + convertResult);
    // const fragmentsData = await getUserFragments(user);
    // const fragmentsDataList = fragmentsData.fragments;
    // updateSelectBar(fragmentsDataList)
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
  // getExpandRequestBtn.onclick = async () => {
  //   await getUserFragmentsViaExpand(user);
  // };
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

  postDropDown.addEventListener('change',()=>{
    const fileUpload = document.querySelector("#post-image-body");
    const bodyTextBox = document.querySelector("#post-body");
    if(postDropDown.value.startsWith("image") ){
      fileUpload.hidden=false;
      bodyTextBox.hidden=true;
      }else{
        fileUpload.hidden=true;
        bodyTextBox.hidden=false;
      }
  })
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
  var selectListConvert = createSelectBar(fragmentsDataList)
  selectListConvert.id = "convertRequestId"
  
  // Populate select bar for delete request
  const deleteRequestElement = document.querySelector('#deleteRequestInput');
  deleteRequestElement.removeChild(deleteRequestElement.firstChild)
  deleteRequestElement.appendChild(selectListDelete)

  // Populate select bar for put request
  const putRequestElement = document.querySelector('#putRequestInput');
  putRequestElement.removeChild(putRequestElement.firstChild);
  putRequestElement.appendChild(selectListPut);

  
  const convertRequestElement = document.querySelector('#convertRequestInput');
  convertRequestElement.removeChild(convertRequestElement.firstChild);
  console.log(convertRequestElement);
  convertRequestElement.appendChild(selectListConvert);
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);