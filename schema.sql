DROP DATABASE IF EXISTS burgers_db;

CREATE DATABASE burgers_db;

USE burgers_db;

CREATE TABLE toEat (
  id int NOT NULL AUTO_INCREMENT,
  burger varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Eaten (
  id int NOT NULL AUTO_INCREMENT,
  burger varchar(255) NOT NULL,
  PRIMARY KEY (id)
);