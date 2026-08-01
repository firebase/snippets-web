// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

describe("firestore-pipelines", () => {
  const { Firestore } = require("firebase/firestore");

  /** @type {Firestore} */
  let db;

  before(async () => {
    const { initializeApp } = require("firebase/app");
    const { getFirestore } = require("firebase/firestore");

    const config = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: "firestorequickstarts.firebaseapp.com",
      projectId: "firestorequickstarts",
    };
    const app = initializeApp(config, "firestore-pipelines");
    db = getFirestore(app);
  });

  it("should load test data for pipeline joins", async () => {
    const { collection, doc, setDoc, addDoc } = require("firebase/firestore");
    // [START pipeline_join_test_data]
    // Load set of cities.
    const cities = collection(db, "cities");

    await setDoc(doc(cities, "SF"), {
      name: "San Francisco",
      state: "CA",
      country: "USA",
    });
    await setDoc(doc(cities, "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    });
    await setDoc(doc(cities, "DC"), {
      name: "Washington, D.C.",
      state: null,
      country: "USA"
    });
    await setDoc(doc(cities, "TOK"), {
      name: "Tokyo",
      state: null,
      country: "Japan"
    });

    // Load restaurants in various cities.
    const sfRestaurants = collection(db, "cities", "SF", "restaurants");
    const laRestaurants = collection(db, "cities", "LA", "restaurants");
    const dcRestaurants = collection(db, "cities", "DC", "restaurants");

    const rest1 = await addDoc(sfRestaurants, {
      name: "Golden Gate Pizza",
      type: "pizza",
      owner_id: "Mario Rossi"
    });
    const rest2 = await addDoc(sfRestaurants, {
      name: "Bay Area Burger",
      type: "burger",
      owner_id: "Sarah Jenkins"
    });
    const rest3 = await addDoc(sfRestaurants, {
      name: "Sunset Taco",
      type: "mexican",
      owner_id: "Edward"
    });

    const rest4 = await addDoc(laRestaurants, {
      name: "Hollywood Sushi",
      type: "sushi",
      owner_id: "Ken Kenji"
    });
    const rest5 = await addDoc(laRestaurants, {
      name: "Venice Pizza",
      type: "pizza",
      owner_id: "Luigi Romano"
    });

    const rest6 = await addDoc(dcRestaurants, {
      name: "Capitol Tacos",
      type: "mexican",
      owner_id: "Maria Garcia"
    });
    const rest7 = await addDoc(dcRestaurants, {
      name: "Georgetown Coffee",
      type: "cafe",
      owner_id: "David Kim"
    });

    // Load collection of reviews.
    const reviews = collection(db, "reviews");

    await addDoc(reviews, { restaurant: rest1, rating: 5, reviewer_id: "Alice" });
    await addDoc(reviews, { restaurant: rest1, rating: 4, reviewer_id: "Bob" });
    await addDoc(reviews, { restaurant: rest2, rating: 4, reviewer_id: "Charlie" });
    await addDoc(reviews, { restaurant: rest3, rating: 5, reviewer_id: "Diana" });
    await addDoc(reviews, { restaurant: rest3, rating: 4, reviewer_id: "Edward" });
    await addDoc(reviews, { restaurant: rest3, rating: 4, reviewer_id: "Fiona" });
    // rest4 has 0 reviews
    await addDoc(reviews, { restaurant: rest5, rating: 3, reviewer_id: "George" });
    await addDoc(reviews, { restaurant: rest6, rating: 5, reviewer_id: "Hannah" });
    await addDoc(reviews, { restaurant: rest6, rating: 4, reviewer_id: "Ian" });
    await addDoc(reviews, { restaurant: rest7, rating: 5, reviewer_id: "Julia" });
    // [END pipeline_join_test_data]
  });

  it("should perform a lookup on reviews collection group", async () => {
    const { execute, field, variable } = require("firebase/firestore/pipelines");
    // [START pipeline_join_lookup]
    let results = await execute(db.pipeline()
      .collectionGroup("reviews")
      .define(field("restaurant").as("restaurant_name"))
      .addFields(db.pipeline()
        .collectionGroup("restaurants")
        .where(field("__name__").equal(variable("restaurant_name")))
        .select("name", "type")
        .toScalarExpression()
        .as("restaurant")));
    // [END pipeline_join_lookup]
  });

  it("should perform an array subquery", async () => {
    const { execute, field, variable } = require("firebase/firestore/pipelines");
    // [START pipeline_join_array]
    let results = await execute(db.pipeline()
      .collectionGroup("restaurants")
      .where(field("type").equal("pizza"))
      .define(field("__name__").as("restaurant_name"))
      .select(
        field("name"),
        db.pipeline()
          .collectionGroup("reviews")
          .where(field("restaurant").equal(variable("restaurant_name")))
          .select("rating", "reviewer_id")
          .toArrayExpression()
          .as("reviews")));
    // [END pipeline_join_array]
  });

  it("should calculate average rating with correlated subquery", async () => {
    const { execute, field, variable, average } = require("firebase/firestore/pipelines");
    // [START pipeline_join_aggregate]
    let results = await execute(db.pipeline()
      .collectionGroup("restaurants")
      .where(field("type").equal("pizza"))
      .define(field("__name__").as("restaurant_name"))
      .select(
        field("name"),
        db.pipeline()
          .collectionGroup("reviews")
          .where(field("restaurant").equal(variable("restaurant_name")))
          .aggregate(average("rating").as("avg_rating"))
          .toScalarExpression()
          .as("avg_rating")));
    // [END pipeline_join_aggregate]
  });

  it("should get top 2 highest-rated reviews for each restaurant", async () => {
    const { execute, field, variable } = require("firebase/firestore/pipelines");
    // [START pipeline_join_limit]
    let results = await execute(db.pipeline()
      .collectionGroup("restaurants")
      .define(field("__name__").as("restaurant_name"))
      .select(
        field("name"),
        db.pipeline()
          .collectionGroup("reviews")
          .where(field("restaurant").equal(variable("restaurant_name")))
          .sort(field("rating").descending())
          .limit(2)
          .select("rating", "reviewer_id")
          .toArrayExpression()
          .as("top_reviews")));
    // [END pipeline_join_limit]
  });

  it("should scan cities and use subcollection stage to count restaurants", async () => {
    const { execute, subcollection } = require("firebase/firestore/pipelines");
    // [START pipeline_join_subcollection]
    let results = await execute(db.pipeline()
      .collection("cities")
      .addFields(subcollection("restaurants")
        .toArrayExpression()
        .length()
        .as("restaurant_count")));
    // [END pipeline_join_subcollection]
  });

  it("should perform multi-field join to find owners who reviewed their own restaurants", async () => {
    const { execute, field, variable, countAll } = require("firebase/firestore/pipelines");
    // [START pipeline_join_multi_field]
    let results = await execute(db.pipeline()
      .collectionGroup("restaurants")
      .define(field("owner_id").as("owner_id"), field("__name__").as("__name__"))
      .where(db.pipeline()
        .collectionGroup("reviews")
        .where(field("restaurant").equal(variable("__name__")))
        .where(field("reviewer_id").equal(variable("owner_id")))
        .aggregate(countAll().as("c"))
        .toScalarExpression()
        .greaterThan(0)));
    // [END pipeline_join_multi_field]
  });

  it("should find restaurants without reviews using anti-join", async () => {
    const { execute, field, variable, countAll } = require("firebase/firestore/pipelines");
    // [START pipeline_join_anti]
    let results = await execute(db.pipeline()
      .collectionGroup("restaurants")
      .define(field("__name__").as("restaurant_name"))
      .where(db.pipeline()
        .collectionGroup("reviews")
        .where(field("restaurant").equal(variable("restaurant_name")))
        .aggregate(countAll().as("review_count"))
        .toScalarExpression()
        .equal(0)));
    // [END pipeline_join_anti]
  });

  it("should flatten relationship between pizza places and reviews using unnest", async () => {
    const { execute, field, variable } = require("firebase/firestore/pipelines");
    // [START pipeline_join_unnest]
    let results = await execute(db.pipeline()
      .collectionGroup("restaurants")
      .where(field("type").equal("pizza"))
      .define(field("__name__").as("restaurant_name"))
      .unnest(
        db.pipeline()
          .collectionGroup("reviews")
          .where(field("restaurant").equal(variable("restaurant_name")))
          .select("rating", "reviewer_id")
          .toArrayExpression()
          .as("review")));
    // [END pipeline_join_unnest]
  });

  it("should filter reviews with rating greater than average using uncorrelated subquery", async () => {
    const { execute, field, average } = require("firebase/firestore/pipelines");
    // [START pipeline_join_uncorrelated]
    let results = await execute(db.pipeline()
      .collection("reviews")
      // Average review rating is 4.3
      .where(field("rating").greaterThan(db.pipeline()
        .collection("reviews")
        .aggregate(average("rating").as("avg"))
        .toScalarExpression()))
      .select("rating", "reviewer_id"));
    // [END pipeline_join_uncorrelated]
  });

  it("should force a table scan on collection group query", async () => {
    // [START pipeline_force_table_scan]
    // Force Planner to only do a Full-Table Scan
    db.pipeline()
      .collectionGroup({ collectionId: "customers", forceIndex: "primary" })
      .limit(100);
    // [END pipeline_force_table_scan]
  });
});
