// This snippet file was generated by processing the source file:
// ./auth-next/email-link-auth.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START auth_email_link_actioncode_settings_modular]
const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://www.example.com/finishSignUp?cartId=1234',
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'example.page.link'
};
// [END auth_email_link_actioncode_settings_modular]