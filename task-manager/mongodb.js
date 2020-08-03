//CRUD create read update and delete

const { MongoClient, ObjectID } = require("mongodb");

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionUrl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }

    const db = client.db(databaseName);

    db.collection("users").findOne(
      { _id: ObjectID("5f27bf05abe15de039bf2485") },
      (error, result) => {
        if (error) {
          return console.log("Unable to fetch data from db");
        }

        console.log(result);
      }
    );

    // db.collection("users").findOne({ name: "Jessica" }, (error, result) => {
    //   if (error) {
    //     return console.log("Unable to fetch data from db");
    //   }

    //   console.log(result);
    // });
    // db.collection("users").insertOne(
    //   {
    //     _id: id,
    //     name: "Jessica",
    //     age: 47,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert user");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "Harvey",
    //       age: 43,
    //     },
    //     {
    //       name: "Mike",
    //       age: 25,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert user");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    //Challenge
    // db.collection("tasks").insertMany(
    //   [
    //     {
    //       description: "Learn ReactJS",
    //       completed: true,
    //     },
    //     {
    //       description: "Learn NodeJS",
    //       completed: false,
    //     },
    //     {
    //       description: "Learn Flutter",
    //       completed: false,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert task");
    //     }
    //     console.log(result.ops);
    //   }
    // );
  }
);
