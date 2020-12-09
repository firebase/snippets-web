import firebase from "firebase";
import "firebase/remote-config";

function getInstance() {
  // [START rc_get_instance]
  const remoteConfig = firebase.remoteConfig();
  // [END rc_get_instance]
}

function setMinimumFetchTime() {
  const remoteConfig = firebase.remoteConfig();
  // [START rc_set_minimum_fetch_time]
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
  // [END rc_set_minimum_fetch_time]
}

function setDefaultValues() {
  const remoteConfig = firebase.remoteConfig();
  // [START rc_set_default_values]
  remoteConfig.defaultConfig = {
    "welcome_message": "Welcome"
  };
  // [END rc_set_default_values]
}

function getValues() {
  const remoteConfig = firebase.remoteConfig();
  // [START rc_get_values]
  const val = remoteConfig.getValue("welcome_messsage");
  // [END rc_get_values]
}

function fetchConfigCallback() {
  const remoteConfig = firebase.remoteConfig();
  // [START rc_fetch_config_callback]
  remoteConfig.fetchAndActivate()
    .then(() => {
      // ...
    })
    .catch((err) => {
      // ...
    });
  // [END rc_fetch_config_callback]
}
