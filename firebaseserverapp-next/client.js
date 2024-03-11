const email = "foo@bar.com";
const password = "yadayada";

// [START register_sw]
// Install servicerWorker if supported on sign-in/sign-up page.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'});
}
// [END register_sw]

function signInAndRedirect() {
    // [START sign_in_and_redirect]
    const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

    // Sign in screen.
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
        // Redirect to profile page after sign-in. The service worker will detect
        // this and append the ID token to the header.
        window.location.assign('/profile');
    })
    .catch((error) => {
        // Error occurred.
    });
    // [END sign_in_and_redirect]
}