import firebase from 'firebase/app';
import 'firebase/firestore';

const geofire = require('geofire-common');

/**
 * @type firebase.firestore.Firestore
 */
var db;

function addHash(done) {
  // [START fs_geo_add_hash]
  // Compute the GeoHash for a lat/lng point
  const lat = 51.5074;
  const lng = 0.1278;
  const hash = geofire.geohashForLocation([lat, lng]);

  // Add the hash and the lat/lng to the document. We will use the hash
  // for queries and the lat/lng for distance comparisons.
  const londonRef = db.collection('cities').doc('LON');
  londonRef.update({
    geohash: hash,
    lat: lat,
    lng: lng
  }).then(() => {
    // [START_EXCLUDE]
    done();
    // [END_EXCLUDE]
  });
  // [END fs_geo_add_hash]
}

function queryHashes(done) {
  // [START fs_geo_query_hashes]
  // Find cities within 50km of London
  const center = [51.5074, 0.1278];
  const radiusInM = 50 * 1000;

  // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
  // a separate query for each pair. There can be up to 9 pairs of bounds
  // depending on overlap, but in most cases there are 4.
  const bounds = geofire.geohashQueryBounds(center, radiusInM);
  const promises = [];
  for (const b of bounds) {
    const q = db.collection('cities')
      .orderBy('geohash')
      .startAt(b[0])
      .endAt(b[1]);

    promises.push(q.get());
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
        const distanceInKm = geofire.distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          matchingDocs.push(doc);
        }
      }
    }

    return matchingDocs;
  }).then((matchingDocs) => {
    // Process the matching documents
    // [START_EXCLUDE]
    done(matchingDocs);
    // [END_EXCLUDE]
  });

  // [END fs_geo_query_hashes]
}

describe("firestore-solution-geoqueries", () => {
    before(() => {
        var config = {
            apiKey: "AIzaSyArvVh6VSdXicubcvIyuB-GZs8ua0m0DTI",
            authDomain: "firestorequickstarts.firebaseapp.com",
            projectId: "firestorequickstarts",
        };
        var app = firebase.initializeApp(config, "solution-geoqueries");
        db = firebase.firestore(app);
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
