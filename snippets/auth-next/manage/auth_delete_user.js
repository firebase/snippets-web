// This snippet file was generated by processing the source file:
// ./auth-next/manage.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START auth_delete_user_modular]
import { getAuth, deleteUser } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

deleteUser(user).then(() => {
  // User deleted.
}).catch((error) => {
  // An error ocurred
  // ...
});
// [END auth_delete_user_modular]