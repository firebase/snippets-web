// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function socialPush() {
  // [START rtdb_social_push]
  const { getDatabase, ref, push, set } = require("firebase/database");

  // Create a new post reference with an auto-generated id
  const db = getDatabase();
  const postListRef = ref(db, 'posts');
  const newPostRef = push(postListRef);
  set(newPostRef, {
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
  const { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved } = require("firebase/database");

  const db = getDatabase();
  const commentsRef = ref(db, 'post-comments/' + postId);
  onChildAdded(commentsRef, (data) => {
    addCommentElement(postElement, data.key, data.val().text, data.val().author);
  });

  onChildChanged(commentsRef, (data) => {
    setCommentValues(postElement, data.key, data.val().text, data.val().author);
  });

  onChildRemoved(commentsRef, (data) => {
    deleteComment(postElement, data.key);
  });
  // [END rtdb_social_listen_children]
}

function socialListenValue() {

  // [START rtdb_social_listen_value]
  const { getDatabase, ref, onValue } = require("firebase/database");

  const db = getDatabase();
  const dbRef = ref(db, '/a/b/c');

  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      // ...
    });
  }, {
    onlyOnce: true
  });
  // [END rtdb_social_listen_value]
}

function socialMostStarred() {
  // [START rtdb_social_most_starred]
  const { getDatabase, ref, query, orderByChild } = require("firebase/database");
  const { getAuth } = require("firebase/auth");

  const db = getDatabase();
  const auth = getAuth();

  const myUserId = auth.currentUser.uid;
  const topUserPostsRef = query(ref(db, 'user-posts/' + myUserId), orderByChild('starCount'));
  // [END rtdb_social_most_starred]
}

function socialMostViewed() {
  // [START rtdb_social_most_viewed]
  const { getDatabase, ref, query, orderByChild } = require("firebase/database");

  const db = getDatabase();
  const mostViewedPosts = query(ref(db, 'posts'), orderByChild('metrics/views'));
  // [END rtdb_social_most_viewed]
}

function socialRecent() {
  // [START rtdb_social_recent]
  const { getDatabase, ref, query, limitToLast } = require("firebase/database");

  const db = getDatabase();
  const recentPostsRef = query(ref(db, 'posts'), limitToLast(100));
  // [END rtdb_social_recent]
}
