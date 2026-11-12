// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    projectId: "<PROJECT_ID>",
};
const app = initializeApp(config);
const db = getFirestore(app);

function createCounter_wrapped() {
    // [START create_counter]
    const { doc, writeBatch } = require("firebase/firestore");

    function CreateCounterButton({ counterRef, num_shards }) {
        async function createCounter() {
            const batch = writeBatch(db);

            // Initialize the counter document
            batch.set(counterRef, { num_shards: num_shards });

            // Initialize each shard with count=0
            for (let i = 0; i < num_shards; i++) {
                const shardRef = doc(counterRef, 'shards', i.toString());
                batch.set(shardRef, { count: 0 });
            }

            // Commit the write batch
            await batch.commit();
        }

        return <button onClick={createCounter}>Create counter</button>;
    }
    // [END create_counter]
}

function incrementCounter_wrapped() {
    // [START increment_counter]
    const { doc, updateDoc, increment } = require("firebase/firestore");

    function IncrementCounterButton({ counterRef, num_shards }) {
        async function incrementCounter() {
            // Select a shard of the counter at random
            const shardId = Math.floor(Math.random() * num_shards).toString();
            const shardRef = doc(counterRef, 'shards', shardId);

            // Update count
            await updateDoc(shardRef, "count", increment(1));
        }

        return <button onClick={incrementCounter}>Increment</button>;
    }
    // [END increment_counter]
}

function getCount_wrapped() {
    // [START get_count]
    const { useEffect, useState } = require("react");
    const { collection, getDocs } = require("firebase/firestore");

    function TotalCount({ counterRef }) {
        const [totalCount, setTotalCount] = useState(null);

        useEffect(() => {
            let ignore = false;
            // Sum the count of each shard in the subcollection
            getDocs(collection(counterRef, 'shards')).then((snapshot) => {
                if (ignore) return;
                let totalCount = 0;
                snapshot.forEach((doc) => {
                    totalCount += doc.data().count;
                });

                setTotalCount(totalCount);
            });
            // Ignore the result if counterRef changes before the read completes.
            return () => { ignore = true; };
        }, [counterRef]);

        return <span>{totalCount}</span>;
    }
    // [END get_count]
}
