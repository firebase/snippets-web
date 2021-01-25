// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

function socialPush() {
  // [START rtdb_social_push]
  const { getDatabase } = require("firebase/database");

  // Create a new post reference with an auto-generated id
  const db = getDatabase(firebaseApp);
  const postListRef = db.ref('posts');
  const newPostRef = postListRef.push();
  newPostRef.set({
      // ...
  });
  // [END rtdb_social_push]
}

function socialListenChildren() {
  const postElement = document.querySelector("#post");
  const postId = "1234";
  function addCommentElement(el, key, text, author) {}
  function setCommentValues(el, key, text, author) {};
  function deleteComment(el, key) {};

  // [START rtdb_social_listen_children]
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const commentsRef = db.ref('post-comments/' + postId);
  commentsRef.on('child_added', (data) => {
    addCommentElement(postElement, data.key, data.val().text, data.val().author);
  });

  commentsRef.on('child_changed', (data) => {
    setCommentValues(postElement, data.key, data.val().text, data.val().author);
  });

  commentsRef.on('child_removed', (data) => {
    deleteComment(postElement, data.key);
  });
  // [END rtdb_social_listen_children]
}

function socialListenValue() {

  // [START rtdb_social_listen_value]
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const ref = db.ref('/a/b/c');

  ref.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      // ...
    });
  });
  // [END rtdb_social_listen_value]
}

function socialMostStarred() {
  // [START rtdb_social_most_starred]
  const { getDatabase } = require("firebase/database");
  const { getAuth } = require("firebase/auth");

  const db = getDatabase(firebaseApp);
  const auth = getAuth(firebaseApp);

  const myUserId = auth.currentUser.uid;
  const topUserPostsRef = db.ref('user-posts/' + myUserId).orderByChild('starCount');
  // [END rtdb_social_most_starred]
}

function socialMostViewed() {
  // [START rtdb_social_most_viewed]
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const mostViewedPosts = db.ref('posts').orderByChild('metrics/views');
  // [END rtdb_social_most_viewed]
}

function socialRecent() {
  // [START rtdb_social_recent]
  const { getDatabase } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  const recentPostsRef = db.ref('posts').limitToLast(100);
  // [END rtdb_social_recent]
}
