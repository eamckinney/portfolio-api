const express = require("express");

// logbookRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const logbookRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
logbookRoutes.route("/logbook").get(function (req, res) {
  let db_connect = dbo.getDb("portfolio");
  db_connect
    .collection("logbook")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single record by id
logbookRoutes.route("/logbook/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("logbook")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new record.
logbookRoutes.route("/logbook/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    id: req.body.id,
    day: req.body.day,
    title: req.body.title,
    date: req.body.date,
    tools: req.body.tools,
    url: req.body.url,
    learned: req.body.learned,
    resources: req.body.resources,
  };
  db_connect.collection("logbook").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
logbookRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      id: req.body.id,
      day: req.body.day,
      title: req.body.title,
      date: req.body.date,
      tools: req.body.tools,
      url: req.body.url,
      learned: req.body.learned,
      resources: req.body.resources,
    },
  };
  db_connect
    .collection("logbook")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a record
logbookRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("logbook").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = logbookRoutes;