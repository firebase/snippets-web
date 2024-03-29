// This snippet file was generated by processing the source file:
// ./firestore-next/test.firestore.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START firestore_query_subcollection_modular]
import { collection, getDocs } from "firebase/firestore";
// Query a reference to a subcollection
const querySnapshot = await getDocs(collection(db, "cities", "SF", "landmarks"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});
// [END firestore_query_subcollection_modular]