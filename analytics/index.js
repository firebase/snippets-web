import firebase from "firebase/app";
import "firebase/analytics";

function initialize() {
  // [START analytics_initialize]
  const analytics = firebase.analytics();
  // [END analytics_initialize]
}

function logEvent() {
  // [START analytics_log_event]
  firebase.analytics().logEvent('notification_received');
  // [END analytics_log_event]
}

function logEventParams() {
  const analytics = firebase.analytics();
  
  // [START analytics_log_event_params]
  analytics.logEvent('select_content', {
    content_type: 'image',
    content_id: 'P12453',
    items: [{ name: 'Kittens' }]
  });
  // [END analytics_log_event_params]
}

function logEventCustomParams() {
  const analytics = firebase.analytics();

  // [START analytics_log_event_custom_params]
  analytics.logEvent('goal_completion', { name: 'lever_puzzle'});
  // [END analytics_log_event_custom_params]
}

function setUserProperties() {
  // [START analytics_set_user_properties]
  firebase.analytics().setUserProperties({favorite_food: 'apples'});
  // [END analytics_set_user_properties]
}
