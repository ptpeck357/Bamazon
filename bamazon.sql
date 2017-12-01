DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

ALTER TABLE products
ADD COLUMN  product_sales INT NULL;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY(item_id)
  );

USE bamazon;
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs INT NULL,
  PRIMARY KEY(department_id)
  );
  
SELECT * FROM products;


