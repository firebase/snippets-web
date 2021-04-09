// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function getMessagingObject() {
  // [START messaging_get_messaging_object]
  const { getMessaging } = require("firebase/messaging");

  const messaging = getMessaging();
  // [END messaging_get_messaging_object]
}

function receiveMessage() {
  // [START messaging_receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.onBackgroundMessage` handler.
  const { getMessaging, onMessage } = require("firebase/messaging");

  const messaging = getMessaging();
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // ...
  });
  // [END messaging_receive_message]
}

function getToken() {
  // [START messaging_get_token]
  const { getMessaging, getToken } = require("firebase/messaging");

  // Get registration token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  const messaging = getMessaging();
  getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
  // [END messaging_get_token]
}

function requestPermission() {
  // [START messaging_request_permission]
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve a registration token for use with FCM.
      // ...
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
  // [END messaging_request_permission]
}

function deleteToken() {
  // [START messaging_delete_token]
  const { getMessaging, deleteToken } = require("firebase/messaging");

  const messaging = getMessaging();
  deleteToken(messaging).then(() => {
    console.log('Token deleted.');
    // ...
  }).catch((err) => {
    console.log('Unable to delete token. ', err);
  });
  // [END messaging_delete_token]
}
