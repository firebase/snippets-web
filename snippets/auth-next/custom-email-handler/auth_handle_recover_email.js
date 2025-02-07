// This snippet file was generated by processing the source file:
// ./auth-next/custom-email-handler.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START auth_handle_recover_email_modular]
import { checkActionCode, applyActionCode, sendPasswordResetEmail } from "firebase/auth";

async function handleRecoverEmail(auth, actionCode, lang) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  let restoredEmail = null;
  try {
    // Confirm the action code is valid.
    const info = await checkActionCode(auth, actionCode);
    // Get the restored email address.
    restoredEmail = info['data']['email'];

    // Revert to the old email.
    await applyActionCode(auth, actionCode);
    // Account email reverted to restoredEmail

    // TODO: Display a confirmation message to the user.

    try {
      // You might also want to give the user the option to reset their password
      // in case the account was compromised:
      await sendPasswordResetEmail(auth, restoredEmail);
      // Password reset confirmation sent. Ask user to check their email.
    } catch (error) {
      // Error encountered while sending password reset code.
    }
  } catch (error) {
    // Invalid code.
  }
}
// [END auth_handle_recover_email_modular]