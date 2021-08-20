import firebase  from 'firebase/app';

function multpleFirebaseApps() {
    // [START firebase_options]
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
    const secondaryApp = firebase.initializeApp(secondaryAppConfig, "secondary");
    // Access services, such as the Realtime Database
    // secondaryApp.database();
    // [END firebase_secondary]
}

function defaultInitOptions() {
    const firebaseConfig = {
        // ...
    };

    // [START app_default_init_options]
    // Initialize Firebase with a "default" Firebase project
    const defaultProject = firebase.initializeApp(firebaseConfig);

    console.log(defaultProject.name);  // "[DEFAULT]"

    // Option 1: Access Firebase services via the defaultProject variable
    let defaultStorage = defaultProject.storage();
    let defaultFirestore = defaultProject.firestore();

    // Option 2: Access Firebase services using shorthand notation
    defaultStorage = firebase.storage();
    defaultFirestore = firebase.firestore();
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
    // Initialize Firebase with a default Firebase project
    firebase.initializeApp(firebaseConfig);

    // Initialize Firebase with a second Firebase project
    const otherProject = firebase.initializeApp(otherProjectFirebaseConfig, "other");

    console.log(firebase.app().name);  // "[DEFAULT]"
    console.log(otherProject.name);    // "otherProject"

    // Use the shorthand notation to access the default project's Firebase services
    const defaultStorage = firebase.storage();
    const defaultFirestore = firebase.firestore();

    // Use the otherProject variable to access the second project's Firebase services
    const otherStorage = otherProject.storage();
    const otherFirestore = otherProject.firestore();
    // [END app_multi_project_init_options]
}
