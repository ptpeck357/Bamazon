


var Table = require('easy-table')
	this.mysql = require('mysql');
	var inquirer = require('inquirer');
	const chalk = require('chalk');
	this.MYSQLPW = process.env.MYSQL_PW;

	var connect = this.mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: this.MYSQLPW,
		database: 'bamazon'
	});
	 
function menuSection(){
	inquirer.prompt({
		name: "action",
		type: "rawlist",
		message: "What would you like to do?",
		choices: 
			[
				"View Product Sales by Department",
				"Create New Department"
			]

	}).then(function(answer) {
	      switch (answer.action) {
	        case "View Product Sales by Department":
			viewProducts();
			break;

			case "Create New Department":
			multiSearch();
			break;
	      }
    });
}



function viewProducts(){

	connect.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
		return;
		}

		//Shows the customer all the products with their info
		var query = connect.query("SELECT * FROM departments", function(err, res) {
		    if(err) throw err;
		    console.log("\n")
		    var t = new Table;
		    res.forEach(function(product) {

				  t.cell('Product Id', product.item_id);
				  t.cell('Name', product.product_name);
				  t.cell('Category', product.department_name);
				  t.cell('Price (USD)', product.price, Table.number(2));
				  t.cell('Quantity', product.stock_quantity);
				  t.newRow();

			});

		    console.log(t.toString());

		   
		});
	});
};

SELECT column_name(s)
FROM table_name
WHERE condition
GROUP BY column_name(s)
ORDER BY column_name(s);


	