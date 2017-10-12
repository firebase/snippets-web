// [START sample_doc]
var arinellDoc = {
  name: 'Arinell Pizza',
  avgRating: 4.65,
  numRatings: 683
}
// [END sample_doc]

describe("firestore-solution-arrays", () => {
    var db;
    before(() => {
        var config = {
            apiKey: "AIzaSyArvVh6VSdXicubcvIyuB-GZs8ua0m0DTI",
            authDomain: "firestorequickstarts.firebaseapp.com",
            projectId: "firestorequickstarts",
        };
        var app = firebase.initializeApp(config, "solution-arrays");
        db = firebase.firestore(app);

        return db.collection("restaurants")
            .doc("arinell-pizza")
            .set(arinellDoc);
    });

    describe("solution-arrays", () => {
        it("should get a collection of ratings", () => {
          // [START get_collection_ratings]
          db.collection("restaurants")
            .doc("arinell-pizza")
            .collection("ratings")
            .get()
          // [END get_collection_ratings]
        })
    });
});
