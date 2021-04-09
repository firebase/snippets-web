// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function initialize() {
  // [START storage_initialize]
  const { initializeApp } = require("firebase/app");
  const { getStorage } = require("firebase/storage");

  // Set the configuration for your app
  // TODO: Replace with your app's config object
  const firebaseConfig = {
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    databaseURL: '<your-database-url>',
    storageBucket: '<your-storage-bucket-url>'
  };
  const firebaseApp = initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage(firebaseApp);
  // [END storage_initialize]
}

function multipleBuckets() {
  // [START storage_multiple_buckets]
  const { getApp } = require("firebase/app");
  const { getStorage } = require("firebase/storage");

  // Get a non-default Storage bucket
  const firebaseApp = getApp();
  const storage = getStorage(firebaseApp, "gs://my-custom-bucket");
  // [END storage_multiple_buckets]
}

function storageCustomApp() {
  const { initializeApp } = require("firebase/app");

  const customApp = initializeApp({
    // ... custom stuff
  });

  // [START storage_custom_app]
  const { getStorage } = require("firebase/storage");

  // Get the default bucket from a custom firebase.app.App
  const storage1 = getStorage(customApp);

  // Get a non-default bucket from a custom firebase.app.App
  const storage2 = getStorage(customApp, "gs://my-custom-bucket");
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

  /** @type {any} */
  const metadata = {
    'contentType': file.type
  };

  // [START storage_on_complete]
  const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

  const storage = getStorage();
  const imageRef = ref(storage, 'images/' + file.name);
  uploadBytesResumable(imageRef, file, metadata)
    .then((snapshot) => {
      console.log('Uploaded', snapshot.totalBytes, 'bytes.');
      console.log('File metadata:', snapshot.metadata);
      // Let's get a download URL for the file.
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('File available at', url);
        // ...
      });
    }).catch((error) => {
      console.error('Upload failed', error);
      // ...
    });
  // [END storage_on_complete]
}
