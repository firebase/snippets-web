// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function writeUserData_wrapped() {
  // [START rtdb_write_new_user]
  const { getDatabase, ref, set } = require("firebase/database");

  function writeUserData(userId, name, email, imageUrl) {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }
  // [END rtdb_write_new_user]
}


function writeUserDataWithCompletion(userId, name, email, imageUrl) {
  // [START rtdb_write_new_user_completion]
  const { getDatabase, ref, set } = require("firebase/database");

  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture : imageUrl
  })
  .then(() => {
    // Data saved successfully!
  })
  .catch((error) => {
    // The write failed...
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
  const { getDatabase, ref, onValue} = require("firebase/database");

  const db = getDatabase();
  const starCountRef = ref(db, 'posts/' + postId + '/starCount');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    updateStarCount(postElement, data);
  });
  // [END rtdb_social_listen_star_count]
}

function socialSingleValueRead() {
  // [START rtdb_social_single_value_read]
  const { getDatabase, ref, onValue } = require("firebase/database");
  const { getAuth } = require("firebase/auth");

  const db = getDatabase();
  const auth = getAuth();

  const userId = auth.currentUser.uid;
  return onValue(ref(db, '/users/' + userId), (snapshot) => {
    const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // ...
  }, {
    onlyOnce: true
  });
  // [END rtdb_social_single_value_read]
}

function writeNewPost_wrapped() {
  const { getDatabase, ref, child, push, update } = require("firebase/database");

  // [START rtdb_social_write_fan_out]
  function writeNewPost(uid, username, picture, title, body) {
    const db = getDatabase();

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
    const newPostKey = push(child(ref(db), 'posts')).key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return update(ref(db), updates);
  }
  // [END rtdb_social_write_fan_out]
}

function socialCompletionCallback() {
  const userId = "123";
  const email = "test@example.com";
  const imageUrl = "https://example.com/image.png";

  // [START rtdb_social_completion_callback]
  const { getDatabase, ref, set } = require("firebase/database");

  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture : imageUrl
  })
  .then(() => {
    // Data saved successfully!
  })
  .catch((error) => {
    // The write failed...
  });
  // [END rtdb_social_completion_callback]
}

function toggleStar_wrapped() {
  // [START rtdb_social_star_transaction]
  const { getDatabase, ref, runTransaction } = require("firebase/database");

  function toggleStar(uid) {
    const db = getDatabase();
    const postRef = ref(db, '/posts/foo-bar-123');

    runTransaction(postRef, (post) => {
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

/**
 * @param {string} uid 
 * @param {string} key 
 */
// [START rtdb_social_star_increment]
function addStar(uid, key) {
  const { getDatabase, increment, ref, update } = require("firebase/database");
  const dbRef = ref(getDatabase());

  const updates = {};
  updates[`posts/${key}/stars/${uid}`] = true;
  updates[`posts/${key}/starCount`] = increment(1);
  updates[`user-posts/${key}/stars/${uid}`] = true;
  updates[`user-posts/${key}/starCount`] = increment(1);
  update(dbRef, updates);
}
// [END rtdb_social_star_increment]

function readOnceWithGet(userId) {
  // [START rtdb_read_once_get]
  const { getDatabase, ref, child, get } = require("firebase/database");

  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
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
