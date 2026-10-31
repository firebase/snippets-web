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

  it("should emit literal documents and expressions", async () => {
    const { execute, field, constant } = require("firebase/firestore/pipelines");
    // [START literals_example]
    let results = await execute(db.pipeline()
      .literals([
        { name: "joe", age: 10 },
        { name: "bob", age: 30 },
        { name: "alice", age: 40 }
      ])
      .where(field("age").lessThan(35)));
    // [END literals_example]

    // [START literals_expressions]
    let exprResults = await execute(db.pipeline()
      .literals([
        { x: constant("foo-bar-baz").length() },
        { x: constant("bar").length() }
      ]));
    // [END literals_expressions]
  });

  it("should delete and update documents with DML stages", async () => {
    const { execute, field, constant, not, exists, currentTimestamp } = require("firebase/firestore/pipelines");
    // [START update_dml]
    const snapshot = await execute(db.pipeline()
      .collectionGroup("users")
      .where(not(exists(field("preferences.color"))))
      .addFields(constant(null).as("preferences.color"))
      .removeFields("color")
      .update());
    // [END update_dml]

    // [START delete_dml]
    const pipeline = db.pipeline()
      .collectionGroup("users")
      .where(field("address.country").equal("USA"))
      .where(field("__create_time__").timestampAdd("day", 10).lessThan(currentTimestamp()))
      .delete();
    await execute(pipeline);
    // [END delete_dml]

    // [START delete_full_collection]
    await execute(db.pipeline()
      .collection("/users")
      .delete());
    // [END delete_full_collection]
  });

  it("should execute DML pipelines atomically", async () => {
    const { execute, field, constant } = require("firebase/firestore/pipelines");
    // [START dml_transaction]
    const pipeline = db.pipeline()
      .collection("users")
      .where(field("active").equal(false))
      .addFields(constant("inactive").as("status"))
      .update();

    await execute({ pipeline, atomic: true });
    // [END dml_transaction]

    // [START dml_atomic_option]
    await execute({
      pipeline: db.pipeline()
        .collection("users")
        .where(field("active").equal(false))
        .addFields(constant("inactive").as("status"))
        .update(),
      atomic: true
    });
    // [END dml_atomic_option]
  });

  it("should insert documents with insert stage", async () => {
    const { doc } = require("firebase/firestore");
    const { execute, field, constant, stringConcat } = require("firebase/firestore/pipelines");

    // [START insert_static_documents]
    await execute(db.pipeline()
      .literals([
        { id: "user1", name: "Alice", age: 30 },
        { id: "user2", name: "Bob", age: 25 }
      ])
      .insert({
        collection: "users",
        documentIdExpression: field("id")
      }));
    // [END insert_static_documents]

    // [START insert_evaluated_doc_id]
    await execute({
      pipeline: db.pipeline()
        .collection("users")
        .distinct(field("name"))
        .insert({
          collection: "new_users",
          documentIdExpression: stringConcat(constant("new_"), field("name"))
        }),
      atomic: true
    });
    // [END insert_evaluated_doc_id]

    // [START insert_document_references]
    await execute(db.pipeline()
      .literals([
        { __name__: doc(db, "users/doc1"), name: "Alice" },
        { __name__: doc(db, "users/doc2"), name: "Bob" }
      ])
      .insert());
    // [END insert_document_references]

    // [START insert_auto_generated_ids]
    await execute(db.pipeline()
      .literals([
        { name: "Alice", role: "admin" },
        { name: "Bob", role: "viewer" }
      ])
      .insert({ collection: "users" }));
    // [END insert_auto_generated_ids]

    // [START insert_subcollection]
    await execute(db.pipeline()
      .literals([
        { title: "Hello World", published: true }
      ])
      .insert({ collection: "users/u1/posts" }));
    // [END insert_subcollection]

    // [START insert_different_collection]
    await execute({
      pipeline: db.pipeline()
        .collection("source_coll")
        .where(field("active").equal(true))
        .addFields(constant("val").as("new_field"))
        .insert({ collection: "target_coll" }),
      atomic: true
    });
    // [END insert_different_collection]

    // [START insert_advanced_queries]
    await execute({
      pipeline: db.pipeline()
        .collection("products")
        .search({ query: "shoes" })
        .insert({ collection: "matched_products" }),
      atomic: true
    });
    // [END insert_advanced_queries]
  });

  it("should update documents from aggregation subquery", async () => {
    const { execute, field, constant, maximum } = require("firebase/firestore/pipelines");
    // [START update_aggregation_subquery]
    await execute({
      pipeline: db.pipeline()
        .collection("users")
        .where(
          field("score").equal(
            db.pipeline()
              .collection("users")
              .aggregate(maximum("score").as("max"))
              .toScalarExpression()
          )
        )
        .update(constant(true).as("is_top_scorer")),
      atomic: true
    });
    // [END update_aggregation_subquery]
  });

  it("should upsert documents with upsert stage", async () => {
    const { doc } = require("firebase/firestore");
    const { execute, field, constant, maximum } = require("firebase/firestore/pipelines");

    // [START upsert_migrate_users]
    await execute({
      pipeline: db.pipeline()
        .collection("users")
        .where(field("age").greaterThanOrEqual(25))
        .addFields(constant(true).as("processed"))
        .upsert({
          collection: "new_users",
          documentIdExpression: field("name")
        }),
      atomic: true
    });
    // [END upsert_migrate_users]

    // [START upsert_in_place]
    await execute({
      pipeline: db.pipeline()
        .collection("users")
        .upsert(constant(31).as("age")),
      atomic: true
    });
    // [END upsert_in_place]

    // [START upsert_different_collection_explicit_id]
    await execute({
      pipeline: db.pipeline()
        .collection("source_coll")
        .upsert({
          additionalFields: [constant(31).as("age")],
          collection: "target_coll",
          documentIdExpression: constant("new_doc_id")
        }),
      atomic: true
    });
    // [END upsert_different_collection_explicit_id]

    // [START upsert_different_collection_existing_id]
    await execute({
      pipeline: db.pipeline()
        .collection("source_coll")
        .upsert({
          additionalFields: [constant("updated_val").as("status")],
          collection: "target_coll"
        }),
      atomic: true
    });
    // [END upsert_different_collection_existing_id]

    // [START upsert_document_references]
    await execute({
      pipeline: db.pipeline()
        .literals([
          { __name__: doc(db, "users/doc1"), name: "Alice" },
          { __name__: doc(db, "users/doc2"), name: "Bob" }
        ])
        .upsert(),
      atomic: true
    });
    // [END upsert_document_references]

    // [START upsert_auto_generated_ids]
    await execute({
      pipeline: db.pipeline()
        .literals([
          { name: "Alice" },
          { name: "Bob" }
        ])
        .upsert({
          additionalFields: [constant("active").as("status")],
          collection: "users"
        }),
      atomic: true
    });
    // [END upsert_auto_generated_ids]

    // [START upsert_subcollection]
    await execute({
      pipeline: db.pipeline()
        .literals([
          { __name__: doc(db, "users/u1/posts/p1"), title: "Updated Post" }
        ])
        .upsert({ collection: "users/u1/posts" }),
      atomic: true
    });
    // [END upsert_subcollection]

    // [START upsert_advanced_queries]
    await execute({
      pipeline: db.pipeline()
        .collection("products")
        .search({ query: "shoes" })
        .upsert(constant(true).as("is_shoes")),
      atomic: true
    });
    // [END upsert_advanced_queries]

    // [START upsert_aggregation_subquery]
    await execute({
      pipeline: db.pipeline()
        .collection("users")
        .where(
          field("score").equal(
            db.pipeline()
              .collection("users")
              .aggregate(maximum("score").as("max"))
              .toScalarExpression()
          )
        )
        .upsert(constant(true).as("is_top_scorer")),
      atomic: true
    });
    // [END upsert_aggregation_subquery]
  });

  it("should filter before and after addFields for security rules", async () => {
    const { execute, field, constant } = require("firebase/firestore/pipelines");
    // [START rules_pipelines_filter_before]
    let beforeResults = await execute(db.pipeline()
      .collection("FeatureRequests")
      .where(field("status").equal("open"))
      .addFields(constant(true).as("isArchived")));
    // [END rules_pipelines_filter_before]

    // [START rules_pipelines_filter_after]
    let afterResults = await execute(db.pipeline()
      .collection("FeatureRequests")
      .addFields(constant(true).as("isArchived"))
      .where(field("status").equal("open")));
    // [END rules_pipelines_filter_after]
  });
});
