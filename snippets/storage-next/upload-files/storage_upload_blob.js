// This snippet file was generated by processing the source file:
// ./storage-next/upload-files.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START storage_upload_blob_modular]
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();
const storageRef = ref(storage, 'some-child');

// 'file' comes from the Blob or File API
uploadBytes(storageRef, file).then((snapshot) => {
  console.log('Uploaded a blob or file!');
});
// [END storage_upload_blob_modular]