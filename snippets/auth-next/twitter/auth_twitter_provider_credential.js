// This snippet file was generated by processing the source file:
// ./auth-next/twitter.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START auth_twitter_provider_credential_modular]
import { TwitterAuthProvider } from "firebase/auth";

const credential = TwitterAuthProvider.credential(accessToken, secret);
// [END auth_twitter_provider_credential_modular]