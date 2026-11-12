// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const geofire = require('geofire-common');

const config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    projectId: "<PROJECT_ID>",
};
const app = initializeApp(config);
const db = getFirestore(app);

function addHash() {
  // [START fs_geo_add_hash]
  const { doc, updateDoc } = require('firebase/firestore');

  function AddHashButton() {
    async function addHash() {
      // Compute the GeoHash for a lat/lng point
      const lat = 51.5074;
      const lng = 0.1278;
      const hash = geofire.geohashForLocation([lat, lng]);

      // Add the hash and the lat/lng to the document. We will use the hash
      // for queries and the lat/lng for distance comparisons.
      const londonRef = doc(db, 'cities', 'LON');
      await updateDoc(londonRef, {
        geohash: hash,
        lat: lat,
        lng: lng
      });
    }

    return <button onClick={addHash}>Add hash</button>;
  }
  // [END fs_geo_add_hash]
}

// tsc complains `center` can have more or fewer than 2 elements, but
// since this is a js file there's no way of more accurately specifying
// `center`'s type.
function queryHashes() {
  // [START fs_geo_query_hashes]
  const { useEffect, useState } = require("react");
  const { collection, query, orderBy, startAt, endAt, getDocs } = require('firebase/firestore');

  function NearbyCities() {
    const [matchingDocs, setMatchingDocs] = useState([]);

    useEffect(() => {
      // Find cities within 50km of London
      const center = [51.5074, 0.1278];
      const radiusInM = 50 * 1000;

      // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
      // a separate query for each pair. There can be up to 9 pairs of bounds
      // depending on overlap, but in most cases there are 4.
      // @ts-ignore
      const bounds = geofire.geohashQueryBounds(center, radiusInM);
      const promises = [];
      for (const b of bounds) {
        const q = query(
          collection(db, 'cities'),
          orderBy('geohash'),
          startAt(b[0]),
          endAt(b[1]));

        promises.push(getDocs(q));
      }

      // Collect all the query results together into a single list
      Promise.all(promises).then((snapshots) => {
        const matchingDocs = [];
        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const lat = doc.get('lat');
            const lng = doc.get('lng');

            // We have to filter out a few false positives due to GeoHash
            // accuracy, but most will match
            // @ts-ignore
            const distanceInKm = geofire.distanceBetween([lat, lng], center);
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radiusInM) {
              matchingDocs.push(doc);
            }
          }
        }
        setMatchingDocs(matchingDocs);
      });
    }, []);

    return (
      <ul>
        {matchingDocs.map((doc) => (
          <li key={doc.id}>{doc.id}</li>
        ))}
      </ul>
    );
  }
  // [END fs_geo_query_hashes]
}
