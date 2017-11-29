DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY(item_id)
  );

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("400", "The Hobbit", "Books", "15", "0");

SELECT * FROM products;