// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

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

function uploadBlob() {
  // [START storage_upload_blob]
  const { useActionState } = require("react");
  const { getStorage, ref, uploadBytes } = require("firebase/storage");

  function UploadForm() {
    const [error, uploadBlob, isPending] = useActionState(async (previousError, formData) => {
      const file = formData.get("file");
      const storage = getStorage();
      const storageRef = ref(storage, 'some-child');

      try {
        // 'file' comes from the Blob or File API
        await uploadBytes(storageRef, file);
        console.log('Uploaded a blob or file!');
        return null;
      } catch (error) {
        return error.message;
      }
    }, null);

    return (
      <form action={uploadBlob}>
        <input name="file" type="file" />
        <button type="submit" disabled={isPending}>Upload</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END storage_upload_blob]
}

function uploadBytes() {
  // [START storage_upload_bytes]
  const { useTransition } = require("react");
  const { getStorage, ref, uploadBytes } = require("firebase/storage");

  function UploadBytesButton() {
    const [isPending, startTransition] = useTransition();

    function uploadArray() {
      startTransition(async () => {
        const storage = getStorage();
        const storageRef = ref(storage, 'some-child');

        const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
        await uploadBytes(storageRef, bytes);
        console.log('Uploaded an array!');
      });
    }

    return <button onClick={uploadArray} disabled={isPending}>Upload</button>;
  }
  // [END storage_upload_bytes]
}

function uploadString() {
  // [START storage_upload_string]
  const { useTransition } = require("react");
  const { getStorage, ref, uploadString } = require("firebase/storage");

  function UploadStringButton() {
    const [isPending, startTransition] = useTransition();

    function uploadStrings() {
      startTransition(async () => {
        const storage = getStorage();
        const storageRef = ref(storage, 'some-child');

        // Raw string is the default if no format is provided
        const message = 'This is my message.';
        await uploadString(storageRef, message);
        console.log('Uploaded a raw string!');

        // Base64 formatted string
        const message2 = '5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
        await uploadString(storageRef, message2, 'base64');
        console.log('Uploaded a base64 string!');

        // Base64url formatted string
        const message3 = '5b6p5Y-344GX44G-44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
        await uploadString(storageRef, message3, 'base64url');
        console.log('Uploaded a base64url string!');

        // Data URL string
        const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
        await uploadString(storageRef, message4, 'data_url');
        console.log('Uploaded a data_url string!');
      });
    }

    return <button onClick={uploadStrings} disabled={isPending}>Upload</button>;
  }
  // [END storage_upload_string]
}

function uploadMetadata() {
  // [START storage_upload_metadata]
  const { getStorage, ref, uploadBytes } = require("firebase/storage");

  function UploadForm() {
    async function uploadMetadata(formData) {
      const file = formData.get("file");
      const storage = getStorage();
      const storageRef = ref(storage, 'images/mountains.jpg');

      // Create file metadata including the content type
      /** @type {any} */
      const metadata = {
        contentType: 'image/jpeg',
      };

      // Upload the file and metadata
      await uploadBytes(storageRef, file, metadata);
    }

    return (
      <form action={uploadMetadata}>
        <input name="file" type="file" />
        <button type="submit">Upload</button>
      </form>
    );
  }
  // [END storage_upload_metadata]
}

function manageUploads() {
  // [START storage_manage_uploads]
  const { useRef } = require("react");
  const { getStorage, ref, uploadBytesResumable } = require("firebase/storage");

  function UploadForm() {
    const uploadTask = useRef(null);

    function startUpload(formData) {
      const file = formData.get("file");
      const storage = getStorage();
      const storageRef = ref(storage, 'images/mountains.jpg');

      // Upload the file and metadata
      uploadTask.current = uploadBytesResumable(storageRef, file);
    }

    function pauseUpload() {
      // Pause the upload
      uploadTask.current.pause();
    }

    function resumeUpload() {
      // Resume the upload
      uploadTask.current.resume();
    }

    function cancelUpload() {
      // Cancel the upload
      uploadTask.current.cancel();
    }

    return (
      <form action={startUpload}>
        <input name="file" type="file" />
        <button type="submit">Upload</button>
        <button type="button" onClick={pauseUpload}>Pause</button>
        <button type="button" onClick={resumeUpload}>Resume</button>
        <button type="button" onClick={cancelUpload}>Cancel</button>
      </form>
    );
  }
  // [END storage_manage_uploads]
}

function monitorUpload() {
  // [START storage_monitor_upload]
  const { useActionState, useState } = require("react");
  const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

  function UploadForm() {
    const [progress, setProgress] = useState(0);
    const [error, uploadFile, isPending] = useActionState(async (previousError, formData) => {
      const file = formData.get("file");
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
          setProgress(progress);
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

      // The task is also a Promise: await it so the form stays pending until the upload settles.
      try {
        await uploadTask;
        return null;
      } catch (error) {
        return error.message;
      }
    }, null);

    return (
      <form action={uploadFile}>
        <input name="file" type="file" />
        <button type="submit" disabled={isPending}>Upload</button>
        <p>Upload is {progress}% done</p>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END storage_monitor_upload]
}

function uploadHandleError() {
  // [START storage_upload_handle_error]
  const { useActionState, useState } = require("react");
  const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

  function UploadForm() {
    const [progress, setProgress] = useState(0);
    const [error, uploadFile, isPending] = useActionState(async (previousError, formData) => {
      const file = formData.get("file");
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
          setProgress(progress);
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

      // The task is also a Promise: await it so the form stays pending until the upload settles.
      try {
        await uploadTask;
        return null;
      } catch (error) {
        return error.message;
      }
    }, null);

    return (
      <form action={uploadFile}>
        <input name="file" type="file" />
        <button type="submit" disabled={isPending}>Upload</button>
        <p>Upload is {progress}% done</p>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END storage_upload_handle_error]
}
