//Customer View of Bamazon

var Customer = function(){
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
	connect.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
		return;
		}
		//Shows the customer all the products with their info
		var query = connect.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
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
		    //Excutes next function
		    whatItem();
		});
	});


	function whatItem(){
		// Asks the customer what item ID they want to buy
		inquirer.prompt([
			{
				type: 'input',
				name: 'id',
				message: "What is the product ID of the product you are looking to buy?",
				validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }
		    },
		    {
				type: 'input',
				name: 'unit',
				message: "How many units do you want to buy?",
				validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }
		    }
		]).then(result => {

				//Calcuates the order that the customer bought
				calculatesOrder(result.id, result.unit);
			});
	};


	//Determines if the product is still in stock. If it is, calculates price.
	function calculatesOrder(productID, unit){
		var query = connect.query("SELECT * FROM products WHERE item_id =?", [productID], function(err, res) {
		    if(err) throw err;
		    if(res[0].stock_quantity === 0){
		    	console.log(chalk.red("\nSorry, this product is currently not in stock. Please look for a different item.\n"));
				whatItem();
		    } 
		    //Validating that the store has enough in stock for the customer
		    else if((res[0].stock_quantity - parseInt(unit)) < 0){
		    	console.log(chalk.red("Sorry, we do not currently have that amount in stock that you asked for. Please enter a different amount."));
		    	whatItem();
		    } else {
		    	console.log(chalk.green("\nYour price is $" + parseInt(unit) * res[0].price));

		    	var newUnit = res[0].stock_quantity - parseInt(unit);

		    	var revenue = res[0].product_sales + (parseInt(unit) * res[0].price);

		    	//Function that adds the customer's money to the product_sales column
		    	addRevenue(productID, newUnit, revenue);
		    };
		});
	};
	//Adds the customer's money to the table
	function addRevenue(productID, newUnit, revenue){
		var query = connect.query(
	        "UPDATE products SET ? WHERE ?",
	        [
	            {
	                product_sales: revenue
	            },
	            {
	                item_id: productID
	            }
	        ],
	        function(err, res) {
		    if(err) throw err;
		    	//Function that subtracts the number of units that the customer bought
			    updateTable(productID, newUnit);
		    });
	};

	//Updates the quantity of the current product in the table
	function updateTable(productID, newUnit){
			var query = connect.query(
	        "UPDATE products SET ? WHERE ?",
	        [
	            {
	                stock_quantity: newUnit
	            },
	            {
	                item_id: productID
	            }
	        ],
			function(err, res) {
		    if(err) throw err;
		    	console.log(chalk.cyanBright("\nStore updated!"));
		    	//Asks the customer if they want to continue shopping
		    	inquirer.prompt([
			    	{
			    		type: 'confirm',
			    		name: 'continue',
			    		message: 'Do you want to continue shopping?'
			    	}
		    	]).then(result =>{
		    		if(result.continue){
		    			whatItem();
		    		} else {
		    			console.log(chalk.green("\nThanks for shopping with us!"));
		    			connect.end();
		    		};
		    	})
		    });
	};
};

module.exports = Customer;
