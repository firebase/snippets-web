// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

// [START sample_doc]
const arinellDoc = {
  name: 'Arinell Pizza',
  avgRating: 4.65,
  numRatings: 683
};
// [END sample_doc]

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    projectId: "<PROJECT_ID>",
};
const app = initializeApp(config);
const db = getFirestore(app);

function getCollectionRatings() {
  // [START get_collection_ratings]
  const { useEffect, useState } = require("react");
  const { collection, getDocs } = require("firebase/firestore");

  function RatingList() {
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
      const ratingsRef = collection(db, "restaurants", "arinell-pizza", "ratings");
      getDocs(ratingsRef).then((ratingsDocs) => {
        setRatings(ratingsDocs.docs);
      });
    }, []);

    return (
      <ul>
        {ratings.map((doc) => (
          <li key={doc.id}>{doc.data().rating}</li>
        ))}
      </ul>
    );
  }
  // [END get_collection_ratings]
}
