// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/database";

function onDisconnectSimple() {
  // [START rtdb_ondisconnect_simple]
  var presenceRef = firebase.database().ref("disconnectmessage");
  // Write a string when this client loses connection
  presenceRef.onDisconnect().set("I disconnected!");
  // [END rtdb_ondisconnect_simple]
}

function onDisconnectCallback() {
  var presenceRef = firebase.database().ref("disconnectmessage");

  // [START rtdb_ondisconnect_callback]
  presenceRef.onDisconnect().remove((err) => {
    if (err) {
      console.error("could not establish onDisconnect event", err);
    }
  });
  // [END rtdb_ondisconnect_callback]
}

function onDisconnectCancel() {
  var presenceRef = firebase.database().ref("disconnectmessage");

  // [START rtdb_ondisconnect_cancel]
  var onDisconnectRef = presenceRef.onDisconnect();
  onDisconnectRef.set("I disconnected");
  // some time later when we change our minds
  onDisconnectRef.cancel();
  // [END rtdb_ondisconnect_cancel]
}

function detectConnectionState() {
  // [START rtdb_detect_connection_state]
  var connectedRef = firebase.database().ref(".info/connected");
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
  var userLastOnlineRef = firebase.database().ref("users/joe/lastOnline");
  userLastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
  // [END rtdb_set_server_timestamp]
}

function estimateClockSkew() {
  // [START rtdb_estimate_clock_skew]
  var offsetRef = firebase.database().ref(".info/serverTimeOffset");
  offsetRef.on("value", (snap) => {
    var offset = snap.val();
    var estimatedServerTimeMs = new Date().getTime() + offset;
  });
  // [END rtdb_estimate_clock_skew]
}

function samplePresenceApp() {
  // [START rtdb_sample_presence_app]
  // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
  // any time that connectionsRef's value is null (i.e. has no children) I am offline
  var myConnectionsRef = firebase.database().ref('users/joe/connections');

  // stores the timestamp of my last disconnect (the last time I was seen online)
  var lastOnlineRef = firebase.database().ref('users/joe/lastOnline');

  var connectedRef = firebase.database().ref('.info/connected');
  connectedRef.on('value', (snap) => {
    if (snap.val() === true) {
      // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
      var con = myConnectionsRef.push();

      // When I disconnect, remove this device
      con.onDisconnect().remove();

      // Add this device to my connections list
      // this value could contain info about the device or a timestamp too
      con.set(true);

      // When I disconnect, update the last time I was seen online
      lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
    }
  });
  // [END rtdb_sample_presence_app]
}
