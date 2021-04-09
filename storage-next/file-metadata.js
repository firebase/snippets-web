// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function getMetadata() {
  // [START storage_get_metadata]
  const { getStorage, ref, getMetadata } = require("firebase/storage");

  // Create a reference to the file whose metadata we want to retrieve
  const storage = getStorage();
  const forestRef = ref(storage, 'images/forest.jpg');

  // Get metadata properties
  getMetadata(forestRef)
    .then((metadata) => {
      // Metadata now contains the metadata for 'images/forest.jpg'
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });
  // [END storage_get_metadata]
}

function updateMetadata() {
  // [START storage_update_metadata]
  const { getStorage, ref, updateMetadata } = require("firebase/storage");

  // Create a reference to the file whose metadata we want to change
  const storage = getStorage();
  const forestRef = ref(storage, 'images/forest.jpg');

  // Create file metadata to update
  const newMetadata = {
    cacheControl: 'public,max-age=300',
    contentType: 'image/jpeg'
  };

  // Update metadata properties
  updateMetadata(forestRef, newMetadata)
    .then((metadata) => {
      // Updated metadata for 'images/forest.jpg' is returned in the Promise
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  // [END storage_update_metadata]
}

function deleteMetadata() {
  // [START storage_delete_metadata]
  const { getStorage, ref, updateMetadata } = require("firebase/storage");

  const storage = getStorage();
  const forestRef = ref(storage, 'images/forest.jpg');

  // Create file metadata with property to delete
  const deleteMetadata = {
    contentType: null
  };

  // Delete the metadata property
  updateMetadata(forestRef, deleteMetadata)
    .then((metadata) => {
      // metadata.contentType should be null
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  // [END storage_delete_metadata]
}

function customMetadata() {
  // [START storage_custom_metadata]
  const metadata = {
    customMetadata: {
      'location': 'Yosemite, CA, USA',
      'activity': 'Hiking'
    }
  };
  // [END storage_custom_metadata]
}
