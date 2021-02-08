import firebase from "firebase/app";
import "firebase/storage";

function uploadRef() {
  // [START storage_upload_ref]
  // Create a root reference
  var storageRef = firebase.storage().ref();

  // Create a reference to 'mountains.jpg'
  var mountainsRef = storageRef.child('mountains.jpg');

  // Create a reference to 'images/mountains.jpg'
  var mountainImagesRef = storageRef.child('images/mountains.jpg');

  // While the file names are the same, the references point to different files
  mountainsRef.name === mountainImagesRef.name;           // true
  mountainsRef.fullPath === mountainImagesRef.fullPath;   // false 
  // [END storage_upload_ref]
}

/**
 * @param {File} file 
 */
function uploadBlob(file) {
  const ref = firebase.storage().ref().child('some-child');

  // [START storage_upload_blob]
  // 'file' comes from the Blob or File API
  ref.put(file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
  // [END storage_upload_blob]
}

function uploadBytes() {
  const ref = firebase.storage().ref().child('some-child');

  // [START storage_upload_bytes]
  var bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
  ref.put(bytes).then((snapshot) => {
    console.log('Uploaded an array!');
  });
  // [END storage_upload_bytes]
}

function uploadString() {
  const ref = firebase.storage().ref().child('some-child');

  // [START storage_upload_string]
  // Raw string is the default if no format is provided
  var message = 'This is my message.';
  ref.putString(message).then((snapshot) => {
    console.log('Uploaded a raw string!');
  });

  // Base64 formatted string
  var message = '5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
  ref.putString(message, 'base64').then((snapshot) => {
    console.log('Uploaded a base64 string!');
  });

  // Base64url formatted string
  var message = '5b6p5Y-344GX44G-44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
  ref.putString(message, 'base64url').then((snapshot) => {
    console.log('Uploaded a base64url string!');
  });

  // Data URL string
  var message = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
  ref.putString(message, 'data_url').then((snapshot) => {
    console.log('Uploaded a data_url string!');
  });
  // [END storage_upload_string]
}

/**
 * @param {File} file 
 */
function uploadMetadata(file) {
  const storageRef = firebase.storage().ref();

  // [START storage_upload_metadata]
  // Create file metadata including the content type
  var metadata = {
    contentType: 'image/jpeg',
  };

  // Upload the file and metadata
  var uploadTask = storageRef.child('images/mountains.jpg').put(file, metadata);
  // [END storage_upload_metadata]
}

/**
 * @param {File} file
 */
function manageUploads(file) {
  const storageRef = firebase.storage().ref();

  // [START storage_manage_uploads]
  // Upload the file and metadata
  var uploadTask = storageRef.child('images/mountains.jpg').put(file);

  // Pause the upload
  uploadTask.pause();

  // Resume the upload
  uploadTask.resume();

  // Cancel the upload
  uploadTask.cancel();
  // [END storage_manage_uploads]
}

/**
 * @param {File} file 
 */
function monitorUpload(file) {
  const storageRef = firebase.storage().ref();

  // [START storage_monitor_upload]
  var uploadTask = storageRef.child('images/rivers.jpg').put(file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', 
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // Handle unsuccessful uploads
    }, 
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
      });
    }
  );
  // [END storage_monitor_upload]
}

/**
 * @param {File} file 
 */
function uploadHandleError(file) {
  const storageRef = firebase.storage().ref();

  // [START storage_upload_handle_error]
  // Create the file metadata
  var metadata = {
    contentType: 'image/jpeg'
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
      });
    }
  );
  // [END storage_upload_handle_error]
}
