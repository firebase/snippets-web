var db;

// [START create_counter]
function createCounter(ref, num_shards) {
    var batch = db.batch();

    // Initialize the counter document
    batch.set(ref, { num_shards: num_shards });

    // Initialize each shard with count=0
    for (let i = 0; i < num_shards; i++) {
        let shardRef = ref.collection('shards').doc(i.toString());
        batch.set(shardRef, { count: 0 });
    }

    // Commit the write batch
    return batch.commit();
}
// [END create_counter]

// [START increment_counter]
function incrementCounter(db, ref, num_shards) {
    // Select a shard of the counter at random
    const shard_id = Math.floor(Math.random() * num_shards).toString();
    const shard_ref = ref.collection('shards').doc(shard_id);

    // Update count in a transaction
    return db.runTransaction(t => {
        return t.get(shard_ref).then(doc => {
            const new_count = doc.data().count + 1;
            t.update(shard_ref, { count: new_count });
        });
    });
}
// [END increment_counter]

// [START get_count]
function getCount(ref) {
    // Sum the count of each shard in the subcollection
    return ref.collection('shards').get().then(snapshot => {
        let total_count = 0;
        snapshot.forEach(doc => {
            total_count += doc.data().count;
        });

        return total_count;
    });
}
// [END get_count]

describe("firestore-solution-counters", () => {
    before(() => {
        var config = {
            apiKey: "AIzaSyArvVh6VSdXicubcvIyuB-GZs8ua0m0DTI",
            authDomain: "firestorequickstarts.firebaseapp.com",
            projectId: "firestorequickstarts",
        };
        var app = firebase.initializeApp(config, "solution-counters");
        db = firebase.firestore(app);
    });

    describe("solution-counters", () => {
        it("should create a counter", () => {
            // Create a counter with 10 shards
            return createCounter(db.collection('counters').doc(), 10);
        });

        it("should increment a counter", () => {
            // Create a counter, then increment it
            let ref = db.collection('counters').doc();
            return createCounter(ref, 10).then(() => {
                return incrementCounter(db, ref, 10);
            });
        });

        it("should get the count of a counter", () => {
            // Create a counter, increment it, then get the count
            let ref = db.collection('counters').doc();
            return createCounter(ref, 10).then(() => {
                return incrementCounter(db, ref, 10);
            }).then(() => {
                return getCount(ref);
            });
        });
    });
});
