const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "burgers_db"
  });
}


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

app.post("/api/burgers", function(req, res) {
  connection.query("INSERT INTO toEat (burger) VALUES (?)", [req.body.burger], function(err, result) {
    if (err) {
      return res.status(500).end();
    }

    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  });
});

app.put("/api/burgers/:id", function(req, res) {
  let chosenId = req.params.id
  connection.query("SELECT burger FROM toEat WHERE id = ?", [chosenId], function(err, result) {
    if (err) {
      return res.status(500).end();
    }
    let eatenBurger = result[0].burger
    connection.query("INSERT INTO eaten (burger) VALUES (?)", [eatenBurger], function(err, result) {
      if (err) {
        return res.status(500).end();
      }
      connection.query("DELETE FROM toEat WHERE id = ?", [chosenId], function(err, result) {
        if (err) {
          return res.status(500).end();
        }
        console.log(`Burger #${chosenId} devoured.`);
        res.status(200).end();  
      });
    });
  });
});

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
