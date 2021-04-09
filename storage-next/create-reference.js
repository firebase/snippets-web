// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function createRef() {
  // [START storage_create_ref]
  const { getStorage, ref } = require("firebase/storage");

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();

  // Create a storage reference from our storage service
  const storageRef = ref(storage);
  // [END storage_create_ref]
}

function createRefChild() {
  // [START storage_create_ref_child]
  const { getStorage, ref } = require("firebase/storage");

  const storage = getStorage();

  // Create a child reference
  const imagesRef = ref(storage, 'images');
  // imagesRef now points to 'images'

  // Child references can also take paths delimited by '/'
  const spaceRef = ref(storage, 'images/space.jpg');
  // spaceRef now points to "images/space.jpg"
  // imagesRef still points to "images"
  // [END storage_create_ref_child]
}

function navigateRef() {
  // [START storage_navigate_ref]
  const { getStorage, ref } = require("firebase/storage");

  const storage = getStorage();
  const spaceRef = ref(storage, 'images/space.jpg');

  // Parent allows us to move to the parent of a reference
  const imagesRef = spaceRef.parent;
  // imagesRef now points to 'images'

  // Root allows us to move all the way back to the top of our bucket
  const rootRef = spaceRef.root;
  // rootRef now points to the root
  // [END storage_navigate_ref]
}

function navigateRefChain() {
  // [START storage_navigate_ref_chain]
  const { getStorage, ref } = require("firebase/storage");

  const storage = getStorage();
  const spaceRef = ref(storage, 'images/space.jpg');

  // References can be chained together multiple times
  const earthRef = ref(spaceRef.parent, 'earth.jpg');
  // earthRef points to 'images/earth.jpg'

  // nullRef is null, since the parent of root is null
  const nullRef = spaceRef.root.parent;
  // [END storage_navigate_ref_chain]
}

function refProperties() {
  // [START storage_ref_properties]
  const { getStorage, ref } = require("firebase/storage");

  const storage = getStorage();
  const spaceRef = ref(storage, 'images/space.jpg');

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
  const { getStorage, ref } = require("firebase/storage");

  const storage = getStorage();

  // Points to the root reference
  const storageRef = ref(storage);

  // Points to 'images'
  const imagesRef = ref(storageRef, 'images');

  // Points to 'images/space.jpg'
  // Note that you can use variables to create child values
  const fileName = 'space.jpg';
  const spaceRef = ref(imagesRef, fileName);

  // File path is 'images/space.jpg'
  const path = spaceRef.fullPath;

  // File name is 'space.jpg'
  const name = spaceRef.name;

  // Points to 'images'
  const imagesRefAgain = spaceRef.parent;
  // [END storage_ref_full_example]
}
