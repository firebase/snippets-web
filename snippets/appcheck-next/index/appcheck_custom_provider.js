// This snippet file was generated by processing the source file:
// ./appcheck-next/index.js
//
// To make edits to the snippets in this file, please edit the source

// [START appcheck_custom_provider_modular]
import { CustomProvider } from "firebase/app-check";

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
// [END appcheck_custom_provider_modular]