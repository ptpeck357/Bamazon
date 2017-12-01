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

	function menuSection(){
		inquirer.prompt({
			name: "action",
			type: "list",
			message: "What would you like to do?",
			choices: 
				[
					"View Product Sales by Department",
					"Create New Department"
				]
		}).then(function(answer) {
		      switch (answer.action) {
		        case "View Product Sales by Department":
				// viewProducts();
				break;

				case "Create New Department":
				createDepartment();
				break;
		      }
	    });
	}



	function viewProducts(){

		inquirer.prompt({
			name: "department",
			type: "input",
			message: "What department would you like to look at?"
		}).then(function(answer) {
			
			var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
			query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
			query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year ";

			connection.query(query, [answer.department], function(err, res) {
			
			});
		});
	};


	function createDepartment(){
		inquirer.prompt([
				{
					type: 'input',
					name: 'id',
					message: "What is the new department ID you are adding?",
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
					message: "What is the name of the new department?"
				},
				{
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
			        	department_id: result.id,
						department_name: result.name,
						over_head_costs: result.amount
			        },
					function(err, res) {
				    if(err) throw err;
				    	menuSection();
				    });
				});
	};
};

module.exports = Supervisor;



	