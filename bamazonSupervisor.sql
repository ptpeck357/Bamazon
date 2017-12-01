DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

Drop TABLE IF EXISTS departments;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs INT NULL,
  PRIMARY KEY(department_id)
  );

SELECT * FROM departments