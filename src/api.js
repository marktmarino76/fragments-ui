// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  console.log("HELLO THERE");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    console.log("HELLO THERE 1");
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    console.log("HELLO THERE 2");
    const data = await res.json();
    console.log("HELLO THERE 3");
    console.log('Got user fragments data', data.fragments );
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function getUserFragmentsById(user,id) {
  console.log('Requesting user fragments data BY ID');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
     console.log(data);
  } catch (err) {
    console.error('Unable to call GET /v1/fragment/:id', { err });
  }
}

export async function postFragments(user) {
  console.log('Posting user fragments data...');
 
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
       headers: user.authorizationHeaders('text/plain'),
       method: 'POST',
       body: 'gurt',
      cache: 'no-cache'
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data;
    console.log('Got user fragments data for post request', { data });
  } catch (err) {
    console.error('Unable to call POST/v1/fragment', { err });
  }
}