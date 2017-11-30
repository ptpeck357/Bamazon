//Manager View of Bamazon

var Manager = function(){
	var Table = require('easy-table');
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

		    var t = new Table;
		    res.forEach(function(product) {
			  t.cell('Product Id', product.item_id)
			  t.cell('Name', product.product_name)
			  t.cell('Category', product.department_name)
			  t.cell('Price, USD', product.price)
			  t.cell('Quantity', product.stock_quantity, Table.number(2))
			  t.newRow()
			})

		    console.log(t.toString());
		    
		});

		options();
	};

	//View items with an inventory count lower than five.
	function viewInventory(){

		var query = connect.query("SELECT * FROM products", function(err, res) {
		    if(err) throw err;

	        if(res[i].stock_quantity < 5){
	        	var t = new Table;
			    res.forEach(function(product) {
				  t.cell('Product Id', product.item_id)
				  t.cell('Name', product.product_name)
				  t.cell('Category', product.department_name)
				  t.cell('Price, USD', product.price)
				  t.cell('Quantity', product.stock_quantity, Table.number(2))
				  t.newRow()
				})

			    console.log(t.toString());

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
		    }, 

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

		]).then(result => {

				var query = connect.query("SELECT * FROM products WHERE item_id =?", result.id, function(err, res) {
				    if(err) throw err;

				    var newUnit = res[0].stock_quantity + parseInt(result.amount);

					addInventory(result.id, newUnit);

				});

			});
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

		    	console.log(chalk.cyanBright("\nStore updated\n"));
				
				options();
		    });
	};

	//Asks the manager what item they are adding
	function addProduct(){

		inquirer.prompt([

			{
				type: 'input',
				name: 'id',
				message: "What is the new product ID of the item you are adding?",
				validate: function(value) {
			      if (isNaN(value) === false) {
			        return true;
			      }
			      return false;
			    }
			},

			{
				type: 'input',
				name: 'name',
				message: "What is the name of the new item?"
			},

			{
				type: 'input',
				name: 'category',
				message: "What category does this new item belong too?"
			
			},

			{
				type: 'input',
				name: 'price',
				message: "What is the price of the new item?",
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
				message: "What is the quantity of the new item?",
				validate: function(value) {
			      if (isNaN(value) === false) {
			        return true;
			      }
			      return false;
			    }
			}

			]).then(result => {

				var query = connect.query(
		        "INSERT INTO products SET ?",
		        {
		        	item_id: result.id,
					product_name: result.name,
					department_name: result.category,
					price: result.price,
					stock_quantity: result.unit
		        },
				function(err, res) {

			    if(err) throw err;

			    	//Shows the manager all the products with their info
					var query = connect.query("SELECT * FROM products", function(err, res) {
					    if(err) throw err;

					    console.log("\n");
					    
					    for(var i = 0; i < res.length; i++) {
					        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + 
					        " | " + "$" + res[i].price + " | " + res[i].stock_quantity + "\n")
					    };
					    console.log(chalk.cyanBright("\nStore updated!\n"));

					    //Asks the manager if he wants to continue looking over the store
						inquirer.prompt([
					    	{
					    		type: 'confirm',
					    		name: 'continue',
					    		message: 'Do you want to continue going over the store?'
					    	}
				    	]).then(result =>{
				    		if(result.continue){
				    			options();
				    		} else {
				    			console.log(chalk.green("Nice seeing you! See you another day!"));
				    			connect.end();
				    		};
				    	})
					});
			    });
			});
	};
};

module.exports = Manager;