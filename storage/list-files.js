import firebase from "firebase/app";
import "firebase/storage";

function listAll() {
  const storageRef = firebase.storage().ref();

  // [START storage_list_all]
  // Create a reference under which you want to list
  var listRef = storageRef.child('files/uid');

  // Find all the prefixes and items.
  listRef.listAll()
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
  const storageRef = firebase.storage().ref();

  // [START storage_list_paginate]
  async function pageTokenExample(){
    // Create a reference under which you want to list
    var listRef = storageRef.child('files/uid');

    // Fetch the first page of 100.
    var firstPage = await listRef.list({ maxResults: 100});

    // Use the result.
    // processItems(firstPage.items)
    // processPrefixes(firstPage.prefixes)

    // Fetch the second page if there are more elements.
    if (firstPage.nextPageToken) {
      var secondPage = await listRef.list({
        maxResults: 100,
        pageToken: firstPage.nextPageToken,
      });
      // processItems(secondPage.items)
      // processPrefixes(secondPage.prefixes)
    }
  }
  // [END storage_list_paginate]
}
