// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function onDisconnectSimple() {
  // [START rtdb_ondisconnect_simple]
  const { getDatabase, ref, onDisconnect } = require("firebase/database");

  const db = getDatabase();
  const presenceRef = ref(db, "disconnectmessage");
  // Write a string when this client loses connection
  onDisconnect(presenceRef).set("I disconnected!");
  // [END rtdb_ondisconnect_simple]
}

function onDisconnectCallback() {
  const { getDatabase, ref, onDisconnect } = require("firebase/database");

  const db = getDatabase();
  const presenceRef = ref(db, "disconnectmessage");

  // [START rtdb_ondisconnect_callback]
  onDisconnect(presenceRef).remove().catch((err) => {
    if (err) {
      console.error("could not establish onDisconnect event", err);
    }
  });
  // [END rtdb_ondisconnect_callback]
}

function onDisconnectCancel() {
  const { getDatabase, ref, onDisconnect } = require("firebase/database");

  const db = getDatabase();
  const presenceRef = ref(db, "disconnectmessage");

  // [START rtdb_ondisconnect_cancel]
  const onDisconnectRef = onDisconnect(presenceRef);
  onDisconnectRef.set("I disconnected");
  // some time later when we change our minds
  onDisconnectRef.cancel();
  // [END rtdb_ondisconnect_cancel]
}

function detectConnectionState() {
  // [START rtdb_detect_connection_state]
  const { useEffect, useState } = require("react");
  const { getDatabase, ref, onValue } = require("firebase/database");

  function ConnectionState() {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
      const db = getDatabase();
      const connectedRef = ref(db, ".info/connected");
      // onValue returns an unsubscribe function. Returning it from the effect
      // detaches the listener when the component unmounts.
      return onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          console.log("connected");
          setConnected(true);
        } else {
          console.log("not connected");
          setConnected(false);
        }
      });
    }, []);

    return <span>{connected ? "connected" : "not connected"}</span>;
  }
  // [END rtdb_detect_connection_state]
}

function setServerTimestamp() {
  // [START rtdb_set_server_timestamp]
  const { getDatabase, ref, onDisconnect, serverTimestamp } = require("firebase/database");

  const db = getDatabase();
  const userLastOnlineRef = ref(db, "users/joe/lastOnline");
  onDisconnect(userLastOnlineRef).set(serverTimestamp());
  // [END rtdb_set_server_timestamp]
}

function estimateClockSkew() {
  // [START rtdb_estimate_clock_skew]
  const { useEffect, useState } = require("react");
  const { getDatabase, ref, onValue } = require("firebase/database");

  function EstimatedServerTime() {
    const [estimatedServerTimeMs, setEstimatedServerTimeMs] = useState(null);

    useEffect(() => {
      const db = getDatabase();
      const offsetRef = ref(db, ".info/serverTimeOffset");
      // onValue returns an unsubscribe function. Returning it from the effect
      // detaches the listener when the component unmounts.
      return onValue(offsetRef, (snap) => {
        const offset = snap.val();
        const estimatedServerTimeMs = new Date().getTime() + offset;
        setEstimatedServerTimeMs(estimatedServerTimeMs);
      });
    }, []);

    return <span>{estimatedServerTimeMs}</span>;
  }
  // [END rtdb_estimate_clock_skew]
}

function samplePresenceApp() {
  // [START rtdb_sample_presence_app]
  const { useEffect } = require("react");
  const { getDatabase, ref, onValue, push, onDisconnect, set, serverTimestamp } = require("firebase/database");

  // Render <Presence /> once near the root of your app; it has no UI of its own.
  function Presence() {
    useEffect(() => {
      // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
      // any time that connectionsRef's value is null (i.e. has no children) I am offline
      const db = getDatabase();
      const myConnectionsRef = ref(db, 'users/joe/connections');

      // stores the timestamp of my last disconnect (the last time I was seen online)
      const lastOnlineRef = ref(db, 'users/joe/lastOnline');

      const connectedRef = ref(db, '.info/connected');
      // onValue returns an unsubscribe function. Returning it from the effect
      // detaches the listener when the component unmounts.
      return onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
          const con = push(myConnectionsRef);

          // When I disconnect, remove this device
          onDisconnect(con).remove();

          // Add this device to my connections list
          // this value could contain info about the device or a timestamp too
          set(con, true);

          // When I disconnect, update the last time I was seen online
          onDisconnect(lastOnlineRef).set(serverTimestamp());
        }
      });
    }, []);

    return null;
  }
  // [END rtdb_sample_presence_app]
}
