import firebase from "firebase/app";
import "firebase/storage";

function createRef() {
  // [START storage_create_ref]
  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = firebase.storage();

  // Create a storage reference from our storage service
  var storageRef = storage.ref();
  // [END storage_create_ref]
}

function createRefChild() {
  const storageRef = firebase.storage().ref();

  // [START storage_create_ref_child]
  // Create a child reference
  var imagesRef = storageRef.child('images');
  // imagesRef now points to 'images'

  // Child references can also take paths delimited by '/'
  var spaceRef = storageRef.child('images/space.jpg');
  // spaceRef now points to "images/space.jpg"
  // imagesRef still points to "images"
  // [END storage_create_ref_child]
}

function navigateRef() {
  const spaceRef = firebase.storage().ref().child('images/space.jpg');

  // [START storage_navigate_ref]
  // Parent allows us to move to the parent of a reference
  var imagesRef = spaceRef.parent;
  // imagesRef now points to 'images'

  // Root allows us to move all the way back to the top of our bucket
  var rootRef = spaceRef.root;
  // rootRef now points to the root
  // [END storage_navigate_ref]
}

function navigateRefChain() {
  const spaceRef = firebase.storage().ref().child('images/space.jpg');

  // [START storage_navigate_ref_chain]
  // References can be chained together multiple times
  var earthRef = spaceRef.parent.child('earth.jpg');
  // earthRef points to 'images/earth.jpg'

  // nullRef is null, since the parent of root is null
  var nullRef = spaceRef.root.parent;
  // [END storage_navigate_ref_chain]
}

function refProperties() {
  const spaceRef = firebase.storage().ref().child('images/space.jpg');

  // [START storage_ref_properties]
  // Reference's path is: 'images/space.jpg'
  // This is analogous to a file path on disk
  spaceRef.fullPath;

  // Reference's name is the last segment of the full path: 'space.jpg'
  // This is analogous to the file name
  spaceRef.name;

  // Reference's bucket is the name of the storage bucket where files are stored
  spaceRef.bucket;
  // [END storage_ref_properties]
}

function refFullExample() {
  // [START storage_ref_full_example]
  // Points to the root reference
  var storageRef = firebase.storage().ref();

  // Points to 'images'
  var imagesRef = storageRef.child('images');

  // Points to 'images/space.jpg'
  // Note that you can use variables to create child values
  var fileName = 'space.jpg';
  var spaceRef = imagesRef.child(fileName);

  // File path is 'images/space.jpg'
  var path = spaceRef.fullPath;

  // File name is 'space.jpg'
  var name = spaceRef.name;

  // Points to 'images'
  var imagesRef = spaceRef.parent;
  // [END storage_ref_full_example]
}
