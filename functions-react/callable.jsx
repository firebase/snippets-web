// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

export function initialize() {
  // [START fb_functions_initialize]
  const { initializeApp } = require("firebase/app");
  const { getFunctions } = require("firebase/functions");

  // Initialize Firebase once at module scope (e.g. src/firebase.js), not inside a component.
  initializeApp({
    // Your Firebase Web SDK configuration
    // [START_EXCLUDE]
    projectId: "<PROJECT_ID>",
    apiKey: "<API_KEY>",
    // [END_EXCLUDE]
  });

  const functions = getFunctions();
  // [END fb_functions_initialize]
}

export function callAddMessage() {
  // [START fb_functions_call_add_message]
  const { useActionState } = require("react");
  const { getFunctions, httpsCallable } = require("firebase/functions");

  function AddMessageForm() {
    const [sanitizedMessage, callAddMessage, isPending] = useActionState(async (previousMessage, formData) => {
      const functions = getFunctions();
      const addMessage = httpsCallable(functions, 'addMessage');
      const result = await addMessage({ text: formData.get("messageText") });
      // Read result of the Cloud Function.
      /** @type {any} */
      const data = result.data;
      const sanitizedMessage = data.text;
      return sanitizedMessage;
    }, null);

    return (
      <form action={callAddMessage}>
        <input name="messageText" />
        <button type="submit" disabled={isPending}>Send</button>
        {sanitizedMessage ? <p>{sanitizedMessage}</p> : null}
      </form>
    );
  }
  // [END fb_functions_call_add_message]
}

export function callAddMessageError() {
  // [START fb_functions_call_add_message_error]
  const { useActionState } = require("react");
  const { getFunctions, httpsCallable } = require("firebase/functions");

  function AddMessageForm() {
    const [error, callAddMessage, isPending] = useActionState(async (previousError, formData) => {
      const functions = getFunctions();
      const addMessage = httpsCallable(functions, 'addMessage');
      try {
        const result = await addMessage({ text: formData.get("messageText") });
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        const sanitizedMessage = data.text;
        return null;
      } catch (error) {
        // Getting the Error details.
        const code = error.code;
        const message = error.message;
        const details = error.details;
        // ...
        return message;
      }
    }, null);

    return (
      <form action={callAddMessage}>
        <input name="messageText" />
        <button type="submit" disabled={isPending}>Send</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END fb_functions_call_add_message_error]
}
