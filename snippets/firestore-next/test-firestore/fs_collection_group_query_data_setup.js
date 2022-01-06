// This snippet file was generated by processing the source file:
// ./firestore-next/test.firestore.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START fs_collection_group_query_data_setup_modular]
import { collection, doc, addDoc } from "firebase/firestore";

const citiesRef = collection(db, 'cities');

await Promise.all([
    addDoc(collection(citiesRef, 'SF', 'landmarks'), {
        name: 'Golden Gate Bridge',
        type: 'bridge'
    }),
    addDoc(collection(citiesRef, 'SF', 'landmarks'), {
        name: 'Legion of Honor',
        type: 'museum'
    }),
    addDoc(collection(citiesRef, 'LA', 'landmarks'), {
        name: 'Griffith Park',
        type: 'park'
    }),
    addDoc(collection(citiesRef, 'LA', 'landmarks'), {
        name: 'The Getty',
        type: 'museum'
    }),
    addDoc(collection(citiesRef, 'DC', 'landmarks'), {
        name: 'Lincoln Memorial',
        type: 'memorial'
    }),
    addDoc(collection(citiesRef, 'DC', 'landmarks'), {
        name: 'National Air and Space Museum',
        type: 'museum'
    }),
    addDoc(collection(citiesRef, 'TOK', 'landmarks'), {
        name: 'Ueno Park',
        type: 'park'
    }),
    addDoc(collection(citiesRef, 'TOK', 'landmarks'), {
        name: 'National Museum of Nature and Science',
        type: 'museum'
    }),
    addDoc(collection(citiesRef, 'BJ', 'landmarks'), {
        name: 'Jingshan Park',
        type: 'park'
    }),
    addDoc(collection(citiesRef, 'BJ', 'landmarks'), {
        name: 'Beijing Ancient Observatory',
        type: 'museum'
    })
]);
// [END fs_collection_group_query_data_setup_modular]
