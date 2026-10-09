// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

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

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    projectId: "<PROJECT_ID>",
};
const app = initializeApp(config);
const db = getFirestore(app);

function queryInCategory() {
    // [START query_in_category]
    const { useEffect, useState } = require("react");
    const { collection, getDocs, query, where } = require("firebase/firestore");

    function CatPosts() {
        const [posts, setPosts] = useState([]);

        useEffect(() => {
            // Find all documents in the 'posts' collection that are
            // in the 'cats' category.
            const q = query(collection(db, "posts"), where("categories.cats", "==", true));
            getDocs(q).then((docs) => {
                setPosts(docs.docs);
            });
        }, []);

        return (
            <ul>
                {posts.map((doc) => (
                    <li key={doc.id}>{doc.data().title}</li>
                ))}
            </ul>
        );
    }
    // [END query_in_category]
}

function queryOne() {
    // [START query_in_category_timestamp_invalid]
    const { collection, query, where, orderBy, Firestore } = require("firebase/firestore");

    const q = query(collection(db, "posts"),
        where("categories.cats", "==", true),
        orderBy("timestamp"));
    // [END query_in_category_timestamp_invalid]
}

function queryTwo() {
    // [START query_in_category_timestamp]
    const { collection, query, where, orderBy } = require("firebase/firestore");

    const q = query(collection(db, "posts"),
        where("categories.cats", ">", 0),
        orderBy("categories.cats"));
    // [END query_in_category_timestamp]
}
