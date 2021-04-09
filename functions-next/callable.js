// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

export function callAddMessage() {
  const messageText = "Hello, World!";

  // [START fb_functions_call_add_message]
  const { getFunctions, httpsCallable } = require("firebase/functions");

  const functions = getFunctions();
  const addMessage = httpsCallable(functions, 'addMessage');
  addMessage({ text: messageText })
    .then((result) => {
      // Read result of the Cloud Function.
      /** @type {any} */
      const data = result.data;
      const sanitizedMessage = data.text;
    });
  // [END fb_functions_call_add_message]
}

export function callAddMessageError(firebaseApp) {
  const messageText = "Hello, World!";

  // [START fb_functions_call_add_message_error]
  const { getFunctions, httpsCallable } = require("firebase/functions");

  const functions = getFunctions();
  const addMessage = httpsCallable(functions, 'addMessage');
  addMessage({ text: messageText })
    .then((result) => {
      // Read result of the Cloud Function.
      /** @type {any} */
      const data = result.data;
      const sanitizedMessage = data.text;
    })
    .catch((error) => {
      // Getting the Error details.
      const code = error.code;
      const message = error.message;
      const details = error.details;
      // ...
    });
  // [END fb_functions_call_add_message_error]
}
