// This snippet file was generated by processing the source file:
// ./firestore-next/test.firestore.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START simple_queries_again_modular]
import { collection, query, where } from "firebase/firestore";
const citiesRef = collection(db, "cities");

const q = query(citiesRef, where("capital", "==", true));
// [END simple_queries_again_modular]