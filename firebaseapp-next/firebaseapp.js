// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function multpleFirebaseApps() {
    // [START firebase_options]
    const { initializeApp } = require("firebase/app");

    // The following fields are REQUIRED:
    //  - Project ID
    //  - App ID
    //  - API Key
    const secondaryAppConfig = {
        projectId: "<PROJECT_ID>",
        appId: "<APP_ID>",
        apiKey: "<API_KEY>",
        // databaseURL: "...",
        // storageBucket: "...",
    };
    // [END firebase_options]

    // [START firebase_secondary]
    // Initialize another app with a different config
    const secondaryApp = initializeApp(secondaryAppConfig, "secondary");
    // Access services, such as the Realtime Database
    // getDatabase(secondaryApp)
    // [END firebase_secondary]
}
