// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

// Mask the global 'window' for this snippet file
const window = {
  recaptchaVerifier: undefined
};

function recaptchaVerifierInvisible() {
  function onSignInSubmit() {
    // TODO(you): Implement
  }

  // [START auth_phone_recaptcha_verifier_invisible]
  const { getAuth, RecaptchaVerifier } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
    }
  }, auth);
  // [END auth_phone_recaptcha_verifier_invisible]
}

function recaptchaVerifierVisible() {
  // [START auth_phone_recaptcha_verifier_visible]
  const { getAuth, RecaptchaVerifier } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'normal',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      // ...
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      // ...
    }
  }, auth);
  // [END auth_phone_recaptcha_verifier_visible]
}

function recaptchaVerifierSimple() {
  // [START auth_phone_recaptcha_verifier_simple]
  const { getAuth, RecaptchaVerifier } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
  // [END auth_phone_recaptcha_verifier_simple]
}

function recaptchaRender() {
  const { RecaptchaVerifier } = require("firebase/auth");

  /** @type {RecaptchaVerifier} */
  const recaptchaVerifier = window.recaptchaVerifier;

  // [START auth_phone_recaptcha_render]
  recaptchaVerifier.render().then((widgetId) => {
    window.recaptchaWidgetId = widgetId;
  });
  // [END auth_phone_recaptcha_render]
}

function phoneSignIn() {
  function getPhoneNumberFromUserInput() {
    return "+15558675309";
  }

  // [START auth_phone_signin]
  const { getAuth, signInWithPhoneNumber } = require("firebase/auth");

  const phoneNumber = getPhoneNumberFromUserInput();
  const appVerifier = window.recaptchaVerifier;

  const auth = getAuth(firebaseApp);
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      }).catch((error) => {
        // Error; SMS not sent
        // ...
      });
  // [END auth_phone_signin]
}

function verifyCode() {
  function getCodeFromUserInput() {
    return "1234";
  }

  // TODO(samstern): Import ConfirmationResult type
  /** @type {*} */
  const confirmationResult = undefined;

  // [START auth_phone_verify_code]
  const code = getCodeFromUserInput();
  confirmationResult.confirm(code).then((result) => {
    // User signed in successfully.
    const user = result.user;
    // ...
  }).catch((error) => {
    // User couldn't sign in (bad verification code?)
    // ...
  });
  // [END auth_phone_verify_code]
}

function getRecaptchaResponse() {
  const recaptchaWidgetId = "...";
  const grecaptcha = {};

  // [START auth_get_recaptcha_response]
  const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);
  // [END auth_get_recaptcha_response]
}

