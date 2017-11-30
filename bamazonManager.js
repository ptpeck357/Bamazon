//Manager View of Bamazon

var Manager = function(){
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

		options();
	});


	function options() {
	  inquirer
	    .prompt({
	      name: "action",
	      type: "list",
	      message: "What would you like to do?",
	      choices: [
	        "View Products for Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product"
	      ]
	    })
	    .then(function(answer) {
	      switch (answer.action) {
	        case "View Products for Sale":
	          viewProducts();
	          break;

	        case "View Low Inventory":
	          viewInventory();
	          break;

	        case "Add to Inventory":
	          whatItem();
	          break;

	        case "Add New Product":
	          addProduct();
	          break;
	      }
	    });
	};



	function viewProducts(){

		//Shows the manager all the products with their info
		var query = connect.query("SELECT * FROM products", function(err, res) {
		    if(err) throw err;

		    console.log("\n");
		    
		    for(var i = 0; i < res.length; i++) {
		        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price 
		        + " | " + res[i].stock_quantity + "\n")
		    };
		});

		options();
	};



	//View items with an inventory count lower than five.
	function viewInventory(){

		var query = connect.query("SELECT * FROM products", function(err, res) {
		    if(err) throw err;

		    console.log("\n");

		    for(var i = 0; i < res.length; i++) {
		        if(res[i].stock_quantity < 5){
		        	console.log("\n" + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + 
		        	" | " + "$" + res[i].price + " | " + res[i].stock_quantity + "\n")
		        };
		    };
		});

		options();
	};



	function whatItem(){

		// Asks the manager what item ID they want to add too
		inquirer.prompt([

			{
				type: 'input',
				name: 'id',
				message: "What is the product ID of the product you're adding too",
				validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }
		    }

		]).then(productID => {

				amount(productID.id)

			});
	};



	function amount(productID){

		inquirer.prompt([
					{
						type: 'input',
						name: 'amount',
						message: 'How many units are you adding to the product?',
						validate: function(value) {
				          if (isNaN(value) === false) {
				            return true;
				          }
				          return false;
				        }
					}
				]).then(amount => {

					var query = connect.query("SELECT * FROM products WHERE item_id =?", productID, function(err, res) {
					    if(err) throw err;

					    var newUnit = res[0].stock_quantity + parseInt(amount.amount);

						    addInventory(productID, newUnit);

					    });

					

				})
	};



	function addInventory(productID, amount){

		var query = connect.query(
	        "UPDATE products SET ? WHERE ?",
	        [
	            {
	                stock_quantity: amount
	            },
	            {
	                item_id: productID
	            }
	        ],
			function(err, res) {
		    if(err) throw err;

		    	console.log("\nStore updated");
				
				options();
		    });
	};



	function addProduct(){

	};
};

module.exports = Manager;