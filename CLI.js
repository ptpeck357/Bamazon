var inquirer = require('inquirer');

var bamazonCustomer = require('./bamazonCustomer.js');

var bamazonManager = require('./bamazonManager.js');

inquirer
.prompt({
  name: "action",
  type: "list",
  message: "What position are you viewing the store?",
  choices: [
    "Customer",
	"Manager",
	"Supervisior"
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
  }
});
