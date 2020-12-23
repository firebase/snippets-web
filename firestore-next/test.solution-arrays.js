// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

const postsWithArray = [
    // [START post_with_array]
    // Sample document in the 'posts' collection.
    {
        title: "My great post",
        categories: [
            "technology",
            "opinion",
            "cats"
        ]
    }
    // [END post_with_array]
];

const postsWithMap = [
    // [START post_with_map]
    // Sample document in the 'posts' collection
    {
        title: "My great post",
        categories: {
            "technology": true,
            "opinion": true,
            "cats": true
        }
    }
    // [END post_with_map]
];

const postsWithMapAdvanced = [
    // [START post_with_map_advanced]
    // The value of each entry in 'categories' is a unix timestamp
    {
      title: "My great post",
      categories: {
        technology: 1502144665,
        opinion: 1502144665,
        cats: 1502144665
      }
    }
    // [END post_with_map_advanced]
];

describe("firestore-solution-arrays", () => {
    const { FirebaseFirestore } = require("firebase/firestore");

    /** @type {FirebaseFirestore} */
    let db;

    before(() => {
        const { initializeApp } = require("firebase/app");
        const { getFirestore } = require("firebase/firestore");

        const config = {
            apiKey: "AIzaSyArvVh6VSdXicubcvIyuB-GZs8ua0m0DTI",
            authDomain: "firestorequickstarts.firebaseapp.com",
            projectId: "firestorequickstarts",
        };
        const app = initializeApp(config, "solution-arrays");
        db = getFirestore(app);
    });

    describe("solution-arrays", () => {
        it("should query in a category", async () => {
            // [START query_in_category]
            const { collection, getDocs, query, where } = require("firebase/firestore");

            // Find all documents in the 'posts' collection that are
            // in the 'cats' category.
            const q = query(collection(db, "posts"), where("categories.cats", "==", true));
            const docs = await getDocs(q);
            // ...
            // [END query_in_category]
        });

        it("should query in a category by timestamp", () => {
            function queryOne() {
                // [START query_in_category_timestamp_invalid]
                const { collection, query, where, orderBy, FirebaseFirestore } = require("@firebase/firestore");

                const q = query(collection(db, "posts"),
                    where("categories.cats", "==", true),
                    orderBy("timestamp"));
                // [END query_in_category_timestamp_invalid]
            }


            function queryTwo() {
                // [START query_in_category_timestamp]
                const { collection, query, where, orderBy } = require("@firebase/firestore");

                const q = query(collection(db, "posts"),
                    where("categories.cats", ">", 0),
                    orderBy("categories.cats"));
                // [END query_in_category_timestamp]
            }

        });
    });
});
