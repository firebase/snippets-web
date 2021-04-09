// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/database";

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
  }, (error) => {
    if (error) {
      // The write failed...
    } else {
      // Data saved successfully!
    }
  });
  // [END rtdb_write_new_user_completion]
}

function socialListenStarCount() {
  const postElement = document.querySelector('#post');
  const postId = "1234";
  function updateStarCount(a, b) {
    // ...
  }

  // [START rtdb_social_listen_star_count]
  var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
  starCountRef.on('value', (snapshot) => {
    const data = snapshot.val();
    updateStarCount(postElement, data);
  });
  // [END rtdb_social_listen_star_count]
}

function socialSingleValueRead() {
  // [START rtdb_social_single_value_read]
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // ...
  });
  // [END rtdb_social_single_value_read]
}

// [START rtdb_social_write_fan_out]
function writeNewPost(uid, username, picture, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}
// [END rtdb_social_write_fan_out]

function socialCompletionCallback() {
  const userId = "123";
  const email = "test@example.com";
  const imageUrl = "https://example.com/image.png";

  // [START rtdb_social_completion_callback]
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  }, (error) => {
    if (error) {
      // The write failed...
    } else {
      // Data saved successfully!
    }
  });
  // [END rtdb_social_completion_callback]
}

/**
 * @param {firebase.database.Reference} postRef 
 * @param {string} uid 
 */
// [START rtdb_social_star_transaction]
function toggleStar(postRef, uid) {
  postRef.transaction((post) => {
    if (post) {
      if (post.stars && post.stars[uid]) {
        post.starCount--;
        post.stars[uid] = null;
      } else {
        post.starCount++;
        if (!post.stars) {
          post.stars = {};
        }
        post.stars[uid] = true;
      }
    }
    return post;
  });
}
// [END rtdb_social_star_transaction]

/**
 * @param {string} uid 
 * @param {string} key 
 */
// [START rtdb_social_star_increment]
function addStar(uid, key) {
  const updates = {};
  updates[`posts/${key}/stars/${uid}`] = true;
  updates[`posts/${key}/starCount`] = firebase.database.ServerValue.increment(1);
  updates[`user-posts/${key}/stars/${uid}`] = true;
  updates[`user-posts/${key}/starCount`] = firebase.database.ServerValue.increment(1);
  firebase.database().ref().update(updates);
}
// [END rtdb_social_star_increment]

function readOnceWithGet(userId) {
  // [START rtdb_read_once_get]
  const dbRef = firebase.database().ref();
  dbRef.child("users").child(userId).get().then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  // [END rtdb_read_once_get]
}
