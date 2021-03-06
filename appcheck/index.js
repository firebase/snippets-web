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
  appCheck.activate('abcdefghijklmnopqrstuvwxy-1234567890abcd');
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
  appCheck.activate(appCheckCustomProvider);
  // [END appcheck_initialize_custom_provider]
}
