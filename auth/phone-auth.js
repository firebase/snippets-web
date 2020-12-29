// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

// Mask the global 'window' for this snippet file
const window = {
  recaptchaVerifier: undefined
};

function recaptchaVerifierInvisible() {
  function onSignInSubmit() {
    // TODO(you): Implement
  }

  // [START auth_phone_recaptcha_verifier_invisible]
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
    }
  });
  // [END auth_phone_recaptcha_verifier_invisible]
}

function recaptchaVerifierVisible() {
  // [START auth_phone_recaptcha_verifier_visible]
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'normal',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      // ...
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      // ...
    }
  });
  // [END auth_phone_recaptcha_verifier_visible]
}

function recaptchaVerifierSimple() {
  // [START auth_phone_recaptcha_verifier_simple]
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  // [END auth_phone_recaptcha_verifier_simple]
}

function recaptchaRender() {
  /** @type {firebase.auth.RecaptchaVerifier} */
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
  const phoneNumber = getPhoneNumberFromUserInput();
  const appVerifier = window.recaptchaVerifier;
  firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
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

  /** @type {firebase.auth.ConfirmationResult} */
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
