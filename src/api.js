// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL;
// || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  
  console.log('GET list of user fragments data... UI');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('GET list of user fragments data... UI', data.fragments );
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function getUserFragmentsById(user,id) {
  console.log('Get specifc user /v1/fragments/:id data BY ID... in UI');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders('text/plain'),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("DATA FROM GET USER FRAGMENT BY ID");
    console.log(data);
  } catch (err) {
    console.error('Unable to call GET /v1/fragment/:id', { err });
  }
}

export async function postFragments(user) {
  console.log('Posting user fragments data... TO UI');
 
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
       headers: user.authorizationHeaders('text/plain'),
       method: 'POST',
       body: 'This is a fragment',
       cache: 'no-cache'
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('POST: - user fragments data for post request in FRAGMENTS-UI', { data });
    return data;
    
  } catch (err) {
    console.error('Unable to call POST/v1/fragment', { err });
  }
}

export async function getUserFragmentsViaExpand(user) {
  console.log('GET/ expand user fragments data... TO UI');
 
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
       headers: user.authorizationHeaders('text/plain'),
       method: 'GET',
       cache: 'no-cache'
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('GET EXPAND: FRONT END', { data });
    return data;
    
  } catch (err) {
    console.error('Unable to call GET/v1/fragment/expand', { err });
  }
}