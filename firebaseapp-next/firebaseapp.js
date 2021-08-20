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

function defaultInitOptions() {
    const firebaseConfig = {
        // ...
    };

    // [START app_default_init_options]
    const { initializeApp } = require("firebase/app");
    const { getStorage } = require("firebase/storage");
    const { getFirestore } = require("firebase/firestore");

    // Initialize Firebase with a "default" Firebase project
    const defaultProject = initializeApp(firebaseConfig);

    console.log(defaultProject.name);  // "[DEFAULT]"

    // Option 1: Access Firebase services via the defaultProject variable
    let defaultStorage = getStorage(defaultProject);
    let defaultFirestore = getFirestore(defaultProject);

    // Option 2: Access Firebase services using shorthand notation
    defaultStorage = getStorage();
    defaultFirestore = getFirestore();
    // [END app_default_init_options]
}

function multiProjectInitOptions() {
    const firebaseConfig = {
        // ...
    };

    const otherProjectFirebaseConfig = {
        // ...
    };

    // [START app_multi_project_init_options]
    const { initializeApp, getApp } = require("firebase/app");
    const { getStorage } = require("firebase/storage");
    const { getFirestore } = require("firebase/firestore");

    // Initialize Firebase with a default Firebase project
    initializeApp(firebaseConfig);

    // Initialize Firebase with a second Firebase project
    const otherProject = initializeApp(otherProjectFirebaseConfig, "other");

    console.log(getApp().name);  // "[DEFAULT]"
    console.log(otherProject.name);    // "otherProject"

    // Use the shorthand notation to access the default project's Firebase services
    const defaultStorage = getStorage();
    const defaultFirestore = getFirestore();

    // Use the otherProject variable to access the second project's Firebase services
    const otherStorage = getStorage(otherProject);
    const otherFirestore = getFirestore(otherProject);
    // [END app_multi_project_init_options]
}
