import firebase from "firebase/app";
import "firebase/storage";

function storageOnComplete() {
  // This variable is just put here to make the code sensible, in reality
  // this would be a File object from a file selection event in the browser.
  // See:
  // - https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
  // - https://developer.mozilla.org/en-US/docs/Web/API/File

  /** @type {File} **/
  const file;

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
