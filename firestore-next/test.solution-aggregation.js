// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

// [START sample_doc]
const arinellDoc = {
  name: 'Arinell Pizza',
  avgRating: 4.65,
  numRatings: 683
};
// [END sample_doc]

describe("firestore-solution-arrays", () => {
    const { FirebaseFirestore } = require("firebase/firestore");

    /** @type {FirebaseFirestore} */
    let db;

    before(async () => {
      const { initializeApp } = require("firebase/app");
      const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");

      const config = {
          apiKey: "AIzaSyArvVh6VSdXicubcvIyuB-GZs8ua0m0DTI",
          authDomain: "firestorequickstarts.firebaseapp.com",
          projectId: "firestorequickstarts",
      };
      const app = initializeApp(config, "solution-arrays");
      db = getFirestore(app);

      await setDoc(doc(collection(db, "restaurants"), "arinell-pizza"), arinellDoc);
    });

    describe("solution-arrays", () => {
        it("should get a collection of ratings", async () => {
          // [START get_collection_ratings]
          const { collection, doc, getDocs } = require("firebase/firestore");

          const ratingsRef = collection(doc(collection(db, "restaurants"), "arinell-pizza"), "ratings");
          const ratingsDocs = await getDocs(ratingsRef);
          // [END get_collection_ratings]
        });
    });
});
