// [START server_admin]
// Server side code.
const admin = require('firebase-admin');
const serviceAccount = require('path/to/serviceAccountKey.json');

// The Firebase Admin SDK is used here to verify the ID token.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function getIdToken(req) {
  // Parse the injected ID token from the request header.
  const authorizationHeader = req.headers.authorization || '';
  const components = authorizationHeader.split(' ');
  return components.length > 1 ? components[1] : '';
}

function checkIfSignedIn(url) {
  return (req, res, next) => {
    if (req.url == url) {
      const idToken = getIdToken(req);
      // Verify the ID token using the Firebase Admin SDK.
      // User already logged in. Redirect to profile page.
      admin.auth().verifyIdToken(idToken).then((decodedClaims) => {
        // User is authenticated, user claims can be retrieved from
        // decodedClaims.
        // In this sample code, authenticated users are always redirected to
        // the profile page.
        res.redirect('/profile');
      }).catch((error) => {
        next();
      });
    } else {
      next();
    }
  };
}

// If a user is signed in, redirect to profile page.
app.use(checkIfSignedIn('/'));
// [END server_admin]