# Bamazon

## Description
Bamazon is an Amazon-like storefront using MySQL and Node.js. This app has 3 different functionalities that are described below: Customer, Manager and Executive. Link to demo is down below.

## Functionality

Running "CLI.file" in node, three options given to the user what position the user is viewing the store: Customer, Manager and
Executive.

<h4>Customer</h4>

In the customer portion, users are presented with a list of items that they can purchase. After being prompted for the #Id and the quantity of the product, they are given the order total and the appropriate amount is subtracted from the database. The sale amount is then added to total sales for the executive to view.

<h4>Manager</h4>

In the manager portion, the user is presented with 4 options:

* View Products for Sale
Displays a list of all products for sale.

* View Low Inventory
Displays a list of products with 5 or less items left in inventory.

* Add to Inventory
Allows the user to add more inventory to an already existing item.

* Add New Product
Allows the user to add a completely new product to the database.

* Delete a Product
Allows the user delete an existing product by product #Id

<h4>Executive</h4>

In the executive portion, the user is presented with 2 options:

* View Product Sales by Department
Allows the user to select a department by ID and displays all relevant information about that department's sales.

* Create New Department
Allows the user to add a new department to the database after inputting all required information.

* Delete an Existing Department
Allows the user to delete an existing department.

## Technologies Used:

* JavaScript
* Node.js
* mySQL
* NPM(Node Packages Manager)
	* mysql
	* inquirer
	* easy-table
	* chalk

#### Youtube link for demo: 
[![Image not available](http://img.youtube.com/vi/UGl5-oeRuxg/0.jpg)](https://www.youtube.com/watch?v=9GyWeRElDPk&feature=youtu.be)


