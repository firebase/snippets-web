// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

function deleteFile() {
  // [START storage_delete_file]
  const { getStorage, ref, deleteObject } = require("firebase/storage");

  const storage = getStorage(firebaseApp);

  // Create a reference to the file to delete
  const desertRef = ref(storage, 'images/desert.jpg');

  // Delete the file
  deleteObject(desertRef).then(() => {
    // File deleted successfully
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });
  // [END storage_delete_file]
}
