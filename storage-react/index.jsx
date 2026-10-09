// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

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
  // Initialize Firebase once at module scope (e.g. src/firebase.js), not inside a component.
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

function storageOnComplete() {
  // [START storage_on_complete]
  const { useActionState } = require("react");
  const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

  function UploadForm() {
    const [error, uploadFile, isPending] = useActionState(async (previousError, formData) => {
      const file = formData.get("file");
      const metadata = {
        'contentType': file.type
      };

      const storage = getStorage();
      const imageRef = ref(storage, 'images/' + file.name);
      try {
        const snapshot = await uploadBytesResumable(imageRef, file, metadata);
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log('File metadata:', snapshot.metadata);
        // Let's get a download URL for the file.
        const url = await getDownloadURL(snapshot.ref);
        console.log('File available at', url);
        // ...
        return null;
      } catch (error) {
        console.error('Upload failed', error);
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={uploadFile}>
        <input name="file" type="file" />
        <button type="submit" disabled={isPending}>Upload</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END storage_on_complete]
}
