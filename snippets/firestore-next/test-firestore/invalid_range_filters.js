// This snippet file was generated by processing the source file:
// ./firestore-next/test.firestore.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START invalid_range_filters_modular]
import { query, where } from "firebase/firestore";  

const q = query(citiesRef, where("state", ">=", "CA"), where("population", ">", 100000));
// [END invalid_range_filters_modular]