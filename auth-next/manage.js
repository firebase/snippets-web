function updateUserProfile() {
    // [START auth_update_user_profile]
    const { getAuth, updateProfile } = require("firebase/auth");
    const auth = getAuth();
    updateProfile(auth.currentUser, {
        displayName: "Jane Q. User", photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(() => {
        // Profile updated!
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });
    // [END auth_update_user_profile]
}

function updateUserEmail() {
    // [START auth_update_user_email]
    const { getAuth, updateEmail } = require("firebase/auth");
    const auth = getAuth();
    updateEmail(auth.currentUser, "user@example.com").then(() => {
        // Email updated!
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });
    // [END auth_update_user_email]
}
