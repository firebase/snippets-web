// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
var firebase = require("firebase/app");
require("firebase/database");

// [START rtdb_write_new_user]
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
// [END rtdb_write_new_user]

function writeUserDataWithCompletion(userId, name, email, imageUrl) {
  // [START rtdb_write_new_user_completion]
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  }, function(error) {
    if (error) {
      // The write failed...
    } else {
      // Data saved successfully!
    }
  });
  // [START rtdb_write_new_user_completion]
}
