// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function getInstance() {
  // [START rc_get_instance]
  const { getRemoteConfig } = require("firebase/remote-config");

  const remoteConfig = getRemoteConfig();
  // [END rc_get_instance]

  return remoteConfig;
}

function setMinimumFetchTime() {
  const remoteConfig = getInstance();
  // [START rc_set_minimum_fetch_time]
  // The default and recommended production fetch interval for Remote Config is 12 hours
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
  const { use, Suspense } = require("react");
  const { fetchAndActivate, getValue } = require("firebase/remote-config");

  // Start the fetch once, at module scope, so every render reuses the same promise.
  const activation = fetchAndActivate(remoteConfig)
    .catch((err) => {
      // ...
    });

  function WelcomeMessage() {
    use(activation);
    const val = getValue(remoteConfig, "welcome_message");
    return <p>{val.asString()}</p>;
  }

  function App() {
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <WelcomeMessage />
      </Suspense>
    );
  }
  // [END rc_fetch_config_callback]
}
