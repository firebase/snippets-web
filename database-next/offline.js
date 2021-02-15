// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

function onDisconnectSimple() {
  // [START rtdb_ondisconnect_simple]
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const presenceRef = db.ref("disconnectmessage");
  // Write a string when this client loses connection
  presenceRef.onDisconnect().set("I disconnected!");
  // [END rtdb_ondisconnect_simple]
}

function onDisconnectCallback() {
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const presenceRef = db.ref("disconnectmessage");

  // [START rtdb_ondisconnect_callback]
  presenceRef.onDisconnect().remove((err) => {
    if (err) {
      console.error("could not establish onDisconnect event", err);
    }
  });
  // [END rtdb_ondisconnect_callback]
}

function onDisconnectCancel() {
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const presenceRef = db.ref("disconnectmessage");

  // [START rtdb_ondisconnect_cancel]
  const onDisconnectRef = presenceRef.onDisconnect();
  onDisconnectRef.set("I disconnected");
  // some time later when we change our minds
  onDisconnectRef.cancel();
  // [END rtdb_ondisconnect_cancel]
}

function detectConnectionState() {
  // [START rtdb_detect_connection_state]
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const connectedRef = db.ref(".info/connected");
  connectedRef.on("value", (snap) => {
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
  const { getDatabase, ServerValue } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const userLastOnlineRef = db.ref("users/joe/lastOnline");
  userLastOnlineRef.onDisconnect().set(ServerValue.TIMESTAMP);
  // [END rtdb_set_server_timestamp]
}

function estimateClockSkew() {
  // [START rtdb_estimate_clock_skew]
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const offsetRef = db.ref(".info/serverTimeOffset");
  offsetRef.on("value", (snap) => {
    const offset = snap.val();
    const estimatedServerTimeMs = new Date().getTime() + offset;
  });
  // [END rtdb_estimate_clock_skew]
}

function samplePresenceApp() {
  // [START rtdb_sample_presence_app]
  const { getDatabase, ServerValue } = require("firebase/database");

  // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
  // any time that connectionsRef's value is null (i.e. has no children) I am offline
  const db = getDatabase(firebaseApp);
  const myConnectionsRef = db.ref('users/joe/connections');

  // stores the timestamp of my last disconnect (the last time I was seen online)
  const lastOnlineRef = db.ref('users/joe/lastOnline');

  const connectedRef = db.ref('.info/connected');
  connectedRef.on('value', (snap) => {
    if (snap.val() === true) {
      // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
      const con = myConnectionsRef.push();

      // When I disconnect, remove this device
      con.onDisconnect().remove();

      // Add this device to my connections list
      // this value could contain info about the device or a timestamp too
      con.set(true);

      // When I disconnect, update the last time I was seen online
      lastOnlineRef.onDisconnect().set(ServerValue.TIMESTAMP);
    }
  });
  // [END rtdb_sample_presence_app]
}
