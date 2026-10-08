// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function socialPush() {
  // [START rtdb_social_push]
  const { useTransition } = require("react");
  const { getDatabase, ref, push, set } = require("firebase/database");

  function NewPostButton() {
    const [isPending, startTransition] = useTransition();

    function addPost() {
      startTransition(async () => {
        // Create a new post reference with an auto-generated id
        const db = getDatabase();
        const postListRef = ref(db, 'posts');
        const newPostRef = push(postListRef);
        await set(newPostRef, {
            // ...
        });
      });
    }

    return <button onClick={addPost} disabled={isPending}>New post</button>;
  }
  // [END rtdb_social_push]
}

function socialListenChildren() {
  // [START rtdb_social_listen_children]
  const { useEffect, useState, startTransition, ViewTransition } = require("react");
  const { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved } = require("firebase/database");

  function CommentList({ postId }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
      const db = getDatabase();
      const commentsRef = ref(db, 'post-comments/' + postId);

      // Each subscription builds its own list, so switching posts starts fresh.
      // Realtime updates aren't urgent user input, so apply them in a
      // Transition. This keeps the page responsive and lets <ViewTransition>
      // animate comments as they're added and removed.
      let list = [];
      const unsubscribeAdded = onChildAdded(commentsRef, (data) => {
        list = [...list, { key: data.key, ...data.val() }];
        startTransition(() => setComments(list));
      });

      const unsubscribeChanged = onChildChanged(commentsRef, (data) => {
        list = list.map((comment) =>
          comment.key === data.key ? { key: data.key, ...data.val() } : comment);
        startTransition(() => setComments(list));
      });

      const unsubscribeRemoved = onChildRemoved(commentsRef, (data) => {
        list = list.filter((comment) => comment.key !== data.key);
        startTransition(() => setComments(list));
      });

      return () => {
        unsubscribeAdded();
        unsubscribeChanged();
        unsubscribeRemoved();
      };
    }, [postId]);

    return (
      <ul>
        {comments.map((comment) => (
          <ViewTransition key={comment.key}>
            <li>{comment.author}: {comment.text}</li>
          </ViewTransition>
        ))}
      </ul>
    );
  }
  // [END rtdb_social_listen_children]
}

function socialListenValue() {
  // [START rtdb_social_listen_value]
  const { useEffect, useState } = require("react");
  const { getDatabase, ref, onValue } = require("firebase/database");

  function ChildList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
      const db = getDatabase();
      const dbRef = ref(db, '/a/b/c');

      return onValue(dbRef, (snapshot) => {
        const items = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          // ...
          items.push({ key: childKey, data: childData });
        });
        setItems(items);
      }, {
        onlyOnce: true
      });
    }, []);

    return (
      <ul>
        {items.map((item) => (
          <li key={item.key}>{item.key}</li>
        ))}
      </ul>
    );
  }
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
