// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

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
  const { useEffect, useState } = require("react");
  const { getMessaging, onMessage } = require("firebase/messaging");

  function LastMessage() {
    const [payload, setPayload] = useState(null);

    useEffect(() => {
      const messaging = getMessaging();
      // onMessage returns an unsubscribe function. Returning it from the effect
      // detaches the listener when the component unmounts.
      return onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // ...
        setPayload(payload);
      });
    }, []);

    return payload ? <pre>{JSON.stringify(payload)}</pre> : null;
  }
  // [END messaging_receive_message]
}

function getToken() {
  // [START messaging_get_token]
  const { useEffect, useState } = require("react");
  const { getMessaging, getToken } = require("firebase/messaging");

  function RegistrationToken() {
    const [currentToken, setCurrentToken] = useState(null);

    useEffect(() => {
      // Get registration token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      const messaging = getMessaging();
      getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
          setCurrentToken(currentToken);
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
    }, []);

    return <span>{currentToken}</span>;
  }
  // [END messaging_get_token]
}

function register() {
  // [START messaging_register]
  const { useEffect, useState } = require("react");
  const { getMessaging, onRegistered, register } = require("firebase/messaging");

  function InstallationId() {
    const [installationId, setInstallationId] = useState(null);

    useEffect(() => {
      const messaging = getMessaging();

      // 1. Implement callback to receive the Firebase installation ID upon registration.
      // This is triggered every time a manual register() finishes, a FID change
      // is detected, or a pushsubscriptionchange event is fired.
      const unsubscribe = onRegistered(messaging, (installationId) => {
        console.log('Registered installation ID:', installationId);

        // Send the Firebase Installation ID to your app server and update the UI if needed.
        sendRegistrationToServer(installationId);
        setInstallationId(installationId);
      });

      // 2. You can also manually trigger registration (recommended on app startup)
      register(messaging, {
        vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>'
      }).then(() => {
        // Success! The Firebase Installation ID can be used to target messages to this app
        // instance and will be delivered asynchronously to your onRegistered() callback.
      }).catch((err) => {
        console.error('An error occurred while registering', err);
      });

      // onRegistered returns an unsubscribe function. Returning it from the effect
      // detaches the listener when the component unmounts.
      return unsubscribe;
    }, []);

    return <span>{installationId}</span>;
  }
  // [END messaging_register]
}

function requestPermission() {
  // [START messaging_request_permission]
  function NotificationPermissionButton() {
    async function requestPermission() {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve a registration token for use with FCM.
        // ...
      } else {
        console.log('Unable to get permission to notify.');
      }
    }

    return <button onClick={requestPermission}>Enable notifications</button>;
  }
  // [END messaging_request_permission]
}

function deleteToken() {
  // [START messaging_delete_token]
  const { getMessaging, deleteToken } = require("firebase/messaging");

  function DeleteTokenButton() {
    async function deleteRegistrationToken() {
      const messaging = getMessaging();
      try {
        await deleteToken(messaging);
        console.log('Token deleted.');
        // ...
      } catch (err) {
        console.log('Unable to delete token. ', err);
      }
    }

    return <button onClick={deleteRegistrationToken}>Delete token</button>;
  }
  // [END messaging_delete_token]
}

function sendRegistrationToServer(installationId) {
    // This function is used in a snippet to indicate that the Firebase Installation ID should be sent to the app server.
    // TODO(developer): Implement this function to send the registration ID to your app's server.
}
