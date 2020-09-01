import { initializeApp, getApp } from "@firebase/app";
import { getFunctions, useFunctionsEmulator, httpsCallable } from "@firebase/functions";

initializeApp({
  projectId: '### CLOUD FUNCTIONS PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

export function emulatorSettings() {
  // [START functions_emulator_connect]
  const functions = getFunctions(getApp());
  useFunctionsEmulator(functions, "http://localhost:5001");
  // [END functions_emulator_connect]
}

export async function callFunction() {
  // [START functions_callable_call]
  const functions = getFunctions(getApp());
  const addMessage = httpsCallable(functions, 'addMessage');

  const result = await addMessage({ text: '<message text>'});
  const sanitizedMessage = result.data.text;
  // ...
  // [END functions_callable_call]
}
