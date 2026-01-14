// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

const { expect } = require('chai');
import { addDoc, or } from "firebase/firestore";

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
const cityConverter = {
    toFirestore: (city) => {
        return {
            name: city.name,
            state: city.state,
            country: city.country
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new City(data.name, data.state, data.country);
    }
};
// [END city_custom_object]

describe("firestore", () => {
    const { Firestore } = require("firebase/firestore");

    /** @type {Firestore} */
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
        projectId: '### FIREBASE PROJECT ID ###',
      } ,"persisted_app");

      const db = getFirestore(app);

      const {
        initializeFirestore,
        memoryLocalCache,
        persistentLocalCache,
        persistentSingleTabManager,
        persistentMultipleTabManager
      } = require("firebase/firestore"); 

      // [START initialize_persistence]
      // Memory cache is the default if no config is specified.
      initializeFirestore(app, {});

      // This is the default behavior if no persistence is specified.
      initializeFirestore(app, {localCache: memoryLocalCache()});

      // Defaults to single-tab persistence if no tab manager is specified.
      initializeFirestore(app, {localCache: persistentLocalCache(/*settings*/{})});

      // Same as `initializeFirestore(app, {localCache: persistentLocalCache(/*settings*/{})})`,
      // but more explicit about tab management.
      initializeFirestore(app, 
        {localCache: 
          persistentLocalCache(/*settings*/{tabManager: persistentSingleTabManager({})})
      });

      // Use multi-tab IndexedDb persistence.
      initializeFirestore(app, 
        {localCache: 
          persistentLocalCache(/*settings*/{tabManager: persistentMultipleTabManager()})
        });
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
                snapshot.forEach((userSnapshot) => {
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
            const { doc } = require("firebase/firestore");

            const alovelaceDocumentRef = doc(db, 'users', 'alovelace');
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
            const { doc } = require("firebase/firestore"); 

            const messageRef = doc(db, "rooms", "roomA", "messages", "message1");
            // [END subcollection_reference]
        });

        it("should set a document", async () => {
            // [START set_document]
            const { doc, setDoc } = require("firebase/firestore"); 

            // Add a new document in collection "cities"
            await setDoc(doc(db, "cities", "LA"), {
              name: "Los Angeles",
              state: "CA",
              country: "USA"
            });
            // [END set_document]
        });

        it("should set document with a custom object converter", async () => {
            // [START set_custom_object]
            const { doc, setDoc } = require("firebase/firestore"); 
            
            // Set with cityConverter
            const ref = doc(db, "cities", "LA").withConverter(cityConverter);
            await setDoc(ref, new City("Los Angeles", "CA", "USA"));
            // [END set_custom_object]
        });

        it("should get document with a custom object converter", async () => {
            // [START get_custom_object]
            const { doc, getDoc} = require("firebase/firestore"); 

            const ref = doc(db, "cities", "LA").withConverter(cityConverter);
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
            const { writeBatch, doc } = require("firebase/firestore"); 

            // Get a new write batch
            const batch = writeBatch(db);

            // Set the value of 'NYC'
            const nycRef = doc(db, "cities", "NYC");
            batch.set(nycRef, {name: "New York City"});

            // Update the population of 'SF'
            const sfRef = doc(db, "cities", "SF");
            batch.update(sfRef, {"population": 1000000});

            // Delete the city 'LA'
            const laRef = doc(db, "cities", "LA");
            batch.delete(laRef);

            // Commit the batch
            await batch.commit();
            // [END write_batch]
        });

        it("should set a document with every datatype #UNVERIFIED", async () => {
            // [START data_types]
            const { doc, setDoc, Timestamp } = require("firebase/firestore"); 

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
            await setDoc(doc(db, "data", "one"), docData);
            // [END data_types]
        });

        it("should allow set with merge", async () => {
            // [START set_with_merge]
            const { doc, setDoc } = require("firebase/firestore"); 

            const cityRef = doc(db, 'cities', 'BJ');
            setDoc(cityRef, { capital: true }, { merge: true });
            // [END set_with_merge]
        });

        it("should update a document's nested fields #UNVERIFIED", async () => {
            // [START update_document_nested]
            const { doc, setDoc, updateDoc } = require("firebase/firestore"); 

            // Create an initial document to update.
            const frankDocRef = doc(db, "users", "frank");
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

              return new Promise((resolve) => {
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
            const { doc, setDoc } = require("firebase/firestore"); 

            await setDoc(doc(db, "cities", "new-city-id"), data);
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
            const { doc, updateDoc } = require("firebase/firestore");

            const washingtonRef = doc(db, "cities", "DC");

            // Set the "capital" field of the city 'DC'
            await updateDoc(washingtonRef, {
              capital: true
            });
            // [END update_document]
        });

        it("should update an array field in a document", async () => {
            // [START update_document_array]
            const { doc, updateDoc, arrayUnion, arrayRemove } = require("firebase/firestore");

            const washingtonRef = doc(db, "cities", "DC");

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
            const { doc, updateDoc, increment } = require("firebase/firestore");

            const washingtonRef = doc(db, "cities", "DC");

            // Atomically increment the population of the city by 50.
            await updateDoc(washingtonRef, {
                population: increment(50)
            });
            // [END update_document_increment]
        });

        it("should delete a document", async () => {
            // [START delete_document]
            const { doc, deleteDoc } = require("firebase/firestore");

            await deleteDoc(doc(db, "cities", "DC"));
            // [END delete_document]
        });

        it("should handle transactions", async () => {
            const { doc, setDoc } = require("firebase/firestore");

            const sfDocRef = doc(db, "cities", "SF");
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
            const { doc, runTransaction } = require("firebase/firestore");

            // Create a reference to the SF doc.
            const sfDocRef = doc(db, "cities", "SF");

            try {
              const newPopulation = await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                  throw "Document does not exist!";
                }

                const newPop = sfDoc.data().population + 1;
                if (newPop <= 1000000) {
                  transaction.update(sfDocRef, { population: newPop });
                  return newPop;
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
            const { doc, getDoc } = require("firebase/firestore");

            const docRef = doc(db, "cities", "SF");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              console.log("Document data:", docSnap.data());
            } else {
              // docSnap.data() will be undefined in this case
              console.log("No such document!");
            }
            // [END get_document]
        });

        it("should get a document with options", async () => {
            // [START get_document_options]
            const { doc, getDocFromCache } = require("firebase/firestore");

            const docRef = doc(db, "cities", "SF");

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
            const { doc, onSnapshot } = require("firebase/firestore");

            const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
                console.log("Current data: ", doc.data());
            });
            // [END listen_document]

            setTimeout(() => {
                unsub();
                done();
            }, 3000);
        }).timeout(5000);

        it("should listen on a single document with metadata", (done) => {
            // [START listen_document_local]
            const { doc, onSnapshot } = require("firebase/firestore");

            const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
              const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
              console.log(source, " data: ", doc.data());
            });
            // [END listen_document_local]

            setTimeout(() => {
                unsub();
                done();
            }, 3000);
        }).timeout(5000);

        it("should listen on a single document with options #UNVERIFIED", (done) => {
            // [START listen_with_metadata]
            const { doc, onSnapshot } = require("firebase/firestore");

            const unsub = onSnapshot(
              doc(db, "cities", "SF"), 
              { includeMetadataChanges: true }, 
              (doc) => {
                // ...
              });
            // [END listen_with_metadata]

            setTimeout(() => {
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

        it("should get all documents from a subcollection", async () => {
          // [START firestore_query_subcollection]
          const { collection, getDocs } = require("firebase/firestore");
          // Query a reference to a subcollection
          const querySnapshot = await getDocs(collection(db, "cities", "SF", "landmarks"));
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });
          // [END firestore_query_subcollection]
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
            setTimeout(() => {
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
            setTimeout(() => {
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
                const { updateDoc, serverTimestamp } = require("firebase/firestore");

                const docRef = doc(db, 'objects', 'some-id');

                // Update the timestamp field with the value from the server
                const updateTimestamp = await updateDoc(docRef, {
                    timestamp: serverTimestamp()
                });
                // [END update_with_server_timestamp]

                return updateTimestamp;
            }

            const { doc, setDoc } = require("firebase/firestore");

            await setDoc(doc(db, 'objects', 'some-id'), {});
            await update();
            console.log('Document updated with server timestamp');
        });

        it("should use options to control server timestamp resolution", async () => {
          // [START server_timestamp_resolution_options]
          const { doc, updateDoc, serverTimestamp, onSnapshot } = require("firebase/firestore");
          // Perform an update followed by an immediate read without
          // waiting for the update to complete. Due to the snapshot
          // options we will get two results: one with an estimate
          // timestamp and one with the resolved server timestamp.
          const docRef = doc(db, 'objects', 'some-id');
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
              const { doc, updateDoc, deleteField } = require("firebase/firestore");

              const cityRef = doc(db, 'cities', 'BJ');

              // Remove the 'capital' field from the document
              await updateDoc(cityRef, {
                  capital: deleteField()
              });
              // [END update_delete_field]
            }

            const { doc, setDoc } = require("firebase/firestore");

            await setDoc(doc(db, 'cities', 'BJ'), { capital: true });
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
              const stateQuery = query(citiesRef, where("state", "==", "CA"));
              const populationQuery = query(citiesRef, where("population", "<", 100000));
              const nameQuery = query(citiesRef, where("name", ">=", "San Francisco"));
              // [END example_filters]

              // [START simple_query_not_equal]
              const notCapitalQuery = query(citiesRef, where("capital", "!=", false));
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
                where('regions', 'array-contains-any', [['west_coast'], ['east_coast']]));
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

                const q = query(citiesRef, where('regions', 'in', [['west_coast'], ['east_coast']]));
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
              const biggerThanSf = query(citiesRef, orderBy("population"), startAt(docSnap));
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

            it("should handle OR queries", async () => {
              const { collection, query, where, and } = require("firebase/firestore");
              // [START or_query]
              const q = query(collection(db, "cities"), and(
                where('state', '==', 'CA'),   
                or(
                  where('capital', '==', true),
                  where('population', '>=', 1000000)
                )
              ));
              // [END or_query]
            });

            it("should allow for 30 or fewer disjunctions", async () => {
              const { collection, query, where, and } = require("firebase/firestore");
              const collectionRef = collection(db, "cities");
              // [START one_disjunction]
              query(collectionRef, where("a", "==", 1));
              // [END one_disjunction]

              // [START two_disjunctions]
              query(collectionRef, or( where("a", "==", 1), where("b", "==", 2) ));
              // [END two_disjunctions]

              // [START four_disjunctions]
              query(collectionRef,
                or( and( where("a", "==", 1), where("c", "==", 3) ),
                    and( where("a", "==", 1), where("d", "==", 4) ),
                    and( where("b", "==", 2), where("c", "==", 3) ),
                    and( where("b", "==", 2), where("d", "==", 4) )
                )
              );
              // [END four_disjunctions]

              // [START four_disjunctions_compact]
              query(collectionRef,
                and( or( where("a", "==", 1), where("b", "==", 2) ),
                     or( where("c", "==", 3), where("d", "==", 4) )
                )
              );
              // [END four_disjunctions_compact]

              expect(() => {
                // [START 50_disjunctions]
                query(collectionRef,
                  and( where("a", "in", [1, 2, 3, 4, 5]),
                       where("b", "in", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                  )
                );
                // [END 50_disjunctions]
              }).to.throw;

              // [START 20_disjunctions]
              query(collectionRef,
                or( where("a", "in", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
                    where("b", "in", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                )
              );
              // [END 20_disjunctions]

              // [START 10_disjunctions]
              query(collectionRef,
                and( where("a", "in", [1, 2, 3, 4, 5]),
                     or( where("b", "==", 2),
                         where("c", "==", 3)
                     )
                )
              );
              // [END 10_disjunctions]
            });
        });

        describe('collectionGroup(landmarks)', () => {
            it("should setup example data", async () => {
                // [START fs_collection_group_query_data_setup]
                const { collection, addDoc } = require("firebase/firestore");  

                const citiesRef = collection(db, 'cities');

                await Promise.all([
                    addDoc(collection(citiesRef, 'SF', 'landmarks'), {
                        name: 'Golden Gate Bridge',
                        type: 'bridge'
                    }),
                    addDoc(collection(citiesRef, 'SF', 'landmarks'), {
                        name: 'Legion of Honor',
                        type: 'museum'
                    }),
                    addDoc(collection(citiesRef, 'LA', 'landmarks'), {
                        name: 'Griffith Park',
                        type: 'park'
                    }),
                    addDoc(collection(citiesRef, 'LA', 'landmarks'), {
                        name: 'The Getty',
                        type: 'museum'
                    }),
                    addDoc(collection(citiesRef, 'DC', 'landmarks'), {
                        name: 'Lincoln Memorial',
                        type: 'memorial'
                    }),
                    addDoc(collection(citiesRef, 'DC', 'landmarks'), {
                        name: 'National Air and Space Museum',
                        type: 'museum'
                    }),
                    addDoc(collection(citiesRef, 'TOK', 'landmarks'), {
                        name: 'Ueno Park',
                        type: 'park'
                    }),
                    addDoc(collection(citiesRef, 'TOK', 'landmarks'), {
                        name: 'National Museum of Nature and Science',
                        type: 'museum'
                    }),
                    addDoc(collection(citiesRef, 'BJ', 'landmarks'), {
                        name: 'Jingshan Park',
                        type: 'park'
                    }),
                    addDoc(collection(citiesRef, 'BJ', 'landmarks'), {
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

    describe("aggregate queries", () => {
        it("should fetch the count of documents in a collection", async () => {
            const { collection, getCountFromServer } = require("firebase/firestore"); 
            // [START count_aggregate_collection]
            const coll = collection(db, "cities");
            const snapshot = await getCountFromServer(coll);
            console.log('count: ', snapshot.data().count);
            // [END count_aggregate_collection]
        });

        it("should fetch the count of documents in a query", async () => {
            const { collection, getCountFromServer, where, query } = require("firebase/firestore"); 
            // [START count_aggregate_query]
            const coll = collection(db, "cities");
            const q = query(coll, where("state", "==", "CA"));
            const snapshot = await getCountFromServer(q);
            console.log('count: ', snapshot.data().count);
            // [END count_aggregate_query]
        });
    });

    // TODO: Break out into separate file
    describe("solution-aggregation", () => {
        it("should update a restaurant in a transaction #UNVERIFIED", async () => {
            // [START add_rating_transaction]
            const { collection, doc, runTransaction } = require("firebase/firestore");  

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
            const ref = doc(db, 'restaurants', 'arinell-pizza');
            await setDoc(ref, {
                name: 'Arinell Pizza',
                avgRating: 4.63,
                numRatings: 683
            });
            await addRating(ref, 5.0);
        });
    });
});

describe("firestore-pipelines", () => {
    const {
        Firestore,
        Timestamp,
        collection,
        doc,
        getFirestore,
        orderBy,
        query,
        setDoc,
        startAt,
    } = require("firebase/firestore")
    const {
        Pipeline,
        array,
        field,
        constant,
        countAll,
        sum,
        average,
        maximum,
        AggregateFunction,
        and,
        or,
        xor,
        conditional,
        concat,
        like,
        execute
    } = require("firebase/firestore/pipelines");

    let app;
    /** @type {Firestore} */ let db;

    before(() => {
        const { initializeApp } = require("firebase/app");
        const config = {
            apiKey: "AIzaSyCM61mMr_iZnP1DzjT1PMB5vDGxfyWNM64",
            authDomain: "firestore-snippets.firebaseapp.com",
            projectId: "firestore-snippets"
        };
        app = initializeApp(config);
        db = getFirestore(app, "enterprise");
    });

    async function typeAndGenericFunctionsExample() {
        // [START type_function]
        field("rating").type();
        // [END type_function]

        // [START concat_function]
        concat(constant("Author ID: "), field("authorId"));
        // [END concat_function]

        // [START length_function]
        field("tags").length();
        // [END length_function]

        // [START reverse_function]
        field("tags").reverse();
        // [END reverse_function]
    }

    async function stagesExpressionsExample() {
      // [START stages_expressions_example]
      const trailing30Days = constant(Timestamp.now().toMillis())
        .unixMillisToTimestamp()
        .timestampSubtract("day", 30);
      const snapshot = await execute(db.pipeline()
        .collection("productViews")
        .where(field("viewedAt").greaterThan(trailing30Days))
        .aggregate(field("productId").countDistinct().as("uniqueProductViews"))
      );
      // [END stages_expressions_example]
      console.log(snapshot);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/where

    async function createWhereData() {
      // [START create_where_data]
      await setDoc(doc(collection(db, "cities"), "SF"),
        { name: "San Francisco", state: "CA", country: "USA", population: 870000 }
      );

      await setDoc(doc(collection(db, "cities"), "LA"),
        { name: "Los Angeles", state: "CA", country: "USA", population: 3970000 }
      );
      await setDoc(doc(collection(db, "cities"), "NY"),
        { name: "New York", state: "NY", country: "USA", population: 8530000 }
      );
      await setDoc(doc(collection(db, "cities"), "TOR"),
        { name: "Toronto", state: null, country: "Canada", population: 2930000 }
      );
      await setDoc(doc(collection(db, "cities"), "MEX"),
        { name: "Mexico City", state: null, country: "Mexico", population: 9200000 }
      );
      // [END create_where_data]
    }

    async function whereEqualityExample() {
      // [START where_equality_example]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .where(field("state").equal("CA")));
      // [END where_equality_example]
      console.log(cities);
    }

    async function whereMultipleStagesExample() {
      // [START where_multiple_stages]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .where(field("location.country").equal("USA"))
        .where(field("population").greaterThan(500000)));
      // [END where_multiple_stages]
      console.log(cities);
    }

    async function whereComplexExample() {
      // [START where_complex]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .where(
          or(
            like(field("name"), "San%"),
            and(
              field("location.state").charLength().greaterThan(7),
              field("location.country").equal("USA")
            )
          )
        ));
      // [END where_complex]
      console.log(cities);
    }

    async function whereStageOrderExample() {
      // [START where_stage_order]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .limit(10)
        .where(field("location.country").equal("USA")));
      // [END where_stage_order]
      console.log(cities);
    }

    async function whereHavingExample() {
      // [START where_having_example]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .aggregate({
          accumulators: [field("population").sum().as("totalPopulation")],
          groups: ["location.state"]
        })
        .where(field("totalPopulation").greaterThan(10000000)));
      // [END where_having_example]
      console.log(cities);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/unnest

    async function unnestSyntaxExample() {
      // [START unnest_syntax]
      const userScore = await execute(db.pipeline()
        .collection("users")
        .unnest(field("scores").as("userScore"), /* index_field= */ "attempt"));
      // [END unnest_syntax]
      console.log(userScore);
    }

    async function unnestAliasIndexDataExample() {
      // [START unnest_alias_index_data]
      await addDoc(collection(db, "users"), {name: "foo", scores: [5, 4], userScore: 0});
      await addDoc(collection(db, "users"), {name: "bar", scores: [1, 3], attempt: 5});
      // [END unnest_alias_index_data]
    }

    async function unnestAliasIndexExample() {
      // [START unnest_alias_index]
      const userScore = await execute(db.pipeline()
        .collection("users")
        .unnest(field("scores").as("userScore"), /* index_field= */ "attempt"));
      // [END unnest_alias_index]
      console.log(userScore);
    }

    async function unnestNonArrayDataExample() {
      // [START unnest_nonarray_data]
        await addDoc(collection(db, "users"), {name: "foo", scores: 1});
        await addDoc(collection(db, "users"), {name: "bar", scores: null});
        await addDoc(collection(db, "users"), {name: "qux", scores: {backupScores: 1}});
      // [END unnest_nonarray_data]
    }

    async function unnestNonArrayExample() {
      // [START unnest_nonarray]
      const userScore = await execute(db.pipeline()
        .collection("users")
        .unnest(field("scores").as("userScore"), /* index_field= */ "attempt"));
      // [END unnest_nonarray]
      console.log(userScore);
    }

    async function unnestEmptyArrayDataExample() {
      // [START unnest_empty_array_data]
      await addDoc(collection(db, "users"), {name: "foo", scores: [5, 4]});
      await addDoc(collection(db, "users"), {name: "bar", scores: []});
      // [END unnest_empty_array_data]
    }

    async function unnestEmptyArrayExample() {
      // [START unnest_empty_array]
      const userScore = await execute(db.pipeline()
        .collection("users")
        .unnest(field("scores").as("userScore"), /* index_field= */ "attempt"));
      // [END unnest_empty_array]
      console.log(userScore);
    }

    async function unnestPreserveEmptyArrayExample() {
      // [START unnest_preserve_empty_array]
      const userScore = await execute(db.pipeline()
        .collection("users")
        .unnest(
          conditional(
            field("scores").equal(array([])),
            array([field("scores")]),
            field("scores")
          ).as("userScore"),
        /* index_field= */ "attempt"));
      // [END unnest_preserve_empty_array]
      console.log(userScore);
    }

    async function unnestNestedDataExample() {
      // [START unnest_nested_data]
      await addDoc(collection(db, "users"), {
        name: "foo", 
        record: [
          {
            scores: [5, 4], 
            avg: 4.5
          }, {
            scores: [1, 3],
            old_avg: 2
          }
        ]
      });
      // [END unnest_nested_data]
    }

    async function unnestNestedExample() {
      // [START unnest_nested]
      const userScore = await execute(db.pipeline()
        .collection("users")
        .unnest(field("record").as("record"))
        .unnest(field("record.scores").as("userScore"), /* index_field= */ "attempt"));
      // [END unnest_nested]
      console.log(userScore);
    }

    // https://cloud.corp.google.com/firestore/docs/pipeline/stages/transformation/sample

    async function sampleSyntaxExample() {
      // [START sample_syntax]
      let sampled = await execute(db.pipeline()
        .database()
        .sample(50));

      sampled = await execute(db.pipeline()
        .database()
        .sample({ percentage: 0.5 }));
      // [END sample_syntax]
      console.log(sampled);
    }

    async function sampleDocumentsDataExample() {
      // [START sample_documents_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {name: "San Francisco", state: "California"});
      await setDoc(doc(collection(db, "cities"), "NYC"), {name: "New York City", state: "New York"});
      await setDoc(doc(collection(db, "cities"), "CHI"), {name: "Chicago", state: "Illinois"});
      // [END sample_documents_data]
    }

    async function sampleDocumentsExample() {
      // [START sample_documents]
      const sampled = await execute(db.pipeline()
        .collection("cities")
        .sample(1));
      // [END sample_documents]
      console.log(sampled);
    }

    async function sampleAllDocumentsExample() {
      // [START sample_all_documents]
      const sampled = await execute(db.pipeline()
        .collection("cities")
        .sample(5));
      // [END sample_all_documents]
      console.log(sampled);
    }

    async function samplePercentageDataExample() {
      // [START sample_percentage_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {name: "San Francsico", state: "California"});
      await setDoc(doc(collection(db, "cities"), "NYC"), {name: "New York City", state: "New York"});
      await setDoc(doc(collection(db, "cities"), "CHI"), {name: "Chicago", state: "Illinois"});
      await setDoc(doc(collection(db, "cities"), "ATL"), {name: "Atlanta", state: "Georgia"});
      // [END sample_percentage_data]
    }

    async function samplePercentageExample() {
      // [START sample_percentage]
      const sampled = await execute(db.pipeline()
        .collection("cities")
        .sample({ percentage: 0.5 }));
      // [END sample_percentage]
      console.log(sampled);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/sort

    async function sortSyntaxExample() {
      // [START sort_syntax]
      const results = await execute(db.pipeline()
        .collection("cities")
        .sort(field("population").ascending()));
      // [END sort_syntax]
      console.log(results);
    }

    async function sortSyntaxExample2() {
      // [START sort_syntax_2]
      const results = await execute(db.pipeline()
        .collection("cities")
        .sort(field("name").charLength().ascending()));
      // [END sort_syntax_2]
      console.log(results);
    }

    async function sortDocumentIDExample() {
      // [START sort_document_id]
      const results = await execute(db.pipeline()
        .collection("cities")
        .sort(field("country").ascending(), field("__name__").ascending()));
      // [END sort_document_id]
      console.log(results);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/select

    async function selectSyntaxExample() {
      // [START select_syntax]
      const names = await execute(db.pipeline()
        .collection("cities")
        .select(
          field("name").stringConcat(", ", field("location.country")).as("name"),
          "population"
        ));
      // [END select_syntax]
      console.log(names);
    }

    async function selectPositionDataExample() {
      // [START select_position_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {
        name: "San Francisco", population: 800000, location: {country: "USA", state: "California"}
      });
      await setDoc(doc(collection(db, "cities"), "TO"), {
        name: "Toronto", population: 3000000, location: {country: "Canada", province: "Ontario"}
      });
      // [END select_position_data]
    }

    async function selectPositionExample() {
      // [START select_position]
      const names = await execute(db.pipeline()
        .collection("cities")
        .where(field("location.country").equal("Canada"))
        .select(
          field("name").stringConcat(", ", field("location.country")).as("name"),
          "population"));
      // [END select_position]
      console.log(names);
    }

    async function selectBadPositionExample() {
      // [START select_bad_position]
      const names = await execute(db.pipeline()
        .collection("cities")
        .select(
          field("name").stringConcat(", ", field("location.country")).as("name"),
          "population")
        .where(field("location.country").equal("Canada")));
      // [END select_bad_position]
      console.log(names);
    }

    async function selectNestedDataExample() {
      // [START select_nested_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {name: "San Francisco", population: 800000, location: {country: "USA", state: "California"}, landmarks: ["Golden Gate Bridge", "Alcatraz"]});
      await setDoc(doc(collection(db, "cities"), "TO"), {name: "Toronto", population:  3000000, province: "ON", location: {country: "Canada", province: "Ontario"}, landmarks: ["CN Tower", "Casa Loma"]});
      await setDoc(doc(collection(db, "cities"), "AT"), {name: "Atlantis", population: null});
      // [END select_nested_data]
    }

    async function selectNestedExample() {
      // [START select_nested]
      const locations = await execute(db.pipeline()
        .collection("cities")
        .select(
          field("name").as("city"),
          field("location.country").as("country"),
          field("landmarks").arrayGet(0).as("topLandmark")
        ));
      // [END select_nested]
      console.log(locations);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/remove_fields

    async function removeFieldsSyntaxExample() {
      // [START remove_fields_syntax]
      const results = await execute(db.pipeline()
        .collection("cities")
        .removeFields("population", "location.state"));
      // [END remove_fields_syntax]
      console.log(results);
    }

    async function removeFieldsNestedDataExample() {
      // [START remove_fields_nested_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {
        name: "San Francisco", location: {country: "USA", state: "California"}
      });
      await setDoc(doc(collection(db, "cities"), "TO"), {
        name: "Toronto", location: {country: "Canada", province: "Ontario"}
      });
      // [END remove_fields_nested_data]
    }

    async function removeFieldsNestedExample() {
      // [START remove_fields_nested]
      const results = await execute(db.pipeline()
        .collection("cities")
        .removeFields("location.state"));
      // [END remove_fields_nested]
      console.log(results);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/limit

    async function limitSyntaxExample() {
      // [START limit_syntax]
      const results = await execute(db.pipeline()
        .collection("cities")
        .limit(10));
      // [END limit_syntax]
      console.log(results);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/find_nearest

    async function findNearestSyntaxExample() {
      // [START find_nearest_syntax]
      const results = await execute(db.pipeline()
        .collection("cities")
        .findNearest({
            field: "embedding",
            vectorValue: [1.5, 2.345],
            distanceMeasure: "euclidean"
        }));
      // [END find_nearest_syntax]
    }

    async function findNearestLimitExample() {
      // [START find_nearest_limit]
      const results = await execute(db.pipeline()
        .collection("cities")
        .findNearest({
            field: "embedding",
            vectorValue: [1.5, 2.345],
            distanceMeasure: "euclidean",
            limit: 10
        }));
      // [END find_nearest_limit]
      console.log(results);
    }

    async function findNearestDistanceDataExample() {
      // [START find_nearest_distance_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {name: "San Francisco", embedding: [1.0, -1.0]});
      await setDoc(doc(collection(db, "cities"), "TO"), {name: "Toronto", embedding: [5.0, -10.0]});
      await setDoc(doc(collection(db, "cities"), "AT"), {name: "Atlantis", embedding: [2.0, -4.0]});
      // [END find_nearest_distance_data]
    }

    async function findNearestDistanceExample() {
      // [START find_nearest_distance]
      const results = await execute(db.pipeline()
      .collection("cities")
      .findNearest({
          field: "embedding",
          vectorValue: [1.3, 2.345],
          distanceMeasure: "euclidean",
          distanceField: "computedDistance",
      }));
      // [END find_nearest_distance]
      console.log(results);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/offset

    async function offsetSyntaxExample() {
      // [START offset_syntax]
      const results = await execute(db.pipeline()
        .collection("cities")
        .offset(10));
      // [END offset_syntax]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/add_fields

    async function addFieldsSyntaxExample() {
      // [START add_fields_syntax]
      const results = await execute(db.pipeline()
        .collection("users")
        .addFields(field("firstName").stringConcat(" ", field("lastName")).as("fullName")));
      // [END add_fields_syntax]
    }

    async function addFieldsOverlapExample() {
      // [START add_fields_overlap]
      const results = await execute(db.pipeline()
        .collection("users")
        .addFields(field("age").abs().as("age"))
        .addFields(field("age").add(10).as("age")));
      // [END add_fields_overlap]
    }

    async function addFieldsNestingExample() {
      // [START add_fields_nesting]
      const results = await execute(db.pipeline()
        .collection("users")
        .addFields(field("address.city").toLower().as("address.city")));
      // [END add_fields_nesting]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/input/collection

    async function collectionInputSyntaxExample() {
      // [START collection_input_syntax]
      const results = await execute(db.pipeline()
        .collection("cities/SF/departments"));
      // [END collection_input_syntax]
    }

    async function collectionInputExampleData() {
      // [START collection_input_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {name: "San Francsico", state: "California"});
      await setDoc(doc(collection(db, "cities"), "NYC"), {name: "New York City", state: "New York"});
      await setDoc(doc(collection(db, "cities"), "CHI"), {name: "Chicago", state: "Illinois"});
      await setDoc(doc(collection(db, "states"), "CA"), {name: "California"});
      // [END collection_input_data]
    }

    async function collectionInputExample() {
      // [START collection_input]
      const results = await execute(db.pipeline()
        .collection("cities")
        .sort(field("name").ascending()));
      // [END collection_input]
    }

    async function subcollectionInputExampleData() {
      // [START subcollection_input_data]
      await setDoc(doc(collection(db, "cities/SF/departments"), "building"),
        {name: "SF Building Deparment", employees: 750});
      await setDoc(doc(collection(db, "cities/NY/departments"), "building"),
        {name: "NY Building Deparment", employees: 1000});
      await setDoc(doc(collection(db, "cities/CHI/departments"), "building"),
        {name: "CHI Building Deparment", employees: 900});
      await setDoc(doc(collection(db, "cities/NY/departments"), "finance"),
        {name: "NY Finance Deparment", employees: 1200});
      // [END subcollection_input_data]
    }

    async function subcollectionInputExample() {
      // [START subcollection_input]
      const results = await execute(db.pipeline()
        .collection("cities/NY/departments")
        .sort(field("employees").ascending()));
      // [END subcollection_input]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/input/collection_group

    async function collectionGroupInputSyntaxExample() {
      // [START collection_group_input_syntax]
      const results = await execute(db.pipeline()
        .collectionGroup("departments"));
      // [END collection_group_input_syntax]
    }

    async function collectionGroupInputExampleData() {
      // [START collection_group_data]
      await setDoc(doc(collection(db, "cities/SF/departments"), "building"),
        {name: "SF Building Deparment", employees: 750});
      await setDoc(doc(collection(db, "cities/NY/departments"), "building"),
        {name: "NY Building Deparment", employees: 1000});
      await setDoc(doc(collection(db, "cities/CHI/departments"), "building"),
        {name: "CHI Building Deparment", employees: 900});
      await setDoc(doc(collection(db, "cities/NY/departments"), "finance"),
        {name: "NY Finance Deparment", employees: 1200});
      // [END collection_group_data]
    }

    async function collectionGroupInputExample() {
      // [START collection_group_input]
      const results = await execute(db.pipeline()
        .collectionGroup("departments")
        .sort(field("employees").ascending()));
      // [END collection_group_input]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/input/database

    async function databaseInputSyntaxExample() {
      // [START database_syntax]
      const results = await execute(db.pipeline()
        .database());
      // [END database_syntax]
    }

    async function databaseInputSyntaxExampleData() {
      // [START database_input_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {name: "San Francsico", state: "California", population: 800000});
      await setDoc(doc(collection(db, "states"), "CA"), {name: "California", population: 39000000});
      await setDoc(doc(collection(db, "countries"), "USA"), {name: "United States of America", population: 340000000});
      // [END database_input_data]
    }

    async function databaseInputExample() {
      // [START database_input]
      const results = await execute(db.pipeline()
        .database()
        .sort(field("population").ascending()));
      // [END database_input]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/input/documents

    async function documentInputSyntaxExample() {
      // [START document_input_syntax]
      const results = await execute(db.pipeline()
        .documents([
          doc(collection(db, "cities"), "SF"),
          doc(collection(db, "cities"), "NYC")]));
      // [END document_input_syntax]
    }

    async function documentInputExampleData() {
      // [START document_input_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {name: "San Francsico", state: "California"});
      await setDoc(doc(collection(db, "cities"), "NYC"), {name: "New York City", state: "New York"});
      await setDoc(doc(collection(db, "cities"), "CHI"), {name: "Chicago", state: "Illinois"});
      // [END document_input_data]
    }

    async function documentInputExample() {
      // [START document_input]
      const results = await execute(db.pipeline()
        .documents([
          doc(collection(db, "cities"), "SF"),
          doc(collection(db, "cities"), "NYC")])
        .sort(field("name").ascending()));
      // [END document_input]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/union

    async function unionSyntaxExample() {
      // [START union_syntax]
      const results = await execute(db.pipeline()
        .collection("cities/SF/restaurants")
        .union(db.pipeline().collection("cities/NYC/restaurants")));
      // [END union_syntax]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/aggregate

    async function aggregateSyntaxExample() {
      // [START aggregate_syntax]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .aggregate(
            countAll().as("total"),
            average("population").as("averagePopulation")
        ));
      // [END aggregate_syntax]
    }

    async function aggregateGroupSyntax() {
      // [START aggregate_group_syntax]
      const result = await execute(db.pipeline()
        .collectionGroup("cities")
        .aggregate({
          accumulators: [
            countAll().as("cities"),
            field("population").sum().as("totalPopulation")
          ],
          groups: [field("location.state").as("state")]
        }));
      // [END aggregate_group_syntax]
    }

    async function aggregateExampleData() {
      // [START aggregate_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {name: "San Francisco", state: "CA", country: "USA", population: 870000});
      await setDoc(doc(collection(db, "cities"), "LA"), {name: "Los Angeles", state: "CA", country: "USA", population: 3970000});
      await setDoc(doc(collection(db, "cities"), "NY"), {name: "New York", state: "NY", country: "USA", population: 8530000});
      await setDoc(doc(collection(db, "cities"), "TOR"), {name: "Toronto", state: null, country: "Canada", population: 2930000});
      await setDoc(doc(collection(db, "cities"), "MEX"), {name: "Mexico City", state: null, country: "Mexico", population: 9200000});
      // [END aggregate_data]
    }

    async function aggregateWithoutGroupExample() {
      // [START aggregate_without_group]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .aggregate(
            countAll().as("total"),
            average("population").as("averagePopulation")
        ));
      // [END aggregate_without_group]
    }

    async function aggregateGroupExample() {
      // [START aggregate_group_example]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .aggregate({
            accumulators: [
                countAll().as("numberOfCities"),
                maximum("population").as("maxPopulation")
            ],
            groups: ["country", "state"]
        }));
      // [END aggregate_group_example]
    }

    async function aggregateGroupComplexExample() {
      // [START aggregate_group_complex]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .aggregate({
            accumulators: [
              sum("population").as("totalPopulation")
            ],
            groups: [field("state").equal(null).as("stateIsNull")]
        }));
      // [END aggregate_group_complex]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/distinct

    async function distinctSyntaxExample() {
      // [START distinct_syntax]
      let cities = await execute(db.pipeline()
        .collection("cities")
        .distinct("country"));

      cities = await execute(db.pipeline()
        .collection("cities")
        .distinct(
          field("state").toLower().as("normalizedState"),
          field("country")));
      // [END distinct_syntax]
    }

    async function distinctExampleData() {
      // [START distinct_data]
      await setDoc(doc(collection(db, "cities"), "SF"), {name: "San Francisco", state: "CA", country: "USA"});
      await setDoc(doc(collection(db, "cities"), "LA"), {name: "Los Angeles", state: "CA", country: "USA"});
      await setDoc(doc(collection(db, "cities"), "NY"), {name: "New York", state: "NY", country: "USA"});
      await setDoc(doc(collection(db, "cities"), "TOR"), {name: "Toronto", state: null, country: "Canada"});
      await setDoc(doc(collection(db, "cities"), "MEX"), {name: "Mexico City", state: null, country: "Mexico"});
      // [END distinct_data]
    }

    async function distinctExample() {
      // [START distinct_example]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .distinct("country"));
      // [END distinct_example]
    }

    async function distinctExpressionsExample() {
      // [START distinct_expressions]
      const cities = await execute(db.pipeline()
        .collection("cities")
        .distinct(
          field("state").toLower().as("normalizedState"),
          field("country")));
      // [END distinct_expressions]
    }

    // old snippets

    async function basicRead() {
      // [START basic_read]
      const readDataPipeline = db.pipeline()
        .collection("users");

      // Execute the pipeline and handle the result
      try {
        const querySnapshot = await execute(readDataPipeline);
        querySnapshot.results.forEach((result) => {
          console.log(`${result.id} => ${result.data()}`);
        });
      } catch (error) {
          console.error("Error getting documents: ", error);
      }
      // [END basic_read]
    }

    function pipelineConcepts() {
        // [START pipeline_concepts]
        const pipeline = db.pipeline()
          // Step 1: Start a query with collection scope
          .collection("cities")
          // Step 2: Filter the collection
          .where(field("population").greaterThan(100000))
          // Step 3: Sort the remaining documents
          .sort(field("name").ascending())
          // Step 4: Return the top 10. Note applying the limit earlier in the
          // pipeline would have unintentional results.
          .limit(10);
        // [END pipeline_concepts]
        console.log(pipeline);
    }

    function pipelineInitialization() {
        // [START pipeline_initialization]
        const { getFirestore } = require("firebase/firestore");
        const { execute } = require("firebase/firestore/pipelines");
        const database = getFirestore(app, "enterprise");
        const pipeline = database.pipeline();
        // [END pipeline_initialization]
        console.log(pipeline);
    }

    function fieldVsConstants() {
        // [START field_or_constant]
        const pipeline = db.pipeline()
          .collection("cities")
          .where(field("name").equal(constant("Toronto")));
        // [END field_or_constant]
        console.log(pipeline);
    }

    async function inputStages() {
        // [START input_stages]
        let results;

        // Return all restaurants in San Francisco
        results = await execute(db.pipeline().collection("cities/sf/restaurants"));

        // Return all restaurants
        results = await execute(db.pipeline().collectionGroup("restaurants"));

        // Return all documents across all collections in the database (the entire database)
        results = await execute(db.pipeline().database());

        // Batch read of 3 documents
        results = await execute(db.pipeline().documents([
          doc(db, "cities", "SF"),
          doc(db, "cities", "DC"),
          doc(db, "cities", "NY")
        ]));
        // [END input_stages]
        console.log(results);
    }

    async function wherePipeline() {
        // [START pipeline_where]
        let results;

        results = await execute(db.pipeline().collection("books")
          .where(field("rating").equal(5))
          .where(field("published").lessThan(1900))
        );

        results = await execute(db.pipeline().collection("books")
          .where(and(field("rating").equal(5), field("published").lessThan(1900)))
        );
        // [END pipeline_where]
        console.log(results);
    }

    async function aggregateGroups() {
        // [START aggregate_groups]
        const results = await execute(db.pipeline()
          .collection("books")
          .aggregate(
            field("rating").average().as("avg_rating")
          )
          .distinct(field("genre"))
        );
        // [END aggregate_groups]
        console.log(results);
    }

    async function aggregateDistinct() {
        // [START aggregate_distinct]
        const results = await execute(db.pipeline()
          .collection("books")
          .distinct(
            field("author").toUpper().as("author"),
            field("genre")
          )
        );
        // [END aggregate_distinct]
        console.log(results);
    }

    async function sort() {
        // [START sort]
        const results = await execute(db.pipeline()
          .collection("books")
          .sort(
            field("release_date").descending(), field("author").ascending()
          )
        );
        // [END sort]
        console.log(results);
    }

    function sortComparison() {
        // [START sort_comparison]
        const q = query(collection(db, "cities"),
          orderBy("state"),
          orderBy("population", "desc"));

        const pipeline = db.pipeline()
          .collection("books")
          .sort(
            field("release_date").descending(), field("author").ascending()
          );
        // [END sort_comparison]
        console.log(q);
        console.log(pipeline);
    }

    async function functions() {
        // [START functions_example]
        let results;

        // Type 1: Scalar (for use in non-aggregation stages)
        // Example: Return the min store price for each book.
        results = await execute(db.pipeline().collection("books")
          .select(field("current").logicalMinimum(field("updated")).as("price_min"))
        );

        // Type 2: Aggregation (for use in aggregate stages)
        // Example: Return the min price of all books.
        results = await execute(db.pipeline().collection("books")
          .aggregate(field("price").minimum().as("min_price"))
        );
        // [END functions_example]
        console.log(results);
    }

    async function creatingIndexes() {
        // [START query_example]
        const results = await execute(db.pipeline()
          .collection("books")
          .where(field("published").lessThan(1900))
          .where(field("genre").equal("Science Fiction"))
          .where(field("rating").greaterThan(4.3))
          .sort(field("published").descending())
        );
        // [END query_example]
        console.log(results);
    }

    async function sparseIndexes() {
        // [START sparse_index_example]
        const results = await execute(db.pipeline()
          .collection("books")
          .where(field("category").like("%fantasy%"))
        );
        // [END sparse_index_example]
        console.log(results);
    }

    async function sparseIndexes2() {
        // [START sparse_index_example_2]
        const results = await execute(db.pipeline()
          .collection("books")
          .sort(field("release_date").ascending())
        );
        // [END sparse_index_example_2]
        console.log(results);
    }

    async function coveredQuery() {
        // [START covered_query]
        const results = await execute(db.pipeline()
          .collection("books")
          .where(field("category").like("%fantasy%"))
          .where(field("title").exists())
          .where(field("author").exists())
          .select(field("title"), field("author"))
        );
        // [END covered_query]
        console.log(results);
    }

    async function pagination() {
        // [START pagination_not_supported_preview]
        // Existing pagination via `startAt()`
        const q =
          query(collection(db, "cities"), orderBy("population"), startAt(1000000));

        // Private preview workaround using pipelines
        const pageSize = 2;
        const pipeline = db.pipeline()
          .collection("cities")
          .select("name", "population", "__name__")
          .sort(field("population").descending(), field("__name__").ascending());

        // Page 1 results
        let snapshot = await execute(pipeline.limit(pageSize));

        // End of page marker
        const lastDoc = snapshot.results[snapshot.results.length - 1];

        // Page 2 results
        snapshot = await execute(
          pipeline
            .where(
              or(
                and(
                  field("population").equal(lastDoc.get("population")),
                  field("__name__").greaterThan(lastDoc.ref)
                ),
                field("population").lessThan(lastDoc.get("population"))
              )
            )
            .limit(pageSize)
        );
        // [END pagination_not_supported_preview]
        console.log(q);
        console.log(pipeline);
    }

    async function collectionStage() {
        // [START collection_example]
        const results = await execute(db.pipeline()
          .collection("users/bob/games")
          .sort(field("name").ascending())
          );
        // [END collection_example]
        console.log(results);
    }

    async function collectionGroupStage() {
        // [START collection_group_example]
        const results = await execute(db.pipeline()
          .collectionGroup("games")
          .sort(field("name").ascending())
          );
        // [END collection_group_example]
        console.log(results);
    }

    async function databaseStage() {
        // [START database_example]
        // Count all documents in the database
        const results = await execute(db.pipeline()
          .database()
          .aggregate(countAll().as("total"))
          );
        // [END database_example]
        console.log(results);
    }

    async function documentsStage() {
        // [START documents_example]
        const results = await execute(db.pipeline()
          .documents([
            doc(db, "cities", "SF"),
            doc(db, "cities", "DC"),
            doc(db, "cities", "NY")
          ])
        );
        // [END documents_example]
        console.log(results);
    }

    async function replaceWithStage() {
        // [START initial_data]
        await setDoc(doc(collection(db, "cities"), "SF"), {
          "name": "San Francisco",
          "population": 800000,
          "location": {
            "country": "USA",
            "state": "California"
          }
        });
        await setDoc(doc(collection(db, "cities"), "TO"), {
          "name": "Toronto",
          "population": 3000000,
          "province": "ON",
          "location": {
            "country": "Canada",
            "province": "Ontario"
          }
        });
        await setDoc(doc(collection(db, "cities"), "NY"), {
          "name": "New York",
          "location": {
            "country": "USA",
            "state": "New York"
          }
        });
        await setDoc(doc(collection(db, "cities"), "AT"), {
          "name": "Atlantis",
        });
        // [END initial_data]

        // [START full_replace]
        const names = await execute(db.pipeline()
          .collection("cities")
          .replaceWith(field("location"))
        );
        // [END full_replace]

        // [START map_merge_overwrite]
        // unsupported in client SDKs for now
        // [END map_merge_overwrite]
        console.log(names);
    }

    async function sampleStage() {
        // [START sample_example]
        let results;

        // Get a sample of 100 documents in a database
        results = await execute(db.pipeline()
          .database()
          .sample(100)
        );

        // Randomly shuffle a list of 3 documents
        results = await execute(db.pipeline()
          .documents([
            doc(db, "cities", "SF"),
            doc(db, "cities", "NY"),
            doc(db, "cities", "DC"),
          ])
          .sample(3)
        );
        // [END sample_example]
        console.log(results);
    }

    async function samplePercent() {
        // [START sample_percent]
        // Get a sample of on average 50% of the documents in the database
        const results = await execute(db.pipeline()
          .database()
          .sample({ percentage: 0.5 })
        );
        // [END sample_percent]
        console.log(results);
    }

    async function unionStage() {
        // [START union_stage]
        const results = await execute(db.pipeline()
          .collection("cities/SF/restaurants")
          .where(field("type").equal("Chinese"))
          .union(db.pipeline()
            .collection("cities/NY/restaurants")
            .where(field("type").equal("Italian")))
          .where(field("rating").greaterThanOrEqual(4.5))
          .sort(field("__name__").descending())
        );
        // [END union_stage]
        console.log(results);
    }

    async function unnestStage() {
        // [START unnest_stage]
        const results = await execute(db.pipeline()
          .database()
          .unnest(field("arrayField").as("unnestedArrayField"), "index")
        );
        // [END unnest_stage]
        console.log(results);
    }

    async function unnestStageEmptyOrNonArray() {
        // [START unnest_edge_cases]
        // Input
        // { identifier : 1, neighbors: [ "Alice", "Cathy" ] }
        // { identifier : 2, neighbors: []                   }
        // { identifier : 3, neighbors: "Bob"                }

        const results = await execute(db.pipeline()
          .database()
          .unnest(field("neighbors").as("unnestedNeighbors"), "index" )
        );

        // Output
        // { identifier: 1, neighbors: [ "Alice", "Cathy" ], unnestedNeighbors: "Alice", index: 0 }
        // { identifier: 1, neighbors: [ "Alice", "Cathy" ], unnestedNeighbors: "Cathy", index: 1 }
        // { identifier: 3, neighbors: "Bob", index: null}
        // [END unnest_edge_cases]
        console.log(results);
    }

    async function countFunction() {
        // [START count_function]
        // Total number of books in the collection
        const countOfAll = await execute(db.pipeline()
          .collection("books")
          .aggregate(countAll().as("count"))
        );

        // Number of books with nonnull `ratings` field
        const countField = await execute(db.pipeline()
          .collection("books")
          .aggregate(field("ratings").count().as("count"))
        );
        // [END count_function]
        console.log(countOfAll);
        console.log(countField);
    }

    async function countIfFunction() {
        // [START count_if]
        const result = await execute(db.pipeline()
          .collection("books")
          .aggregate(
            field("rating").greaterThan(4).countIf().as("filteredCount")
          )
        );
        // [END count_if]
        console.log(result);
    }

    async function countDistinctFunction() {
        // [START count_distinct]
        const result = await execute(db.pipeline()
          .collection("books")
          .aggregate(field("author").countDistinct().as("unique_authors"))
        );
        // [END count_distinct]
        console.log(result);
    }

    async function sumFunction() {
        // [START sum_function]
        const result = await execute(db.pipeline()
          .collection("cities")
          .aggregate(field("population").sum().as("totalPopulation"))
        );
        // [END sum_function]
        console.log(result);
    }

    async function avgFunction() {
        // [START avg_function]
        const result = await execute(db.pipeline()
          .collection("cities")
          .aggregate(field("population").average().as("averagePopulation"))
        );
        // [END avg_function]
        console.log(result);
    }

    async function minFunction() {
        // [START min_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .aggregate(field("price").minimum().as("minimumPrice"))
        );
        // [END min_function]
        console.log(result);
    }

    async function maxFunction() {
        // [START max_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .aggregate(field("price").maximum().as("maximumPrice"))
        );
        // [END max_function]
        console.log(result);
    }

    async function addFunction() {
        // [START add_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("soldBooks").add(field("unsoldBooks")).as("totalBooks"))
        );
        // [END add_function]
        console.log(result);
    }

    async function subtractFunction() {
        // [START subtract_function]
        const storeCredit = 7;
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("price").subtract(constant(storeCredit)).as("totalCost"))
        );
        // [END subtract_function]
        console.log(result);
    }

    async function multiplyFunction() {
        // [START multiply_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("price").multiply(field("soldBooks")).as("revenue"))
        );
        // [END multiply_function]
        console.log(result);
    }

    async function divideFunction() {
        // [START divide_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("ratings").divide(field("soldBooks")).as("reviewRate"))
        );
        // [END divide_function]
        console.log(result);
    }

    async function modFunction() {
        // [START mod_function]
        const displayCapacity = 1000;
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("unsoldBooks").mod(constant(displayCapacity)).as("warehousedBooks"))
        );
        // [END mod_function]
        console.log(result);
    }

    async function ceilFunction() {
        // [START ceil_function]
        const booksPerShelf = 100;
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("unsoldBooks").divide(constant(booksPerShelf)).ceil().as("requiredShelves")
          )
        );
        // [END ceil_function]
        console.log(result);
    }

    async function floorFunction() {
        // [START floor_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .addFields(
            field("wordCount").divide(field("pages")).floor().as("wordsPerPage")
          )
        );
        // [END floor_function]
        console.log(result);
    }

    async function roundFunction() {
        // [START round_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("soldBooks").multiply(field("price")).round().as("partialRevenue"))
          .aggregate(field("partialRevenue").sum().as("totalRevenue"))
          );
        // [END round_function]
        console.log(result);
    }

    async function powFunction() {
        // [START pow_function]
        const googleplex = { latitude: 37.4221, longitude: 122.0853 };
        const result = await execute(db.pipeline()
          .collection("cities")
          .addFields(
            field("lat").subtract(constant(googleplex.latitude))
              .multiply(111 /* km per degree */)
              .pow(2)
              .as("latitudeDifference"),
            field("lng").subtract(constant(googleplex.longitude))
              .multiply(111 /* km per degree */)
              .pow(2)
              .as("longitudeDifference")
          )
          .select(
            field("latitudeDifference").add(field("longitudeDifference")).sqrt()
              // Inaccurate for large distances or close to poles
              .as("approximateDistanceToGoogle")
          )
        );
        // [END pow_function]
        console.log(result);
    }

    async function sqrtFunction() {
        // [START sqrt_function]
        const googleplex = { latitude: 37.4221, longitude: 122.0853 };
        const result = await execute(db.pipeline()
          .collection("cities")
          .addFields(
            field("lat").subtract(constant(googleplex.latitude))
              .multiply(111 /* km per degree */)
              .pow(2)
              .as("latitudeDifference"),
            field("lng").subtract(constant(googleplex.longitude))
              .multiply(111 /* km per degree */)
              .pow(2)
              .as("longitudeDifference")
          )
          .select(
            field("latitudeDifference").add(field("longitudeDifference")).sqrt()
              // Inaccurate for large distances or close to poles
              .as("approximateDistanceToGoogle")
          )
        );
        // [END sqrt_function]
        console.log(result);
    }

    async function expFunction() {
        // [START exp_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").exp().as("expRating"))
        );
        // [END exp_function]
        console.log(result);
    }

    async function lnFunction() {
        // [START ln_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").ln().as("lnRating"))
        );
        // [END ln_function]
        console.log(result);
    }

    async function logFunction() {
        // [START log_function]
        // Not supported on JS
        // [END log_function]
    }

    async function arrayConcat() {
        // [START array_concat]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("genre").arrayConcat([field("subGenre")]).as("allGenres"))
        );
        // [END array_concat]
        console.log(result);
    }

    async function arrayContains() {
        // [START array_contains]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("genre").arrayContains(constant("mystery")).as("isMystery"))
        );
        // [END array_contains]
        console.log(result);
    }

    async function arrayContainsAll() {
        // [START array_contains_all]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("genre")
              .arrayContainsAll([constant("fantasy"), constant("adventure")])
              .as("isFantasyAdventure")
          )
        );
        // [END array_contains_all]
        console.log(result);
    }

    async function arrayContainsAny() {
        // [START array_contains_any]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("genre")
              .arrayContainsAny([constant("fantasy"), constant("nonfiction")])
              .as("isMysteryOrFantasy")
          )
        );
        // [END array_contains_any]
        console.log(result);
    }

    async function arrayLength() {
        // [START array_length]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("genre").arrayLength().as("genreCount"))
        );
        // [END array_length]
        console.log(result);
    }

    async function arrayReverse() {
        // [START array_reverse]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("genre").arrayReverse().as("reversedGenres"))
        );
        // [END array_reverse]
        console.log(result);
    }

    async function equalFunction() {
        // [START equal_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").equal(5).as("hasPerfectRating"))
        );
        // [END equal_function]
        console.log(result);
    }

    async function greaterThanFunction() {
        // [START greater_than]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").greaterThan(4).as("hasHighRating"))
        );
        // [END greater_than]
        console.log(result);
    }

    async function greaterThanOrEqualToFunction() {
        // [START greater_or_equal]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("published").greaterThanOrEqual(1900).as("publishedIn20thCentury"))
        );
        // [END greater_or_equal]
        console.log(result);
    }

    async function lessThanFunction() {
        // [START less_than]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("published").lessThan(1923).as("isPublicDomainProbably"))
        );
        // [END less_than]
        console.log(result);
    }

    async function lessThanOrEqualToFunction() {
        // [START less_or_equal]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").lessThanOrEqual(2).as("hasBadRating"))
        );
        // [END less_or_equal]
        console.log(result);
    }

    async function notEqualFunction() {
        // [START not_equal]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("title").notEqual("1984").as("not1984"))
        );
        // [END not_equal]
        console.log(result);
    }

    async function existsFunction() {
        // [START exists_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").exists().as("hasRating"))
        );
        // [END exists_function]
        console.log(result);
    }

    async function andFunction() {
        // [START and_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            and(field("rating").greaterThan(4), field("price").lessThan(10))
              .as("under10Recommendation")
          )
        );
        // [END and_function]
        console.log(result);
    }

    async function orFunction() {
        // [START or_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            or(field("genre").equal("Fantasy"), field("tags").arrayContains("adventure"))
              .as("matchesSearchFilters")
          )
        );
        // [END or_function]
        console.log(result);
    }

    async function xorFunction() {
        // [START xor_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            xor(field("tags").arrayContains("magic"), field("tags").arrayContains("nonfiction"))
              .as("matchesSearchFilters")
          )
        );
        // [END xor_function]
        console.log(result);
    }

    async function notFunction() {
        // [START not_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("tags").arrayContains("nonfiction").not()
              .as("isFiction")
          )
        );
        // [END not_function]
        console.log(result);
    }

    async function condFunction() {
        // [START cond_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("tags").arrayConcat([
              field("pages").greaterThan(100)
                .conditional(constant("longRead"), constant("shortRead"))
            ]).as("extendedTags")
          )
        );
        // [END cond_function]
        console.log(result);
    }

    async function equalAnyFunction() {
        // [START eq_any]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("genre").equalAny(["Science Fiction", "Psychological Thriller"])
              .as("matchesGenreFilters")
          )
        );
        // [END eq_any]
        console.log(result);
    }

    async function notEqualAnyFunction() {
        // [START not_eq_any]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("author").notEqualAny(["George Orwell", "F. Scott Fitzgerald"])
              .as("byExcludedAuthors")
          )
        );
        // [END not_eq_any]
        console.log(result);
    }

    async function maxLogicalFunction() {
        // [START max_logical_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("rating").logicalMaximum(1).as("flooredRating")
          )
        );
        // [END max_logical_function]
        console.log(result);
    }

    async function minLogicalFunction() {
        // [START min_logical_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("rating").logicalMinimum(5).as("cappedRating")
          )
        );
        // [END min_logical_function]
        console.log(result);
    }

    async function mapGetFunction() {
        // [START map_get]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("awards").mapGet("pulitzer").as("hasPulitzerAward")
          )
        );
        // [END map_get]
        console.log(result);
    }

    async function byteLengthFunction() {
        // [START byte_length]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("title").byteLength().as("titleByteLength")
          )
        );
        // [END byte_length]
        console.log(result);
    }

    async function charLengthFunction() {
        // [START char_length]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("title").charLength().as("titleCharLength")
          )
        );
        // [END char_length]
        console.log(result);
    }

    async function startsWithFunction() {
        // [START starts_with]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("title").startsWith("The")
              .as("needsSpecialAlphabeticalSort")
          )
        );
        // [END starts_with]
        console.log(result);
    }

    async function endsWithFunction() {
        // [START ends_with]
        const result = await execute(db.pipeline()
          .collection("inventory/devices/laptops")
          .select(
            field("name").endsWith("16 inch")
              .as("16InLaptops")
          )
        );
        // [END ends_with]
        console.log(result);
    }

    async function likeFunction() {
        // [START like]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("genre").like("%Fiction")
              .as("anyFiction")
          )
        );
        // [END like]
        console.log(result);
    }

    async function regexContainsFunction() {
        // [START regex_contains]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("title").regexContains("Firestore (Enterprise|Standard)")
              .as("isFirestoreRelated")
          )
        );
        // [END regex_contains]
        console.log(result);
    }

    async function regexMatchFunction() {
        // [START regex_match]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("title").regexMatch("Firestore (Enterprise|Standard)")
              .as("isFirestoreExactly")
          )
        );
        // [END regex_match]
        console.log(result);
    }

    async function strConcatFunction() {
        // [START str_concat]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("title").stringConcat(" by ", field("author"))
              .as("fullyQualifiedTitle")
          )
        );
        // [END str_concat]
        console.log(result);
    }

    async function strContainsFunction() {
        // [START string_contains]
        const result = await execute(db.pipeline()
          .collection("articles")
          .select(
            field("body").stringContains("Firestore")
              .as("isFirestoreRelated")
          )
        );
        // [END string_contains]
        console.log(result);
    }

    async function toUpperFunction() {
        // [START to_upper]
        const result = await execute(db.pipeline()
          .collection("authors")
          .select(
            field("name").toUpper()
              .as("uppercaseName")
          )
        );
        // [END to_upper]
        console.log(result);
    }

    async function toLowerFunction() {
        // [START to_lower]
        const result = await execute(db.pipeline()
          .collection("authors")
          .select(
            field("genre").toLower().equal("fantasy")
              .as("isFantasy")
          )
        );
        // [END to_lower]
    }

    async function substrFunction() {
        // [START substr_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .where(field("title").startsWith("The "))
          .select(
            field("title").substring(4)
              .as("titleWithoutLeadingThe")
          )
        );
        // [END substr_function]
        console.log(result);
    }

    async function strReverseFunction() {
        // [START str_reverse]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("name").reverse().as("reversedName")
          )
        );
        // [END str_reverse]
        console.log(result);
    }

    async function strTrimFunction() {
        // [START trim_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("name").trim().as("whitespaceTrimmedName")
          )
        );
        // [END trim_function]
        console.log(result);
    }

    async function strReplaceFunction() {
        // not yet supported until GA
    }

    async function strSplitFunction() {
        // not yet supported until GA
    }

    async function unixMicrosToTimestampFunction() {
        // [START unix_micros_timestamp]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("createdAtMicros").unixMicrosToTimestamp().as("createdAtString")
          )
        );
        // [END unix_micros_timestamp]
        console.log(result);
    }

    async function unixMillisToTimestampFunction() {
        // [START unix_millis_timestamp]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("createdAtMillis").unixMillisToTimestamp().as("createdAtString")
          )
        );
        // [END unix_millis_timestamp]
        console.log(result);
    }

    async function unixSecondsToTimestampFunction() {
        // [START unix_seconds_timestamp]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("createdAtSeconds").unixSecondsToTimestamp().as("createdAtString")
          )
        );
        // [END unix_seconds_timestamp]
        console.log(result);
    }

    async function timestampAddFunction() {
        // [START timestamp_add]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("createdAt").timestampAdd("day", 3653).as("expiresAt")
          )
        );
        // [END timestamp_add]
        console.log(result);
    }

    async function timestampSubFunction() {
        // [START timestamp_sub]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("expiresAt").timestampSubtract("day", 14).as("sendWarningTimestamp")
          )
        );
        // [END timestamp_sub]
        console.log(result);
    }

    async function timestampToUnixMicrosFunction() {
        // [START timestamp_unix_micros]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("dateString").timestampToUnixMicros().as("unixMicros")
          )
        );
        // [END timestamp_unix_micros]
        console.log(result);
    }

    async function timestampToUnixMillisFunction() {
        // [START timestamp_unix_millis]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("dateString").timestampToUnixMillis().as("unixMillis")
          )
        );
        // [END timestamp_unix_millis]
        console.log(result);
    }

    async function timestampToUnixSecondsFunction() {
        // [START timestamp_unix_seconds]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("dateString").timestampToUnixSeconds().as("unixSeconds")
          )
        );
        // [END timestamp_unix_seconds]
        console.log(result);
    }

    async function cosineDistanceFunction() {
        // [START cosine_distance]
        const sampleVector = [0.0, 1, 2, 3, 4, 5];
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("embedding").cosineDistance(sampleVector).as("cosineDistance")));
        // [END cosine_distance]
        console.log(result);
    }

    async function dotProductFunction() {
        // [START dot_product]
        const sampleVector = [0.0, 1, 2, 3, 4, 5];
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("embedding").dotProduct(sampleVector).as("dotProduct")
          )
        );
        // [END dot_product]
        console.log(result);
    }

    async function euclideanDistanceFunction() {
        // [START euclidean_distance]
        const sampleVector = [0.0, 1, 2, 3, 4, 5];
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("embedding").euclideanDistance(sampleVector).as("euclideanDistance")
          )
        );
        // [END euclidean_distance]
        console.log(result);
    }

    async function vectorLengthFunction() {
        // [START vector_length]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("embedding").vectorLength().as("vectorLength")
          )
        );
        // [END vector_length]
        console.log(result);
    }
});
