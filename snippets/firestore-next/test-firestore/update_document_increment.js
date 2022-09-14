// This snippet file was generated by processing the source file:
// ./firestore-next/test.firestore.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START update_document_increment_modular]
import { doc, updateDoc, increment } from "firebase/firestore";

const washingtonRef = doc(db, "cities", "DC");

// Automatically increment the population of the city by 50.
await updateDoc(washingtonRef, {
    population: increment(50)
});
// [END update_document_increment_modular]