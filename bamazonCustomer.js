//Customer View of Bamazon

var Customer = function(){

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
		var query = connect.query("SELECT * FROM products", function(err, res) {
		    if(err) throw err;

		    for(var i = 0; i < res.length; i++) {
		        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price 
		        + " | " + res[i].stock_quantity + "\n")
		    };

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
			    	updateTable(productID, newUnit);
			    };

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
		    			console.log(chalk.green("Thanks for shopping with us!"));
		    			connect.end();
		    		};
		    	})

		    });
	};
};

module.exports = Customer;
