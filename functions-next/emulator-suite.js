// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

export function emulatorSettings() {
  // [START functions_emulator_connect]
  const { getApp } = require("firebase/app");
  const { getFunctions, useFunctionsEmulator } = require("firebase/functions");

  const functions = getFunctions(getApp());
  useFunctionsEmulator(functions, "localhost", 5001);
  // [END functions_emulator_connect]
}

export async function callFunction() {
  // [START functions_callable_call]
  const { getApp } = require("firebase/app");
  const { getFunctions, httpsCallable } = require("firebase/functions");

  const functions = getFunctions(getApp());
  const addMessage = httpsCallable(functions, 'addMessage');

  const result = await addMessage({ text: '<message text>'});
  const sanitizedMessage = result.data.text;
  // ...
  // [END functions_callable_call]
}
