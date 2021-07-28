// This snippet file was generated by processing the source file:
// ./analytics-next/ecommerce.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START analytics_ecommerce_remove_cart_modular]
import { getAnalytics, logEvent } from "firebase/analytics";

// Prepare ecommerce params
const params6 = {
  currency: 'USD',
  value: 24.99,
  items: [item_jeggings]
};

// Log event
const analytics = getAnalytics();
logEvent(analytics, 'remove_from_cart', params6);
// [END analytics_ecommerce_remove_cart_modular]