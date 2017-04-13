var mysql = require("mysql");
var inquirer = require("inquirer")

/*global var*/
var userQuant = 0;

/*connection to database*/
var connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   // Your username
   user: "root",
   // Your password
   password: "root",
   database: "bamazon"
});

/*checks connection*/
connection.connect(function (err) {
   if (err) {
   	throw err;
   } else {
   console.log("connected as id " + connection.threadId);
	}
});

/*displays all the available products for the user*/
connection.query("SELECT item_id, product_name, price FROM products", function (error, result) {
	if (error) {
		throw error;
	} else {
		for (var i = 0 ; i < result.length ; i++) {
				console.log("Id #: " + result[i].item_id + " || Product: " + result[i].product_name + " || Price: " + result[i].price);
			}
	}
});

/*asks the user what they want to buy and of what quantity*/
setTimeout(function(){

	inquirer.prompt([
	{
		name: "id",
		message: "What is the ID of the product you would like to buy?"
	}, {
		name: "quantity",
		message: "How many units would you like to buy?"
	}
	]).then(function(answers){

		userQuant = answers.quantity;
		var quant = 0;

		/*goes through callback hell to then update the database and display relevant purchase information to the user*/
		 connection.query("SELECT stock_quantity FROM products WHERE item_id =" + answers.id + ";", function (error, result) {
			if (error) {
				throw error;
			} else {
				for (var i = 0 ; i < result.length ; i++) {
					if (userQuant > result[i].stock_quantity) {
						console.log("Sorry... we don't have that much in stock.")
						connection.end();
					} else {
						 console.log("We have " + (result[i].stock_quantity - userQuant) + " left in stock!");
						 console.log("---------------------");
						 connection.query("UPDATE products SET stock_quantity = stock_quantity - " + userQuant + " WHERE item_id =" + answers.id + ";", function (error, result) {
							if (error) {
								console.log("Error 1");
							} else {
								connection.query("SELECT price FROM products WHERE item_id =" + answers.id + ";", function (error, result) {
									if (error) {
										throw error;
									} else {

										for (var i = 0 ; i < result.length ; i++) {
											var totalPrice = result[i].price * userQuant;
											console.log("Thank you for your purchase!");
											console.log("---------------------");
											console.log("You Paid: " + totalPrice);
											connection.end();
										}
									}
								});
							 }
						 });

					 };
				};
			};
		});

  });

},400);



