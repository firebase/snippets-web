// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function uploadRef() {
  // [START storage_upload_ref]
  const { getStorage, ref } = require("firebase/storage");

  // Create a root reference
  const storage = getStorage();

  // Create a reference to 'mountains.jpg'
  const mountainsRef = ref(storage, 'mountains.jpg');

  // Create a reference to 'images/mountains.jpg'
  const mountainImagesRef = ref(storage, 'images/mountains.jpg');

  // While the file names are the same, the references point to different files
  mountainsRef.name === mountainImagesRef.name;           // true
  mountainsRef.fullPath === mountainImagesRef.fullPath;   // false 
  // [END storage_upload_ref]
}

/**
 * @param {File} file 
 */
function uploadBlob(file) {
  // [START storage_upload_blob]
  const { getStorage, ref, uploadBytes } = require("firebase/storage");

  const storage = getStorage();
  const storageRef = ref(storage, 'some-child');

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
  // [END storage_upload_blob]
}

function uploadBytes() {
  // [START storage_upload_bytes]
  const { getStorage, ref, uploadBytes } = require("firebase/storage");

  const storage = getStorage();
  const storageRef = ref(storage, 'some-child');

  const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
  uploadBytes(storageRef, bytes).then((snapshot) => {
    console.log('Uploaded an array!');
  });
  // [END storage_upload_bytes]
}

function uploadString() {
  // [START storage_upload_string]
  const { getStorage, ref, uploadString } = require("firebase/storage");

  const storage = getStorage();
  const storageRef = ref(storage, 'some-child');

  // Raw string is the default if no format is provided
  const message = 'This is my message.';
  uploadString(storageRef, message).then((snapshot) => {
    console.log('Uploaded a raw string!');
  });

  // Base64 formatted string
  const message2 = '5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
  uploadString(storageRef, message2, 'base64').then((snapshot) => {
    console.log('Uploaded a base64 string!');
  });

  // Base64url formatted string
  const message3 = '5b6p5Y-344GX44G-44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
  uploadString(storageRef, message3, 'base64url').then((snapshot) => {
    console.log('Uploaded a base64url string!');
  });

  // Data URL string
  const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
  uploadString(storageRef, message4, 'data_url').then((snapshot) => {
    console.log('Uploaded a data_url string!');
  });
  // [END storage_upload_string]
}

/**
 * @param {File} file 
 */
function uploadMetadata(file) {
  // [START storage_upload_metadata]
  const { getStorage, ref, uploadBytes } = require("firebase/storage");

  const storage = getStorage();
  const storageRef = ref(storage, 'images/mountains.jpg');

  // Create file metadata including the content type
  /** @type {any} */
  const metadata = {
    contentType: 'image/jpeg',
  };

  // Upload the file and metadata
  const uploadTask = uploadBytes(storageRef, file, metadata);
  // [END storage_upload_metadata]
}

/**
 * @param {File} file
 */
function manageUploads(file) {
  // [START storage_manage_uploads]
  const { getStorage, ref, uploadBytesResumable } = require("firebase/storage");

  const storage = getStorage();
  const storageRef = ref(storage, 'images/mountains.jpg');

  // Upload the file and metadata
  const uploadTask = uploadBytesResumable(storageRef, file);

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
  // [START storage_monitor_upload]
  const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

  const storage = getStorage();
  const storageRef = ref(storage, 'images/rivers.jpg');

  const uploadTask = uploadBytesResumable(storageRef, file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', 
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
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
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
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
  // [START storage_upload_handle_error]
  const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

  const storage = getStorage();

  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: 'image/jpeg'
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, 'images/' + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
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
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
      });
    }
  );
  // [END storage_upload_handle_error]
}
