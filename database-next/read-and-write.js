// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

function writeUserData_wrapped() {
  // [START rtdb_write_new_user]
  const { getDatabase } = require("firebase/database");

  function writeUserData(userId, name, email, imageUrl) {
    const db = getDatabase(firebaseApp);
    db.ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }
  // [END rtdb_write_new_user]
}


function writeUserDataWithCompletion(userId, name, email, imageUrl) {
  // [START rtdb_write_new_user_completion]
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  db.ref('users/' + userId).set({
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
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const starCountRef = db.ref('posts/' + postId + '/starCount');
  starCountRef.on('value', (snapshot) => {
    const data = snapshot.val();
    updateStarCount(postElement, data);
  });
  // [END rtdb_social_listen_star_count]
}

function socialSingleValueRead() {
  // [START rtdb_social_single_value_read]
  const { getDatabase } = require("firebase/database");
  const { getAuth } = require("firebase/auth");

  const db = getDatabase(firebaseApp);
  const auth = getAuth(firebaseApp);

  const userId = auth.currentUser.uid;
  return db.ref('/users/' + userId).once('value').then((snapshot) => {
    const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // ...
  });
  // [END rtdb_social_single_value_read]
}

function writeNewPost_wrapped() {
  const { getDatabase } = require("firebase/database");

  // [START rtdb_social_write_fan_out]
  function writeNewPost(uid, username, picture, title, body) {
    const db = getDatabase(firebaseApp);

    // A post entry.
    const postData = {
      author: username,
      uid: uid,
      body: body,
      title: title,
      starCount: 0,
      authorPic: picture
    };

    // Get a key for a new Post.
    const newPostKey = db.ref().child('posts').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return db.ref().update(updates);
  }
  // [END rtdb_social_write_fan_out]
}

function socialCompletionCallback() {
  const userId = "123";
  const email = "test@example.com";
  const imageUrl = "https://example.com/image.png";

  // [START rtdb_social_completion_callback]
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  db.ref('users/' + userId).set({
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

function toggleStar_wrapped() {
  // [START rtdb_social_star_transaction]
  const { getDatabase } = require("firebase/database");

  function toggleStar(uid) {
    const db = getDatabase(firebaseApp);
    const postRef = db.ref('/posts/foo-bar-123');

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
}

