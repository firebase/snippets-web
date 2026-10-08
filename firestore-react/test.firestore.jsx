// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

import { or } from "firebase/firestore";

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

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    projectId: "<PROJECT_ID>",
};
const app = initializeApp(config);
const db = getFirestore(app);

function setCacheSize() {
  // [START fs_setup_cache]
  const { initializeFirestore, CACHE_SIZE_UNLIMITED } = require("firebase/firestore");

  const firestoreDb = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  });
  // [END fs_setup_cache]
}

function initializeWithPersistence() {
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
}

function disableNetwork_wrapped() {
  // [START disable_network]
  const { useTransition } = require("react");
  const { disableNetwork } = require("firebase/firestore"); 

  function DisableNetworkButton() {
    const [isPending, startTransition] = useTransition();

    function goOffline() {
      startTransition(async () => {
        await disableNetwork(db);
        console.log("Network disabled!");
        // Do offline actions
      });
    }

    return <button onClick={goOffline} disabled={isPending}>Go offline</button>;
  }
  // [END disable_network]
}

function enableNetwork_wrapped() {
  // [START enable_network]
  const { useTransition } = require("react");
  const { enableNetwork } = require("firebase/firestore"); 

  function EnableNetworkButton() {
    const [isPending, startTransition] = useTransition();

    function goOnline() {
      startTransition(async () => {
        await enableNetwork(db);
        // Do online actions
      });
    }

    return <button onClick={goOnline} disabled={isPending}>Go online</button>;
  }
  // [END enable_network]
}

function replyWithFromCacheFields() {
  // [START use_from_cache]
  const { useEffect, useState } = require("react");
  const { collection, onSnapshot, where, query } = require("firebase/firestore"); 

  function DataSource() {
    const [source, setSource] = useState(null);

    useEffect(() => {
      const q = query(collection(db, "cities"), where("state", "==", "CA"));
      // onSnapshot returns an unsubscribe function. Returning it from the effect
      // detaches the listener when the component unmounts.
      return onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log("New city: ", change.doc.data());
          }

          const source = snapshot.metadata.fromCache ? "local cache" : "server";
          console.log("Data came from " + source);
          setSource(source);
        });
      });
    }, []);

    return <span>{source}</span>;
  }
  // [END use_from_cache]
}

function addAdaLovelace() {
  // [START add_ada_lovelace]
  const { useTransition } = require("react");
  const { collection, addDoc } = require("firebase/firestore"); 

  function AddUserButton() {
    const [isPending, startTransition] = useTransition();

    function addUser() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={addUser} disabled={isPending}>Add user</button>;
  }
  // [END add_ada_lovelace]
}

function getAllUsers() {
  // [START get_all_users]
  const { useEffect, useState } = require("react");
  const { collection, getDocs } = require("firebase/firestore"); 

  function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      getDocs(collection(db, "users")).then((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          users.push({ id: doc.id, ...doc.data() });
        });
        setUsers(users);
      });
    }, []);

    return (
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.first} {user.last}</li>
        ))}
      </ul>
    );
  }
  // [END get_all_users]
}

function addAlanTuring() {
  // [START add_alan_turing]
  // Add a second document with a generated ID.
  const { useTransition } = require("react");
  const { addDoc, collection } = require("firebase/firestore"); 

  function AddUserButton() {
    const [isPending, startTransition] = useTransition();

    function addUser() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={addUser} disabled={isPending}>Add user</button>;
  }
  // [END add_alan_turing]
}

function loopThroughWatchedCollection() {
  // [START listen_for_users]
  const { useEffect, useState } = require("react");
  const { collection, where, query, onSnapshot } = require("firebase/firestore"); 

  function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const q = query(collection(db, "users"), where("born", "<", 1900));
      // onSnapshot returns an unsubscribe function. Returning it from the effect
      // detaches the listener when the component unmounts.
      return onSnapshot(q, (snapshot) => {
        console.log("Current users born before 1900:");
        const users = [];
        snapshot.forEach((userSnapshot) => {
          console.log(userSnapshot.data());
          users.push({ id: userSnapshot.id, ...userSnapshot.data() });
        });
        setUsers(users);
      });
    }, []);

    return (
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.first} {user.last}</li>
        ))}
      </ul>
    );
  }
  // [END listen_for_users]
}

function referenceSpecificDocument() {
  // [START doc_reference]
  const { doc } = require("firebase/firestore");

  const alovelaceDocumentRef = doc(db, 'users', 'alovelace');
  // [END doc_reference]
}

function referenceSpecificCollection() {
  // [START collection_reference]
  const { collection } = require("firebase/firestore");

  const usersCollectionRef = collection(db, 'users');
  // [END collection_reference]
}

function referenceSpecificDocumentAlternative() {
  // [START doc_reference_alternative]
  const { doc } = require("firebase/firestore"); 

  const alovelaceDocumentRef = doc(db, 'users/alovelace');
  // [END doc_reference_alternative]
}

function referenceDocumentInSubcollection() {
  // [START subcollection_reference]
  const { doc } = require("firebase/firestore"); 

  const messageRef = doc(db, "rooms", "roomA", "messages", "message1");
  // [END subcollection_reference]
}

function setDocument() {
  // [START set_document]
  const { useTransition } = require("react");
  const { doc, setDoc } = require("firebase/firestore"); 

  function AddCityButton() {
    const [isPending, startTransition] = useTransition();

    function addCity() {
      startTransition(async () => {
        // Add a new document in collection "cities"
        await setDoc(doc(db, "cities", "LA"), {
          name: "Los Angeles",
          state: "CA",
          country: "USA"
        });
      });
    }

    return <button onClick={addCity} disabled={isPending}>Add city</button>;
  }
  // [END set_document]
}

function setCustomObject() {
  // [START set_custom_object]
  const { useTransition } = require("react");
  const { doc, setDoc } = require("firebase/firestore"); 

  function AddCityButton() {
    const [isPending, startTransition] = useTransition();

    function addCity() {
      startTransition(async () => {
        // Set with cityConverter
        const ref = doc(db, "cities", "LA").withConverter(cityConverter);
        await setDoc(ref, new City("Los Angeles", "CA", "USA"));
      });
    }

    return <button onClick={addCity} disabled={isPending}>Add city</button>;
  }
  // [END set_custom_object]
}

function getCustomObject() {
  // [START get_custom_object]
  const { useEffect, useState } = require("react");
  const { doc, getDoc} = require("firebase/firestore"); 

  function CityDetails() {
    const [city, setCity] = useState(null);

    useEffect(() => {
      const ref = doc(db, "cities", "LA").withConverter(cityConverter);
      getDoc(ref).then((docSnap) => {
        if (docSnap.exists()) {
          // Convert to City object
          const city = docSnap.data();
          // Use a City instance method
          console.log(city.toString());
          console.log(city.name, city.state, city.country);
          setCity(city);
        } else {
          console.log("No such document!");
        }
      });
    }, []);

    return city ? <p>{city.toString()}</p> : <p>Loading...</p>;
  }
  // [END get_custom_object]
}

function supportBatchWrites() {
  // [START write_batch]
  const { useTransition } = require("react");
  const { writeBatch, doc } = require("firebase/firestore"); 

  function CommitBatchButton() {
    const [isPending, startTransition] = useTransition();

    function commitBatch() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={commitBatch} disabled={isPending}>Commit batch</button>;
  }
  // [END write_batch]
}

function setDocumentWithEveryDatatype() {
  // [START data_types]
  const { useTransition } = require("react");
  const { doc, setDoc, Timestamp } = require("firebase/firestore"); 

  function SaveDataButton() {
    const [isPending, startTransition] = useTransition();

    function saveData() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={saveData} disabled={isPending}>Save</button>;
  }
  // [END data_types]
}

function allowSetWithMerge() {
  // [START set_with_merge]
  const { useTransition } = require("react");
  const { doc, setDoc } = require("firebase/firestore"); 

  function UpdateCityButton() {
    const [isPending, startTransition] = useTransition();

    function updateCity() {
      startTransition(async () => {
        const cityRef = doc(db, 'cities', 'BJ');
        await setDoc(cityRef, { capital: true }, { merge: true });
      });
    }

    return <button onClick={updateCity} disabled={isPending}>Update city</button>;
  }
  // [END set_with_merge]
}

function updateDocumentNestedFields() {
  // [START update_document_nested]
  const { useTransition } = require("react");
  const { doc, setDoc, updateDoc } = require("firebase/firestore"); 

  function UpdateUserButton() {
    const [isPending, startTransition] = useTransition();

    function updateUser() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={updateUser} disabled={isPending}>Update user</button>;
  }
  // [END update_document_nested]
}

function deleteCollection_wrapped() {
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
}

function setDocuments() {
  // [START example_data]
  const { useTransition } = require("react");
  const { collection, doc, setDoc } = require("firebase/firestore"); 

  function AddCitiesButton() {
    const [isPending, startTransition] = useTransition();

    function addCities() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={addCities} disabled={isPending}>Add cities</button>;
  }
  // [END example_data]
}

function setCityDocument() {
  // [START cities_document_set]
  const { useTransition } = require("react");
  const { doc, setDoc } = require("firebase/firestore"); 

  function AddCityButton({ data }) {
    const [isPending, startTransition] = useTransition();

    function addCity() {
      startTransition(async () => {
        await setDoc(doc(db, "cities", "new-city-id"), data);
      });
    }

    return <button onClick={addCity} disabled={isPending}>Add city</button>;
  }
  // [END cities_document_set]
}

function addDocument() {
  // [START add_document]
  const { useTransition } = require("react");
  const { collection, addDoc } = require("firebase/firestore"); 

  function AddCityButton() {
    const [isPending, startTransition] = useTransition();

    function addCity() {
      startTransition(async () => {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "cities"), {
          name: "Tokyo",
          country: "Japan"
        });
        console.log("Document written with ID: ", docRef.id);
      });
    }

    return <button onClick={addCity} disabled={isPending}>Add city</button>;
  }
  // [END add_document]
}

function addEmptyDocument() {
  // [START new_document]
  const { useTransition } = require("react");
  const { collection, doc, setDoc } = require("firebase/firestore"); 

  function AddCityButton({ data }) {
    const [isPending, startTransition] = useTransition();

    function addCity() {
      startTransition(async () => {
        // Add a new document with a generated id
        const newCityRef = doc(collection(db, "cities"));

        // later...
        await setDoc(newCityRef, data);
      });
    }

    return <button onClick={addCity} disabled={isPending}>Add city</button>;
  }
  // [END new_document]
}

function updateDocument() {
  // [START update_document]
  const { useTransition } = require("react");
  const { doc, updateDoc } = require("firebase/firestore");

  function UpdateCityButton() {
    const [isPending, startTransition] = useTransition();

    function updateCity() {
      startTransition(async () => {
        const washingtonRef = doc(db, "cities", "DC");

        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
          capital: true
        });
      });
    }

    return <button onClick={updateCity} disabled={isPending}>Update city</button>;
  }
  // [END update_document]
}

function updateArrayField() {
  // [START update_document_array]
  const { useTransition } = require("react");
  const { doc, updateDoc, arrayUnion, arrayRemove } = require("firebase/firestore");

  function UpdateRegionsButton() {
    const [isPending, startTransition] = useTransition();

    function updateRegions() {
      startTransition(async () => {
        const washingtonRef = doc(db, "cities", "DC");

        // Atomically add a new region to the "regions" array field.
        await updateDoc(washingtonRef, {
            regions: arrayUnion("greater_virginia")
        });

        // Atomically remove a region from the "regions" array field.
        await updateDoc(washingtonRef, {
            regions: arrayRemove("east_coast")
        });
      });
    }

    return <button onClick={updateRegions} disabled={isPending}>Update regions</button>;
  }
  // [END update_document_array]
}

function updateWithNumericTransforms() {
  // [START update_document_increment]
  const { useTransition } = require("react");
  const { doc, updateDoc, increment } = require("firebase/firestore");

  function IncrementPopulationButton() {
    const [isPending, startTransition] = useTransition();

    function incrementPopulation() {
      startTransition(async () => {
        const washingtonRef = doc(db, "cities", "DC");

        // Atomically increment the population of the city by 50.
        await updateDoc(washingtonRef, {
            population: increment(50)
        });
      });
    }

    return <button onClick={incrementPopulation} disabled={isPending}>Increment population</button>;
  }
  // [END update_document_increment]
}

function deleteDocument() {
  // [START delete_document]
  const { useTransition } = require("react");
  const { doc, deleteDoc } = require("firebase/firestore");

  function DeleteCityButton() {
    const [isPending, startTransition] = useTransition();

    function deleteCity() {
      startTransition(async () => {
        await deleteDoc(doc(db, "cities", "DC"));
      });
    }

    return <button onClick={deleteCity} disabled={isPending}>Delete city</button>;
  }
  // [END delete_document]
}

function handleTransactions() {
  // [START transaction]
  const { useTransition } = require("react");
  const { runTransaction } = require("firebase/firestore");

  function IncrementPopulationButton({ sfDocRef }) {
    const [isPending, startTransition] = useTransition();

    function incrementPopulation() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={incrementPopulation} disabled={isPending}>Increment population</button>;
  }
  // [END transaction]
}

function handleTransactionWhichBubblesOutData() {
  // [START transaction_promise]
  const { useTransition } = require("react");
  const { doc, runTransaction } = require("firebase/firestore");

  function IncrementPopulationButton() {
    const [isPending, startTransition] = useTransition();

    function incrementPopulation() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={incrementPopulation} disabled={isPending}>Increment population</button>;
  }
  // [END transaction_promise]
}

function getSingleDocument() {
  // [START get_document]
  const { useEffect, useState } = require("react");
  const { doc, getDoc } = require("firebase/firestore");

  function CityDetails() {
    const [city, setCity] = useState(null);

    useEffect(() => {
      const docRef = doc(db, "cities", "SF");
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setCity(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      });
    }, []);

    return city ? <p>{city.name}</p> : <p>Loading...</p>;
  }
  // [END get_document]
}

function getDocumentWithOptions() {
  // [START get_document_options]
  const { useEffect, useState } = require("react");
  const { doc, getDocFromCache } = require("firebase/firestore");

  function CityDetails() {
    const [city, setCity] = useState(null);

    useEffect(() => {
      const docRef = doc(db, "cities", "SF");

      // Get a document, forcing the SDK to fetch from the offline cache.
      getDocFromCache(docRef).then((doc) => {
        // Document was found in the cache. If no cached document exists,
        // an error will be returned to the 'catch' block below.
        console.log("Cached document data:", doc.data());
        setCity(doc.data());
      }).catch((e) => {
        console.log("Error getting cached document:", e);
      });
    }, []);

    return city ? <p>{city.name}</p> : <p>Loading...</p>;
  }
  // [END get_document_options]
}

function listenOnSingleDocument() {
  // [START listen_document]
  const { useEffect, useState } = require("react");
  const { doc, onSnapshot } = require("firebase/firestore");

  function CityDetails() {
    const [city, setCity] = useState(null);

    useEffect(() => {
      // onSnapshot returns an unsubscribe function. Returning it from the effect
      // detaches the listener when the component unmounts.
      return onSnapshot(doc(db, "cities", "SF"), (doc) => {
        console.log("Current data: ", doc.data());
        setCity(doc.data());
      });
    }, []);

    return city ? <p>{city.name}</p> : <p>Loading...</p>;
  }
  // [END listen_document]
}

function listenOnSingleDocumentWithMetadata() {
  // [START listen_document_local]
  const { useEffect, useState } = require("react");
  const { doc, onSnapshot } = require("firebase/firestore");

  function CityDetails() {
    const [city, setCity] = useState(null);
    const [source, setSource] = useState(null);

    useEffect(() => {
      return onSnapshot(doc(db, "cities", "SF"), (doc) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
        setSource(source);
        setCity(doc.data());
      });
    }, []);

    return city ? <p>{source} data: {city.name}</p> : <p>Loading...</p>;
  }
  // [END listen_document_local]
}

function listenOnSingleDocumentWithOptions() {
  // [START listen_with_metadata]
  const { useEffect, useState } = require("react");
  const { doc, onSnapshot } = require("firebase/firestore");

  function CityDetails() {
    const [city, setCity] = useState(null);

    useEffect(() => {
      return onSnapshot(
        doc(db, "cities", "SF"), 
        { includeMetadataChanges: true }, 
        (doc) => {
          // ...
          setCity(doc.data());
        });
    }, []);

    return city ? <p>{city.name}</p> : <p>Loading...</p>;
  }
  // [END listen_with_metadata]
}

function getMultipleDocuments() {
  // [START get_multiple]
  const { useEffect, useState } = require("react");
  const { collection, query, where, getDocs } = require("firebase/firestore");

  function CapitalCities() {
    const [cities, setCities] = useState([]);

    useEffect(() => {
      const q = query(collection(db, "cities"), where("capital", "==", true));

      getDocs(q).then((querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          cities.push({ id: doc.id, ...doc.data() });
        });
        setCities(cities);
      });
    }, []);

    return (
      <ul>
        {cities.map((city) => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    );
  }
  // [END get_multiple]
}

function getAllDocuments() {
  // [START get_multiple_all]
  const { useEffect, useState } = require("react");
  const { collection, getDocs } = require("firebase/firestore");

  function CityList() {
    const [cities, setCities] = useState([]);

    useEffect(() => {
      getDocs(collection(db, "cities")).then((querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          cities.push({ id: doc.id, ...doc.data() });
        });
        setCities(cities);
      });
    }, []);

    return (
      <ul>
        {cities.map((city) => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    );
  }
  // [END get_multiple_all]
}

function getAllDocumentsFromSubcollection() {
  // [START firestore_query_subcollection]
  const { useEffect, useState } = require("react");
  const { collection, getDocs } = require("firebase/firestore");

  function LandmarkList() {
    const [landmarks, setLandmarks] = useState([]);

    useEffect(() => {
      // Query a reference to a subcollection
      getDocs(collection(db, "cities", "SF", "landmarks")).then((querySnapshot) => {
        const landmarks = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          landmarks.push({ id: doc.id, ...doc.data() });
        });
        setLandmarks(landmarks);
      });
    }, []);

    return (
      <ul>
        {landmarks.map((landmark) => (
          <li key={landmark.id}>{landmark.name}</li>
        ))}
      </ul>
    );
  }
  // [END firestore_query_subcollection]
}

function listenOnMultipleDocuments() {
  // [START listen_multiple]
  const { useEffect, useState } = require("react");
  const { collection, query, where, onSnapshot } = require("firebase/firestore");

  function CityList({ state }) {
    const [cities, setCities] = useState([]);

    useEffect(() => {
      const q = query(collection(db, "cities"), where("state", "==", state));
      return onSnapshot(q, (querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
            cities.push({ id: doc.id, name: doc.data().name });
        });
        setCities(cities);
      });
    }, [state]);

    return (
      <ul>
        {cities.map((city) => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    );
  }
  // [END listen_multiple]
}

function viewChangesBetweenSnapshots() {
  // [START listen_diffs]
  const { useEffect, useState } = require("react");
  const { collection, query, where, onSnapshot } = require("firebase/firestore");

  function CityList({ state }) {
    const [cities, setCities] = useState([]);

    useEffect(() => {
      const q = query(collection(db, "cities"), where("state", "==", state));
      // Each subscription builds its own list, so resubscribing starts fresh.
      let list = [];
      return onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
              console.log("New city: ", change.doc.data());
              list = [...list, { id: change.doc.id, ...change.doc.data() }];
          }
          if (change.type === "modified") {
              console.log("Modified city: ", change.doc.data());
              list = list.map((city) =>
                city.id === change.doc.id ? { id: change.doc.id, ...change.doc.data() } : city);
          }
          if (change.type === "removed") {
              console.log("Removed city: ", change.doc.data());
              list = list.filter((city) => city.id !== change.doc.id);
          }
        });
        setCities(list);
      });
    }, [state]);

    return (
      <ul>
        {cities.map((city) => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    );
  }
  // [END listen_diffs]
}

function unsubscribeListener() {
  // [START detach_listener]
  const { useEffect } = require("react");
  const { collection, onSnapshot } = require("firebase/firestore");

  function CitiesListener() {
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "cities"), () => {
        // Respond to data
        // ...
      });
      
      // Later ...
      return () => {
        // Stop listening to changes
        unsubscribe();
      };
    }, []);

    return null;
  }
  // [END detach_listener]
}

function handleListenerErrors() {
  // [START handle_listen_errors]
  const { useEffect } = require("react");
  const { collection, onSnapshot } = require("firebase/firestore");

  function CitiesListener() {
    useEffect(() => {
      return onSnapshot(
        collection(db, "cities"), 
        (snapshot) => {
          // ...
        },
        (error) => {
          // ...
        });
    }, []);

    return null;
  }
  // [END handle_listen_errors]
}

function updateWithServerTimestamp() {
  const { doc } = require("firebase/firestore");

  // [START update_with_server_timestamp]
  const { useTransition } = require("react");
  const { updateDoc, serverTimestamp } = require("firebase/firestore");

  function UpdateTimestampButton() {
    const [isPending, startTransition] = useTransition();

    function update() {
      startTransition(async () => {
        const docRef = doc(db, 'objects', 'some-id');

        // Update the timestamp field with the value from the server
        const updateTimestamp = await updateDoc(docRef, {
            timestamp: serverTimestamp()
        });
      });
    }

    return <button onClick={update} disabled={isPending}>Update</button>;
  }
  // [END update_with_server_timestamp]
}

function serverTimestampResolutionOptions() {
  // [START server_timestamp_resolution_options]
  const { useEffect, useState } = require("react");
  const { doc, updateDoc, serverTimestamp, onSnapshot } = require("firebase/firestore");

  function ObjectTimestamp() {
    const [timestamp, setTimestamp] = useState(null);

    useEffect(() => {
      // Perform an update followed by an immediate read without
      // waiting for the update to complete. Due to the snapshot
      // options we will get two results: one with an estimate
      // timestamp and one with the resolved server timestamp.
      const docRef = doc(db, 'objects', 'some-id');
      updateDoc(docRef, {
          timestamp: serverTimestamp()
      });

      return onSnapshot(docRef, (snapshot) => {
        const data = snapshot.data({
          // Options: 'estimate', 'previous', or 'none'
          serverTimestamps: "estimate"
        });
        console.log(
            'Timestamp: ' + data.timestamp +
            ', pending: ' + snapshot.metadata.hasPendingWrites);
        setTimestamp(data.timestamp);
      });
    }, []);

    return <span>{timestamp ? timestamp.toDate().toString() : null}</span>;
  }
  // [END server_timestamp_resolution_options]
}

function deleteDocumentField() {
  // [START update_delete_field]
  const { useTransition } = require("react");
  const { doc, updateDoc, deleteField } = require("firebase/firestore");

  function RemoveCapitalButton() {
    const [isPending, startTransition] = useTransition();

    function removeCapital() {
      startTransition(async () => {
        const cityRef = doc(db, 'cities', 'BJ');

        // Remove the 'capital' field from the document
        await updateDoc(cityRef, {
            capital: deleteField()
        });
      });
    }

    return <button onClick={removeCapital} disabled={isPending}>Remove capital</button>;
  }
  // [END update_delete_field]
}

function handleSimpleWhere() {
  // [START simple_queries]
  // Create a reference to the cities collection
  const { collection, query, where } = require("firebase/firestore");
  const citiesRef = collection(db, "cities");

  // Create a query against the collection.
  const q = query(citiesRef, where("state", "==", "CA"));
  // [END simple_queries]
}

function handleAnotherSimpleWhere() {
  // [START simple_queries_again]
  const { collection, query, where } = require("firebase/firestore");
  const citiesRef = collection(db, "cities");

  const q = query(citiesRef, where("capital", "==", true));
  // [END simple_queries_again]
}

function handleOtherWheres() {
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
}

function handleArrayContainsWhere() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START array_contains_filter]
  const { query, where } = require("firebase/firestore");  
  const q = query(citiesRef, where("regions", "array-contains", "west_coast"));
  // [END array_contains_filter]
}

function handleArrayContainsAnyWhere() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START array_contains_any_filter]
  const { query, where } = require("firebase/firestore");  

  const q = query(citiesRef, 
    where('regions', 'array-contains-any', [['west_coast'], ['east_coast']]));
  // [END array_contains_any_filter]
}

function handleInWhere() {
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
}

function handleCompoundQueries() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START chain_filters]
  const { query, where } = require("firebase/firestore");  

  const q1 = query(citiesRef, where("state", "==", "CO"), where("name", "==", "Denver"));
  const q2 = query(citiesRef, where("state", "==", "CA"), where("population", "<", 1000000));
  // [END chain_filters]
}

function handleRangeFiltersOnOneField() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START valid_range_filters]
  const { query, where } = require("firebase/firestore");  

  const q1 = query(citiesRef, where("state", ">=", "CA"), where("state", "<=", "IN"));
  const q2 = query(citiesRef, where("state", "==", "CA"), where("population", ">", 1000000));
  // [END valid_range_filters]
}

function notHandleRangeFiltersOnMultipleFields() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START invalid_range_filters]
  const { query, where } = require("firebase/firestore");  

  const q = query(citiesRef, where("state", ">=", "CA"), where("population", ">", 100000));
  // [END invalid_range_filters]
}

function orderAndLimit() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START order_and_limit]
  const { query, orderBy, limit } = require("firebase/firestore");  

  const q = query(citiesRef, orderBy("name"), limit(3));
  // [END order_and_limit]
}

function orderDescending() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START order_and_limit_desc]
  const { query, orderBy, limit } = require("firebase/firestore");  

  const q = query(citiesRef, orderBy("name", "desc"), limit(3));
  // [END order_and_limit_desc]
}

function orderDescendingByOtherField() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START order_multiple]
  const { query, orderBy } = require("firebase/firestore");  

  const q = query(citiesRef, orderBy("state"), orderBy("population", "desc"));
  // [END order_multiple]
}

function whereAndOrderByWithLimit() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START filter_and_order]
  const { query, where, orderBy, limit } = require("firebase/firestore");  

  const q = query(citiesRef, where("population", ">", 100000), orderBy("population"), limit(2));
  // [END filter_and_order]
}

function whereAndOrderOnSameField() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START valid_filter_and_order]
  const { query, where, orderBy } = require("firebase/firestore");  

  const q = query(citiesRef, where("population", ">", 100000), orderBy("population"));
  // [END valid_filter_and_order]
}

function notWhereAndOrderOnSameField() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START invalid_filter_and_order]
  const { query, where, orderBy } = require("firebase/firestore");  
  
  const q = query(citiesRef, where("population", ">", 100000), orderBy("country"));
  // [END invalid_filter_and_order]
}

function handleStartAt() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START order_and_start]
  const { query, orderBy, startAt } = require("firebase/firestore");  

  const q = query(citiesRef, orderBy("population"), startAt(1000000));
  // [END order_and_start]
}

function handleEndAt() {
  const { collection } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  // [START order_and_end]
  const { query, orderBy, endAt } = require("firebase/firestore");  

  const q = query(citiesRef, orderBy("population"), endAt(1000000));
  // [END order_and_end]
}

async function handleStartAtDoc() {
  // [START start_doc]
  const { collection, doc, getDoc, query, orderBy, startAt } = require("firebase/firestore");  
  const citiesRef = collection(db, "cities");

  const docSnap = await getDoc(doc(citiesRef, "SF"));
  
  // Get all cities with a population bigger than San Francisco
  const biggerThanSf = query(citiesRef, orderBy("population"), startAt(docSnap));
  // ...
  // [END start_doc]
}

function handleMultipleOrderBy() {
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
}

function paginate() {
  // [START paginate]
  const { useEffect, useState } = require("react");
  const { collection, query, orderBy, startAfter, limit, getDocs } = require("firebase/firestore");  

  function CityPage() {
    const [cities, setCities] = useState([]);

    useEffect(() => {
      // Query the first page of docs
      const first = query(collection(db, "cities"), orderBy("population"), limit(25));
      getDocs(first).then((documentSnapshots) => {
        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        console.log("last", lastVisible);

        // Construct a new query starting at this document,
        // get the next 25 cities.
        const next = query(collection(db, "cities"),
            orderBy("population"),
            startAfter(lastVisible),
            limit(25));

        setCities(documentSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
    }, []);

    return (
      <ul>
        {cities.map((city) => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    );
  }
  // [END paginate]
}

function handleOrQueries() {
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
}

function allowForThirtyOrFewerDisjunctions() {
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

  // [START 50_disjunctions]
  query(collectionRef,
    and( where("a", "in", [1, 2, 3, 4, 5]),
         where("b", "in", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    )
  );
  // [END 50_disjunctions]

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
}

function setupExampleData() {
  // [START fs_collection_group_query_data_setup]
  const { useTransition } = require("react");
  const { collection, addDoc } = require("firebase/firestore");  

  function AddLandmarksButton() {
    const [isPending, startTransition] = useTransition();

    function addLandmarks() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={addLandmarks} disabled={isPending}>Add landmarks</button>;
  }
  // [END fs_collection_group_query_data_setup]
}

function queryCollectionGroup() {
  // [START fs_collection_group_query]
  const { useEffect, useState } = require("react");
  const { collectionGroup, query, where, getDocs } = require("firebase/firestore");  

  function MuseumList() {
    const [landmarks, setLandmarks] = useState([]);

    useEffect(() => {
      const museums = query(collectionGroup(db, 'landmarks'), where('type', '==', 'museum'));
      getDocs(museums).then((querySnapshot) => {
        const landmarks = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.id, ' => ', doc.data());
            landmarks.push({ id: doc.id, ...doc.data() });
        });
        setLandmarks(landmarks);
      });
    }, []);

    return (
      <ul>
        {landmarks.map((landmark) => (
          <li key={landmark.id}>{landmark.name}</li>
        ))}
      </ul>
    );
  }
  // [END fs_collection_group_query]
}

function fetchCountOfDocumentsInCollection() {
  // [START count_aggregate_collection]
  const { useEffect, useState } = require("react");
  const { collection, getCountFromServer } = require("firebase/firestore"); 

  function CityCount() {
    const [count, setCount] = useState(null);

    useEffect(() => {
      const coll = collection(db, "cities");
      getCountFromServer(coll).then((snapshot) => {
        console.log('count: ', snapshot.data().count);
        setCount(snapshot.data().count);
      });
    }, []);

    return <span>{count}</span>;
  }
  // [END count_aggregate_collection]
}

function fetchCountOfDocumentsInQuery() {
  // [START count_aggregate_query]
  const { useEffect, useState } = require("react");
  const { collection, getCountFromServer, where, query } = require("firebase/firestore"); 

  function CityCount() {
    const [count, setCount] = useState(null);

    useEffect(() => {
      const coll = collection(db, "cities");
      const q = query(coll, where("state", "==", "CA"));
      getCountFromServer(q).then((snapshot) => {
        console.log('count: ', snapshot.data().count);
        setCount(snapshot.data().count);
      });
    }, []);

    return <span>{count}</span>;
  }
  // [END count_aggregate_query]
}

function updateRestaurantInTransaction() {
  // [START add_rating_transaction]
  const { useTransition } = require("react");
  const { collection, doc, runTransaction } = require("firebase/firestore");  

  function AddRatingButton({ restaurantRef, rating }) {
    const [isPending, startTransition] = useTransition();

    function addRating() {
      startTransition(async () => {
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
      });
    }

    return <button onClick={addRating} disabled={isPending}>Add rating</button>;
  }
  // [END add_rating_transaction]
}
