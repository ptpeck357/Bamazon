var inquirer = require('inquirer');

var bamazonCustomer = require('./bamazonCustomer.js');

var bamazonManager = require('./bamazonManager.js');

var bamazonSupervisor = require('./bamazonSupervisor.js')

inquirer.prompt({
	name: "action",
	type: "list",
	message: "What position are you viewing the store?",
	choices: [
		"Customer",
		"Manager",
		"Supervisor"
	]
})
.then(function(answer) {	
	switch (answer.action) {
		case "Customer":
		var customerUser = new bamazonCustomer;
		break;
		case "Manager":
		var managerUser = new bamazonManager;
		break;
		case "Supervisor":
		var supervisorUser = new bamazonSupervisor;
		break;
	}
});
