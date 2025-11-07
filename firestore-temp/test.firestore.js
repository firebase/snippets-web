// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

const { expect } = require('chai');

describe("firestore-pipelines", () => {
    const {
        Firestore
    } = require("@google-cloud/firestore")
    const {
        Pipeline,
        field,
        constant,
        countAll,
        AggregateFunction,
        and,
        or,
        xor,
        conditional
    } = require("@google-cloud/firestore/pipelines");

    let app;
    /** @type {Firestore} */ let db;

    before(() => {
      db = new Firestore({
        projectId: 'your-project-id',
        databaseId: 'your-new-enterprise-database'
      });
    });

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
        projectId: 'your-project-id',
        databaseId: 'your-new-enterprise-database'
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
          doc(db, "cities", "SF"),
          doc(db, "cities", "DC"),
          doc(db, "cities", "NY")
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
        const results = await execute(db.pipeline()
          .collection("books")
          .distinct(
            field("author").toUpper().as("author"),
            field("genre")
          )
        );
        // [END aggregate_distinct]
        console.log(results);
    }

    async function sort() {
        // [START sort]
        const results = await execute(db.pipeline()
          .collection("books")
          .sort(
            field("release_date").descending(), field("author").ascending()
          )
        );
        // [END sort]
        console.log(results);
    }

    function sortComparison() {
        // [START sort_comparison]
        const q = query(collection(db, "cities"),
          orderBy("state"),
          orderBy("population", "desc"));

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
        results = await execute(db.pipeline().collection("books")
          .select(field("current").logicalMinimum(field("updated")).as("price_min"))
        );

        // Type 2: Aggregation (for use in aggregate stages)
        // Example: Return the min price of all books.
        results = await execute(db.pipeline().collection("books")
          .aggregate(field("price").minimum().as("min_price"))
        );
        // [END functions_example]
        console.log(results);
    }

    async function creatingIndexes() {
        // [START query_example]
        const results = await execute(db.pipeline()
          .collection("books")
          .where(field("published").lessThan(1900))
          .where(field("genre").equal("Science Fiction"))
          .where(field("rating").greaterThan(4.3))
          .sort(field("published").descending())
        );
        // [END query_example]
        console.log(results);
    }

    async function sparseIndexes() {
        // [START sparse_index_example]
        const results = await execute(db.pipeline()
          .collection("books")
          .where(field("category").like("%fantasy%"))
        );
        // [END sparse_index_example]
        console.log(results);
    }

    async function sparseIndexes2() {
        // [START sparse_index_example_2]
        const results = await execute(db.pipeline()
          .collection("books")
          .sort(field("release_date").ascending())
        );
        // [END sparse_index_example_2]
        console.log(results);
    }

    async function coveredQuery() {
        // [START covered_query]
        const results = await execute(db.pipeline()
          .collection("books")
          .where(field("category").like("%fantasy%"))
          .where(field("title").exists())
          .where(field("author").exists())
          .select(field("title"), field("author"))
        );
        // [END covered_query]
        console.log(results);
    }

    async function pagination() {
        // [START pagination_not_supported_preview]
        // Existing pagination via `startAt()`
        const q =
          query(collection(db, "cities"), orderBy("population"), startAt(1000000));

        // Private preview workaround using pipelines
        const pageSize = 2;
        const pipeline = db.pipeline()
          .collection("cities")
          .select("name", "population", "__name__")
          .sort(field("population").descending(), field("__name__").ascending());

        // Page 1 results
        let snapshot = await execute(pipeline.limit(pageSize));

        // End of page marker
        const lastDoc = snapshot.results[snapshot.results.length - 1];

        // Page 2 results
        snapshot = await execute(
          pipeline
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
        );
        // [END pagination_not_supported_preview]
        console.log(q);
        console.log(pipeline);
    }

    async function collectionStage() {
        // [START collection_example]
        const results = await execute(db.pipeline()
          .collection("users/bob/games")
          .sort(field("name").ascending())
          );
        // [END collection_example]
        console.log(results);
    }

    async function collectionGroupStage() {
        // [START collection_group_example]
        const results = await execute(db.pipeline()
          .collectionGroup("games")
          .sort(field("name").ascending())
          );
        // [END collection_group_example]
        console.log(results);
    }

    async function databaseStage() {
        // [START database_example]
        // Count all documents in the database
        const results = await execute(db.pipeline()
          .database()
          .aggregate(countAll().as("total"))
          );
        // [END database_example]
        console.log(results);
    }

    async function documentsStage() {
        // [START documents_example]
        const results = await execute(db.pipeline()
          .documents([
            doc(db, "cities", "SF"),
            doc(db, "cities", "DC"),
            doc(db, "cities", "NY")
          ])
        );
        // [END documents_example]
        console.log(results);
    }

    async function replaceWithStage() {
        // [START initial_data]
        await setDoc(doc(collection(db, "cities"), "SF"), {
          "name": "San Francisco",
          "population": 800000,
          "location": {
            "country": "USA",
            "state": "California"
          }
        });
        await setDoc(doc(collection(db, "cities"), "TO"), {
          "name": "Toronto",
          "population": 3000000,
          "province": "ON",
          "location": {
            "country": "Canada",
            "province": "Ontario"
          }
        });
        await setDoc(doc(collection(db, "cities"), "NY"), {
          "name": "New York",
          "location": {
            "country": "USA",
            "state": "New York"
          }
        });
        await setDoc(doc(collection(db, "cities"), "AT"), {
          "name": "Atlantis",
        });
        // [END initial_data]

        // [START full_replace]
        const names = await execute(db.pipeline()
          .collection("cities")
          .replaceWith(field("location"))
        );
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
        results = await execute(db.pipeline()
          .database()
          .sample(100)
        );

        // Randomly shuffle a list of 3 documents
        results = await execute(db.pipeline()
          .documents([
            doc(db, "cities", "SF"),
            doc(db, "cities", "NY"),
            doc(db, "cities", "DC"),
          ])
          .sample(3)
        );
        // [END sample_example]
        console.log(results);
    }

    async function samplePercent() {
        // [START sample_percent]
        // Get a sample of on average 50% of the documents in the database
        const results = await execute(db.pipeline()
          .database()
          .sample({ percentage: 0.5 })
        );
        // [END sample_percent]
        console.log(results);
    }

    async function unionStage() {
        // [START union_stage]
        const results = await execute(db.pipeline()
          .collection("cities/SF/restaurants")
          .where(field("type").equal("Chinese"))
          .union(db.pipeline()
            .collection("cities/NY/restaurants")
            .where(field("type").equal("Italian")))
          .where(field("rating").greaterThanOrEqual(4.5))
          .sort(field("__name__").descending())
        );
        // [END union_stage]
        console.log(results);
    }

    async function unnestStage() {
        // [START unnest_stage]
        const results = await execute(db.pipeline()
          .database()
          .unnest(field("arrayField").as("unnestedArrayField"), "index")
        );
        // [END unnest_stage]
        console.log(results);
    }

    async function unnestStageEmptyOrNonArray() {
        // [START unnest_edge_cases]
        // Input
        // { identifier : 1, neighbors: [ "Alice", "Cathy" ] }
        // { identifier : 2, neighbors: []                   }
        // { identifier : 3, neighbors: "Bob"                }

        const results = await execute(db.pipeline()
          .database()
          .unnest(field("neighbors").as("unnestedNeighbors"), "index" )
        );

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
        const countOfAll = await execute(db.pipeline()
          .collection("books")
          .aggregate(countAll().as("count"))
        );

        // Number of books with nonnull `ratings` field
        const countField = await execute(db.pipeline()
          .collection("books")
          .aggregate(field("ratings").count().as("count"))
        );
        // [END count_function]
        console.log(countOfAll);
        console.log(countField);
    }

    async function countIfFunction() {
        // [START count_if]
        const result = await execute(db.pipeline()
          .collection("books")
          .aggregate(
            field("rating").greaterThan(4).countIf().as("filteredCount")
          )
        );
        // [END count_if]
        console.log(result);
    }

    async function countDistinctFunction() {
        // [START count_distinct]
        const result = await execute(db.pipeline()
          .collection("books")
          .aggregate(field("author").countDistinct().as("unique_authors"))
        );
        // [END count_distinct]
        console.log(result);
    }

    async function sumFunction() {
        // [START sum_function]
        const result = await execute(db.pipeline()
          .collection("cities")
          .aggregate(field("population").sum().as("totalPopulation"))
        );
        // [END sum_function]
        console.log(result);
    }

    async function avgFunction() {
        // [START avg_function]
        const result = await execute(db.pipeline()
          .collection("cities")
          .aggregate(field("population").average().as("averagePopulation"))
        );
        // [END avg_function]
        console.log(result);
    }

    async function minFunction() {
        // [START min_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .aggregate(field("price").minimum().as("minimumPrice"))
        );
        // [END min_function]
        console.log(result);
    }

    async function maxFunction() {
        // [START max_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .aggregate(field("price").maximum().as("maximumPrice"))
        );
        // [END max_function]
        console.log(result);
    }

    async function addFunction() {
        // [START add_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("soldBooks").add(field("unsoldBooks")).as("totalBooks"))
        );
        // [END add_function]
        console.log(result);
    }

    async function subtractFunction() {
        // [START subtract_function]
        const storeCredit = 7;
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("price").subtract(constant(storeCredit)).as("totalCost"))
        );
        // [END subtract_function]
        console.log(result);
    }

    async function multiplyFunction() {
        // [START multiply_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("price").multiply(field("soldBooks")).as("revenue"))
        );
        // [END multiply_function]
        console.log(result);
    }

    async function divideFunction() {
        // [START divide_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("ratings").divide(field("soldBooks")).as("reviewRate"))
        );
        // [END divide_function]
        console.log(result);
    }

    async function modFunction() {
        // [START mod_function]
        const displayCapacity = 1000;
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("unsoldBooks").mod(constant(displayCapacity)).as("warehousedBooks"))
        );
        // [END mod_function]
        console.log(result);
    }

    async function ceilFunction() {
        // [START ceil_function]
        const booksPerShelf = 100;
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("unsoldBooks").divide(constant(booksPerShelf)).ceil().as("requiredShelves")
          )
        );
        // [END ceil_function]
        console.log(result);
    }

    async function floorFunction() {
        // [START floor_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .addFields(
            field("wordCount").divide(field("pages")).floor().as("wordsPerPage")
          )
        );
        // [END floor_function]
        console.log(result);
    }

    async function roundFunction() {
        // [START round_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("soldBooks").multiply(field("price")).round().as("partialRevenue"))
          .aggregate(field("partialRevenue").sum().as("totalRevenue"))
          );
        // [END round_function]
        console.log(result);
    }

    async function powFunction() {
        // [START pow_function]
        const googleplex = { latitude: 37.4221, longitude: 122.0853 };
        const result = await execute(db.pipeline()
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
        );
        // [END pow_function]
        console.log(result);
    }

    async function sqrtFunction() {
        // [START sqrt_function]
        const googleplex = { latitude: 37.4221, longitude: 122.0853 };
        const result = await execute(db.pipeline()
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
        );
        // [END sqrt_function]
        console.log(result);
    }

    async function expFunction() {
        // [START exp_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").exp().as("expRating"))
        );
        // [END exp_function]
        console.log(result);
    }

    async function lnFunction() {
        // [START ln_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").ln().as("lnRating"))
        );
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
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("genre").arrayConcat([field("subGenre")]).as("allGenres"))
        );
        // [END array_concat]
        console.log(result);
    }

    async function arrayContains() {
        // [START array_contains]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("genre").arrayContains(constant("mystery")).as("isMystery"))
        );
        // [END array_contains]
        console.log(result);
    }

    async function arrayContainsAll() {
        // [START array_contains_all]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("genre")
              .arrayContainsAll([constant("fantasy"), constant("adventure")])
              .as("isFantasyAdventure")
          )
        );
        // [END array_contains_all]
        console.log(result);
    }

    async function arrayContainsAny() {
        // [START array_contains_any]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("genre")
              .arrayContainsAny([constant("fantasy"), constant("nonfiction")])
              .as("isMysteryOrFantasy")
          )
        );
        // [END array_contains_any]
        console.log(result);
    }

    async function arrayLength() {
        // [START array_length]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("genre").arrayLength().as("genreCount"))
        );
        // [END array_length]
        console.log(result);
    }

    async function arrayReverse() {
        // [START array_reverse]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("genre").arrayReverse().as("reversedGenres"))
        );
        // [END array_reverse]
        console.log(result);
    }

    async function equalFunction() {
        // [START equal_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").equal(5).as("hasPerfectRating"))
        );
        // [END equal_function]
        console.log(result);
    }

    async function greaterThanFunction() {
        // [START greater_than]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").greaterThan(4).as("hasHighRating"))
        );
        // [END greater_than]
        console.log(result);
    }

    async function greaterThanOrEqualToFunction() {
        // [START greater_or_equal]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("published").greaterThanOrEqual(1900).as("publishedIn20thCentury"))
        );
        // [END greater_or_equal]
        console.log(result);
    }

    async function lessThanFunction() {
        // [START less_than]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("published").lessThan(1923).as("isPublicDomainProbably"))
        );
        // [END less_than]
        console.log(result);
    }

    async function lessThanOrEqualToFunction() {
        // [START less_or_equal]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").lessThanOrEqual(2).as("hasBadRating"))
        );
        // [END less_or_equal]
        console.log(result);
    }

    async function notEqualFunction() {
        // [START not_equal]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("title").notEqual("1984").as("not1984"))
        );
        // [END not_equal]
        console.log(result);
    }

    async function existsFunction() {
        // [START exists_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(field("rating").exists().as("hasRating"))
        );
        // [END exists_function]
        console.log(result);
    }

    async function andFunction() {
        // [START and_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            and(field("rating").greaterThan(4), field("price").lessThan(10))
              .as("under10Recommendation")
          )
        );
        // [END and_function]
        console.log(result);
    }

    async function orFunction() {
        // [START or_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            or(field("genre").equal("Fantasy"), field("tags").arrayContains("adventure"))
              .as("matchesSearchFilters")
          )
        );
        // [END or_function]
        console.log(result);
    }

    async function xorFunction() {
        // [START xor_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            xor(field("tags").arrayContains("magic"), field("tags").arrayContains("nonfiction"))
              .as("matchesSearchFilters")
          )
        );
        // [END xor_function]
        console.log(result);
    }

    async function notFunction() {
        // [START not_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("tags").arrayContains("nonfiction").not()
              .as("isFiction")
          )
        );
        // [END not_function]
        console.log(result);
    }

    async function condFunction() {
        // [START cond_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("tags").arrayConcat([
              field("pages").greaterThan(100)
                .conditional(constant("longRead"), constant("shortRead"))
            ]).as("extendedTags")
          )
        );
        // [END cond_function]
        console.log(result);
    }

    async function equalAnyFunction() {
        // [START eq_any]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("genre").equalAny(["Science Fiction", "Psychological Thriller"])
              .as("matchesGenreFilters")
          )
        );
        // [END eq_any]
        console.log(result);
    }

    async function notEqualAnyFunction() {
        // [START not_eq_any]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("author").notEqualAny(["George Orwell", "F. Scott Fitzgerald"])
              .as("byExcludedAuthors")
          )
        );
        // [END not_eq_any]
        console.log(result);
    }

    async function maxLogicalFunction() {
        // [START max_logical_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("rating").logicalMaximum(1).as("flooredRating")
          )
        );
        // [END max_logical_function]
        console.log(result);
    }

    async function minLogicalFunction() {
        // [START min_logical_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("rating").logicalMinimum(5).as("cappedRating")
          )
        );
        // [END min_logical_function]
        console.log(result);
    }

    async function mapGetFunction() {
        // [START map_get]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("awards").mapGet("pulitzer").as("hasPulitzerAward")
          )
        );
        // [END map_get]
        console.log(result);
    }

    async function byteLengthFunction() {
        // [START byte_length]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("title").byteLength().as("titleByteLength")
          )
        );
        // [END byte_length]
        console.log(result);
    }

    async function charLengthFunction() {
        // [START char_length]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("title").charLength().as("titleCharLength")
          )
        );
        // [END char_length]
        console.log(result);
    }

    async function startsWithFunction() {
        // [START starts_with]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("title").startsWith("The")
              .as("needsSpecialAlphabeticalSort")
          )
        );
        // [END starts_with]
        console.log(result);
    }

    async function endsWithFunction() {
        // [START ends_with]
        const result = await execute(db.pipeline()
          .collection("inventory/devices/laptops")
          .select(
            field("name").endsWith("16 inch")
              .as("16InLaptops")
          )
        );
        // [END ends_with]
        console.log(result);
    }

    async function likeFunction() {
        // [START like]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("genre").like("%Fiction")
              .as("anyFiction")
          )
        );
        // [END like]
        console.log(result);
    }

    async function regexContainsFunction() {
        // [START regex_contains]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("title").regexContains("Firestore (Enterprise|Standard)")
              .as("isFirestoreRelated")
          )
        );
        // [END regex_contains]
        console.log(result);
    }

    async function regexMatchFunction() {
        // [START regex_match]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("title").regexMatch("Firestore (Enterprise|Standard)")
              .as("isFirestoreExactly")
          )
        );
        // [END regex_match]
        console.log(result);
    }

    async function strConcatFunction() {
        // [START str_concat]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("title").stringConcat(" by ", field("author"))
              .as("fullyQualifiedTitle")
          )
        );
        // [END str_concat]
        console.log(result);
    }

    async function strContainsFunction() {
        // [START string_contains]
        const result = await execute(db.pipeline()
          .collection("articles")
          .select(
            field("body").stringContains("Firestore")
              .as("isFirestoreRelated")
          )
        );
        // [END string_contains]
        console.log(result);
    }

    async function toUpperFunction() {
        // [START to_upper]
        const result = await execute(db.pipeline()
          .collection("authors")
          .select(
            field("name").toUpper()
              .as("uppercaseName")
          )
        );
        // [END to_upper]
        console.log(result);
    }

    async function toLowerFunction() {
        // [START to_lower]
        const result = await execute(db.pipeline()
          .collection("authors")
          .select(
            field("genre").toLower().equal("fantasy")
              .as("isFantasy")
          )
        );
        // [END to_lower]
    }

    async function substrFunction() {
        // [START substr_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .where(field("title").startsWith("The "))
          .select(
            field("title").substring(4)
              .as("titleWithoutLeadingThe")
          )
        );
        // [END substr_function]
        console.log(result);
    }

    async function strReverseFunction() {
        // [START str_reverse]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("name").reverse().as("reversedName")
          )
        );
        // [END str_reverse]
        console.log(result);
    }

    async function strTrimFunction() {
        // [START trim_function]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("name").trim().as("whitespaceTrimmedName")
          )
        );
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
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("createdAtMicros").unixMicrosToTimestamp().as("createdAtString")
          )
        );
        // [END unix_micros_timestamp]
        console.log(result);
    }

    async function unixMillisToTimestampFunction() {
        // [START unix_millis_timestamp]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("createdAtMillis").unixMillisToTimestamp().as("createdAtString")
          )
        );
        // [END unix_millis_timestamp]
        console.log(result);
    }

    async function unixSecondsToTimestampFunction() {
        // [START unix_seconds_timestamp]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("createdAtSeconds").unixSecondsToTimestamp().as("createdAtString")
          )
        );
        // [END unix_seconds_timestamp]
        console.log(result);
    }

    async function timestampAddFunction() {
        // [START timestamp_add]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("createdAt").timestampAdd("day", 3653).as("expiresAt")
          )
        );
        // [END timestamp_add]
        console.log(result);
    }

    async function timestampSubFunction() {
        // [START timestamp_sub]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("expiresAt").timestampSubtract("day", 14).as("sendWarningTimestamp")
          )
        );
        // [END timestamp_sub]
        console.log(result);
    }

    async function timestampToUnixMicrosFunction() {
        // [START timestamp_unix_micros]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("dateString").timestampToUnixMicros().as("unixMicros")
          )
        );
        // [END timestamp_unix_micros]
        console.log(result);
    }

    async function timestampToUnixMillisFunction() {
        // [START timestamp_unix_millis]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("dateString").timestampToUnixMillis().as("unixMillis")
          )
        );
        // [END timestamp_unix_millis]
        console.log(result);
    }

    async function timestampToUnixSecondsFunction() {
        // [START timestamp_unix_seconds]
        const result = await execute(db.pipeline()
          .collection("documents")
          .select(
            field("dateString").timestampToUnixSeconds().as("unixSeconds")
          )
        );
        // [END timestamp_unix_seconds]
        console.log(result);
    }

    async function cosineDistanceFunction() {
        // [START cosine_distance]
        const sampleVector = [0.0, 1, 2, 3, 4, 5];
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("embedding").cosineDistance(sampleVector).as("cosineDistance")
          )
        );
        // [END cosine_distance]
        console.log(result);
    }

    async function dotProductFunction() {
        // [START dot_product]
        const sampleVector = [0.0, 1, 2, 3, 4, 5];
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("embedding").dotProduct(sampleVector).as("dotProduct")
          )
        );
        // [END dot_product]
        console.log(result);
    }

    async function euclideanDistanceFunction() {
        // [START euclidean_distance]
        const sampleVector = [0.0, 1, 2, 3, 4, 5];
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("embedding").euclideanDistance(sampleVector).as("euclideanDistance")
          )
        );
        // [END euclidean_distance]
        console.log(result);
    }

    async function vectorLengthFunction() {
        // [START vector_length]
        const result = await execute(db.pipeline()
          .collection("books")
          .select(
            field("embedding").vectorLength().as("vectorLength")
          )
        );
        // [END vector_length]
        console.log(result);
    }
});
