// This snippet file was generated by processing the source file:
// ./storage-next/file-metadata.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START storage_get_metadata_modular]
import { getStorage, ref, getMetadata } from "firebase/storage";

// Create a reference to the file whose metadata we want to retrieve
const storage = getStorage();
const forestRef = ref(storage, 'images/forest.jpg');

// Get metadata properties
getMetadata(forestRef)
  .then((metadata) => {
    // Metadata now contains the metadata for 'images/forest.jpg'
  })
  .catch((error) => {
    // Uh-oh, an error occurred!
  });
// [END storage_get_metadata_modular]