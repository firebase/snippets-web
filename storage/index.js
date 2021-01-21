import firebase from "firebase/app";
import "firebase/storage";

function initialize() {
  // [START storage_initialize]
  // Set the configuration for your app
  // TODO: Replace with your app's config object
  var firebaseConfig = {
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    databaseURL: '<your-database-url>',
    storageBucket: '<your-storage-bucket-url>'
  };
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = firebase.storage();
  // [END storage_initialize]
}

function multipleBuckets() {
  // [START storage_multiple_buckets]
  // Get a non-default Storage bucket
  var storage = firebase.app().storage("gs://my-custom-bucket");
  // [END storage_multiple_buckets]
}

function storageCustomApp() {
  const customApp = firebase.initializeApp({
    // ... custom stuff
  });

  // [START storage_custom_app]
  // Get the default bucket from a custom firebase.app.App
  var storage = customApp.storage();

  // Get a non-default bucket from a custom firebase.app.App
  var storage = customApp.storage("gs://my-custom-bucket");
  // [END storage_custom_app]
}

/**
 * @param {File} file 
 */
function storageOnComplete(file) {
  // The file param would be a File object from a file selection event in the browser.
  // See:
  // - https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
  // - https://developer.mozilla.org/en-US/docs/Web/API/File

  const metadata = {
    'contentType': file.type
  };

  // [START storage_on_complete]
  const storageRef = firebase.storage().ref();
  storageRef.child('images/' + file.name).put(file, metadata)
    .then((snapshot) => {
      console.log('Uploaded', snapshot.totalBytes, 'bytes.');
      console.log('File metadata:', snapshot.metadata);
      // Let's get a download URL for the file.
      snapshot.ref.getDownloadURL().then((url) => {
        console.log('File available at', url);
        // ...
      });
    }).catch((error) => {
      console.error('Upload failed', error);
      // ...
    });
  // [END storage_on_complete]
}
