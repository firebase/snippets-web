// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

function signInCustom() {
  var token = "token123";
  // [START auth_sign_in_custom]
  firebase.auth().signInWithCustomToken(token)
    .then((user) => {
      // Signed in
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    })
  // [END auth_sign_in_custom]
}
