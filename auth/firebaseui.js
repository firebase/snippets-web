// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

import * as firebaseui from "firebaseui"

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/firebaseui.md

function fuiInit() {
  // [START auth_fui_init]
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // [END auth_fui_init]

  return ui;
}

function fuiStartEmail() {
  var ui = fuiInit();
  // [START auth_fui_start_email]
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Other config options...
  });
  // [END auth_fui_start_email]
}

function fuiStartEmailOptions() {
  var ui = fuiInit();
  // [START auth_fui_start_email_options]
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
      }
    ]
  });
  // [END auth_fui_start_email_options]
}

function fuiStartEmailLink() {
  var ui = fuiInit();
  // [START auth_fui_start_email_link]
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
      }
    ],
    // Other config options...
  });
  // [END auth_fui_start_email_link]
}

function fuiEmailLinkResult(uiConfig) {
  var ui = fuiInit();
  // [START auth_fui_email_link_result]
  // Is there an email link sign-in?
  if (ui.isPendingRedirect()) {
    ui.start('#firebaseui-auth-container', uiConfig);
  }
  // This can also be done via:
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    ui.start('#firebaseui-auth-container', uiConfig);
  }
  // [END auth_fui_email_link_result]
}

function fuiStartEmailLinkOptions() {
  var ui = fuiInit();
  // [START auth_fui_start_email_link_options]
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        // Allow the user the ability to complete sign-in cross device,
        // including the mobile apps specified in the ActionCodeSettings
        // object below.
        forceSameDevice: false,
        // Used to define the optional firebase.auth.ActionCodeSettings if
        // additional state needs to be passed along request and whether to open
        // the link in a mobile app if it is installed.
        emailLinkSignIn: () => {
          return {
            // Additional state showPromo=1234 can be retrieved from URL on
            // sign-in completion in signInSuccess callback by checking
            // window.location.href.
            url: 'https://www.example.com/completeSignIn?showPromo=1234',
            // Custom FDL domain.
            dynamicLinkDomain: 'example.page.link',
            // Always true for email link sign-in.
            handleCodeInApp: true,
            // Whether to handle link in iOS app if installed.
            iOS: {
              bundleId: 'com.example.ios'
            },
            // Whether to handle link in Android app if opened in an Android
            // device.
            android: {
              packageName: 'com.example.android',
              installApp: true,
              minimumVersion: '12'
            }
          };
        }
      }
    ]
  });
  // [END auth_fui_start_email_link_options]
}

function fuiStartOauth() {
  var ui = fuiInit();
  // [START auth_fui_start_oauth]
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      // List of OAuth providers supported.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    // Other config options...
  });  
  // [END auth_fui_start_oauth]
}

function fuiStartOauthOptions() {
  var ui = fuiInit();
  // [START auth_fui_start_oauth_options]
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        scopes: [
          'https://www.googleapis.com/auth/contacts.readonly'
        ],
        customParameters: {
          // Forces account selection even when one account
          // is available.
          prompt: 'select_account'
        }
      },
      {
        provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        scopes: [
          'public_profile',
          'email',
          'user_likes',
          'user_friends'
        ],
        customParameters: {
          // Forces password re-entry.
          auth_type: 'reauthenticate'
        }
      },
      firebase.auth.TwitterAuthProvider.PROVIDER_ID, // Twitter does not support scopes.
      firebase.auth.EmailAuthProvider.PROVIDER_ID // Other providers don't need to be given as object.
    ]
  });
  // [END auth_fui_start_oauth_options]
}

function fuiStartPhone() {
  var ui = fuiInit();
  // [START auth_fui_start_phone]
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Other config options...
  });
  // [END auth_fui_start_phone]
}

function fuiStartPhoneOptions() {
  var ui = fuiInit();
  // [START auth_fui_start_phone_options]
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image', // 'audio'
          size: 'normal', // 'invisible' or 'compact'
          badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
        },
        defaultCountry: 'GB', // Set default country to the United Kingdom (+44).
        // For prefilling the national number, set defaultNationNumber.
        // This will only be observed if only phone Auth provider is used since
        // for multiple providers, the NASCAR screen will always render first
        // with a 'sign in with phone number' button.
        defaultNationalNumber: '1234567890',
        // You can also pass the full phone number string instead of the
        // 'defaultCountry' and 'defaultNationalNumber'. However, in this case,
        // the first country ID that matches the country code will be used to
        // populate the country selector. So for countries that share the same
        // country code, the selected country may not be the expected one.
        // In that case, pass the 'defaultCountry' instead to ensure the exact
        // country is selected. The 'defaultCountry' and 'defaultNationaNumber'
        // will always have higher priority than 'loginHint' which will be ignored
        // in their favor. In this case, the default country will be 'GB' even
        // though 'loginHint' specified the country code as '+1'.
        loginHint: '+11234567890'
      }
    ]
  });
  // [END auth_fui_start_phone_options]
}

function fuiConfig() {
  // [START auth_fui_config]
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };
  // [END auth_fui_config]
}

function fuiConfigStart(uiConfig) {
  var ui = fuiInit();
  // [START auth_fui_config_start]
  ui.start('#firebaseui-auth-container', uiConfig);
  // [END auth_fui_config_start]
}

function fuiHandleAnonymous() {
  var ui = fuiInit();
  // [START auth_fui_handle_anonymous]
  // Temp variable to hold the anonymous user data if needed.
  var data = null;
  // Hold a reference to the anonymous current user.
  var anonymousUser = firebase.auth().currentUser;
  ui.start('#firebaseui-auth-container', {
    // Whether to upgrade anonymous users should be explicitly provided.
    // The user must already be signed in anonymously before FirebaseUI is
    // rendered.
    autoUpgradeAnonymousUsers: true,
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // signInFailure callback must be provided to handle merge conflicts which
      // occur when an existing credential is linked to an anonymous user.
      signInFailure: (error) => {
        // For merge conflicts, the error.code will be
        // 'firebaseui/anonymous-upgrade-merge-conflict'.
        if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
          return Promise.resolve();
        }
        // The credential the user tried to sign in with.
        var cred = error.credential;
        // Copy data from anonymous user to permanent user and delete anonymous
        // user.
        // ...
        // Finish sign-in after data is copied.
        return firebase.auth().signInWithCredential(cred).then(() => {
          return;
        });
      }
    }
  });
  // [END auth_fui_handle_anonymous]
}
