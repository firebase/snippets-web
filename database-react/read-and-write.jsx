// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function writeUserData_wrapped() {
  // [START rtdb_write_new_user]
  const { getDatabase, ref, set } = require("firebase/database");

  function NewUserForm({ userId }) {
    async function writeUserData(formData) {
      const db = getDatabase();
      await set(ref(db, 'users/' + userId), {
        username: formData.get("name"),
        email: formData.get("email"),
        profile_picture : formData.get("imageUrl")
      });
    }

    return (
      <form action={writeUserData}>
        <input name="name" />
        <input name="email" type="email" />
        <input name="imageUrl" type="url" />
        <button type="submit">Save</button>
      </form>
    );
  }
  // [END rtdb_write_new_user]
}


function writeUserDataWithCompletion() {
  // [START rtdb_write_new_user_completion]
  const { useActionState } = require("react");
  const { getDatabase, ref, set } = require("firebase/database");

  function NewUserForm({ userId }) {
    const [error, writeUserData, isPending] = useActionState(async (previousError, formData) => {
      const db = getDatabase();
      try {
        await set(ref(db, 'users/' + userId), {
          username: formData.get("name"),
          email: formData.get("email"),
          profile_picture : formData.get("imageUrl")
        });
        // Data saved successfully!
        return null;
      } catch (error) {
        // The write failed...
        return error.message;
      }
    }, null);

    return (
      <form action={writeUserData}>
        <input name="name" />
        <input name="email" type="email" />
        <input name="imageUrl" type="url" />
        <button type="submit" disabled={isPending}>Save</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END rtdb_write_new_user_completion]
}

function socialListenStarCount() {
  // [START rtdb_social_listen_star_count]
  const { useEffect, useState } = require("react");
  const { getDatabase, ref, onValue } = require("firebase/database");

  function StarCount({ postId }) {
    const [starCount, setStarCount] = useState(null);

    useEffect(() => {
      const db = getDatabase();
      const starCountRef = ref(db, 'posts/' + postId + '/starCount');
      // onValue returns an unsubscribe function. Returning it from the effect
      // detaches the listener when postId changes or the component unmounts.
      return onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setStarCount(data);
      });
    }, [postId]);

    return <span>{starCount}</span>;
  }
  // [END rtdb_social_listen_star_count]
}

function socialSingleValueRead() {
  // [START rtdb_social_single_value_read]
  const { useEffect, useState } = require("react");
  const { getDatabase, ref, onValue } = require("firebase/database");
  const { getAuth } = require("firebase/auth");

  function Username() {
    const [username, setUsername] = useState('Anonymous');

    useEffect(() => {
      const db = getDatabase();
      const auth = getAuth();

      const userId = auth.currentUser.uid;
      return onValue(ref(db, '/users/' + userId), (snapshot) => {
        const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        setUsername(username);
      }, {
        onlyOnce: true
      });
    }, []);

    return <span>{username}</span>;
  }
  // [END rtdb_social_single_value_read]
}

function writeNewPost_wrapped() {
  // [START rtdb_social_write_fan_out]
  const { getDatabase, ref, child, push, update } = require("firebase/database");

  function NewPostForm({ uid, username, picture }) {
    async function writeNewPost(formData) {
      const db = getDatabase();

      // A post entry.
      const postData = {
        author: username,
        uid: uid,
        body: formData.get("body"),
        title: formData.get("title"),
        starCount: 0,
        authorPic: picture
      };

      // Get a key for a new Post.
      const newPostKey = push(child(ref(db), 'posts')).key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      const updates = {};
      updates['/posts/' + newPostKey] = postData;
      updates['/user-posts/' + uid + '/' + newPostKey] = postData;

      await update(ref(db), updates);
    }

    return (
      <form action={writeNewPost}>
        <input name="title" />
        <textarea name="body" />
        <button type="submit">Post</button>
      </form>
    );
  }
  // [END rtdb_social_write_fan_out]
}

function socialCompletionCallback() {
  // [START rtdb_social_completion_callback]
  const { useActionState } = require("react");
  const { getDatabase, ref, set } = require("firebase/database");

  function NewUserForm({ userId }) {
    const [error, writeUserData, isPending] = useActionState(async (previousError, formData) => {
      const db = getDatabase();
      try {
        await set(ref(db, 'users/' + userId), {
          username: formData.get("name"),
          email: formData.get("email"),
          profile_picture : formData.get("imageUrl")
        });
        // Data saved successfully!
        return null;
      } catch (error) {
        // The write failed...
        return error.message;
      }
    }, null);

    return (
      <form action={writeUserData}>
        <input name="name" />
        <input name="email" type="email" />
        <input name="imageUrl" type="url" />
        <button type="submit" disabled={isPending}>Save</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END rtdb_social_completion_callback]
}

function toggleStar_wrapped() {
  // [START rtdb_social_star_transaction]
  const { useOptimistic, startTransition } = require("react");
  const { getDatabase, ref, runTransaction } = require("firebase/database");

  function StarButton({ uid, starred }) {
    const [optimisticStarred, setOptimisticStarred] = useOptimistic(starred);

    function toggleStar() {
      startTransition(async () => {
        // Show the new state right away. When the transaction settles, React
        // returns to the `starred` prop, which your listener has updated by then.
        setOptimisticStarred(!optimisticStarred);

        const db = getDatabase();
        const postRef = ref(db, '/posts/foo-bar-123');

        await runTransaction(postRef, (post) => {
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
      });
    }

    return (
      <button onClick={toggleStar}>
        {optimisticStarred ? 'Unstar' : 'Star'}
      </button>
    );
  }
  // [END rtdb_social_star_transaction]
}

function addStar_wrapped() {
  // [START rtdb_social_star_increment]
  const { getDatabase, increment, ref, update } = require("firebase/database");

  function AddStarButton({ uid, postKey }) {
    async function addStar() {
      const dbRef = ref(getDatabase());

      const updates = {};
      updates[`posts/${postKey}/stars/${uid}`] = true;
      updates[`posts/${postKey}/starCount`] = increment(1);
      updates[`user-posts/${postKey}/stars/${uid}`] = true;
      updates[`user-posts/${postKey}/starCount`] = increment(1);
      await update(dbRef, updates);
    }

    return <button onClick={addStar}>Star</button>;
  }
  // [END rtdb_social_star_increment]
}

function readOnceWithGet() {
  // [START rtdb_read_once_get]
  const { useEffect, useState } = require("react");
  const { getDatabase, ref, child, get } = require("firebase/database");

  function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
      let ignore = false;
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (ignore) return;
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
      // Ignore the result if userId changes before the read completes.
      return () => { ignore = true; };
    }, [userId]);

    return user ? <p>{user.username}</p> : <p>Loading...</p>;
  }
  // [END rtdb_read_once_get]
}
