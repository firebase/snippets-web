import firebase from "firebase/app";
import "firebase/storage";

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
