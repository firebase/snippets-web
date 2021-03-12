// [START fs_bundle_load]
// If you are using module bundlers.
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/firestore/bundle"; // This line enables bundle loading as a side effect.

// [START_EXCLUDE]
/**
 * @type firebase.firestore.Firestore
 */
var db;
// [END_EXCLUDE]

async function fetchFromBundle() {
  // Fetch the bundle from Firebase Hosting, if the CDN cache is hit the 'X-Cache'
  // response header will be set to 'HIT'
  const resp = await fetch('/createBundle');

  // Load the bundle contents into the Firestore SDK
  await db.loadBundle(resp.body);

  // Query the results from the cache
  // Note: omitting "source: cache" will query the Firestore backend.
  const query = await db.namedQuery('latest-stories-query');
  const storiesSnap = await query.get({ source: 'cache' });

  // Use the results
  // ...
}
// [END fs_bundle_load]

describe("firestore-solution-bundles", () => {
    before(() => {
        var config = {
            apiKey: "AIzaSyArvVh6VSdXicubcvIyuB-GZs8ua0m0DTI",
            authDomain: "firestorequickstarts.firebaseapp.com",
            projectId: "firestorequickstarts",
        };
        var app = firebase.initializeApp(config, "solution-bundles");
        db = firebase.firestore(app);
    });

    describe("solution-bundles", () => {
      it("should fetch a bundle", (done) => {
        fetchFromBundle().finally(done);
      });
    });
});
