// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function listAll() {
  // [START storage_list_all]
  const { useEffect, useState } = require("react");
  const { getStorage, ref, listAll } = require("firebase/storage");

  function FileList() {
    const [prefixes, setPrefixes] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
      const storage = getStorage();

      // Create a reference under which you want to list
      const listRef = ref(storage, 'files/uid');

      // Find all the prefixes and items.
      listAll(listRef)
        .then((res) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
          setPrefixes(res.prefixes);
          // All the items under listRef.
          setItems(res.items);
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
    }, []);

    return (
      <ul>
        {prefixes.map((folderRef) => (
          <li key={folderRef.fullPath}>{folderRef.name}/</li>
        ))}
        {items.map((itemRef) => (
          <li key={itemRef.fullPath}>{itemRef.name}</li>
        ))}
      </ul>
    );
  }
  // [END storage_list_all]
}

function listPaginate() {
  // [START storage_list_paginate]
  const { useEffect, useState } = require("react");
  const { getStorage, ref, list } = require("firebase/storage");

  function FileList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
      async function pageTokenExample(){
        // Create a reference under which you want to list
        const storage = getStorage();
        const listRef = ref(storage, 'files/uid');

        // Fetch the first page of 100.
        const firstPage = await list(listRef, { maxResults: 100 });

        // Use the result.
        // processItems(firstPage.items)
        // processPrefixes(firstPage.prefixes)
        setItems(firstPage.items);

        // Fetch the second page if there are more elements.
        if (firstPage.nextPageToken) {
          const secondPage = await list(listRef, {
            maxResults: 100,
            pageToken: firstPage.nextPageToken,
          });
          // processItems(secondPage.items)
          // processPrefixes(secondPage.prefixes)
          setItems([...firstPage.items, ...secondPage.items]);
        }
      }
      pageTokenExample();
    }, []);

    return (
      <ul>
        {items.map((itemRef) => (
          <li key={itemRef.fullPath}>{itemRef.name}</li>
        ))}
      </ul>
    );
  }
  // [END storage_list_paginate]
}
