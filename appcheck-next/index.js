// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function initialize() {
  // [START appcheck_initialize]
  const { initializeApp } = require("firebase/app");
  const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");

  const app = initializeApp({
    // Your firebase configuration object
  });
  
  // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
  // key is the counterpart to the secret key you set in the Firebase console.
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('abcdefghijklmnopqrstuvwxy-1234567890abcd')
  });
  // [END appcheck_initialize]
}

function customProvider() {
  // [START appcheck_custom_provider]
  const { CustomProvider } = require("firebase/app-check");
  
  const appCheckCustomProvider = new CustomProvider({
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
  });
  // [END appcheck_custom_provider]

  return appCheckCustomProvider;
}

function initializeCustomProvider() {
  const appCheckCustomProvider = customProvider();

  // [START appcheck_initialize_custom_provider]
  const { initializeApp } = require("firebase/app");
  const { initializeAppCheck } = require("firebase/app-check");

  const app = initializeApp({
    // Your firebase configuration object
  });
  
  const appCheck = initializeAppCheck(app, {
    provider: appCheckCustomProvider
  });
  // [END appcheck_initialize_custom_provider]
}
