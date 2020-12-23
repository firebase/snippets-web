// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

const { expect } = require('chai');

// [START city_custom_object]
class City {
    constructor (name, state, country ) {
        this.name = name;
        this.state = state;
        this.country = country;
    }
    toString() {
        return this.name + ', ' + this.state + ', ' + this.country;
    }
}
    
// Firestore data converter
var cityConverter = {
    toFirestore: function(city) {
        return {
            name: city.name,
            state: city.state,
            country: city.country
            };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new City(data.name, data.state, data.country);
    }
};
// [END city_custom_object]

describe("firestore", () => {
    const { FirebaseFirestore } = require("firebase/firestore");

    /** @type {FirebaseFirestore} */
    let db;
    let app;

    before(() => {
        const { initializeApp } = require("firebase/app");
        const { getFirestore } = require("firebase/firestore");

        const config = {
            apiKey: "AIzaSyCM61mMr_iZnP1DzjT1PMB5vDGxfyWNM64",
            authDomain: "firestore-snippets.firebaseapp.com",
            projectId: "firestore-snippets"
        };
        app = initializeApp(config);
        db = getFirestore(app);
    });

    it("should be able to set the cache size", () => {
        // [START fs_setup_cache]
        const { initializeFirestore, CACHE_SIZE_UNLIMITED } = require("firebase/firestore");

        const firestoreDb = initializeFirestore(app, {
          cacheSizeBytes: CACHE_SIZE_UNLIMITED
        });
        // [END fs_setup_cache]
    });

    it("should be initializable with persistence", () => {
      const { initializeApp } = require("firebase/app");
      const { getFirestore } = require("firebase/firestore");

      const app = initializeApp({
        apiKey: '### FIREBASE API KEY ###',
        authDomain: '### FIREBASE AUTH DOMAIN ###',
        projectId: '### CLOUD FIRESTORE PROJECT ID ###',
      } ,"persisted_app");

      const db = getFirestore(app);

      // [START initialize_persistence]
      const { enableIndexedDbPersistence } = require("firebase/firestore"); 

      enableIndexedDbPersistence(db)
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
            } else if (err.code == 'unimplemented') {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
            }
        });
      // Subsequent queries will use persistence, if it was enabled successfully
      // [END initialize_persistence]
    });

    it("should be able to enable/disable network", async () => {
      // [START disable_network]
      const { disableNetwork } = require("firebase/firestore"); 

      await disableNetwork(db);
      console.log("Network disabled!");
      // Do offline actions
      // [START_EXCLUDE]
      console.log("Network disabled!");
      // [END_EXCLUDE]
      // [END disable_network]

      // [START enable_network]
      const { enableNetwork } = require("firebase/firestore"); 

      await enableNetwork(db);
      // Do online actions
      // [START_EXCLUDE]
      console.log("Network enabled!");
      // [END_EXCLUDE]
      // [END enable_network]

    });

    it("should reply with .fromCache fields", () => {
      // [START use_from_cache]
      const { collection, onSnapshot, where, query } = require("firebase/firestore"); 
      
      const q = query(collection(db, "cities"), where("state", "==", "CA"));
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                  console.log("New city: ", change.doc.data());
              }

              const source = snapshot.metadata.fromCache ? "local cache" : "server";
              console.log("Data came from " + source);
          });
      });
      // [END use_from_cache]
    });

    describe("collection('users')", () => {
        it("should add data to a collection", async () => {
            // [START add_ada_lovelace]
            const { collection, addDoc } = require("firebase/firestore"); 

            try {
              const docRef = await addDoc(collection(db, "users"), {
                first: "Ada",
                last: "Lovelace",
                born: 1815
              });
              console.log("Document written with ID: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
            // [END add_ada_lovelace]
        });

        it("should get all users", async () => {
            // [START get_all_users]
            const { collection, getDocs } = require("firebase/firestore"); 

            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
              console.log(`${doc.id} => ${doc.data()}`);
            });
            // [END get_all_users]
        });

        it("should add data to a collection with new fields", async () => {
            // [START add_alan_turing]
            // Add a second document with a generated ID.
            const { addDoc, collection } = require("firebase/firestore"); 

            try {
              const docRef = await addDoc(collection(db, "users"), {
                first: "Alan",
                middle: "Mathison",
                last: "Turing",
                born: 1912
              });

              console.log("Document written with ID: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
            // [END add_alan_turing]
        });

        it("should loop through a watched collection", (done) => {
            // [START listen_for_users]
            const { collection, where, query, onSnapshot } = require("firebase/firestore"); 

            const q = query(collection(db, "users"), where("born", "<", 1900));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                console.log("Current users born before 1900:");
                snapshot.forEach(function (userSnapshot) {
                    console.log(userSnapshot.data());
                });
            });
            // [END listen_for_users]

            setTimeout(() => {
                unsubscribe();
                done();
            }, 1500);
        });

        it("should reference a specific document", () => {
            // [START doc_reference]
            const { collection, doc } = require("firebase/firestore");

            const alovelaceDocumentRef = doc(collection(db, 'users'), 'alovelace');
            // [END doc_reference]
        });

        it("should reference a specific collection", () => {
            // [START collection_reference]
            const { collection } = require("firebase/firestore");

            const usersCollectionRef = collection(db, 'users');
            // [END collection_reference]
        });

        it("should reference a specific document (alternative)", () => {
            // [START doc_reference_alternative]
            const { doc } = require("firebase/firestore"); 

            const alovelaceDocumentRef = doc(db, 'users/alovelace');
            // [END doc_reference_alternative]
        });

        it("should reference a document in a subcollection", () => {
            // [START subcollection_reference]
            const { doc, collection } = require("firebase/firestore"); 

            const messageRef = doc(collection(doc(collection(db, "rooms"), "roomA"), "messages"), "message1");
            // [END subcollection_reference]
        });

        it("should set a document", async () => {
            // [START set_document]
            const { doc, collection, setDoc } = require("firebase/firestore"); 

            // Add a new document in collection "cities"
            await setDoc(doc(collection(db, "cities"), "LA"), {
              name: "Los Angeles",
              state: "CA",
              country: "USA"
            });
            // [END set_document]
        });

        it("should set document with a custom object converter", async () => {
            // [START set_custom_object]
            const { doc, collection, setDoc } = require("firebase/firestore"); 
            
            // Set with cityConverter
            const ref = doc(collection(db, "cities"), "LA").withConverter(cityConverter);
            await setDoc(ref, new City("Los Angeles", "CA", "USA"));
            // [END set_custom_object]
        });

        it("should get document with a custom object converter", async () => {
            // [START get_custom_object]
            const { doc, collection, getDoc} = require("firebase/firestore"); 

            const ref = doc(collection(db, "cities"), "LA").withConverter(cityConverter);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
              // Convert to City object
              const city = docSnap.data();
              // Use a City instance method
              console.log(city.toString());
            } else {
              console.log("No such document!");
            }
            // [END get_custom_object]
        });

        it("should support batch writes", async () => {
            // [START write_batch]
            const { writeBatch, doc, collection } = require("firebase/firestore"); 

            // Get a new write batch
            const batch = writeBatch(db);

            // Set the value of 'NYC'
            const nycRef = doc(collection(db, "cities"), "NYC");
            batch.set(nycRef, {name: "New York City"});

            // Update the population of 'SF'
            const sfRef = doc(collection(db, "cities"), "SF");
            batch.update(sfRef, {"population": 1000000});

            // Delete the city 'LA'
            const laRef = doc(collection(db, "cities"), "LA");
            batch.delete(laRef);

            // Commit the batch
            await batch.commit();
            // [END write_batch]
        });

        it("should set a document with every datatype #UNVERIFIED", async () => {
            // [START data_types]
            const { doc, collection, setDoc, Timestamp } = require("firebase/firestore"); 

            const docData = {
                stringExample: "Hello world!",
                booleanExample: true,
                numberExample: 3.14159265,
                dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
                arrayExample: [5, true, "hello"],
                nullExample: null,
                objectExample: {
                    a: 5,
                    b: {
                        nested: "foo"
                    }
                }
            };
            await setDoc(doc(collection(db, "data"), "one"), docData);
            // [END data_types]
        });

        it("should allow set with merge", async () => {
            // [START set_with_merge]
            const { doc, collection, setDoc } = require("firebase/firestore"); 

            const cityRef = doc(collection(db, 'cities'), 'BJ');
            setDoc(cityRef, { capital: true }, { merge: true });
            // [END set_with_merge]
        });

        it("should update a document's nested fields #UNVERIFIED", async () => {
            // [START update_document_nested]
            const { doc, collection, setDoc, updateDoc } = require("firebase/firestore"); 

            // Create an initial document to update.
            const frankDocRef = doc(collection(db, "users"), "frank");
            await setDoc(frankDocRef, {
                name: "Frank",
                favorites: { food: "Pizza", color: "Blue", subject: "recess" },
                age: 12
            });

            // To update age and favorite color:
            await updateDoc(frankDocRef, {
                "age": 13,
                "favorites.color": "Red"
            });
            // [END update_document_nested]
        });

        it("should delete a collection", () => {
            // [START delete_collection]
            /**
             * Delete a collection, in batches of batchSize. Note that this does
             * not recursively delete subcollections of documents in the collection
             */
            const { collection, query, orderBy, limit, getDocs, writeBatch } = require("firebase/firestore"); 

            function deleteCollection(db, collectionRef, batchSize) {
              const q = query(collectionRef, orderBy('__name__'), limit(batchSize));

              return new Promise(function(resolve) {
                  deleteQueryBatch(db, q, batchSize, resolve);
              });
            }

            async function deleteQueryBatch(db, query, batchSize, resolve) {
              const snapshot = await getDocs(query);

              // When there are no documents left, we are done
              let numDeleted = 0;
              if (snapshot.size > 0) {
                // Delete documents in a batch
                const batch = writeBatch(db);
                snapshot.docs.forEach((doc) => {
                  batch.delete(doc.ref);
                });

                await batch.commit();
                numDeleted = snapshot.size;
              }

              if (numDeleted < batchSize) {
                resolve();
                return;
              }

              // Recurse on the next process tick, to avoid
              // exploding the stack.
              setTimeout(() => {
                  deleteQueryBatch(db, query, batchSize, resolve);
              }, 0);
            }
            // [END delete_collection]

            return deleteCollection(db, collection(db, "users"), 2);
        }).timeout(2000);
    });

    describe("collection('cities')", () => {
        it("should set documents", async () => {
            // [START example_data]
            const { collection, doc, setDoc } = require("firebase/firestore"); 

            const citiesRef = collection(db, "cities");

            await setDoc(doc(citiesRef, "SF"), {
                name: "San Francisco", state: "CA", country: "USA",
                capital: false, population: 860000,
                regions: ["west_coast", "norcal"] });
            await setDoc(doc(citiesRef, "LA"), {
                name: "Los Angeles", state: "CA", country: "USA",
                capital: false, population: 3900000,
                regions: ["west_coast", "socal"] });
            await setDoc(doc(citiesRef, "DC"), {
                name: "Washington, D.C.", state: null, country: "USA",
                capital: true, population: 680000,
                regions: ["east_coast"] });
            await setDoc(doc(citiesRef, "TOK"), {
                name: "Tokyo", state: null, country: "Japan",
                capital: true, population: 9000000,
                regions: ["kanto", "honshu"] });
            await setDoc(doc(citiesRef, "BJ"), {
                name: "Beijing", state: null, country: "China",
                capital: true, population: 21500000,
                regions: ["jingjinji", "hebei"] });
            // [END example_data]
        });
        it("should set a document", async () => {
            const data = {};

            // [START cities_document_set]
            const { collection, doc, setDoc } = require("firebase/firestore"); 

            await setDoc(doc(collection(db, "cities"), "new-city-id"), data);
            // [END cities_document_set]
        });

        it("should add a document", async () => {
            // [START add_document]
            const { collection, addDoc } = require("firebase/firestore"); 

            // Add a new document with a generated id.
            const docRef = await addDoc(collection(db, "cities"), {
              name: "Tokyo",
              country: "Japan"
            });
            console.log("Document written with ID: ", docRef.id);
            // [END add_document]
        });

        it("should add an empty a document", async () => {
            const data = {};
            // [START new_document]
            const { collection, doc, setDoc } = require("firebase/firestore"); 

            // Add a new document with a generated id
            const newCityRef = doc(collection(db, "cities"));

            // later...
            await setDoc(newCityRef, data);
            // [END new_document]
        });

        it("should update a document", async () => {
            const data = {};
            // [START update_document]
            const { collection, doc, updateDoc } = require("firebase/firestore");

            const washingtonRef = doc(collection(db, "cities"), "DC");

            // Set the "capital" field of the city 'DC'
            await updateDoc(washingtonRef, {
              capital: true
            });
            // [END update_document]
        });

        it("should update an array field in a document", async () => {
            // [START update_document_array]
            const { collection, doc, updateDoc, arrayUnion, arrayRemove } = require("firebase/firestore");

            const washingtonRef = doc(collection(db, "cities"), "DC");

            // Atomically add a new region to the "regions" array field.
            await updateDoc(washingtonRef, {
                regions: arrayUnion("greater_virginia")
            });

            // Atomically remove a region from the "regions" array field.
            await updateDoc(washingtonRef, {
                regions: arrayRemove("east_coast")
            });
            // [END update_document_array]
        });

        it("should update a document using numeric transforms", async () => {
            // [START update_document_increment]
            const { collection, doc, updateDoc, increment } = require("firebase/firestore");

            const washingtonRef = doc(collection(db, "cities"), "DC");

            // Atomically increment the population of the city by 50.
            await updateDoc(washingtonRef, {
                population: increment(50)
            });
            // [END update_document_increment]
        });

        it("should delete a document", async () => {
            // [START delete_document]
            const { collection, doc, deleteDoc } = require("firebase/firestore");

            await deleteDoc(doc(collection(db, "cities"), "DC"));
            // [END delete_document]
        });

        it("should handle transactions", async () => {
            const { collection, doc, setDoc } = require("firebase/firestore");

            const sfDocRef = doc(collection(db, "cities"), "SF");
            await setDoc(sfDocRef, { population: 0 });

            // [START transaction]
            const { runTransaction } = require("firebase/firestore");

            try {
              await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                  throw "Document does not exist!";
                }

                const newPopulation = sfDoc.data().population + 1;
                transaction.update(sfDocRef, { population: newPopulation });
              });
              console.log("Transaction successfully committed!");
            } catch (e) {
              console.log("Transaction failed: ", e);
            }
            // [END transaction]
        });

        it("should handle transaction which bubble out data", async () => {
            // [START transaction_promise]
            const { collection, doc, runTransaction } = require("firebase/firestore");

            // Create a reference to the SF doc.
            const sfDocRef = doc(collection(db, "cities"), "SF");

            try {
              const newPopulation = await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                  throw "Document does not exist!";
                }

                const newPop = sfDoc.data().population + 1;
                if (newPop <= 1000000) {
                  transaction.update(sfDocRef, { population: newPop });
                } else {
                  return Promise.reject("Sorry! Population is too big");
                }
              });

              console.log("Population increased to ", newPopulation);
            } catch (e) {
              // This will be a "population is too big" error.
              console.error(e);
            }
            // [END transaction_promise]
        });

        it("should get a single document", async () => {
            // [START get_document]
            const { collection, doc, getDoc } = require("firebase/firestore");

            const docRef = doc(collection(db, "cities"), "SF");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              console.log("Document data:", docSnap.data());
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
            // [END get_document]
        });

        it("should get a document with options", async () => {
            // [START get_document_options]
            const { collection, doc, getDocFromCache } = require("firebase/firestore");

            const docRef = doc(collection(db, "cities"), "SF");

            // Get a document, forcing the SDK to fetch from the offline cache.
            try {
              const doc = await getDocFromCache(docRef);

              // Document was found in the cache. If no cached document exists,
              // an error will be returned to the 'catch' block below.
              console.log("Cached document data:", doc.data());
            } catch (e) {
              console.log("Error getting cached document:", e);
            }
            // [END get_document_options]
        });

        it("should listen on a single document", (done) => {
            // [START listen_document]
            const { collection, doc, onSnapshot } = require("firebase/firestore");

            const unsub = onSnapshot(doc(collection(db, "cities"), "SF"), (doc) => {
                console.log("Current data: ", doc.data());
            });
            // [END listen_document]

            setTimeout(function() {
                unsub();
                done();
            }, 3000);
        }).timeout(5000);

        it("should listen on a single document with metadata", (done) => {
            // [START listen_document_local]
            const { collection, doc, onSnapshot } = require("firebase/firestore");

            const unsub = onSnapshot(doc(collection(db, "cities"), "SF"), (doc) => {
              const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
              console.log(source, " data: ", doc.data());
            });
            // [END listen_document_local]

            setTimeout(function() {
                unsub();
                done();
            }, 3000);
        }).timeout(5000);

        it("should listen on a single document with options #UNVERIFIED", (done) => {
            // [START listen_with_metadata]
            const { collection, doc, onSnapshot } = require("firebase/firestore");

            const unsub = onSnapshot(
              doc(collection(db, "cities"), "SF"), 
              { includeMetadataChanges: true }, 
              (doc) => {
                // ...
              });
            // [END listen_with_metadata]

            setTimeout(function() {
                unsub();
                done();
            }, 3000);
        }).timeout(5000);

        it("should get multiple documents from a collection", async () => {
            // [START get_multiple]
            const { collection, query, where, getDocs } = require("firebase/firestore");

            const q = query(collection(db, "cities"), where("capital", "==", true));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
            });
            // [END get_multiple]
        }).timeout(5000);

        it("should get all documents from a collection", async () => {
            // [START get_multiple_all]
            const { collection, getDocs } = require("firebase/firestore");

            const querySnapshot = await getDocs(collection(db, "cities"));
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
            });
            // [END get_multiple_all]
        });

        it("should listen on multiple documents #UNVERIFIED", (done) => {
            // [START listen_multiple]
            const { collection, query, where, onSnapshot } = require("firebase/firestore");

            const q = query(collection(db, "cities"), where("state", "==", "CA"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const cities = [];
              querySnapshot.forEach((doc) => {
                  cities.push(doc.data().name);
              });
              console.log("Current cities in CA: ", cities.join(", "));
            });
            // [END listen_multiple]
            setTimeout(function() {
                unsubscribe();
                done();
            }, 2500);
        }).timeout(5000);

        it("should view changes between snapshots #UNVERIFIED", (done) => {
            // [START listen_diffs]
            const { collection, query, where, onSnapshot } = require("firebase/firestore");

            const q = query(collection(db, "cities"), where("state", "==", "CA"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("New city: ", change.doc.data());
                }
                if (change.type === "modified") {
                    console.log("Modified city: ", change.doc.data());
                }
                if (change.type === "removed") {
                    console.log("Removed city: ", change.doc.data());
                }
              });
            });
            // [END listen_diffs]
            setTimeout(function() {
                unsubscribe();
                done();
            }, 2500);
        }).timeout(5000);

        it("should unsubscribe a listener", () => {
            // [START detach_listener]
            const { collection, onSnapshot } = require("firebase/firestore");

            const unsubscribe = onSnapshot(collection(db, "cities"), () => {
              // Respond to data
              // ...
            });
            
            // Later ...

            // Stop listening to changes
            unsubscribe();
            // [END detach_listener]
        });

        it("should handle listener errors", () => {
            // [START handle_listen_errors]
            const { collection, onSnapshot } = require("firebase/firestore");

            const unsubscribe = onSnapshot(
              collection(db, "cities"), 
              (snapshot) => {
                // ...
              },
              (error) => {
                // ...
              });
            // [END handle_listen_errors]
            unsubscribe();
        });

        it("should update a document with server timestamp", async () => {
            async function update() {
                // [START update_with_server_timestamp]
                const { collection, updateDoc, serverTimestamp } = require("firebase/firestore");

                const docRef = doc(collection(db, 'objects'), 'some-id');

                // Update the timestamp field with the value from the server
                const updateTimestamp = await updateDoc(docRef, {
                    timestamp: serverTimestamp()
                });
                // [END update_with_server_timestamp]

                return updateTimestamp;
            }

            const { collection, doc, setDoc } = require("firebase/firestore");

            await setDoc(doc(collection(db, 'objects'), 'some-id'), {});
            await update();
            console.log('Document updated with server timestamp');
        });

        it("should use options to control server timestamp resolution", async () => {
          // [START server_timestamp_resolution_options]
          const { collection, doc, updateDoc, serverTimestamp, onSnapshot } = require("firebase/firestore");
          // Perform an update followed by an immediate read without
          // waiting for the update to complete. Due to the snapshot
          // options we will get two results: one with an estimate
          // timestamp and one with the resolved server timestamp.
          const docRef = doc(collection(db, 'objects'), 'some-id');
          updateDoc(docRef, {
              timestamp: serverTimestamp()
          });

          onSnapshot(docRef, (snapshot) => {
            const data = snapshot.data({
              // Options: 'estimate', 'previous', or 'none'
              serverTimestamps: "estimate"
            });
            console.log(
                'Timestamp: ' + data.timestamp +
                ', pending: ' + snapshot.metadata.hasPendingWrites);
          });
          // [END server_timestamp_resolution_options]
        });

        it("should delete a document field", async () => {
            async function update() {
              // [START update_delete_field]
              const { doc, collection, updateDoc, deleteField } = require("firebase/firestore");

              const cityRef = doc(collection(db, 'cities'), 'BJ');

              // Remove the 'capital' field from the document
              await updateDoc(cityRef, {
                  capital: deleteField()
              });
              // [END update_delete_field]
            }

            const { doc, collection, setDoc } = require("firebase/firestore");

            await setDoc(doc(collection(db,'cities'), 'BJ'), { capital: true });
            await update();
        });

        describe("queries", () => {
            it("should handle simple where", () => {
                // [START simple_queries]
                // Create a reference to the cities collection
                const { collection, query, where } = require("firebase/firestore");
                const citiesRef = collection(db, "cities");

                // Create a query against the collection.
                const q = query(citiesRef, where("state", "==", "CA"));
                // [END simple_queries]
            });

            it("should handle another simple where", () => {
                // [START simple_queries_again]
                const { collection, query, where } = require("firebase/firestore");
                const citiesRef = collection(db, "cities");

                const q = query(citiesRef, where("capital", "==", true));
                // [END simple_queries_again]
            });

            it("should handle other wheres", () => {
              const { collection, query, where } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START example_filters]
              const q1 =  query(citiesRef, where("state", "==", "CA"));
              const q2 =  query(citiesRef, where("population", "<", 100000));
              const q3 =  query(citiesRef, where("name", ">=", "San Francisco"));
              // [END example_filters]

              // [START simple_query_not_equal]
              const q4 = query(citiesRef, where("capital", "!=", false));
              // [END simple_query_not_equal]
            });

            it("should handle array-contains where", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START array_contains_filter]
              const { query, where } = require("firebase/firestore");  
              const q = query(citiesRef, where("regions", "array-contains", "west_coast"));
              // [END array_contains_filter]
            });

            it("should handle an array contains any where", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START array_contains_any_filter]
              const { query, where } = require("firebase/firestore");  

              const q = query(citiesRef, 
                where('regions', 'array-contains-any', ['west_coast', 'east_coast']));
              // [END array_contains_any_filter]
            });

            it("should handle an in where", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              function inFilter() {
                // [START in_filter]
                const { query, where } = require("firebase/firestore");

                const q = query(citiesRef, where('country', 'in', ['USA', 'Japan']));
                // [END in_filter]
              }

              function notInFilter() {
                // [START not_in_filter]
                const { query, where } = require("firebase/firestore");

                const q = query(citiesRef, where('country', 'not-in', ['USA', 'Japan']));
                // [END not_in_filter]
              }

              function inFilterWithArray() {
                // [START in_filter_with_array]
                const { query, where } = require("firebase/firestore");  

                const q = query(citiesRef, where('regions', 'in', [['west_coast', 'east_coast']]));
                // [END in_filter_with_array]
              }
            });

            it("should handle compound queries", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START chain_filters]
              const { query, where } = require("firebase/firestore");  

              const q1 = query(citiesRef, where("state", "==", "CO"), where("name", "==", "Denver"));
              const q2 = query(citiesRef, where("state", "==", "CA"), where("population", "<", 1000000));
              // [END chain_filters]
            });

            it("should handle range filters on one field", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START valid_range_filters]
              const { query, where } = require("firebase/firestore");  

              const q1 = query(citiesRef, where("state", ">=", "CA"), where("state", "<=", "IN"));
              const q2 = query(citiesRef, where("state", "==", "CA"), where("population", ">", 1000000));
              // [END valid_range_filters]
            });

            it("should not handle range filters on multiple field", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              expect(() => {
                // [START invalid_range_filters]
                const { query, where } = require("firebase/firestore");  

                const q = query(citiesRef, where("state", ">=", "CA"), where("population", ">", 100000));
                // [END invalid_range_filters]
              }).to.throw;
            });

            it("should order and limit", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START order_and_limit]
              const { query, orderBy, limit } = require("firebase/firestore");  

              const q = query(citiesRef, orderBy("name"), limit(3));
              // [END order_and_limit]
            });

            it("should order descending", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START order_and_limit_desc]
              const { query, orderBy, limit } = require("firebase/firestore");  

              const q = query(citiesRef, orderBy("name", "desc"), limit(3));
              // [END order_and_limit_desc]
            });

            it("should order descending by other field", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START order_multiple]
              const { query, orderBy } = require("firebase/firestore");  

              const q = query(citiesRef, orderBy("state"), orderBy("population", "desc"));
              // [END order_multiple]
            });

            it("should where and order by with limit", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START filter_and_order]
              const { query, where, orderBy, limit } = require("firebase/firestore");  

              const q = query(citiesRef, where("population", ">", 100000), orderBy("population"), limit(2));
              // [END filter_and_order]
            });

            it("should where and order on same field", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START valid_filter_and_order]
              const { query, where, orderBy } = require("firebase/firestore");  

              const q = query(citiesRef, where("population", ">", 100000), orderBy("population"));
              // [END valid_filter_and_order]
            });

            it("should not where and order on same field", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              expect(() => {
                // [START invalid_filter_and_order]
                const { query, where, orderBy } = require("firebase/firestore");  
                
                const q = query(citiesRef, where("population", ">", 100000), orderBy("country"));
                // [END invalid_filter_and_order]
              }).to.throw;
            });

            it("should handle startAt", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START order_and_start]
              const { query, orderBy, startAt } = require("firebase/firestore");  

              const q = query(citiesRef, orderBy("population"), startAt(1000000));
              // [END order_and_start]
            });

            it("should handle endAt", () => {
              const { collection } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              // [START order_and_end]
              const { query, orderBy, endAt } = require("firebase/firestore");  

              const q = query(citiesRef, orderBy("population"), endAt(1000000));
              // [END order_and_end]
            });

            it("should handle startAt(doc) ", async () => {
              // [START start_doc]
              const { collection, doc, getDoc, query, orderBy, startAt } = require("firebase/firestore");  
              const citiesRef = collection(db, "cities");

              const docSnap = await getDoc(doc(citiesRef, "SF"));
              
              // Get all cities with a population bigger than San Francisco
              const biggerThanSf = query(citiesRef, orderBy("popuation"), startAt(docSnap));
              // ...
              // [END start_doc]
            });

            it("should handle multiple orderBy", () => {
                // [START start_multiple_orderby]
                // Will return all Springfields
                const { collection, query, orderBy, startAt } = require("firebase/firestore");  
                const q1 = query(collection(db, "cities"),
                   orderBy("name"),
                   orderBy("state"),
                   startAt("Springfield"));

                // Will return "Springfield, Missouri" and "Springfield, Wisconsin"
                const q2 = query(collection(db, "cities"),
                   orderBy("name"),
                   orderBy("state"),
                   startAt("Springfield", "Missouri"));
                // [END start_multiple_orderby]
            });

            it("should paginate", async () => {
              // [START paginate]
              const { collection, query, orderBy, startAfter, limit, getDocs } = require("firebase/firestore");  
      
              // Query the first page of docs
              const first = query(collection(db, "cities"), orderBy("population"), limit(25));
              const documentSnapshots = await getDocs(first);

              // Get the last visible document
              const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
              console.log("last", lastVisible);

              // Construct a new query starting at this document,
              // get the next 25 cities.
              const next = query(collection(db, "cities"),
                  orderBy("population"),
                  startAfter(lastVisible),
                  limit(25));
              // [END paginate]
            });
        });

        describe('collectionGroup(landmarks)', () => {
            it("should setup example data", async () => {
                // [START fs_collection_group_query_data_setup]
                const { collection, doc, setDoc } = require("firebase/firestore");  

                const citiesRef = collection(db, 'cities');

                await Promise.all([
                    setDoc(doc(collection(doc(citiesRef, 'SF'), 'landmarks')), {
                        name: 'Golden Gate Bridge',
                        type: 'bridge'
                    }),
                    setDoc(doc(collection(doc(citiesRef, 'SF'), 'landmarks')), {
                        name: 'Legion of Honor',
                        type: 'museum'
                    }),
                    setDoc(doc(collection(doc(citiesRef, 'LA'), 'landmarks')), {
                        name: 'Griffith Park',
                        type: 'park'
                    }),
                    setDoc(doc(collection(doc(citiesRef, 'LA'), 'landmarks')), {
                        name: 'The Getty',
                        type: 'museum'
                    }),
                    setDoc(doc(collection(doc(citiesRef, 'DC'), 'landmarks')), {
                        name: 'Lincoln Memorial',
                        type: 'memorial'
                    }),
                    setDoc(doc(collection(doc(citiesRef, 'DC'), 'landmarks')), {
                        name: 'National Air and Space Museum',
                        type: 'museum'
                    }),
                    setDoc(doc(collection(doc(citiesRef, 'TOK'), 'landmarks')), {
                        name: 'Ueno Park',
                        type: 'park'
                    }),
                    setDoc(doc(collection(doc(citiesRef, 'TOK'), 'landmarks')), {
                        name: 'National Museum of Nature and Science',
                        type: 'museum'
                    }),
                    setDoc(doc(collection(doc(citiesRef, 'BJ'), 'landmarks')), {
                        name: 'Jingshan Park',
                        type: 'park'
                    }),
                    setDoc(doc(collection(doc(citiesRef, 'BJ'), 'landmarks')), {
                        name: 'Beijing Ancient Observatory',
                        type: 'museum'
                    })
                ]);
                // [END fs_collection_group_query_data_setup]
            });
            
            it("should query a collection group", async () => {
                // [START fs_collection_group_query]
                const { collectionGroup, query, where, getDocs } = require("firebase/firestore");  

                const museums = query(collectionGroup(db, 'landmarks'), where('type', '==', 'museum'));
                const querySnapshot = await getDocs(museums);
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data());
                });
                // [END fs_collection_group_query]
            });
        });
    });

    // TODO: Break out into separate file
    describe("solution-aggregation", () => {
        it("should update a restaurant in a transaction #UNVERIFIED", async () => {
            // [START add_rating_transaction]
            const { collection, doc, runTransaction} = require("firebase/firestore");  

            async function addRating(restaurantRef, rating) {
                // Create a reference for a new rating, for use inside the transaction
                const ratingRef = doc(collection(restaurantRef, 'ratings'));

                // In a transaction, add the new rating and update the aggregate totals
                await runTransaction(db, async (transaction) => {
                    const res = await transaction.get(restaurantRef);
                    if (!res.exists()) {
                        throw "Document does not exist!";
                    }

                    // Compute new number of ratings
                    const newNumRatings = res.data().numRatings + 1;

                    // Compute new average rating
                    const oldRatingTotal = res.data().avgRating * res.data().numRatings;
                    const newAvgRating = (oldRatingTotal + rating) / newNumRatings;

                    // Commit to Firestore
                    transaction.update(restaurantRef, {
                        numRatings: newNumRatings,
                        avgRating: newAvgRating
                    });
                    transaction.set(ratingRef, { rating: rating });
                });
            }
            // [END add_rating_transaction]

            // Create document and add a rating
            const { setDoc } = require("firebase/firestore");
            const ref = doc(collection(db, 'restaurants'), ('arinell-pizza'));
            await setDoc(ref, {
                name: 'Arinell Pizza',
                avgRating: 4.63,
                numRatings: 683
            });
            await addRating(ref, 5.0);
        });
    });
});
