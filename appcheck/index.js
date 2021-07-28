import firebase from "firebase/app";
import "firebase/app-check";

function initialize() {
  // [START appcheck_initialize]
  firebase.initializeApp({
    // Your firebase configuration object
  });
  
  const appCheck = firebase.appCheck();
  // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
  // key is the counterpart to the secret key you set in the Firebase console.
  appCheck.activate(
    'abcdefghijklmnopqrstuvwxy-1234567890abcd',

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    true);
  // [END appcheck_initialize]
}

function customProvider() {
  // [START appcheck_custom_provider]
  const appCheckCustomProvider = {
    getToken: () => {
      return new Promise((resolve, _reject) => {
        // TODO: Logic to exchange proof of authenticity for an App Check token and
        // expiration time.

        // [START_EXCLUDE]
        const tokenFromServer = "abc1234";
        const expirationFromServer = 1234;
        // [END_EXCLUDE]
  
        const appCheckToken = {
          token: tokenFromServer,
          expireTimeMillis: expirationFromServer * 1000
        };
  
        resolve(appCheckToken);
      });
    }
  };
  // [END appcheck_custom_provider]

  return appCheckCustomProvider;
}

function initializeCustomProvider() {
  const appCheckCustomProvider = customProvider();

  // [START appcheck_initialize_custom_provider]
  firebase.initializeApp({
    // Your firebase configuration object
  });
  
  const appCheck = firebase.appCheck();
  appCheck.activate(
    appCheckCustomProvider,

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    true);
  // [END appcheck_initialize_custom_provider]
}

// [START appcheck_nonfirebase]
const callApiWithAppCheckExample = async () => {
  let appCheckTokenResponse;
  try {
      appCheckTokenResponse = await firebase.appCheck().getToken(/* forceRefresh= */ false);
  } catch (err) {
      // Handle any errors if the token was not retrieved.
      return;
  }

  // Include the App Check token with requests to your server.
  const apiResponse = await fetch('https://yourbackend.example.com/yourApiEndpoint', {
      headers: {
          'X-Firebase-AppCheck': appCheckTokenResponse.token,
      }
  });

  // Handle response from your backend.
};
// [END appcheck_nonfirebase]
