// This snippet file was generated by processing the source file:
// ./storage-next/create-reference.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START storage_ref_full_example_modular]
import { getStorage, ref } from "firebase/storage";

const storage = getStorage();

// Points to the root reference
const storageRef = ref(storage);

// Points to 'images'
const imagesRef = ref(storageRef, 'images');

// Points to 'images/space.jpg'
// Note that you can use variables to create child values
const fileName = 'space.jpg';
const spaceRef = ref(imagesRef, fileName);

// File path is 'images/space.jpg'
const path = spaceRef.fullPath;

// File name is 'space.jpg'
const name = spaceRef.name;

// Points to 'images'
const imagesRefAgain = spaceRef.parent;
// [END storage_ref_full_example_modular]