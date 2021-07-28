// This snippet file was generated by processing the source file:
// ./firestore-next/test.firestore.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START fs_collection_group_query_data_setup_modular]
import { collection, doc, setDoc } from "firebase/firestore";  

const citiesRef = collection(db, 'cities');

await Promise.all([
    setDoc(doc(citiesRef, 'SF', 'landmarks'), {
        name: 'Golden Gate Bridge',
        type: 'bridge'
    }),
    setDoc(doc(citiesRef, 'SF', 'landmarks'), {
        name: 'Legion of Honor',
        type: 'museum'
    }),
    setDoc(doc(citiesRef, 'LA', 'landmarks'), {
        name: 'Griffith Park',
        type: 'park'
    }),
    setDoc(doc(citiesRef, 'LA', 'landmarks'), {
        name: 'The Getty',
        type: 'museum'
    }),
    setDoc(doc(citiesRef, 'DC', 'landmarks'), {
        name: 'Lincoln Memorial',
        type: 'memorial'
    }),
    setDoc(doc(citiesRef, 'DC', 'landmarks'), {
        name: 'National Air and Space Museum',
        type: 'museum'
    }),
    setDoc(doc(citiesRef, 'TOK', 'landmarks'), {
        name: 'Ueno Park',
        type: 'park'
    }),
    setDoc(doc(citiesRef, 'TOK', 'landmarks'), {
        name: 'National Museum of Nature and Science',
        type: 'museum'
    }),
    setDoc(doc(citiesRef, 'BJ', 'landmarks'), {
        name: 'Jingshan Park',
        type: 'park'
    }),
    setDoc(doc(citiesRef, 'BJ', 'landmarks'), {
        name: 'Beijing Ancient Observatory',
        type: 'museum'
    })
]);
// [END fs_collection_group_query_data_setup_modular]