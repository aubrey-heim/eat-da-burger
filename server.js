var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("mysql");
require("dotenv").config();

var app = express();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "burgers_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

app.get("/", function(req, res) {
  connection.query("SELECT * FROM toeat", function(err, data) {
    if (err) {
      return res.status(500).end();
    }
    let toEatData = data

    connection.query("SELECT * FROM eaten", function(err, data) {
      if (err) {
        return res.status(500).end();
      }
      let eatenData = data
      res.render("index", { toEat: toEatData, eaten: eatenData });
    });
  });
});

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
