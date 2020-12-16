// This snippet file was generated by processing the source file:
// ./auth-next/firebaseui.js
//
// To make edits to the snippets in this file, please edit the source

// [START auth_fui_email_link_result_modular]
// Is there an email link sign-in?
if (ui.isPendingRedirect()) {
  ui.start('#firebaseui-auth-container', uiConfig);
}
// This can also be done via:
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  ui.start('#firebaseui-auth-container', uiConfig);
}
// [END auth_fui_email_link_result_modular]