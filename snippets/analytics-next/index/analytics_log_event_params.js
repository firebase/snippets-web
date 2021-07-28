// This snippet file was generated by processing the source file:
// ./analytics-next/index.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START analytics_log_event_params_modular]
import { getAnalytics, logEvent } from "firebase/analytics";

const analytics = getAnalytics();
logEvent(analytics, 'select_content', {
  content_type: 'image',
  content_id: 'P12453',
  items: [{ name: 'Kittens' }]
});
// [END analytics_log_event_params_modular]