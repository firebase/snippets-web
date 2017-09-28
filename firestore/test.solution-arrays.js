let postsWithArray = [
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

let postsWithMap = [
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

let postsWithMapAdvanced = [
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
]

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
    });

    describe("solution-arrays", () => {
        it("should query in a category #UNVERIFIED", () => {
            // [START query_in_category]
            // Find all documents in the 'posts' collection that are
            // in the 'cats' category.
            db.collection('posts')
                .where('categories.cats', '==', true)
                .get()
                .then(() => {
                    // ...
                });
            // [END query_in_category]
        });

        it("should query in a category by timestamp #UNVERIFIED", () => {
            // [START query_in_category_timestamp_invalid]
            db.collection('posts')
                .where('categories.cats', '==', true)
                .orderBy('timestamp');
            // [END query_in_category_timestamp_invalid]

            // [START query_in_category_timestamp]
            db.collection('posts')
                .where('categories.cats', '>', 0)
                .orderBy('categories.cats');
            // [END query_in_category_timestamp]
        });
    });
});
