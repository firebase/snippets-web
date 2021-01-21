import firebase from "firebase/app";
import "firebase/storage";

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
