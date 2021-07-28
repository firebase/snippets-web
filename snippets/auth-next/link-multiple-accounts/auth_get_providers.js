// This snippet file was generated by processing the source file:
// ./auth-next/link-multiple-accounts.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START auth_get_providers_modular]
import { GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const githubProvider = new GithubAuthProvider();
// [END auth_get_providers_modular]