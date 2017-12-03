var Supervisor = function(){	

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
		menuSection();
	});


	//Asks what they want to do
	function menuSection(){
		inquirer.prompt({
			name: "action",
			type: "list",
			message: "What would you like to do?",
			choices: 
				[
					"View Product Sales by Department",
					"Create New Department",
					"Delete a Department",
					"Exit"
				]
		}).then(function(answer) {
		      switch (answer.action) {
		        case "View Product Sales by Department":
					viewExistingdeparments();
					break;

				case "Create New Department":
					createDepartment();
					break;

				case "Delete a Department":
					deleteDepartment();
					break;

				case "Exit":
					exit();
					break;
		      }
	    });
	}


	//Views the existing departments. 
	function viewExistingdeparments(){

		var query = "SELECT department_name FROM departments GROUP BY department_name";

			connect.query(query, function(err, res) {
				//Array to hold the existing departments
				var object = [];

				for (var i = 0; i < res.length; i++) {
					object[i] = res[i].department_name 
				};
				grabData(object);
			});
	};


	//Grabbing the total profit of that specific department
	function grabData(departments){
		inquirer.prompt({
			name: "department",
			type: "list",
			choices: departments,
			message: "What department would you like to look at?"
		}).then(function(answer) {

			var query = "SELECT product_sales FROM products WHERE department_name =?";

			connect.query(query, [answer.department], function(err, res) {

					var product_sales = 0;

					//Adding the amount from all the items in the same department
					for (var i = 0; i < res.length; i++) {
						product_sales += res[i].product_sales;
					}		
					viewDepartments(product_sales, answer.department);
			});
		});
	};

	//Joining the two tables and displaying the data
	function viewDepartments(productsale, input){
		var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales ";
		    query += "FROM departments inner JOIN products ON (departments.department_name = products.department_name) ";
		    query += "WHERE (departments.department_name =? AND products.department_name =?) GROUP BY departments.department_name";

		connect.query(query, [input, input], function(err, res) {
			var t = new Table;
			//Caluculating the profit
        	var difference = parseInt(productsale) - parseInt(res[0].over_head_costs);

        	var data = [
	        	{ id: res[0].department_id, name: input, headcosts: res[0].over_head_costs, product_sales: productsale, profit: difference}
        	]
		    data.forEach(function(product) {
				t.cell(chalk.green('Department Id'),product.id);
				t.cell(chalk.green('Department Name'),product.name);
				t.cell(chalk.green('Over Head Costs'), product.headcosts);
				t.cell(chalk.green('Product Sales'), product.product_sales);
				t.cell(chalk.green('Total Profit'), product.profit);
				t.newRow();
			})
			console.log("\n" + t.toString()); 
			menuSection();
		});
	};

	//Here, the supervisor can create a new department to look over later
	function createDepartment(){
		inquirer.prompt([
				{
					type: 'input',
					name: 'name',
					message: "What is the name of the new department?"
				}, {
					type: 'input',
					name: 'amount',
					message: "What is the over head cost of the new department?",
					validate: function(value) {
				      if (isNaN(value) === false) {
				        return true;
				      }
				      return false;
				    }
				}
				]).then(result => {
					var query = connect.query(
			        "INSERT INTO departments SET ?",
			        {
						department_name: result.name,
						over_head_costs: result.amount
			        },
					function(err, res) {
				    if(err) throw err;
				    	menuSection();
				    });
				});
	};

	function deleteDepartment(){
		inquirer.prompt([
				{
					type: 'input',
					name: 'delete',
					message: "What is the department ID that you want to delete?",
					validate: function(value) {
				      if (isNaN(value) === false) {
				        return true;
				      }
				      return false;
				    }
				}
				]).then(result => {
					var query = connect.query(
			        "DELETE FROM departments WHERE ?",
			        {
						department_id: result.delete
			        },
					function(err, res) {
				    if(err) throw err;
				    	console.log(chalk.cyanBright("\nStore updated\n\n"));
				    	menuSection();
				    });
				});
	}

	function exit(){
		console.log(chalk.green("\nThank you for coming by!"));
		connect.end();
	};
};

module.exports = Supervisor;



	