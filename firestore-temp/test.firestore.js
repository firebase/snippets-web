// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

const { expect } = require("chai");

describe("firestore-pipelines", () => {
    const {
        Firestore,
        Timestamp
    } = require("@google-cloud/firestore")
    const {
        Pipeline,
        array,
        arrayReverse,
        average,
        maximum,
        sum,
        field,
        constant,
        countAll,
        AggregateFunction,
        and,
        like,
        or,
        xor,
        conditional
    } = require("@google-cloud/firestore/pipelines");

    let app;
    /** @type {Firestore} */ let db;

    before(() => {
      db = new Firestore({
        projectId: "your-project-id",
        databaseId: "your-new-enterprise-database"
      });
    });

    async function stagesExpressionsExample() {
      // [START stages_expressions_example]
      const trailing30Days = constant(Timestamp.now().toMillis())
        .unixMillisToTimestamp()
        .timestampSubtract("day", 30);
      const snapshot = await db.pipeline()
        .collection("productViews")
        .where(field("viewedAt").greaterThan(trailing30Days))
        .aggregate(field("productId").countDistinct().as("uniqueProductViews"))
        .execute();
      // [END stages_expressions_example]
      console.log(snapshot);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/where

    async function createWhereData() {
      // [START create_where_data]
      await db.collection("cities").doc("SF").set(
        { name: "San Francisco", state: "CA", country: "USA", population: 870000 }
      );
      await db.collection("cities").doc("LA").set(
        { name: "Los Angeles", state: "CA", country: "USA", population: 3970000 }
      );
      await db.collection("cities").doc("NY").set(
        { name: "New York", state: "NY", country: "USA", population: 8530000 }
      );
      await db.collection("cities").doc("TOR").set(
        { name: "Toronto", state: null, country: "Canada", population: 2930000 }
      );
      await db.collection("cities").doc("MEX").set(
        { name: "Mexico City", state: null, country: "Mexico", population: 9200000 }
      );
      // [END create_where_data]
    }

    async function whereEqualityExample() {
      // [START where_equality_example]
      const cities = await db.pipeline()
        .collection("cities")
        .where(field("state").equal("CA"))
        .execute();
      // [END where_equality_example]
      console.log(cities);
    }

    async function whereMultipleStagesExample() {
      // [START where_multiple_stages]
      const cities = await db.pipeline()
        .collection("cities")
        .where(field("location.country").equal("USA"))
        .where(field("population").greaterThan(500000))
        .execute();
      // [END where_multiple_stages]
      console.log(cities);
    }

    async function whereComplexExample() {
      // [START where_complex]
      const cities = await db.pipeline()
        .collection("cities")
        .where(
          or(
            like(field("name"), "San%"),
            and(
              field("location.state").charLength().greaterThan(7),
              field("location.country").equal("USA")
            )
          )
        ).execute();
      // [END where_complex]
      console.log(cities);
    }

    async function whereStageOrderExample() {
      // [START where_stage_order]
      const cities = await db.pipeline()
        .collection("cities")
        .limit(10)
        .where(field("location.country").equal("USA"))
        .execute();
      // [END where_stage_order]
      console.log(cities);
    }

    async function whereHavingExample() {
      // [START where_having_example]
      const cities = await db.pipeline()
        .collection("cities")
        .aggregate({
          accumulators: [field("population").sum().as("total_population")],
          groups: ["location.state"]
        })
        .where(field("total_population").greaterThan(10000000))
        .execute();
      // [END where_having_example]
      console.log(cities);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/unnest

    async function unnestSyntaxExample() {
      // [START unnest_syntax]
      const userScore = await db.pipeline()
        .collection("users")
        .unnest(field("scores").as("userScore"), /* index_field= */ "attempt")
        .execute();
      // [END unnest_syntax]
      console.log(userScore);
    }

    async function unnestAliasIndexDataExample() {
      // [START unnest_alias_index_data]
      await db.collection("users").add({name: "foo", scores: [5, 4], userScore: 0});
      await db.collection("users").add({name: "bar", scores: [1, 3], attempt: 5});
      // [END unnest_alias_index_data]
    }

    async function unnestAliasIndexExample() {
      // [START unnest_alias_index]
      const userScore = await db.pipeline()
        .collection("users")
        .unnest(field("scores").as("userScore"), /* index_field= */ "attempt")
        .execute();
      // [END unnest_alias_index]
      console.log(userScore);
    }

    async function unnestNonArrayDataExample() {
      // [START unnest_nonarray_data]
        await db.collection("users").add({name: "foo", scores: 1});
        await db.collection("users").add({name: "bar", scores: null});
        await db.collection("users").add({name: "qux", scores: {backupScores: 1}});
      // [END unnest_nonarray_data]
    }

    async function unnestNonArrayExample() {
      // [START unnest_nonarray]
      const userScore = await db.pipeline()
        .collection("users")
        .unnest(field("scores").as("userScore"), /* index_field= */ "attempt")
        .execute();
      // [END unnest_nonarray]
      console.log(userScore);
    }

    async function unnestEmptyArrayDataExample() {
      // [START unnest_empty_array_data]
      await db.collection("users").add({name: "foo", scores: [5, 4]});
      await db.collection("users").add({name: "bar", scores: []});
      // [END unnest_empty_array_data]
    }

    async function unnestEmptyArrayExample() {
      // [START unnest_empty_array]
      const userScore = await db.pipeline()
        .collection("users")
        .unnest(field("scores").as("userScore"), /* index_field= */ "attempt")
        .execute();
      // [END unnest_empty_array]
      console.log(userScore);
    }

    async function unnestPreserveEmptyArrayExample() {
      // [START unnest_preserve_empty_array]
      const userScore = await db.pipeline()
        .collection("users")
        .unnest(
          conditional(
            field("scores").equal(array([])),
            array([field("scores")]),
            field("scores")
          ).as("userScore"),
        /* index_field= */ "attempt")
        .execute();
      // [END unnest_preserve_empty_array]
      console.log(userScore);
    }

    async function unnestNestedDataExample() {
      // [START unnest_nested_data]
      await db.collection("users").add({
        name: "foo", 
        record: [
          {
            scores: [5, 4], 
            avg: 4.5
          }, {
            scores: [1, 3],
            old_avg: 2
          }
        ]
      });
      // [END unnest_nested_data]
    }

    async function unnestNestedExample() {
      // [START unnest_nested]
      const userScore = await db.pipeline()
        .collection("users")
        .unnest(field("record").as("record"))
        .unnest(field("record.scores").as("userScore"), /* index_field= */ "attempt")
        .execute();
      // [END unnest_nested]
      console.log(userScore);
    }

    // https://cloud.corp.google.com/firestore/docs/pipeline/stages/transformation/sample

    async function sampleSyntaxExample() {
      // [START sample_syntax]
      let sampled = await db.pipeline()
        .database()
        .sample(50)
        .execute();

      sampled = await db.pipeline()
        .database()
        .sample({ percentage: 0.5 })
        .execute();
      // [END sample_syntax]
      console.log(sampled);
    }

    async function sampleDocumentsDataExample() {
      // [START sample_documents_data]
      await db.collection("cities").doc("SF").set({name: "San Francisco", state: "California"});
      await db.collection("cities").doc("NYC").set({name: "New York City", state: "New York"});
      await db.collection("cities").doc("CHI").set({name: "Chicago", state: "Illinois"});
      // [END sample_documents_data]
    }

    async function sampleDocumentsExample() {
      // [START sample_documents]
      const sampled = await db.pipeline()
        .collection("cities")
        .sample(1)
        .execute();
      // [END sample_documents]
      console.log(sampled);
    }

    async function sampleAllDocumentsExample() {
      // [START sample_all_documents]
      const sampled = await db.pipeline()
        .collection("cities")
        .sample(5)
        .execute();
      // [END sample_all_documents]
      console.log(sampled);
    }

    async function samplePercentageDataExample() {
      // [START sample_percentage_data]
      await db.collection("cities").doc("SF").set({name: "San Francsico", state: "California"});
      await db.collection("cities").doc("NYC").set({name: "New York City", state: "New York"});
      await db.collection("cities").doc("CHI").set({name: "Chicago", state: "Illinois"});
      await db.collection("cities").doc("ATL").set({name: "Atlanta", state: "Georgia"});
      // [END sample_percentage_data]
    }

    async function samplePercentageExample() {
      // [START sample_percentage]
      const sampled = await db.pipeline()
        .collection("cities")
        .sample({ percentage: 0.5 })
        .execute();
      // [END sample_percentage]
      console.log(sampled);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/sort

    async function sortSyntaxExample() {
      // [START sort_syntax]
      const results = await db.pipeline()
        .collection("cities")
        .sort(field("population").ascending())
        .execute();
      // [END sort_syntax]
      console.log(results);
    }

    async function sortSyntaxExample2() {
      // [START sort_syntax_2]
      const results = await db.pipeline()
        .collection("cities")
        .sort(field("name").charLength().ascending())
        .execute();
      // [END sort_syntax_2]
      console.log(results);
    }

    async function sortDocumentIDExample() {
      // [START sort_document_id]
      const results = await db.pipeline()
        .collection("cities")
        .sort(field("country").ascending(), field("__name__").ascending())
        .execute();
      // [END sort_document_id]
      console.log(results);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/select

    async function selectSyntaxExample() {
      // [START select_syntax]
      const names = await db.pipeline()
        .collection("cities")
        .select(
          field("name").stringConcat(", ", field("location.country")).as("name"),
          "population"
        ).execute();
      // [END select_syntax]
      console.log(names);
    }

    async function selectPositionDataExample() {
      // [START select_position_data]
      await db.collection("cities").doc("SF").set({
        name: "San Francisco", population: 800000, location: {country: "USA", state: "California"}
      });
      await db.collection("cities").doc("TO").set({
        name: "Toronto", population: 3000000, location: {country: "Canada", province: "Ontario"}
      });
      // [END select_position_data]
    }

    async function selectPositionExample() {
      // [START select_position]
      const names = await db.pipeline()
        .collection("cities")
        .where(field("location.country").equal("Canada"))
        .select(
          field("name").stringConcat(", ", field("location.country")).as("name"),
          "population")
        .execute();
      // [END select_position]
      console.log(names);
    }

    async function selectBadPositionExample() {
      // [START select_bad_position]
      const names = await db.pipeline()
        .collection("cities")
        .select(
          field("name").stringConcat(", ", field("location.country")).as("name"),
          "population")
        .where(field("location.country").equal("Canada"))
        .execute();
      // [END select_bad_position]
      console.log(names);
    }

    async function selectNestedDataExample() {
      // [START select_nested_data]
      await db.collection("cities").doc("SF").set({name: "San Francisco", population: 800000, location: {country: "USA", state: "California"}, landmarks: ["Golden Gate Bridge", "Alcatraz"]});
      await db.collection("cities").doc("TO").set({name: "Toronto", population:  3000000, province: "ON", location: {country: "Canada", province: "Ontario"}, landmarks: ["CN Tower", "Casa Loma"]});
      await db.collection("cities").doc("AT").set({name: "Atlantis", population: null});
      // [END select_nested_data]
    }

    async function selectNestedExample() {
      // [START select_nested]
      const locations = await db.pipeline()
        .collection("cities")
        .select(
          field("name").as("city"),
          field("location.country").as("country"),
          field("landmarks").arrayGet(0).as("topLandmark")
        ).execute();
      // [END select_nested]
      console.log(locations);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/remove_fields

    async function removeFieldsSyntaxExample() {
      // [START remove_fields_syntax]
      const results = await db.pipeline()
        .collection("cities")
        .removeFields("population", "location.state")
        .execute();
      // [END remove_fields_syntax]
      console.log(results);
    }

    async function removeFieldsNestedDataExample() {
      // [START remove_fields_nested_data]
      await db.collection("cities").doc("SF").set({
        name: "San Francisco", location: {country: "USA", state: "California"}
      });
      await db.collection("cities").doc("TO").set({
        name: "Toronto", location: {country: "Canada", province: "Ontario"}
      });
      // [END remove_fields_nested_data]
    }

    async function removeFieldsNestedExample() {
      // [START remove_fields_nested]
      const results = await db.pipeline()
        .collection("cities")
        .removeFields("location.state")
        .execute();
      // [END remove_fields_nested]
      console.log(results);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/limit

    async function limitSyntaxExample() {
      // [START limit_syntax]
      const results = await db.pipeline()
        .collection("cities")
        .limit(10)
        .execute();
      // [END limit_syntax]
      console.log(results);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/find_nearest

    async function findNearestSyntaxExample() {
      // [START find_nearest_syntax]
      const results = await db.pipeline()
        .collection("cities")
        .findNearest({
            field: "embedding",
            vectorValue: [1.5, 2.345],
            distanceMeasure: "euclidean"
        })
        .execute();
      // [END find_nearest_syntax]
    }

    async function findNearestLimitExample() {
      // [START find_nearest_limit]
      const results = await db.pipeline()
        .collection("cities")
        .findNearest({
            field: "embedding",
            vectorValue: [1.5, 2.345],
            distanceMeasure: "euclidean",
            limit: 10
        })
        .execute();
      // [END find_nearest_limit]
      console.log(results);
    }

    async function findNearestDistanceDataExample() {
      // [START find_nearest_distance_data]
      await db.collection("cities").doc("SF").set({name: "San Francisco", embedding: [1.0, -1.0]});
      await db.collection("cities").doc("TO").set({name: "Toronto", embedding: [5.0, -10.0]});
      await db.collection("cities").doc("AT").set({name: "Atlantis", embedding: [2.0, -4.0]});
      // [END find_nearest_distance_data]
    }

    async function findNearestDistanceExample() {
      // [START find_nearest_distance]
      const results = await db.pipeline()
      .collection("cities")
      .findNearest({
          field: "embedding",
          vectorValue: [1.3, 2.345],
          distanceMeasure: "euclidean",
          distanceField: "computedDistance",
      })
      .execute();
      // [END find_nearest_distance]
      console.log(results);
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/offset

    async function offsetSyntaxExample() {
      // [START offset_syntax]
      const results = await db.pipeline()
        .collection("cities")
        .offset(10)
        .execute();
      // [END offset_syntax]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/add_fields

    async function addFieldsSyntaxExample() {
      // [START add_fields_syntax]
      const results = await db.pipeline()
        .collection("users")
        .addFields(field("firstName").stringConcat(" ", field("lastName")).as("fullName"))
        .execute();
      // [END add_fields_syntax]
    }

    async function addFieldsOverlapExample() {
      // [START add_fields_overlap]
      const results = await db.pipeline()
        .collection("users")
        .addFields(field("age").abs().as("age"))
        .addFields(field("age").add(10).as("age"))
        .execute();
      // [END add_fields_overlap]
    }

    async function addFieldsNestingExample() {
      // [START add_fields_nesting]
      const results = await db.pipeline()
        .collection("users")
        .addFields(field("address.city").toLower().as("address.city"))
        .execute();
      // [END add_fields_nesting]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/input/collection

    async function collectionInputSyntaxExample() {
      // [START collection_input_syntax]
      const results = await db.pipeline()
        .collection("cities/SF/departments")
        .execute();
      // [END collection_input_syntax]
    }

    async function collectionInputExampleData() {
      // [START collection_input_data]
      await db.collection("cities").doc("SF").set({name: "San Francsico", state: "California"});
      await db.collection("cities").doc("NYC").set({name: "New York City", state: "New York"});
      await db.collection("cities").doc("CHI").set({name: "Chicago", state: "Illinois"});
      await db.collection("states").doc("CA").set({name: "California"});
      // [END collection_input_data]
    }

    async function collectionInputExample() {
      // [START collection_input]
      const results = await db.pipeline()
        .collection("cities")
        .sort(field("name").ascending())
        .execute();
      // [END collection_input]
    }

    async function subcollectionInputExampleData() {
      // [START subcollection_input_data]
      await db.collection("cities/SF/departments").doc("building")
        .set({name: "SF Building Deparment", employees: 750});
      await db.collection("cities/NY/departments").doc("building")
        .set({name: "NY Building Deparment", employees: 1000});
      await db.collection("cities/CHI/departments").doc("building")
        .set({name: "CHI Building Deparment", employees: 900});
      await db.collection("cities/NY/departments").doc("finance")
        .set({name: "NY Finance Deparment", employees: 1200});
      // [END subcollection_input_data]
    }

    async function subcollectionInputExample() {
      // [START subcollection_input]
      const results = await db.pipeline()
        .collection("cities/NY/departments")
        .sort(field("employees").ascending())
        .execute();
      // [END subcollection_input]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/input/collection_group

    async function collectionGroupInputSyntaxExample() {
      // [START collection_group_input_syntax]
      const results = await db.pipeline()
        .collectionGroup("departments")
        .execute();
      // [END collection_group_input_syntax]
    }

    async function collectionGroupInputExampleData() {
      // [START collection_group_data]
      await db.collection("cities/SF/departments").doc("building").set({name: "SF Building Deparment", employees: 750});
      await db.collection("cities/NY/departments").doc("building").set({name: "NY Building Deparment", employees: 1000});
      await db.collection("cities/CHI/departments").doc("building").set({name: "CHI Building Deparment", employees: 900});
      await db.collection("cities/NY/departments").doc("finance").set({name: "NY Finance Deparment", employees: 1200});
      // [END collection_group_data]
    }

    async function collectionGroupInputExample() {
      // [START collection_group_input]
      const results = await db.pipeline()
        .collectionGroup("departments")
        .sort(field("employees").ascending())
        .execute();
      // [END collection_group_input]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/input/database

    async function databaseInputSyntaxExample() {
      // [START database_syntax]
      const results = await db.pipeline()
        .database()
        .execute();
      // [END database_syntax]
    }

    async function databaseInputSyntaxExampleData() {
      // [START database_input_data]
      await db.collection("cities").doc("SF").set({name: "San Francsico", state: "California", population: 800000});
      await db.collection("states").doc("CA").set({name: "California", population: 39000000});
      await db.collection("countries").doc("USA").set({name: "United States of America", population: 340000000});
      // [END database_input_data]
    }

    async function databaseInputExample() {
      // [START database_input]
      const results = await db.pipeline()
        .database()
        .sort(field("population").ascending())
        .execute();
      // [END database_input]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/input/documents

    async function documentInputSyntaxExample() {
      // [START document_input_syntax]
      const results = await db.pipeline()
        .documents([
          db.collection("cities").doc("SF"),
          db.collection("cities").doc("NY")])
        .execute();
      // [END document_input_syntax]
    }

    async function documentInputExampleData() {
      // [START document_input_data]
      await db.collection("cities").doc("SF").set({name: "San Francsico", state: "California"});
      await db.collection("cities").doc("NYC").set({name: "New York City", state: "New York"});
      await db.collection("cities").doc("CHI").set({name: "Chicago", state: "Illinois"});
      // [END document_input_data]
    }

    async function documentInputExample() {
      // [START document_input]
      const results = await db.pipeline()
        .documents([
          db.collection("cities").doc("SF"),
          db.collection("cities").doc("NYC")])
        .sort(field("name").ascending())
        .execute();
      // [END document_input]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/union

    async function unionSyntaxExample() {
      // [START union_syntax]
      const results = await db.pipeline()
        .collection("cities/SF/restaurants")
        .union(db.pipeline().collection("cities/NYC/restaurants"))
        .execute();
      // [END union_syntax]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/aggregate

    async function aggregateSyntaxExample() {
      // [START aggregate_syntax]
      const cities = await db.pipeline()
        .collection("cities")
        .aggregate(
            countAll().as("total"),
            average("population").as("averagePopulation")
        ).execute();
      // [END aggregate_syntax]
    }

    async function aggregateGroupSyntax() {
      // [START aggregate_group_syntax]
      const result = await db.pipeline()
        .collectionGroup("cities")
        .aggregate({
          accumulators: [
            countAll().as("cities"),
            field("population").sum().as("totalPopulation")
          ],
          groups: [field("location.state").as("state")]
        })
        .execute();
      // [END aggregate_group_syntax]
    }

    async function aggregateExampleData() {
      // [START aggregate_data]
      await db.collection("cities").doc("SF").set({name: "San Francisco", state: "CA", country: "USA", population: 870000});
      await db.collection("cities").doc("LA").set({name: "Los Angeles", state: "CA", country: "USA", population: 3970000});
      await db.collection("cities").doc("NY").set({name: "New York", state: "NY", country: "USA", population: 8530000});
      await db.collection("cities").doc("TOR").set({name: "Toronto", state: null, country: "Canada", population: 2930000});
      await db.collection("cities").doc("MEX").set({name: "Mexico City", state: null, country: "Mexico", population: 9200000});
      // [END aggregate_data]
    }

    async function aggregateWithoutGroupExample() {
      // [START aggregate_without_group]
      const cities = await db.pipeline()
        .collection("cities")
        .aggregate(
            countAll().as("total"),
            average("population").as("averagePopulation")
        ).execute();
      // [END aggregate_without_group]
    }

    async function aggregateGroupExample() {
      // [START aggregate_group_example]
      const cities = await db.pipeline()
        .collection("cities")
        .aggregate({
            accumulators: [
                countAll().as("numberOfCities"),
                maximum("population").as("maxPopulation")
            ],
            groups: ["country", "state"]
        })
        .execute();
      // [END aggregate_group_example]
    }

    async function aggregateGroupComplexExample() {
      // [START aggregate_group_complex]
      const cities = await db.pipeline()
        .collection("cities")
        .aggregate({
            accumulators: [
              sum("population").as("totalPopulation")
            ],
            groups: [field("state").equal(null).as("stateIsNull")]
        })
        .execute();
      // [END aggregate_group_complex]
    }

    // https://cloud.google.com/firestore/docs/pipeline/stages/transformation/distinct

    async function distinctSyntaxExample() {
      // [START distinct_syntax]
      let cities = await db.pipeline()
        .collection("cities")
        .distinct("country")
        .execute();

      cities = await db.pipeline()
        .collection("cities")
        .distinct(
          field("state").toLower().as("normalizedState"),
          field("country"))
        .execute();
      // [END distinct_syntax]
    }

    async function distinctExampleData() {
      // [START distinct_data]
      await db.collection("cities").doc("SF").set({name: "San Francisco", state: "CA", country: "USA"});
      await db.collection("cities").doc("LA").set({name: "Los Angeles", state: "CA", country: "USA"});
      await db.collection("cities").doc("NY").set({name: "New York", state: "NY", country: "USA"});
      await db.collection("cities").doc("TOR").set({name: "Toronto", state: null, country: "Canada"});
      await db.collection("cities").doc("MEX").set({name: "Mexico City", state: null, country: "Mexico"});
      // [END distinct_data]
    }

    async function distinctExample() {
      // [START distinct_example]
      const cities = await db.pipeline()
        .collection("cities")
        .distinct("country")
        .execute();
      // [END distinct_example]
    }

    async function distinctExpressionsExample() {
      // [START distinct_expressions]
      const cities = await db.pipeline()
        .collection("cities")
        .distinct(
          field("state").toLower().as("normalizedState"),
          field("country"))
        .execute();
      // [END distinct_expressions]
    }

    // old snippets

    async function basicRead() {
      // [START basic_read]
      const readDataPipeline = db.pipeline()
        .collection("users");

      // Execute the pipeline and handle the result
      try {
        const querySnapshot = await readDataPipeline.execute();
        querySnapshot.results.forEach((result) => {
          console.log(`${result.id} => ${result.data()}`);
        });
      } catch (error) {
          console.error("Error getting documents: ", error);
      }
      // [END basic_read]
    }

    function pipelineConcepts() {
        // [START pipeline_concepts]
        const pipeline = db.pipeline()
          // Step 1: Start a query with collection scope
          .collection("cities")
          // Step 2: Filter the collection
          .where(field("population").greaterThan(100000))
          // Step 3: Sort the remaining documents
          .sort(field("name").ascending())
          // Step 4: Return the top 10. Note applying the limit earlier in the
          // pipeline would have unintentional results.
          .limit(10);
        // [END pipeline_concepts]
        console.log(pipeline);
    }

    function pipelineInitialization() {
      // [START pipeline_initialization]
      const { Firestore } = require("@google-cloud/firestore");
      const database = new Firestore({
        projectId: "your-project-id",
        databaseId: "your-new-enterprise-database"
      });
      const pipeline = database.pipeline();
      // [END pipeline_initialization]
      console.log(pipeline);
    }

    function fieldVsConstants() {
        // [START field_or_constant]
        const pipeline = db.pipeline()
          .collection("cities")
          .where(field("name").equal(constant("Toronto")));
        // [END field_or_constant]
        console.log(pipeline);
    }

    async function inputStages() {
        // [START input_stages]
        let results;

        // Return all restaurants in San Francisco
        results = await db.pipeline().collection("cities/sf/restaurants").execute();

        // Return all restaurants
        results = await db.pipeline().collectionGroup("restaurants").execute();

        // Return all documents across all collections in the database (the entire database)
        results = await db.pipeline().database().execute();

        // Batch read of 3 documents
        results = await db.pipeline().documents([
          db.collection("cities").doc("SF"),
          db.collection("cities").doc("DC"),
          db.collection("cities").doc("NY"),
        ]).execute();
        // [END input_stages]
        console.log(results);
    }

    async function wherePipeline() {
        // [START pipeline_where]
        let results;

        results = await db.pipeline().collection("books")
          .where(field("rating").equal(5))
          .where(field("published").lessThan(1900))
          .execute();

        results = await db.pipeline().collection("books")
          .where(and(field("rating").equal(5), field("published").lessThan(1900)))
          .execute();
        // [END pipeline_where]
        console.log(results);
    }

    async function aggregateGroups() {
        // [START aggregate_groups]
        const results = await db.pipeline()
          .collection("books")
          .aggregate(
            field("rating").average().as("avg_rating")
          )
          .distinct(field("genre"))
          .execute();
        // [END aggregate_groups]
        console.log(results);
    }

    async function aggregateDistinct() {
        // [START aggregate_distinct]
        const results = await db.pipeline()
          .collection("books")
          .distinct(
            field("author").toUpper().as("author"),
            field("genre")
          )
          .execute();
        // [END aggregate_distinct]
        console.log(results);
    }

    async function sort() {
        // [START sort]
        const results = await db.pipeline()
          .collection("books")
          .sort(
            field("release_date").descending(), field("author").ascending()
          )
          .execute();
        // [END sort]
        console.log(results);
    }

    function sortComparison() {
        // [START sort_comparison]
        const q = db.collection("cities")
          .orderBy("state")
          .orderBy("population", "desc");

        const pipeline = db.pipeline()
          .collection("books")
          .sort(
            field("release_date").descending(), field("author").ascending()
          );
        // [END sort_comparison]
        console.log(q);
        console.log(pipeline);
    }

    async function functions() {
        // [START functions_example]
        let results;

        // Type 1: Scalar (for use in non-aggregation stages)
        // Example: Return the min store price for each book.
        results = await db.pipeline().collection("books")
          .select(field("current").logicalMinimum(field("updated")).as("price_min"))
          .execute();

        // Type 2: Aggregation (for use in aggregate stages)
        // Example: Return the min price of all books.
        results = await db.pipeline().collection("books")
          .aggregate(field("price").minimum().as("min_price"))
          .execute();
        // [END functions_example]
        console.log(results);
    }

    async function creatingIndexes() {
        // [START query_example]
        const results = await db.pipeline()
          .collection("books")
          .where(field("published").lessThan(1900))
          .where(field("genre").equal("Science Fiction"))
          .where(field("rating").greaterThan(4.3))
          .sort(field("published").descending())
          .execute();
        // [END query_example]
        console.log(results);
    }

    async function sparseIndexes() {
        // [START sparse_index_example]
        const results = await db.pipeline()
          .collection("books")
          .where(like(field("category"), "%fantasy%"))
          .execute();
        // [END sparse_index_example]
        console.log(results);
    }

    async function sparseIndexes2() {
        // [START sparse_index_example_2]
        const results = await db.pipeline()
          .collection("books")
          .sort(field("release_date").ascending())
          .execute();
        // [END sparse_index_example_2]
        console.log(results);
    }

    async function coveredQuery() {
        // [START covered_query]
        const results = await db.pipeline()
          .collection("books")
          .where(like(field("category"), "%fantasy%"))
          .where(field("title").exists())
          .where(field("author").exists())
          .select(field("title"), field("author"))
          .execute();
        // [END covered_query]
        console.log(results);
    }

    async function pagination() {
        // [START pagination_not_supported_preview]
        // Existing pagination via `startAt()`
        const q =
          db.collection("cities").orderBy("population").startAt(1000000);

        // Private preview workaround using pipelines
        const pageSize = 2;
        const pipeline = db.pipeline()
          .collection("cities")
          .select("name", "population", "__name__")
          .sort(field("population").descending(), field("__name__").ascending());

        // Page 1 results
        let snapshot = await pipeline.limit(pageSize).execute();

        // End of page marker
        const lastDoc = snapshot.results[snapshot.results.length - 1];

        // Page 2 results
        snapshot = await pipeline
            .where(
              or(
                and(
                  field("population").equal(lastDoc.get("population")),
                  field("__name__").greaterThan(lastDoc.ref)
                ),
                field("population").lessThan(lastDoc.get("population"))
              )
            )
            .limit(pageSize)
            .execute();
        // [END pagination_not_supported_preview]
        console.log(q);
        console.log(pipeline);
    }

    async function collectionStage() {
        // [START collection_example]
        const results = await db.pipeline()
          .collection("users/bob/games")
          .sort(field("name").ascending())
          .execute();
        // [END collection_example]
        console.log(results);
    }

    async function collectionGroupStage() {
        // [START collection_group_example]
        const results = await db.pipeline()
          .collectionGroup("games")
          .sort(field("name").ascending())
          .execute();
        // [END collection_group_example]
        console.log(results);
    }

    async function databaseStage() {
        // [START database_example]
        // Count all documents in the database
        const results = await db.pipeline()
          .database()
          .aggregate(countAll().as("total"))
          .execute();
        // [END database_example]
        console.log(results);
    }

    async function documentsStage() {
        // [START documents_example]
        const results = await db.pipeline()
          .documents([
            db.collection("cities").doc("SF"),
            db.collection("cities").doc("DC"),
            db.collection("cities").doc("NY")
          ])
          .execute();
        // [END documents_example]
        console.log(results);
    }

    async function replaceWithStage() {
        // [START initial_data]
        await db.collection("cities").doc("SF").set({
          "name": "San Francisco",
          "population": 800000,
          "location": {
            "country": "USA",
            "state": "California"
          }
        });
        await db.collection("cities").doc("TO").set({
          "name": "Toronto",
          "population": 3000000,
          "province": "ON",
          "location": {
            "country": "Canada",
            "province": "Ontario"
          }
        });
        await db.collection("cities").doc("NY").set({
          "name": "New York",
          "location": {
            "country": "USA",
            "state": "New York"
          }
        });
        await db.collection("cities").doc("AT").set({
          "name": "Atlantis",
        });
        // [END initial_data]

        // [START full_replace]
        const names = await db.pipeline()
          .collection("cities")
          .replaceWith(field("location"))
          .execute();
        // [END full_replace]

        // [START map_merge_overwrite]
        // unsupported in client SDKs for now
        // [END map_merge_overwrite]
        console.log(names);
    }

    async function sampleStage() {
        // [START sample_example]
        let results;

        // Get a sample of 100 documents in a database
        results = await db.pipeline()
          .database()
          .sample(100)
          .execute();

        // Randomly shuffle a list of 3 documents
        results = await db.pipeline()
          .documents([
            db.collection("cities").doc("SF"),
            db.collection("cities").doc("DC"),
            db.collection("cities").doc("NY")
          ])
          .sample(3)
          .execute();
        // [END sample_example]
        console.log(results);
    }

    async function samplePercent() {
        // [START sample_percent]
        // Get a sample of on average 50% of the documents in the database
        const results = await db.pipeline()
          .database()
          .sample({ percentage: 0.5 })
          .execute();
        // [END sample_percent]
        console.log(results);
    }

    async function unionStage() {
        // [START union_stage]
        const results = await db.pipeline()
          .collection("cities/SF/restaurants")
          .where(field("type").equal("Chinese"))
          .union(db.pipeline()
            .collection("cities/NY/restaurants")
            .where(field("type").equal("Italian")))
          .where(field("rating").greaterThanOrEqual(4.5))
          .sort(field("__name__").descending())
          .execute();
        // [END union_stage]
        console.log(results);
    }

    async function unnestStage() {
        // [START unnest_stage]
        const results = await db.pipeline()
          .database()
          .unnest(field("arrayField").as("unnestedArrayField"), "index")
          .execute();
        // [END unnest_stage]
        console.log(results);
    }

    async function unnestStageEmptyOrNonArray() {
        // [START unnest_edge_cases]
        // Input
        // { identifier : 1, neighbors: [ "Alice", "Cathy" ] }
        // { identifier : 2, neighbors: []                   }
        // { identifier : 3, neighbors: "Bob"                }

        const results = await db.pipeline()
          .database()
          .unnest(field("neighbors").as("unnestedNeighbors"), "index" )
          .execute();

        // Output
        // { identifier: 1, neighbors: [ "Alice", "Cathy" ], unnestedNeighbors: "Alice", index: 0 }
        // { identifier: 1, neighbors: [ "Alice", "Cathy" ], unnestedNeighbors: "Cathy", index: 1 }
        // { identifier: 3, neighbors: "Bob", index: null}
        // [END unnest_edge_cases]
        console.log(results);
    }

    async function countFunction() {
        // [START count_function]
        // Total number of books in the collection
        const countOfAll = await db.pipeline()
          .collection("books")
          .aggregate(countAll().as("count"))
          .execute();

        // Number of books with nonnull `ratings` field
        const countField = await db.pipeline()
          .collection("books")
          .aggregate(field("ratings").count().as("count"))
          .execute();
        // [END count_function]
        console.log(countOfAll);
        console.log(countField);
    }

    async function countIfFunction() {
        // [START count_if]
        const result = await db.pipeline()
          .collection("books")
          .aggregate(
            field("rating").greaterThan(4).countIf().as("filteredCount")
          )
          .execute();
        // [END count_if]
        console.log(result);
    }

    async function countDistinctFunction() {
        // [START count_distinct]
        const result = await db.pipeline()
          .collection("books")
          .aggregate(field("author").countDistinct().as("unique_authors"))
          .execute();
        // [END count_distinct]
        console.log(result);
    }

    async function sumFunction() {
        // [START sum_function]
        const result = await db.pipeline()
          .collection("cities")
          .aggregate(field("population").sum().as("totalPopulation"))
          .execute();
        // [END sum_function]
        console.log(result);
    }

    async function avgFunction() {
        // [START avg_function]
        const result = await db.pipeline()
          .collection("cities")
          .aggregate(field("population").average().as("averagePopulation"))
          .execute();
        // [END avg_function]
        console.log(result);
    }

    async function minFunction() {
        // [START min_function]
        const result = await db.pipeline()
          .collection("books")
          .aggregate(field("price").minimum().as("minimumPrice"))
          .execute();
        // [END min_function]
        console.log(result);
    }

    async function maxFunction() {
        // [START max_function]
        const result = await db.pipeline()
          .collection("books")
          .aggregate(field("price").maximum().as("maximumPrice"))
          .execute();
        // [END max_function]
        console.log(result);
    }

    async function addFunction() {
        // [START add_function]
        const result = await db.pipeline()
          .collection("books")
          .select(field("soldBooks").add(field("unsoldBooks")).as("totalBooks"))
          .execute();
        // [END add_function]
        console.log(result);
    }

    async function subtractFunction() {
        // [START subtract_function]
        const storeCredit = 7;
        const result = await db.pipeline()
          .collection("books")
          .select(field("price").subtract(constant(storeCredit)).as("totalCost"))
          .execute();
        // [END subtract_function]
        console.log(result);
    }

    async function multiplyFunction() {
        // [START multiply_function]
        const result = await db.pipeline()
          .collection("books")
          .select(field("price").multiply(field("soldBooks")).as("revenue"))
          .execute();
        // [END multiply_function]
        console.log(result);
    }

    async function divideFunction() {
        // [START divide_function]
        const result = await db.pipeline()
          .collection("books")
          .select(field("ratings").divide(field("soldBooks")).as("reviewRate"))
          .execute();
        // [END divide_function]
        console.log(result);
    }

    async function modFunction() {
        // [START mod_function]
        const displayCapacity = 1000;
        const result = await db.pipeline()
          .collection("books")
          .select(field("unsoldBooks").mod(constant(displayCapacity)).as("warehousedBooks"))
          .execute();
        // [END mod_function]
        console.log(result);
    }

    async function ceilFunction() {
        // [START ceil_function]
        const booksPerShelf = 100;
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("unsoldBooks").divide(constant(booksPerShelf)).ceil().as("requiredShelves")
          )
          .execute();
        // [END ceil_function]
        console.log(result);
    }

    async function floorFunction() {
        // [START floor_function]
        const result = await db.pipeline()
          .collection("books")
          .addFields(
            field("wordCount").divide(field("pages")).floor().as("wordsPerPage")
          )
          .execute();
        // [END floor_function]
        console.log(result);
    }

    async function roundFunction() {
        // [START round_function]
        const result = await db.pipeline()
          .collection("books")
          .select(field("soldBooks").multiply(field("price")).round().as("partialRevenue"))
          .aggregate(field("partialRevenue").sum().as("totalRevenue"))
          .execute();
        // [END round_function]
        console.log(result);
    }

    async function powFunction() {
      // [START pow_function]
      const googleplex = { latitude: 37.4221, longitude: 122.0853 };
      const result = await db.pipeline()
        .collection("cities")
        .addFields(
          field("lat").subtract(constant(googleplex.latitude))
            .multiply(111 /* km per degree */)
            .pow(2)
            .as("latitudeDifference"),
          field("lng").subtract(constant(googleplex.longitude))
            .multiply(111 /* km per degree */)
            .pow(2)
            .as("longitudeDifference")
        )
        .select(
          field("latitudeDifference").add(field("longitudeDifference")).sqrt()
            // Inaccurate for large distances or close to poles
            .as("approximateDistanceToGoogle")
        )
        .execute();
      // [END pow_function]
      console.log(result);
    }

    async function sqrtFunction() {
      // [START sqrt_function]
      const googleplex = { latitude: 37.4221, longitude: 122.0853 };
      const result = await db.pipeline()
        .collection("cities")
        .addFields(
          field("lat").subtract(constant(googleplex.latitude))
            .multiply(111 /* km per degree */)
            .pow(2)
            .as("latitudeDifference"),
          field("lng").subtract(constant(googleplex.longitude))
            .multiply(111 /* km per degree */)
            .pow(2)
            .as("longitudeDifference")
        )
        .select(
          field("latitudeDifference").add(field("longitudeDifference")).sqrt()
            // Inaccurate for large distances or close to poles
            .as("approximateDistanceToGoogle")
        )
        .execute();
      // [END sqrt_function]
      console.log(result);
    }

    async function expFunction() {
        // [START exp_function]
        const result = await db.pipeline()
          .collection("books")
          .select(field("rating").exp().as("expRating"))
          .execute();
        // [END exp_function]
        console.log(result);
    }

    async function lnFunction() {
        // [START ln_function]
        const result = await db.pipeline()
          .collection("books")
          .select(field("rating").ln().as("lnRating"))
          .execute();
        // [END ln_function]
        console.log(result);
    }

    async function logFunction() {
        // [START log_function]
        // Not supported on JS
        // [END log_function]
    }

    async function arrayConcat() {
        // [START array_concat]
        const result = await db.pipeline()
          .collection("books")
          .select(field("genre").arrayConcat([field("subGenre")]).as("allGenres"))
          .execute();
        // [END array_concat]
        console.log(result);
    }

    async function arrayContains() {
        // [START array_contains]
        const result = await db.pipeline()
          .collection("books")
          .select(field("genre").arrayContains(constant("mystery")).as("isMystery"))
          .execute();
        // [END array_contains]
        console.log(result);
    }

    async function arrayContainsAll() {
        // [START array_contains_all]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("genre")
              .arrayContainsAll([constant("fantasy"), constant("adventure")])
              .as("isFantasyAdventure")
          )
          .execute();
        // [END array_contains_all]
        console.log(result);
    }

    async function arrayContainsAny() {
        // [START array_contains_any]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("genre")
              .arrayContainsAny([constant("fantasy"), constant("nonfiction")])
              .as("isMysteryOrFantasy")
          )
          .execute();
        // [END array_contains_any]
        console.log(result);
    }

    async function arrayLength() {
        // [START array_length]
        const result = await db.pipeline()
          .collection("books")
          .select(field("genre").arrayLength().as("genreCount"))
          .execute();
        // [END array_length]
        console.log(result);
    }

    async function arrayReverseSnippet() {
        // [START array_reverse]
        const result = await db.pipeline()
          .collection("books")
          .select(arrayReverse(field("genre")).as("reversedGenres"))
          .execute();
        // [END array_reverse]
        console.log(result);
    }

    async function equalFunction() {
        // [START equal_function]
        const result = await db.pipeline()
          .collection("books")
          .select(field("rating").equal(5).as("hasPerfectRating"))
          .execute();
        // [END equal_function]
        console.log(result);
    }

    async function greaterThanFunction() {
        // [START greater_than]
        const result = await db.pipeline()
          .collection("books")
          .select(field("rating").greaterThan(4).as("hasHighRating"))
          .execute();
        // [END greater_than]
        console.log(result);
    }

    async function greaterThanOrEqualToFunction() {
        // [START greater_or_equal]
        const result = await db.pipeline()
          .collection("books")
          .select(field("published").greaterThanOrEqual(1900).as("publishedIn20thCentury"))
          .execute();
        // [END greater_or_equal]
        console.log(result);
    }

    async function lessThanFunction() {
        // [START less_than]
        const result = await db.pipeline()
          .collection("books")
          .select(field("published").lessThan(1923).as("isPublicDomainProbably"))
          .execute();
        // [END less_than]
        console.log(result);
    }

    async function lessThanOrEqualToFunction() {
        // [START less_or_equal]
        const result = await db.pipeline()
          .collection("books")
          .select(field("rating").lessThanOrEqual(2).as("hasBadRating"))
          .execute();
        // [END less_or_equal]
        console.log(result);
    }

    async function notEqualFunction() {
        // [START not_equal]
        const result = await db.pipeline()
          .collection("books")
          .select(field("title").notEqual("1984").as("not1984"))
          .execute();
        // [END not_equal]
        console.log(result);
    }

    async function existsFunction() {
        // [START exists_function]
        const result = await db.pipeline()
          .collection("books")
          .select(field("rating").exists().as("hasRating"))
          .execute();
        // [END exists_function]
        console.log(result);
    }

    async function andFunction() {
        // [START and_function]
        const result = await db.pipeline()
          .collection("books")
          .select(
            and(field("rating").greaterThan(4), field("price").lessThan(10))
              .as("under10Recommendation")
          )
          .execute();
        // [END and_function]
        console.log(result);
    }

    async function orFunction() {
        // [START or_function]
        const result = await db.pipeline()
          .collection("books")
          .select(
            or(field("genre").equal("Fantasy"), field("tags").arrayContains("adventure"))
              .as("matchesSearchFilters")
          )
          .execute();
        // [END or_function]
        console.log(result);
    }

    async function xorFunction() {
        // [START xor_function]
        const result = await db.pipeline()
          .collection("books")
          .select(
            xor(field("tags").arrayContains("magic"), field("tags").arrayContains("nonfiction"))
              .as("matchesSearchFilters")
          )
          .execute();
        // [END xor_function]
        console.log(result);
    }

    async function notFunction() {
        // [START not_function]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("tags").arrayContains("nonfiction").not()
              .as("isFiction")
          )
          .execute();
        // [END not_function]
        console.log(result);
    }

    async function condFunction() {
        // [START cond_function]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("tags").arrayConcat([
              conditional(
                field("pages").greaterThan(100),
                constant("longRead"),
                constant("shortRead")
              )
            ]).as("extendedTags")
          )
          .execute();
        // [END cond_function]
        console.log(result);
    }

    async function equalAnyFunction() {
        // [START eq_any]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("genre").equalAny(["Science Fiction", "Psychological Thriller"])
              .as("matchesGenreFilters")
          )
          .execute();
        // [END eq_any]
        console.log(result);
    }

    async function notEqualAnyFunction() {
        // [START not_eq_any]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("author").notEqualAny(["George Orwell", "F. Scott Fitzgerald"])
              .as("byExcludedAuthors")
          )
          .execute();
        // [END not_eq_any]
        console.log(result);
    }

    async function maxLogicalFunction() {
        // [START max_logical_function]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("rating").logicalMaximum(1).as("flooredRating")
          )
          .execute();
        // [END max_logical_function]
        console.log(result);
    }

    async function minLogicalFunction() {
        // [START min_logical_function]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("rating").logicalMinimum(5).as("cappedRating")
          )
          .execute();
        // [END min_logical_function]
        console.log(result);
    }

    async function mapGetFunction() {
        // [START map_get]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("awards").mapGet("pulitzer").as("hasPulitzerAward")
          )
          .execute();
        // [END map_get]
        console.log(result);
    }

    async function byteLengthFunction() {
        // [START byte_length]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("title").byteLength().as("titleByteLength")
          )
          .execute();
        // [END byte_length]
        console.log(result);
    }

    async function charLengthFunction() {
        // [START char_length]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("title").charLength().as("titleCharLength")
          )
          .execute();
        // [END char_length]
        console.log(result);
    }

    async function startsWithFunction() {
        // [START starts_with]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("title").startsWith("The")
              .as("needsSpecialAlphabeticalSort")
          )
          .execute();
        // [END starts_with]
        console.log(result);
    }

    async function endsWithFunction() {
        // [START ends_with]
        const result = await db.pipeline()
          .collection("inventory/devices/laptops")
          .select(
            field("name").endsWith("16 inch")
              .as("16InLaptops")
          )
          .execute();
        // [END ends_with]
        console.log(result);
    }

    async function likeFunction() {
        // [START like]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("genre").like("%Fiction")
              .as("anyFiction")
          )
          .execute();
        // [END like]
        console.log(result);
    }

    async function regexContainsFunction() {
        // [START regex_contains]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("title").regexContains("Firestore (Enterprise|Standard)")
              .as("isFirestoreRelated")
          )
          .execute();
        // [END regex_contains]
        console.log(result);
    }

    async function regexMatchFunction() {
        // [START regex_match]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("title").regexMatch("Firestore (Enterprise|Standard)")
              .as("isFirestoreExactly")
          )
          .execute();
        // [END regex_match]
        console.log(result);
    }

    async function strConcatFunction() {
        // [START str_concat]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("title").stringConcat(" by ", field("author"))
              .as("fullyQualifiedTitle")
          )
          .execute();
        // [END str_concat]
        console.log(result);
    }

    async function strContainsFunction() {
        // [START string_contains]
        const result = await db.pipeline()
          .collection("articles")
          .select(
            field("body").stringContains("Firestore")
              .as("isFirestoreRelated")
          )
          .execute();
        // [END string_contains]
        console.log(result);
    }

    async function toUpperFunction() {
        // [START to_upper]
        const result = await db.pipeline()
          .collection("authors")
          .select(
            field("name").toUpper()
              .as("uppercaseName")
          )
          .execute();
        // [END to_upper]
        console.log(result);
    }

    async function toLowerFunction() {
        // [START to_lower]
        const result = await db.pipeline()
          .collection("authors")
          .select(
            field("genre").toLower().equal("fantasy")
              .as("isFantasy")
          )
          .execute();
        // [END to_lower]
    }

    async function substrFunction() {
        // [START substr_function]
        const result = await db.pipeline()
          .collection("books")
          .where(field("title").startsWith("The "))
          .select(
            field("title").substring(4)
              .as("titleWithoutLeadingThe")
          )
          .execute();
        // [END substr_function]
        console.log(result);
    }

    async function strReverseFunction() {
        // [START str_reverse]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("name").reverse().as("reversedName")
          )
          .execute();
        // [END str_reverse]
        console.log(result);
    }

    async function strTrimFunction() {
        // [START trim_function]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("name").trim().as("whitespaceTrimmedName")
          )
          .execute();
        // [END trim_function]
        console.log(result);
    }

    async function strReplaceFunction() {
        // not yet supported until GA
    }

    async function strSplitFunction() {
        // not yet supported until GA
    }

    async function unixMicrosToTimestampFunction() {
        // [START unix_micros_timestamp]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("createdAtMicros").unixMicrosToTimestamp().as("createdAtString")
          )
          .execute();
        // [END unix_micros_timestamp]
        console.log(result);
    }

    async function unixMillisToTimestampFunction() {
        // [START unix_millis_timestamp]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("createdAtMillis").unixMillisToTimestamp().as("createdAtString")
          )
          .execute();
        // [END unix_millis_timestamp]
        console.log(result);
    }

    async function unixSecondsToTimestampFunction() {
        // [START unix_seconds_timestamp]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("createdAtSeconds").unixSecondsToTimestamp().as("createdAtString")
          )
          .execute();
        // [END unix_seconds_timestamp]
        console.log(result);
    }

    async function timestampAddFunction() {
        // [START timestamp_add]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("createdAt").timestampAdd("day", 3653).as("expiresAt")
          )
          .execute();
        // [END timestamp_add]
        console.log(result);
    }

    async function timestampSubFunction() {
        // [START timestamp_sub]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("expiresAt").timestampSubtract("day", 14).as("sendWarningTimestamp")
          )
          .execute();
        // [END timestamp_sub]
        console.log(result);
    }

    async function timestampToUnixMicrosFunction() {
        // [START timestamp_unix_micros]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("dateString").timestampToUnixMicros().as("unixMicros")
          )
          .execute();
        // [END timestamp_unix_micros]
        console.log(result);
    }

    async function timestampToUnixMillisFunction() {
        // [START timestamp_unix_millis]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("dateString").timestampToUnixMillis().as("unixMillis")
          )
          .execute();
        // [END timestamp_unix_millis]
        console.log(result);
    }

    async function timestampToUnixSecondsFunction() {
        // [START timestamp_unix_seconds]
        const result = await db.pipeline()
          .collection("documents")
          .select(
            field("dateString").timestampToUnixSeconds().as("unixSeconds")
          )
          .execute();
        // [END timestamp_unix_seconds]
        console.log(result);
    }

    async function cosineDistanceFunction() {
        // [START cosine_distance]
        const sampleVector = [0.0, 1, 2, 3, 4, 5];
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("embedding").cosineDistance(sampleVector).as("cosineDistance")
          )
          .execute();
        // [END cosine_distance]
        console.log(result);
    }

    async function dotProductFunction() {
        // [START dot_product]
        const sampleVector = [0.0, 1, 2, 3, 4, 5];
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("embedding").dotProduct(sampleVector).as("dotProduct")
          )
          .execute();
        // [END dot_product]
        console.log(result);
    }

    async function euclideanDistanceFunction() {
        // [START euclidean_distance]
        const sampleVector = [0.0, 1, 2, 3, 4, 5];
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("embedding").euclideanDistance(sampleVector).as("euclideanDistance")
          )
          .execute();
        // [END euclidean_distance]
        console.log(result);
    }

    async function vectorLengthFunction() {
        // [START vector_length]
        const result = await db.pipeline()
          .collection("books")
          .select(
            field("embedding").vectorLength().as("vectorLength")
          )
          .execute();
        // [END vector_length]
        console.log(result);
    }
});
