// This snippet file was generated by processing the source file:
// ./firestore-next/test.firestore.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START four_disjunctions_modular]
query(collectionRef,
  or( and( where("a", "==", 1), where("c", "==", 3) ),
      and( where("a", "==", 1), where("d", "==", 4) ),
      and( where("b", "==", 2), where("c", "==", 3) ),
      and( where("b", "==", 2), where("d", "==", 4) )
  )
);
// [END four_disjunctions_modular]