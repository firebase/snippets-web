// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

function listAll() {
  // [START storage_list_all]
  const { getStorage, ref, listAll } = require("firebase/storage");

  const storage = getStorage(firebaseApp);

  // Create a reference under which you want to list
  const listRef = ref(storage, 'files/uid');

  // Find all the prefixes and items.
  listAll(listRef)
    .then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
      });
      res.items.forEach((itemRef) => {
        // All the items under listRef.
      });
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  // [END storage_list_all]
}

function listPaginate() {
  // [START storage_list_paginate]
  const { getStorage, ref, list } = require("firebase/storage");

  async function pageTokenExample(){
    // Create a reference under which you want to list
    const storage = getStorage(firebaseApp);
    const listRef = ref(storage, 'files/uid');

    // Fetch the first page of 100.
    const firstPage = await list(listRef, { maxResults: 100 });

    // Use the result.
    // processItems(firstPage.items)
    // processPrefixes(firstPage.prefixes)

    // Fetch the second page if there are more elements.
    if (firstPage.nextPageToken) {
      const secondPage = await list(listRef, {
        maxResults: 100,
        pageToken: firstPage.nextPageToken,
      });
      // processItems(secondPage.items)
      // processPrefixes(secondPage.prefixes)
    }
  }
  // [END storage_list_paginate]
}
