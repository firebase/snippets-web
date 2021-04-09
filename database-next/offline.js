// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

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
  const { getDatabase, ref, onValue } = require("firebase/database");

  const db = getDatabase();
  const connectedRef = ref(db, ".info/connected");
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      console.log("connected");
    } else {
      console.log("not connected");
    }
  });
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
  const { getDatabase, ref, onValue } = require("firebase/database");

  const db = getDatabase();
  const offsetRef = ref(db, ".info/serverTimeOffset");
  onValue(offsetRef, (snap) => {
    const offset = snap.val();
    const estimatedServerTimeMs = new Date().getTime() + offset;
  });
  // [END rtdb_estimate_clock_skew]
}

function samplePresenceApp() {
  // [START rtdb_sample_presence_app]
  const { getDatabase, ref, onValue, push, onDisconnect, set, serverTimestamp } = require("firebase/database");

  // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
  // any time that connectionsRef's value is null (i.e. has no children) I am offline
  const db = getDatabase();
  const myConnectionsRef = ref(db, 'users/joe/connections');

  // stores the timestamp of my last disconnect (the last time I was seen online)
  const lastOnlineRef = ref(db, 'users/joe/lastOnline');

  const connectedRef = ref(db, '.info/connected');
  onValue(connectedRef, (snap) => {
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
  // [END rtdb_sample_presence_app]
}
