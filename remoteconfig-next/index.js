// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

function getInstance() {
  // [START rc_get_instance]
  const { getRemoteConfig } = require("firebase/remote-config");

  const remoteConfig = getRemoteConfig(firebaseApp);
  // [END rc_get_instance]

  return remoteConfig;
}

function setMinimumFetchTime() {
  const remoteConfig = getInstance();
  // [START rc_set_minimum_fetch_time]
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
  // [END rc_set_minimum_fetch_time]
}

function setDefaultValues() {
  const remoteConfig = getInstance();
  // [START rc_set_default_values]
  remoteConfig.defaultConfig = {
    "welcome_message": "Welcome"
  };
  // [END rc_set_default_values]
}

function getValues() {
  const remoteConfig = getInstance();
  // [START rc_get_values]
  const { getValue } = require("firebase/remote-config");

  const val = getValue(remoteConfig, "welcome_messsage");
  // [END rc_get_values]
}

function fetchConfigCallback() {
  const remoteConfig = getInstance();
  // [START rc_fetch_config_callback]
  const { fetchAndActivate } = require("firebase/remote-config");

  fetchAndActivate(remoteConfig)
    .then(() => {
      // ...
    })
    .catch((err) => {
      // ...
    });
  // [END rc_fetch_config_callback]
}
