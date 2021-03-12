// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

const { FirebaseFirestore } = require('firebase/firestore');

/**
 * @type FirebaseFirestore
 */
var db;

// [START fs_bundle_load]
const { loadBundle, namedQuery, getDocsFromCache } = require("firebase/firestore");

async function fetchFromBundle() {
  // Fetch the bundle from Firebase Hosting, if the CDN cache is hit the 'X-Cache'
  // response header will be set to 'HIT'
  const resp = await fetch('/createBundle');

  // Load the bundle contents into the Firestore SDK
  await loadBundle(db, resp.body);

  // Query the results from the cache
  const query = await namedQuery(db, 'latest-stories-query');
  const storiesSnap = await getDocsFromCache(query);

  // Use the results
  // ...
}
// [END fs_bundle_load]

describe("firestore-solution-bundles", () => {
    before(() => {
      const { initializeApp } = require("firebase/app");
      const { getFirestore} = require("firebase/firestore");

      const config = {
          apiKey: "AIzaSyArvVh6VSdXicubcvIyuB-GZs8ua0m0DTI",
          authDomain: "firestorequickstarts.firebaseapp.com",
          projectId: "firestorequickstarts",
      };
      const app = initializeApp(config, "solution-bundles");
      db = getFirestore(app);
    });

    describe("solution-bundles", () => {
      it("should fetch a bundle", (done) => {
        fetchFromBundle().finally(done);
      });
    });
});
