// This snippet file was generated by processing the source file:
// ./appcheck-next/index.js
//
// To make edits to the snippets in this file, please edit the source

// [START appcheck_initialize_modular]
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const app = initializeApp({
  // Your firebase configuration object
});

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('abcdefghijklmnopqrstuvwxy-1234567890abcd')
});
// [END appcheck_initialize_modular]