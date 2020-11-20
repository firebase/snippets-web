// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/database";

function socialPush() {
  // [START rtdb_social_push]
  // Create a new post reference with an auto-generated id
  var postListRef = firebase.database().ref('posts');
  var newPostRef = postListRef.push();
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
  var commentsRef = firebase.database().ref('post-comments/' + postId);
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
  const ref = firebase.database().ref('/a/b/c');

  // [START rtdb_social_listen_value]
  ref.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      // ...
    });
  });
  // [END rtdb_social_listen_value]
}

function socialMostStarred() {
  // [START rtdb_social_most_starred]
  var myUserId = firebase.auth().currentUser.uid;
  var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId).orderByChild('starCount');
  // [END rtdb_social_most_starred]
}

function socialMostViewed() {
  // [START rtdb_social_most_viewed]
  var mostViewedPosts = firebase.database().ref('posts').orderByChild('metrics/views');
  // [END rtdb_social_most_viewed]
}

function socialRecent() {
  // [START rtdb_social_recent]
  var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
  // [END rtdb_social_recent]
}
