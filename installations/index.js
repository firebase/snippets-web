import firebase from "firebase/app";
import "firebase/installations";

async function deleteInstallation() {
  try {
    // [START delete_installation]
    await firebase.installations().delete();
    // [END delete_installation]
  } catch (err) {
    console.error('Unable to delete installation: ', err);
  }
}

async function getInstallationId() {
  try {
    // [START get_installation_id]
    const installationId = await firebase.installations().getId();
    console.log(installationId);
    // [END get_installation_id]
  } catch (err) {
    console.error('Unable to get Installation ID: ', err);
  }
}

async function getAuthenticationToken() {
  try {
    // [START get_auth_token]
    const installationToken = await firebase.installations()
        .getToken(/* forceRefresh */ true);
    console.log(installationToken);
    // [END get_auth_token]
  } catch (err) {
    console.error('Unable to get auth token: ', err);
  }
}

async function setOnIdChangeHandler() {
  try {
    // [START set_id_change_handler]
    await firebase.installations().onIdChange((newId) => {
      console.log(newId);
      // TODO: Handle new installation ID.
    });
    // [END set_id_change_handler]
  } catch (err) {
    console.error('Unable to set ID change handler: ', err);
  }
}
