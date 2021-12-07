// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function downloadCreateRef() {
  // [START storage_download_create_ref]
  const { getStorage, ref } = require("firebase/storage");

  // Create a reference with an initial file path and name
  const storage = getStorage();
  const pathReference = ref(storage, 'images/stars.jpg');

  // Create a reference from a Google Cloud Storage URI
  const gsReference = ref(storage, 'gs://bucket/images/stars.jpg');

  // Create a reference from an HTTPS URL
  // Note that in the URL, characters are URL escaped!
  const httpsReference = ref(storage, 'https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg');  
  // [END storage_download_create_ref]
}

function downloadViaUrl() {
  // [START storage_download_via_url]
  const { getStorage, ref, getDownloadURL } = require("firebase/storage");

  const storage = getStorage();
  getDownloadURL(ref(storage, 'images/stars.jpg'))
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'
    
      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    
      // Or inserted into an <img> element
      const img = document.getElementById('myimg');
      img.setAttribute('src', url);
    })
    .catch((error) => {
      // Handle any errors
    });
  // [END storage_download_via_url]
}

function downloadFullExample() {
  // [START storage_download_full_example]
  const { getStorage, ref, getDownloadURL } = require("firebase/storage");

  // Create a reference to the file we want to download
  const storage = getStorage();
  const starsRef = ref(storage, 'images/stars.jpg');

  // Get the download URL
  getDownloadURL(starsRef)
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
