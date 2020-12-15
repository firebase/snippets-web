// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

export function callAddMessage(firebaseApp) {
  const messageText = "Hello, World!";

  // [START functions_call_add_message]
  const { getFunctions, httpsCallable } = require("firebase/functions");

  const functions = getFunctions(firebaseApp);
  const addMessage = httpsCallable(functions, 'addMessage');
  addMessage({ text: messageText })
    .then((result) => {
      // Read result of the Cloud Function.
      const sanitizedMessage = result.data.text;
    });
  // [END functions_call_add_message]
}

export function callAddMessageError(firebaseApp) {
  const messageText = "Hello, World!";

  // [START functions_call_add_message_error]
  const { getFunctions, httpsCallable } = require("firebase/functions");

  const functions = getFunctions(firebaseApp);
  const addMessage = httpsCallable(functions, 'addMessage');
  addMessage({ text: messageText })
    .then((result) => {
      // Read result of the Cloud Function.
      const sanitizedMessage = result.data.text;
    })
    .catch((error) => {
      // Getting the Error details.
      const code = error.code;
      const message = error.message;
      const details = error.details;
      // ...
    });
  // [END functions_call_add_message_error]
}
