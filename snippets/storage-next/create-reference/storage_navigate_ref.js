// This snippet file was generated by processing the source file:
// ./storage-next/create-reference.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START storage_navigate_ref_modular]
import { getStorage, ref } from "firebase/storage";

const storage = getStorage();
const spaceRef = ref(storage, 'images/space.jpg');

// Parent allows us to move to the parent of a reference
const imagesRef = spaceRef.parent;
// imagesRef now points to 'images'

// Root allows us to move all the way back to the top of our bucket
const rootRef = spaceRef.root;
// rootRef now points to the root
// [END storage_navigate_ref_modular]