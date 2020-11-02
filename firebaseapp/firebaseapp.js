import firebase  from 'firebase/app';

function multpleFirebaseApps() {
    // [START firebase_options]
    // The following fields are REQUIRED:
    //  - Project ID
    //  - App ID
    //  - API Key
    var secondaryAppConfig = {
        projectId: "<PROJECT_ID>",
        appId: "<APP_ID>",
        apiKey: "<API_KEY>",
        // databaseURL: "...",
        // storageBucket: "...",
    };
    // [END firebase_options]

    // [START firebase_secondary]
    // Initialize another app with a different config
    var secondaryApp = firebase.initializeApp(secondaryAppConfig, "secondary");
    // Access services, such as the Realtime Database
    // secondaryApp.database();
    // [END firebase_secondary]
}
