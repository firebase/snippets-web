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

function deleteFile() {
  const storageRef = firebase.storage().ref();

  // [START storage_delete_file]
  // Create a reference to the file to delete
  var desertRef = storageRef.child('images/desert.jpg');

  // Delete the file
  desertRef.delete().then(() => {
    // File deleted successfully
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });
  // [END storage_delete_file]
}

function downloadCreateRef() {
  // [START storage_download_create_ref]
  // Create a reference with an initial file path and name
  var storage = firebase.storage();
  var pathReference = storage.ref('images/stars.jpg');

  // Create a reference from a Google Cloud Storage URI
  var gsReference = storage.refFromURL('gs://bucket/images/stars.jpg');

  // Create a reference from an HTTPS URL
  // Note that in the URL, characters are URL escaped!
  var httpsReference = storage.refFromURL('https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg');  
  // [END storage_download_create_ref]
}

function downloadViaUrl() {
  const storageRef = firebase.storage().ref();

  // [START storage_download_via_url]
  storageRef.child('images/stars.jpg').getDownloadURL()
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'
    
      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    
      // Or inserted into an <img> element
      var img = document.getElementById('myimg');
      img.setAttribute('src', url);
    })
    .catch((error) => {
      // Handle any errors
    });
  // [END storage_download_via_url]
}

function downloadFullExample() {
  const storageRef = firebase.storage().ref();

  // [START storage_download_full_example]
  // Create a reference to the file we want to download
  var starsRef = storageRef.child('images/stars.jpg');

  // Get the download URL
  starsRef.getDownloadURL()
  .then((url) => {
    // Insert url into an <img> tag to "download"
  })
  .catch((error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  });
  // [END storage_download_full_example]
}

/**
 * @param {File} file 
 */
function storageOnComplete(file) {
  // The file param would be a File object from a file selection event in the browser.
  // See:
  // - https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
  // - https://developer.mozilla.org/en-US/docs/Web/API/File

  const metadata = {
    'contentType': file.type
  };

  // [START storage_on_complete]
  const storageRef = firebase.storage().ref();
  storageRef.child('images/' + file.name).put(file, metadata)
    .then((snapshot) => {
      console.log('Uploaded', snapshot.totalBytes, 'bytes.');
      console.log('File metadata:', snapshot.metadata);
      // Let's get a download URL for the file.
      snapshot.ref.getDownloadURL().then((url) => {
        console.log('File available at', url);
        // ...
      });
    }).catch((error) => {
      console.error('Upload failed', error);
      // ...
    });
  // [END storage_on_complete]
}
