import firebase from "firebase/app";
import "firebase/analytics";

// [START analytics_ecommerce_items]
// A pair of jeggings
const item_jeggings = {
  item_id: 'SKU_123',
  item_name: 'jeggings',
  item_category: 'pants',
  item_variant: 'black',
  item_brand: 'Google',
  price: 9.99
};

// A pair of boots
const item_boots = {
  item_id: 'SKU_456',
  item_name: 'boots',
  item_category: 'shoes',
  item_variant: 'brown',
  item_brand: 'Google',
  price: 24.99
};

// A pair of socks
const item_socks = {
  item_id: 'SKU_789',
  item_name: 'ankle_socks',
  item_category: 'socks',
  item_variant: 'red',
  item_brand: 'Google',
  price: 5.99
};
// [END analytics_ecommerce_items]

function ecommerceViewItemList() {
  // [START analytics_ecommerce_view_item_list]
  // Prepare ecommerce params
  const params1 = {
    item_list_id: 'L001',
    item_list_name: 'Related products',
    items: [item_jeggings, item_boots, item_socks]
  };

  // Log event
  firebase.analytics().logEvent(firebase.analytics.EventName.VIEW_ITEM_LIST, params1);
  // [END analytics_ecommerce_view_item_list]
}

function ecommerceSelectItem() {
  // [START analytics_ecommerce_select_item]
  // Prepare ecommerce event params
  const params2 = {
    item_list_id: 'L001',
    item_list_name: 'Related products',
    items: [item_jeggings]
  };

  // Log event
  firebase.analytics().logEvent(firebase.analytics.EventName.SELECT_ITEM, params2);
  // [END analytics_ecommerce_select_item]
}

function ecommerceViewItemDetails() {
    // [START analytics_ecommerce_view_item_details]
    // Prepare ecommerce event params
    const params3 = {
      currency: 'USD',
      value: 9.99,
      items: [item_jeggings]
    };

  // Log event
  firebase.analytics().logEvent(firebase.analytics.EventName.VIEW_ITEM, params3);
  // [END analytics_ecommerce_view_item_details]
}

function ecommerceAddCart() {
  // [START analytics_ecommerce_add_cart]
  // Specify order quantity
  const item_jeggings_quantity = {
    ...item_jeggings,
    quantity: 2
  };

  // Prepare ecommerce bundle
  const params4 = {
    currency: 'USD',
    value: 19.98,
    items: [item_jeggings_quantity]
  };

  // Log event when a product is added to a wishlist
  firebase.analytics().logEvent(firebase.analytics.EventName.ADD_TO_WISHLIST, params4);

  // Log event when a product is added to the cart
  firebase.analytics().logEvent(firebase.analytics.EventName.ADD_TO_CART, params4);
  // [END analytics_ecommerce_add_cart]
}

function ecommerceViewCart() {
  // [START analytics_ecommerce_view_cart]
  // Specify order quantity
  const item_jeggings_quantity = {
    ...item_jeggings,
    quantity: 2
  };

  const item_boots_quantity = {
    ...item_boots,
    quantity: 1
  };

  // Prepare ecommerce params
  const params5 = {
    currency: 'USD',
    value: 44.97,
    items: [item_jeggings_quantity, item_boots_quantity]
  };

  // Log event when the cart is viewed
  firebase.analytics().logEvent(firebase.analytics.EventName.VIEW_CART, params5);
  // [END analytics_ecommerce_view_cart]
}

function ecommerceRemoveCart() {
  // [START analytics_ecommerce_remove_cart]
  // Prepare ecommerce params
  const params6 = {
    currency: 'USD',
    value: 24.99,
    items: [item_jeggings]
  };

  // Log event
  firebase.analytics().logEvent(firebase.analytics.EventName.REMOVE_FROM_CART, params6);
  // [END analytics_ecommerce_remove_cart]
}

function ecommerceCheckout() {
  // [START analytics_ecommerce_checkout]
  // Prepare ecommerce params
  const params7 = {
    currency: 'USD',
    value: 14.98, // Total Revenue
    coupon: 'SUMMER_FUN',
    items: [item_jeggings]
  };

  // Log event
  firebase.analytics().logEvent(firebase.analytics.EventName.BEGIN_CHECKOUT, params7);
  // [END analytics_ecommerce_checkout]
}

function ecommerceShippingInfo() {
  // [START analytics_ecommerce_shipping_info]
  // Prepare ecommerce params
  const params8 = {
    currency: 'USD',
    value: 14.98, // Total Revenue
    coupon: 'SUMMER_FUN',
    shipping_tier: 'Ground',
    items: [item_jeggings]
  };

  // Log event
  firebase.analytics().logEvent(firebase.analytics.EventName.ADD_SHIPPING_INFO, params8);
  // [END analytics_ecommerce_shipping_info]
}

function ecommercePaymentInfo() {
  // [START analytics_ecommerce_payment_info]
  // Prepare ecommerce params
  const params9 = {
    currency: 'USD',
    value: 14.98, // Total Revenue
    coupon: 'SUMMER_FUN',
    payment_type: 'Visa',
    items: [item_jeggings]
  };

  // Log event
  firebase.analytics().logEvent(firebase.analytics.EventName.ADD_PAYMENT_INFO, params9);  
  // [END analytics_ecommerce_payment_info]
}

function ecommercePurchase() {
  // [START analytics_ecommerce_purchase]
  // Prepare ecommerce bundle
  const params10 = {
    transaction_id: 'T12345',
    affiliation: 'Google Store',
    currency: 'USD',
    value: 14.98, // Total Revenue
    tax: 2.85,
    shipping: 5.34,
    coupon: 'SUMMER_FUN',
    items: [item_jeggings]
  };

  // Log event
  firebase.analytics().logEvent(firebase.analytics.EventName.PURCHASE, params10);
  // [END analytics_ecommerce_purchase]
}

function ecommerceRefund() {
  // [START analytics_ecommerce_refund]
  // Prepare ecommerce params
  const params11 = {
    transaction_id: 'T12345', // Required
    affiliation: 'Google Store',
    currency: 'USD',
    value: 9.99,
    items: []
  };

  // (Optional) For partial refunds, define the item_id and quantity of refunded items
  const refundedProduct = {
    item_id: 'SKU_123', // Required
    quantity: 1 // Required
  };

  params11.items.push(refundedProduct);

  // Log event
  firebase.analytics().logEvent(firebase.analytics.EventName.REFUND, params11);
  // [END analytics_ecommerce_refund]
}

function ecommercePromotions() {
  // [START analytics_ecommerce_promotions]
  // Prepare ecommerce params
  const params12 = {
    promotion_id: 'ABC123',
    promotion_name: 'Summer Sale',
    creative_name: 'summer2020_promo.jpg',
    creative_slot: 'featured_app_1',
    location_id: 'HERO_BANNER',
    items: [item_jeggings]
  };

  // Log event when a promotion is displayed
  firebase.analytics().logEvent(firebase.analytics.EventName.VIEW_PROMOTION, params12);

  // Log event when a promotion is selected
  firebase.analytics().logEvent(firebase.analytics.EventName.SELECT_PROMOTION, params12);
  // [END analytics_ecommerce_promotions]
}
