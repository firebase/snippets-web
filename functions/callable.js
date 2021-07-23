// [START fb_functions_imports]
import firebase from "firebase/app";
import "firebase/functions";
// [END fb_functions_imports]

function initialize() {
  // [START fb_functions_initialize]
  firebase.initializeApp({
    // Your Firebase Web SDK configuration
    // [START_EXCLUDE]
    projectId: "<PROJECT_ID>",
    apiKey: "<API_KEY>",
    // [END_EXCLUDE]
  });

  const functions = firebase.functions();
  // [END fb_functions_initialize]
}

function callAddMessage() {
  const messageText = "Hello, World!";

  // [START fb_functions_call_add_message]
  var addMessage = firebase.functions().httpsCallable('addMessage');
  addMessage({ text: messageText })
    .then((result) => {
      // Read result of the Cloud Function.
      var sanitizedMessage = result.data.text;
    });
  // [END fb_functions_call_add_message]
}

function callAddMessageError() {
  const messageText = "Hello, World!";

  // [START fb_functions_call_add_message_error]
  var addMessage = firebase.functions().httpsCallable('addMessage');
  addMessage({ text: messageText })
    .then((result) => {
      // Read result of the Cloud Function.
      var sanitizedMessage = result.data.text;
    })
    .catch((error) => {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      // ...
    });
  // [END fb_functions_call_add_message_error]
}
