// This snippet file was generated by processing the source file:
// ./firestore-next/test.firestore.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START listen_for_users_modular]
import { collection, where, query, onSnapshot } from "firebase/firestore"; 

const q = query(collection(db, "users"), where("born", "<", 1900));
const unsubscribe = onSnapshot(q, (snapshot) => {
    console.log("Current users born before 1900:");
    snapshot.forEach((userSnapshot) => {
        console.log(userSnapshot.data());
    });
});
// [END listen_for_users_modular]