// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    projectId: "<PROJECT_ID>",
};
const app = initializeApp(config);
const db = getFirestore(app);

function fetchFromBundle_wrapped() {
  // [START fs_bundle_load]
  const { useEffect, useState } = require("react");
  const { loadBundle, namedQuery, getDocsFromCache } = require("firebase/firestore");

  function LatestStories() {
    const [stories, setStories] = useState([]);

    useEffect(() => {
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
        setStories(storiesSnap.docs);
      }
      fetchFromBundle();
    }, []);

    return (
      <ul>
        {stories.map((doc) => (
          <li key={doc.id}>{doc.data().title}</li>
        ))}
      </ul>
    );
  }
  // [END fs_bundle_load]
}
