// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

const { FirebaseFirestore } = require('firebase/firestore');

const geofire = require('geofire-common');

/** @type {FirebaseFirestore} */
let db;

async function addHash(done) {
  // [START fs_geo_add_hash]
  const { doc, updateDoc } = require('firebase/firestore');

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
  // [END fs_geo_add_hash]
  done();
}

async function queryHashes(done) {
  // [START fs_geo_query_hashes]
  const { collection, query, orderBy, startAt, endAt, getDocs } = require('firebase/firestore');

  // Find cities within 50km of London
  const center = [51.5074, 0.1278];
  const radiusInM = 50 * 1000;

  // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
  // a separate query for each pair. There can be up to 9 pairs of bounds
  // depending on overlap, but in most cases there are 4.
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
  const snapshots = await Promise.all(promises);

  const matchingDocs = [];
  for (const snap of snapshots) {
    for (const doc of snap.docs) {
      const lat = doc.get('lat');
      const lng = doc.get('lng');

      // We have to filter out a few false positives due to GeoHash
      // accuracy, but most will match
      const distanceInKm = geofire.distanceBetween([lat, lng], center);
      const distanceInM = distanceInKm * 1000;
      if (distanceInM <= radiusInM) {
        matchingDocs.push(doc);
      }
    }
  }
  // [END fs_geo_query_hashes]
  done(matchingDocs);
}

describe("firestore-solution-geoqueries", () => {
    before(() => {
      const { initializeApp } = require("firebase/app");
      const { getFirestore} = require("firebase/firestore");

      const config = {
          apiKey: "AIzaSyArvVh6VSdXicubcvIyuB-GZs8ua0m0DTI",
          authDomain: "firestorequickstarts.firebaseapp.com",
          projectId: "firestorequickstarts",
      };
      const app = initializeApp(config, "solution-geoqueries");
      db = getFirestore(app);
    });

    describe("solution-geoqueries", () => {
      it("should add a hash to a doc", (done) => {
        addHash(done);
      });

      it("should query hashes", (done) => {
        queryHashes(done);
      });
    });
});



