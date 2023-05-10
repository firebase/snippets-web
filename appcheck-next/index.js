// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function initialize() {
  // [START appcheck_initialize]
  import { initializeApp } from 'firebase/app';
  import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

  const app = initializeApp({
    // Your firebase configuration object
  });

  // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
  // key is the counterpart to the secret key you set in the Firebase console.
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      'abcdefghijklmnopqrstuvwxy-1234567890abcd'
    ),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true,
  });
  // [END appcheck_initialize]
}

function customProvider() {
  // [START appcheck_custom_provider]
  import { CustomProvider } from 'firebase/app-check';

  const appCheckCustomProvider = new CustomProvider({
    getToken: () => {
      return new Promise((resolve, _reject) => {
        // TODO: Logic to exchange proof of authenticity for an App Check token and
        // expiration time.

        // [START_EXCLUDE]
        const tokenFromServer = 'abc1234';
        const expirationFromServer = 1234;
        // [END_EXCLUDE]

        const appCheckToken = {
          token: tokenFromServer,
          expireTimeMillis: expirationFromServer * 1000,
        };

        resolve(appCheckToken);
      });
    },
  });
  // [END appcheck_custom_provider]

  return appCheckCustomProvider;
}

function initializeCustomProvider() {
  const appCheckCustomProvider = customProvider();

  // [START appcheck_initialize_custom_provider]
  import { initializeApp } from 'firebase/app';
  import { initializeAppCheck } from 'firebase/app-check';

  const app = initializeApp({
    // Your firebase configuration object
  });

  const appCheck = initializeAppCheck(app, {
    provider: appCheckCustomProvider,

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true,
  });
  // [END appcheck_initialize_custom_provider]
}

function nonFirebase() {
  import { initializeApp } from 'firebase/app';
  const app = initializeApp({
    // Your firebase configuration object
  });
  const { ReCaptchaV3Provider } = import('firebase/app-check');
  const provider = new ReCaptchaV3Provider('');

  // [START appcheck_nonfirebase]
  const { initializeAppCheck, getToken } = import('firebase/app-check');

  const appCheck = initializeAppCheck(
    app,
    { provider: provider } // ReCaptchaV3Provider or CustomProvider
  );

  const callApiWithAppCheckExample = async () => {
    let appCheckTokenResponse;
    try {
      appCheckTokenResponse = await getToken(
        appCheck,
        /* forceRefresh= */ false
      );
    } catch (err) {
      // Handle any errors if the token was not retrieved.
      return;
    }

    // Include the App Check token with requests to your server.
    const apiResponse = await fetch(
      'https://yourbackend.example.com/yourApiEndpoint',
      {
        headers: {
          'X-Firebase-AppCheck': appCheckTokenResponse.token,
        },
      }
    );

    // Handle response from your backend.
  };
  // [END appcheck_nonfirebase]
}
