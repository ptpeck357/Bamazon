# Node.js-MySQL

## Description
This program is an Amazon-like storefront using MySQL and node. The app will take in orders from customers. This app has 3 different functionalities: Customer, Manager and
Executive.

* ##Functionality

From the CLI.file, there are three options given to you to view the store: Customer, Manager and
Executive.

* ##### Customer

In the customer portion of the app, users are presented with a list of items that they can purchase. After being prompted for the ID of the item they want and the quantity, they are given the order total and the appropriate amount is subtracted from the database. The sale amount is also added to it's respective department's total sales.

* ##### Manager

In the manager app the user is presented with 4 options:

* View Products for Sale
Displays a list of all products for sale.

* View Low Inventory
Displays a list of products with 5 or less items left in inventory.

* Add to Inventory
Allows the user to add more inventory to an already existing item.

* Add New Product
Allows the user to add a completely new product to the database.

* ##### Executive

In the executive app the user is presented with 2 options:

* View Product Sales by Department
Allows the user to slect a department by ID and displays all relevant information about that department's sales.

* Create New Department
Allows the user to add a new department to the database after inputting all required information.

## Technologies Used:

* JavaScript
* Node.js
* MYSQL
* NPM(Node Packages Manager)
	* mysql
	* inquirer
	* easy-table
	* chalk

