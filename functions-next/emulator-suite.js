// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

export function emulatorSettings() {
  // [START fb_functions_emulator_connect]
  const { getApp } = require("firebase/app");
  const { getFunctions, connectFunctionsEmulator } = require("firebase/functions");

  const functions = getFunctions(getApp());
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  // [END fb_functions_emulator_connect]
}

export async function callFunction() {
  // [START fb_functions_callable_call]
  const { getApp } = require("firebase/app");
  const { getFunctions, httpsCallable } = require("firebase/functions");

  const functions = getFunctions(getApp());
  const addMessage = httpsCallable(functions, 'addMessage');

  const result = await addMessage({ text: '<message text>'});
  /** @type {any} */
  const data = result.data;
  const sanitizedMessage = data.text;
  // ...
  // [END fb_functions_callable_call]
}
