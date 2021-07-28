// This snippet file was generated by processing the source file:
// ./storage-next/file-metadata.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START storage_delete_metadata_modular]
import { getStorage, ref, updateMetadata } from "firebase/storage";

const storage = getStorage();
const forestRef = ref(storage, 'images/forest.jpg');

// Create file metadata with property to delete
const deleteMetadata = {
  contentType: null
};

// Delete the metadata property
updateMetadata(forestRef, deleteMetadata)
  .then((metadata) => {
    // metadata.contentType should be null
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });
// [END storage_delete_metadata_modular]