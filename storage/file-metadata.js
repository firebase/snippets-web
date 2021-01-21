import firebase from "firebase/app";
import "firebase/storage";

function getMetadata() {
  const storageRef = firebase.storage().ref();

  // [START storage_get_metadata]
  // Create a reference to the file whose metadata we want to retrieve
  var forestRef = storageRef.child('images/forest.jpg');

  // Get metadata properties
  forestRef.getMetadata()
    .then((metadata) => {
      // Metadata now contains the metadata for 'images/forest.jpg'
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });
  // [END storage_get_metadata]
}

function updateMetadata() {
  const storageRef = firebase.storage().ref();

  // [START storage_update_metadata]
  // Create a reference to the file whose metadata we want to change
  var forestRef = storageRef.child('images/forest.jpg');

  // Create file metadata to update
  var newMetadata = {
    cacheControl: 'public,max-age=300',
    contentType: 'image/jpeg'
  };

  // Update metadata properties
  forestRef.updateMetadata(newMetadata)
    .then((metadata) => {
      // Updated metadata for 'images/forest.jpg' is returned in the Promise
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  // [END storage_update_metadata]
}

function deleteMetadata() {
  const storageRef = firebase.storage().ref();
  const forestRef = storageRef.child('images/forest.jpg');

  // [START storage_delete_metadata]

  // Create file metadata with property to delete
  var deleteMetadata = {
    contentType: null
  };

  // Delete the metadata property
  forestRef.updateMetadata(deleteMetadata)
    .then((metadata) => {
      // metadata.contentType should be null
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  // [END storage_delete_metadata]
}

function customMetadata() {
  // [START storage_custom_metadata]
  var metadata = {
    customMetadata: {
      'location': 'Yosemite, CA, USA',
      'activity': 'Hiking'
    }
  };
  // [END storage_custom_metadata]
}
