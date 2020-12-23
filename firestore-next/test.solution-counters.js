// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

const { FirebaseFirestore } = require('firebase/firestore');

/** @type {FirebaseFirestore} */
let db;

// [START create_counter]
function createCounter(ref, num_shards) {
    const { collection, doc, writeBatch } = require("firebase/firestore");

    const batch = writeBatch(db);

    // Initialize the counter document
    batch.set(ref, { num_shards: num_shards });

    // Initialize each shard with count=0
    for (let i = 0; i < num_shards; i++) {
        const shardRef = doc(collection(ref, 'shards'), i.toString());
        batch.set(shardRef, { count: 0 });
    }

    // Commit the write batch
    return batch.commit();
}
// [END create_counter]

// [START increment_counter]
function incrementCounter(db, ref, num_shards) {
    const { collection, doc, updateDoc, increment, FirebaseFirestore } = require("@firebase/firestore");

    // Select a shard of the counter at random
    const shardId = Math.floor(Math.random() * num_shards).toString();
    const shardRef = doc(collection(ref, 'shards'), shardId);

    // Update count
    return updateDoc(shardRef, "count", increment(1));
}
// [END increment_counter]

// [START get_count]
async function getCount(ref) {
    const { collection, getDocs } = require("@firebase/firestore");

    // Sum the count of each shard in the subcollection
    const snapshot = await getDocs(collection(ref, 'shards'));

    let totalCount = 0;
    snapshot.forEach((doc) => {
        totalCount += doc.data().count;
    });

    return totalCount;
}
// [END get_count]

describe("firestore-solution-counters", () => {
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

    describe("solution-counters", () => {
        it("should create a counter", () => {
            // Create a counter with 10 shards
            const { collection, doc } = require("firebase/firestore");

            return createCounter(doc(collection(db, 'counters')), 10);
        });

        it("should increment a counter", async () => {
            // Create a counter, then increment it
            const { collection, doc } = require("firebase/firestore");

            const ref = doc(collection(db, 'counters'));
            await createCounter(ref, 10);
            await incrementCounter(db, ref, 10);
        });

        it("should get the count of a counter", async () => {
            // Create a counter, increment it, then get the count
            const { collection, doc } = require("firebase/firestore");

            const ref = doc(collection(db, 'counters'));
            await createCounter(ref, 10);
            await incrementCounter(db, ref, 10);
            await getCount(ref);
        });
    });
});
