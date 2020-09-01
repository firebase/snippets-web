import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";

describe("firestore", () => {
    let db;
    before(() => {
        const config = {
            apiKey: "AIzaSyCM61mMr_iZnP1DzjT1PMB5vDGxfyWNM64",
            authDomain: "firestore-snippets.firebaseapp.com",
            projectId: "firestore-snippets"
        };
        const app = initializeApp(config);
        db = getFirestore(app);
        //firebase.firestore.setLogLevel("debug");
    });

    it("should be able to set the cache size", () => {
        // [START fs_setup_cache]
        db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        });
        // [END fs_setup_cache]
    });

    it("should be initializable with persistence", () => {
      const app = initializeApp({
        apiKey: '### FIREBASE API KEY ###',
        authDomain: '### FIREBASE AUTH DOMAIN ###',
        projectId: '### CLOUD FIRESTORE PROJECT ID ###',
      } ,"persisted_app");

      const db = getFirestore(app);

      // [START initialize_persistence]
      const { enableIndexedDbPersistence } = require("@firebase/firestore"); 

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
      const { disableNetwork } = require("@firebase/firestore"); 

      await disableNetwork(db);
      console.log("Network disabled!");
      // Do offline actions
      // [START_EXCLUDE]
      console.log("Network disabled!");
      // [END_EXCLUDE]
      // [END disable_network]

      // [START enable_network]
      const { enableNetwork } = require("@firebase/firestore"); 

      await enableNetwork(db)
      // Do online actions
      // [START_EXCLUDE]
      console.log("Network enabled!");
      // [END_EXCLUDE]
      // [END enable_network]

    });

    it("should reply with .fromCache fields", () => {
      // [START use_from_cache]
      const { collection, onSnapshot, where, query } = require("@firebase/firestore"); 
      
      const query = query(collection(db, "cities"), where("state", "==", "CA"));
      onSnapshot(query, { includeMetadataChanges: true }, (snapshot) => {
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
            const { collection, addDoc } = require("@firebase/firestore"); 

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
            const { getDocs } = require("@firebase/firestore"); 

            const querySnapshot = await getDocs(db.collection("users"));
            querySnapshot.forEach((doc) => {
              console.log(`${doc.id} => ${doc.data()}`);
            });
            // [END get_all_users]
        });

        it("should add data to a collection with new fields", async () => {
            // [START add_alan_turing]
            // Add a second document with a generated ID.
            const { addDoc, collection } = require("@firebase/firestore"); 

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
            const { collection, where, query, onSnapshot } = require("@firebase/firestore"); 

            const q = query(collection(db, "users"), where("born", "<", 1900));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                console.log("Current users born before 1900:");
                snapshot.forEach(function (userSnapshot) {
                    console.log(userSnapshot.data())
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
            const { collection, doc } = require("@firebase/firestore");

            const alovelaceDocumentRef = doc(collection(db, 'users'), 'alovelace');
            // [END doc_reference]
        });

        it("should reference a specific collection", () => {
            // [START collection_reference]
            const { collection } = require("@firebase/firestore");

            const usersCollectionRef = collection(db, 'users');
            // [END collection_reference]
        });

        it("should reference a specific document (alternative)", () => {
            // [START doc_reference_alternative]
            const { doc } = require("@firebase/firestore"); 

            const alovelaceDocumentRef = doc(db, 'users/alovelace');
            // [END doc_reference_alternative]
        })

        it("should reference a document in a subcollection", () => {
            // [START subcollection_reference]
            const { doc, collection } = require("@firebase/firestore"); 

            const messageRef = doc(collection(doc(collection("rooms"), "roomA"), "messages"), "message1");
            // [END subcollection_reference]
        });

        it("should set a document", async () => {
            // [START set_document]
            const { doc, collection, setDoc } = require("@firebase/firestore"); 

            // Add a new document in collection "cities"
            await setDoc(doc(collection(db, "cities"), "LA"), {
              name: "Los Angeles",
              state: "CA",
              country: "USA"
            });
            // [END set_document]
        });

        it("should set document with a custom object converter", async () => {
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
            cityConverter = {
                toFirestore: function(city) {
                    return {
                        name: city.name,
                        state: city.state,
                        country: city.country
                        }
                },
                fromFirestore: function(snapshot, options){
                    const data = snapshot.data(options);
                    return new City(data.name, data.state, data.country)
                }
            }
            // [END city_custom_object]
            // [START set_custom_object]
            const { doc, collection, setDoc } = require("@firebase/firestore"); 
            
            // Set with cityConverter
            const ref = doc(collection(db, "cities"), "LA").withConverter(cityConverter);
            await setDoc(ref, new City("Los Angeles", "CA", "USA"));
            // [END set_custom_object]
        });

        it("should get document with a custom object converter", async () => {
            // [START get_custom_object]
            const { doc, collection, getDoc} = require("@firebase/firestore"); 

            const ref = collection(doc(db, "cities"), "LA").withConverter(cityConverter);
            const doc = await getDoc(ref);
            if (doc.exists){
              // Convert to City object
              city = doc.data();
              // Use a City instance method
              console.log(city.toString());
            } else {
              console.log("No such document!")
            }
            // [END get_custom_object]
        });

        it("should support batch writes", async () => {
            // [START write_batch]
            const { writeBatch, doc, collection } = require("@firebase/firestore"); 

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
            const { doc, collection, setDoc } = require("@firebase/firestore"); 

            const docData = {
                stringExample: "Hello world!",
                booleanExample: true,
                numberExample: 3.14159265,
                dateExample: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
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
            const { doc, collection, setDoc } = require("@firebase/firestore"); 

            const cityRef = doc(collection(db, 'cities'), 'BJ');
            setDoc(cityRef, { capital: true }, { merge: true });
            // [END set_with_merge]
            return setWithMerge;
        });

        it("should update a document's nested fields #UNVERIFIED", async () => {
            // [START update_document_nested]
            const { doc, collection, setDoc, updateDoc } = require("@firebase/firestore"); 

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
            function deleteCollection(db, collectionRef, batchSize) {
                var query = collectionRef.orderBy('__name__').limit(batchSize);

                return new Promise(function(resolve, reject) {
                    deleteQueryBatch(db, query, batchSize, resolve, reject);
                });
            }

            function deleteQueryBatch(db, query, batchSize, resolve, reject) {
                query.get()
                    .then((snapshot) => {
                        // When there are no documents left, we are done
                        if (snapshot.size == 0) {
                            return 0;
                        }

                        // Delete documents in a batch
                        var batch = db.batch();
                        snapshot.docs.forEach(function(doc) {
                            batch.delete(doc.ref);
                        });

                        return batch.commit().then(function() {
                            return snapshot.size;
                        });
                    }).then(function(numDeleted) {
                        if (numDeleted < batchSize) {
                            resolve();
                            return;
                        }

                        // Recurse on the next process tick, to avoid
                        // exploding the stack.
                        setTimeout(function() {
                            deleteQueryBatch(db, query, batchSize, resolve, reject);
                        }, 0);
                    })
                    .catch(reject);
            }
            // [END delete_collection]

            return deleteCollection(db, db.collection("users"), 2);
        }).timeout(2000);
    });

    describe("collection('cities')", () => {
        it("should set documents #UNVERIFIED", () => {
            // [START example_data]
            var citiesRef = db.collection("cities");

            citiesRef.doc("SF").set({
                name: "San Francisco", state: "CA", country: "USA",
                capital: false, population: 860000,
                regions: ["west_coast", "norcal"] });
            citiesRef.doc("LA").set({
                name: "Los Angeles", state: "CA", country: "USA",
                capital: false, population: 3900000,
                regions: ["west_coast", "socal"] });
            citiesRef.doc("DC").set({
                name: "Washington, D.C.", state: null, country: "USA",
                capital: true, population: 680000,
                regions: ["east_coast"] });
            citiesRef.doc("TOK").set({
                name: "Tokyo", state: null, country: "Japan",
                capital: true, population: 9000000,
                regions: ["kanto", "honshu"] });
            citiesRef.doc("BJ").set({
                name: "Beijing", state: null, country: "China",
                capital: true, population: 21500000,
                regions: ["jingjinji", "hebei"] });
            // [END example_data]
        });
        it("should set a document", () => {
            var data = {};

            return output =
            // [START cities_document_set]
            db.collection("cities").doc("new-city-id").set(data);
            // [END cities_document_set]
        });

        it("should add a document", () => {
            return output =
            // [START add_document]
            // Add a new document with a generated id.
            db.collection("cities").add({
                name: "Tokyo",
                country: "Japan"
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
            // [END add_document]
        });

        it("should add an empty a document #UNVERIFIED", () => {
            var data = {};
            // [START new_document]
            // Add a new document with a generated id.
            var newCityRef = db.collection("cities").doc();

            // later...
            newCityRef.set(data);
            // [END new_document]
        });

        it("should update a document", () => {
            var data = {};
            // [START update_document]
            var washingtonRef = db.collection("cities").doc("DC");

            // Set the "capital" field of the city 'DC'
            return washingtonRef.update({
                capital: true
            })
            .then(function() {
                console.log("Document successfully updated!");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            // [END update_document]
        });

        it("should update an array field in a document", () => {
            // [START update_document_array]
            var washingtonRef = db.collection("cities").doc("DC");

            // Atomically add a new region to the "regions" array field.
            washingtonRef.update({
                regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
            });

            // Atomically remove a region from the "regions" array field.
            washingtonRef.update({
                regions: firebase.firestore.FieldValue.arrayRemove("east_coast")
            });
            // [END update_document_array]
        });

        it("should update a document using numeric transforms", () => {
            // [START update_document_increment]
            var washingtonRef = db.collection('cities').doc('DC');

            // Atomically increment the population of the city by 50.
            washingtonRef.update({
                population: firebase.firestore.FieldValue.increment(50)
            });
            // [END update_document_increment]
        })

        it("should delete a document", () => {
            return output =
            // [START delete_document]
            db.collection("cities").doc("DC").delete().then(function() {
                console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
            // [END delete_document]
        });

        it("should handle transactions #FIXME #UNVERIFIED", () => {
            return db.collection("cities").doc("SF").set({ population: 0 }).then(() => {
                // [START transaction]
                // Create a reference to the SF doc.
                var sfDocRef = db.collection("cities").doc("SF");

                // Uncomment to initialize the doc.
                // sfDocRef.set({ population: 0 });

                return db.runTransaction(function(transaction) {
                    // This code may get re-run multiple times if there are conflicts.
                    return transaction.get(sfDocRef).then(function(sfDoc) {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }

                        // Add one person to the city population.
                        // Note: this could be done without a transaction
                        //       by updating the population using FieldValue.increment()
                        var newPopulation = sfDoc.data().population + 1;
                        transaction.update(sfDocRef, { population: newPopulation });
                    });
                }).then(function() {
                    console.log("Transaction successfully committed!");
                }).catch(function(error) {
                    console.log("Transaction failed: ", error);
                });
                // [END transaction]
            });
        });

        it("should handle transaction which bubble out data #UNVERIFIED", () => {
            // [START transaction_promise]
            // Create a reference to the SF doc.
            var sfDocRef = db.collection("cities").doc("SF");

            db.runTransaction(function(transaction) {
                return transaction.get(sfDocRef).then(function(sfDoc) {
                    if (!sfDoc.exists) {
                        throw "Document does not exist!";
                    }

                    var newPopulation = sfDoc.data().population + 1;
                    if (newPopulation <= 1000000) {
                        transaction.update(sfDocRef, { population: newPopulation });
                        return newPopulation;
                    } else {
                        return Promise.reject("Sorry! Population is too big.");
                    }
                });
            }).then(function(newPopulation) {
                console.log("Population increased to ", newPopulation);
            }).catch(function(err) {
                // This will be an "population is too big" error.
                console.error(err);
            });
            // [END transaction_promise]
        });

        it("should get a single document #UNVERIFIED", () => {
            // [START get_document]
            var docRef = db.collection("cities").doc("SF");

            docRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            // [END get_document]
        });

        it("should get a document with options #UNVERIFIED", () => {
            // [START get_document_options]
            var docRef = db.collection("cities").doc("SF");

            // Valid options for source are 'server', 'cache', or
            // 'default'. See https://firebase.google.com/docs/reference/js/firebase.firestore.GetOptions
            // for more information.
            var getOptions = {
                source: 'cache'
            };

            // Get a document, forcing the SDK to fetch from the offline cache.
            docRef.get(getOptions).then(function(doc) {
                // Document was found in the cache. If no cached document exists,
                // an error will be returned to the 'catch' block below.
                console.log("Cached document data:", doc.data());
            }).catch(function(error) {
                console.log("Error getting cached document:", error);
            });
            // [END get_document_options]
        });

        it("should listen on a single document", (done) => {
            var unsub =
            // [START listen_document]
            db.collection("cities").doc("SF")
                .onSnapshot(function(doc) {
                    console.log("Current data: ", doc.data());
                });
            // [END listen_document]

            setTimeout(function() {
                unsub();
                done();
            }, 3000);
        }).timeout(5000);

        it("should listen on a single document with metadata #UNVERIFIED", (done) => {
            var unsub =
            // [START listen_document_local]
            db.collection("cities").doc("SF")
                .onSnapshot(function(doc) {
                    var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                    console.log(source, " data: ", doc.data());
                });
            // [END listen_document_local]

            setTimeout(function() {
                unsub();
                done();
            }, 3000);
        }).timeout(5000);

        it("should listen on a single document with options #UNVERIFIED", (done) => {
            var unsub =
            // [START listen_with_metadata]
            db.collection("cities").doc("SF")
                .onSnapshot({
                    // Listen for document metadata changes
                    includeMetadataChanges: true
                }, function(doc) {
                    // ...
                });
            // [END listen_with_metadata]

            setTimeout(function() {
                unsub();
                done();
            }, 3000);
        }).timeout(5000);

        it("should get multiple documents from a collection", () => {
            return output =
            // [START get_multiple]
            db.collection("cities").where("capital", "==", true)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                    });
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });
            // [END get_multiple]
        }).timeout(5000);

        it("should get all documents from a collection", () => {
            return output =
            // [START get_multiple_all]
            db.collection("cities").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                });
            });
            // [END get_multiple_all]
        })

        it("should listen on multiple documents #UNVERIFIED", (done) => {
            var unsubscribe =
            // [START listen_multiple]
            db.collection("cities").where("state", "==", "CA")
                .onSnapshot(function(querySnapshot) {
                    var cities = [];
                    querySnapshot.forEach(function(doc) {
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
            var unsubscribe =
            // [START listen_diffs]
            db.collection("cities").where("state", "==", "CA")
                .onSnapshot(function(snapshot) {
                    snapshot.docChanges().forEach(function(change) {
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
            var unsubscribe = db.collection("cities")
                .onSnapshot(function (){
                  // Respond to data
                  // ...
                });
            
            // Later ...

            // Stop listening to changes
            unsubscribe();
            // [END detach_listener]
        });

        it("should handle listener errors", () => {
            var unsubscribe =
            // [START handle_listen_errors]
            db.collection("cities")
                .onSnapshot(function(snapshot) {
                    //...
                }, function(error) {
                    //...
                });
            // [END handle_listen_errors]
            unsubscribe();
        });

        it("should update a document with server timestamp", () => {
            function update() {
                // [START update_with_server_timestamp]
                var docRef = db.collection('objects').doc('some-id');

                // Update the timestamp field with the value from the server
                var updateTimestamp = docRef.update({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                // [END update_with_server_timestamp]

                return updateTimestamp;
            }

            return db.collection('objects').doc('some-id')
                .set({})
                .then(() => update())
                .then(() => {
                    console.log('Document updated with server timestamp');
                });
        });

        it("should use options to control server timestamp resolution #UNVERIFIED", () => {
            var options = {
                // Options: 'estimate', 'previous', or 'none'
                serverTimestamps: 'estimate'
            };

            // Perform an update followed by an immediate read without
            // waiting for the update to complete. Due to the snapshot
            // options we will get two results: one with an estimate
            // timestamp and one with the resolved server timestamp.
            var docRef = db.collection('objects').doc('some-id');
            docRef.update({
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            docRef.onSnapshot(function(snapshot) {
                var data = snapshot.data(options);
                console.log(
                    'Timestamp: ' + data.timestamp +
                    ', pending: ' + snapshot.metadata.hasPendingWrites);
            });
        });

        it("should delete a document field", () => {
            function update() {
                // [START update_delete_field]
                var cityRef = db.collection('cities').doc('BJ');

                // Remove the 'capital' field from the document
                var removeCapital = cityRef.update({
                    capital: firebase.firestore.FieldValue.delete()
                });
                // [END update_delete_field]

                return removeCapital;
            }


            return db.collection('cities').doc('BJ')
                .set({ capital: true })
                .then(() => update())
                .then(() => {
                    console.log('Document field deleted');
                });
        });

        describe("queries", () => {
            it("should handle simple where", () => {
                // [START simple_queries]
                // Create a reference to the cities collection
                var citiesRef = db.collection("cities");

                // Create a query against the collection.
                var query = citiesRef.where("state", "==", "CA");
                // [END simple_queries]
            });

            it("should handle another simple where", () => {
                // [START simple_queries_again]
                var citiesRef = db.collection("cities");

                var query = citiesRef.where("capital", "==", true);
                // [END simple_queries_again]
            });

            it("should handle other wheres", () => {
                var citiesRef = db.collection("cities");
                // [START example_filters]
                citiesRef.where("state", "==", "CA")
                citiesRef.where("population", "<", 100000)
                citiesRef.where("name", ">=", "San Francisco")
                // [END example_filters]
            });

            it("should handle array-contains where", () => {
                var citiesRef = db.collection("cities");
                // [START array_contains_filter]
                citiesRef.where("regions", "array-contains", "west_coast")
                // [END array_contains_filter]
            });

            it("should handle an array contains any where", () => {
                const citiesRef = db.collection('cities');
                // [START array_contains_any_filter]
                citiesRef.where('regions', 'array-contains-any',
                    ['west_coast', 'east_coast']);
                // [END array_contains_any_filter]
            });

            it("should handle an in where", () => {
                const citiesRef = db.collection('cities');
                // [START in_filter]
                citiesRef.where('country', 'in', ['USA', 'Japan']);
                // [END in_filter]

                // [START in_filter_with_array]
                citiesRef.where('regions', 'in',
                    [['west_coast', 'east_coast']]);
                // [END in_filter_with_array]
            });

            it("should handle compound queries", () => {
                var citiesRef = db.collection("cities");
                // [START chain_filters]
                citiesRef.where("state", "==", "CO").where("name", "==", "Denver");
                citiesRef.where("state", "==", "CA").where("population", "<", 1000000);
                // [END chain_filters]
            });

            it("should handle range filters on one field", () => {
                var citiesRef = db.collection("cities");
                // [START valid_range_filters]
                citiesRef.where("state", ">=", "CA").where("state", "<=", "IN");
                citiesRef.where("state", "==", "CA").where("population", ">", 1000000);
                // [END valid_range_filters]
            });

            it("should not handle range filters on multiple field", () => {
                var citiesRef = db.collection("cities");
                expect(() => {
                    // [START invalid_range_filters]
                    citiesRef.where("state", ">=", "CA").where("population", ">", 100000);
                    // [END invalid_range_filters]
                }).to.throwException();
            });

            it("should order and limit", () => {
                var citiesRef = db.collection("cities");
                // [START order_and_limit]
                citiesRef.orderBy("name").limit(3)
                // [END order_and_limit]
            });

            it("should order descending", () => {
                var citiesRef = db.collection("cities");
                // [START order_and_limit_desc]
                citiesRef.orderBy("name", "desc").limit(3)
                // [END order_and_limit_desc]
            });

            it("should order descending by other field", () => {
                var citiesRef = db.collection("cities");
                // [START order_multiple]
                citiesRef.orderBy("state").orderBy("population", "desc")
                // [END order_multiple]
            });

            it("should where and order by with limit", () => {
                var citiesRef = db.collection("cities");
                // [START filter_and_order]
                citiesRef.where("population", ">", 100000).orderBy("population").limit(2)
                // [END filter_and_order]
            });

            it("should where and order on same field", () => {
                var citiesRef = db.collection("cities");
                // [START valid_filter_and_order]
                citiesRef.where("population", ">", 100000).orderBy("population")
                // [END valid_filter_and_order]
            });

            it("should not where and order on same field", () => {
                var citiesRef = db.collection("cities");
                expect(() => {
                    // [START invalid_filter_and_order]
                    citiesRef.where("population", ">", 100000).orderBy("country")
                    // [END invalid_filter_and_order]
                }).to.throwException();
            });

            it("should handle startAt", () => {
                var citiesRef = db.collection("cities");
                // [START order_and_start]
                citiesRef.orderBy("population").startAt(1000000)
                // [END order_and_start]
            });

            it("should handle endAt", () => {
                var citiesRef = db.collection("cities");
                // [START order_and_end]
                citiesRef.orderBy("population").endAt(1000000)
                // [END order_and_end]
            });

            it("should handle startAt(doc) ", () => {
                // [START start_doc]
                var citiesRef = db.collection("cities");

                return citiesRef.doc("SF").get().then(function(doc) {
                    // Get all cities with a population bigger than San Francisco
                    var biggerThanSf = citiesRef
                        .orderBy("population")
                        .startAt(doc);

                    // ...
                });
                // [END start_doc]
            });

            it("should handle multiple orderBy", () => {
                // [START start_multiple_orderby]
                // Will return all Springfields
                db.collection("cities")
                   .orderBy("name")
                   .orderBy("state")
                   .startAt("Springfield")

                // Will return "Springfield, Missouri" and "Springfield, Wisconsin"
                db.collection("cities")
                   .orderBy("name")
                   .orderBy("state")
                   .startAt("Springfield", "Missouri")
                // [END start_multiple_orderby]
            });

            it("shoud paginate", () => {
              // [START paginate]
              var first = db.collection("cities")
                      .orderBy("population")
                      .limit(25);

              return first.get().then(function (documentSnapshots) {
                // Get the last visible document
                var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
                console.log("last", lastVisible);

                // Construct a new query starting at this document,
                // get the next 25 cities.
                var next = db.collection("cities")
                        .orderBy("population")
                        .startAfter(lastVisible)
                        .limit(25);
              });
              // [END paginate]
            });
        });

        describe('collectionGroup(landmarks', () => {
            it("should setup example data", () => {
                // [START fs_collection_group_query_data_setup]
                var citiesRef = db.collection('cities');

                var landmarks = Promise.all([
                    citiesRef.doc('SF').collection('landmarks').doc().set({
                        name: 'Golden Gate Bridge',
                        type: 'bridge'
                    }),
                    citiesRef.doc('SF').collection('landmarks').doc().set({
                        name: 'Legion of Honor',
                        type: 'museum'
                    }),
                    citiesRef.doc('LA').collection('landmarks').doc().set({
                        name: 'Griffith Park',
                        type: 'park'
                    }),
                    citiesRef.doc('LA').collection('landmarks').doc().set({
                        name: 'The Getty',
                        type: 'museum'
                    }),
                    citiesRef.doc('DC').collection('landmarks').doc().set({
                        name: 'Lincoln Memorial',
                        type: 'memorial'
                    }),
                    citiesRef.doc('DC').collection('landmarks').doc().set({
                        name: 'National Air and Space Museum',
                        type: 'museum'
                    }),
                    citiesRef.doc('TOK').collection('landmarks').doc().set({
                        name: 'Ueno Park',
                        type: 'park'
                    }),
                    citiesRef.doc('TOK').collection('landmarks').doc().set({
                        name: 'National Museum of Nature and Science',
                        type: 'museum'
                    }),
                    citiesRef.doc('BJ').collection('landmarks').doc().set({
                        name: 'Jingshan Park',
                        type: 'park'
                    }),
                    citiesRef.doc('BJ').collection('landmarks').doc().set({
                        name: 'Beijing Ancient Observatory',
                        type: 'museum'
                    })
                ]);
                // [END fs_collection_group_query_data_setup]
                return landmarks;
            });
            
            it("should query a collection group", () => {
                // [START fs_collection_group_query]
                var museums = db.collectionGroup('landmarks').where('type', '==', 'museum');
                museums.get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id, ' => ', doc.data());
                    });
                });
                // [END fs_collection_group_query]
            });
        });
    });

    // TODO: Break out into separate file
    describe("solution-aggregation", () => {
        it("should update a restaurant in a transaction #UNVERIFIED", () => {
            // [START add_rating_transaction]
            function addRating(restaurantRef, rating) {
                // Create a reference for a new rating, for use inside the transaction
                var ratingRef = restaurantRef.collection('ratings').doc();

                // In a transaction, add the new rating and update the aggregate totals
                return db.runTransaction(transaction => {
                    return transaction.get(restaurantRef).then(res => {
                        if (!res.exists) {
                            throw "Document does not exist!";
                        }

                        // Compute new number of ratings
                        var newNumRatings = res.data().numRatings + 1;

                        // Compute new average rating
                        var oldRatingTotal = res.data().avgRating * res.data().numRatings;
                        var newAvgRating = (oldRatingTotal + rating) / newNumRatings;

                        // Commit to Firestore
                        transaction.update(restaurantRef, {
                            numRatings: newNumRatings,
                            avgRating: newAvgRating
                        });
                        transaction.set(ratingRef, { rating: rating });
                    })
                });
            }
            // [END add_rating_transaction]

            // Create document and add a rating
            var ref = db.collection('restaurants').doc('arinell-pizza');
            return ref.set({
                name: 'Arinell Pizza',
                avgRating: 4.63,
                numRatings: 683
            }).then(res => {
                return addRating(ref, 5.0)
            });
        });
    });
});
