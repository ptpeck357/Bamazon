//Manager View of Bamazon

var mysql = require('mysql');

var inquirer = require('inquirer');

const chalk = require('chalk');

var MYSQLPW = process.env.MYSQL_PW;

var connect = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: MYSQLPW,
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
          addInventory();
          break;

        case "Add New Product":
          addProduct();
          break;
      }
    });
}


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

};



//View items with an inventory count lower than five.
function viewInventory(){
	var query = connect.query("SELECT * FROM products", function(err, res) {
	    if(err) throw err;

	    console.log("\n");

	    for(var i = 0; i < res.length; i++) {
	        if(res[i].stock_quantity < 5){
	        	console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price 
	        	+ " | " + res[i].stock_quantity + "\n")
	        };
	    };
	});
};



function addInventory(){

}



function addProduct(){

}