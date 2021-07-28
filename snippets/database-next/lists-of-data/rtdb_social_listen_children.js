// This snippet file was generated by processing the source file:
// ./database-next/lists-of-data.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START rtdb_social_listen_children_modular]
import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";

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
// [END rtdb_social_listen_children_modular]