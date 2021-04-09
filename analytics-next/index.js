// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

function initialize() {
  // [START analytics_initialize]
  const { getAnalytics } = require("firebase/analytics");

  const analytics = getAnalytics();
  // [END analytics_initialize]
}

function logEvent() {
  // [START analytics_log_event]
  const { getAnalytics, logEvent } = require("firebase/analytics");

  const analytics = getAnalytics();
  logEvent(analytics, 'notification_received');
  // [END analytics_log_event]
}

function logEventParams() {
  // [START analytics_log_event_params]
  const { getAnalytics, logEvent } = require("firebase/analytics");
  
  const analytics = getAnalytics();
  logEvent(analytics, 'select_content', {
    content_type: 'image',
    content_id: 'P12453',
    items: [{ name: 'Kittens' }]
  });
  // [END analytics_log_event_params]
}

function logEventCustomParams() {
  // [START analytics_log_event_custom_params]
  const { getAnalytics, logEvent } = require("firebase/analytics");

  const analytics = getAnalytics();
  logEvent(analytics, 'goal_completion', { name: 'lever_puzzle'});
  // [END analytics_log_event_custom_params]
}

function setUserProperties() {
  // [START analytics_set_user_properties]
  const { getAnalytics, setUserProperties } = require("firebase/analytics");

  const analytics = getAnalytics();
  setUserProperties(analytics, { favorite_food: 'apples' });
  // [END analytics_set_user_properties]
}
