// This snippet file was generated by processing the source file:
// ./analytics-next/index.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START analytics_set_user_properties_modular]
import { getAnalytics, setUserProperties } from "firebase/analytics";

const analytics = getAnalytics();
setUserProperties(analytics, { favorite_food: 'apples' });
// [END analytics_set_user_properties_modular]