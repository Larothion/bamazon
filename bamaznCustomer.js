var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   // Your username
   user: "root",
   // Your password
   password: "root",
   database: "bamazon"
});
connection.connect(function (err) {
   if (err) throw err;
   console.log("connected as id " + connection.threadId);
});

connection.query("SELECT item_id, product_name, price FROM products", function (error, result) {
	if (error) {
		throw error;
	} else {
		for (var i = 0 ; i < result.length ; i++) {
				console.log("Id #: " + result[i].item_id + " || Product: " + result[i].product_name + " || Price: " + result[i].price);
			}
	}
})

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

		var userQuant = answers.quantity;
		var quant = 0
		 connection.query("SELECT stock_quantity FROM products WHERE item_id =" + answers.id + ";", function (error, result) {
			if (error) {
				throw error;
			} else {
				for (var i = 0 ; i < result.length ; i++) {
					if (userQuant > result[i].stock_quantity) {
						console.log("Sorry... we don't have that much in stock.")
						connection.end();
					} else {
						 connection.query("UPDATE products SET stock_quantity = stock_quantity - " + userQuant + " WHERE item_id =" + answers.id + ";", function (error, result) {
							if (error) {
								console.log("Error 1");
							} else {
								connection.query("SELECT price FROM products WHERE item_id =" + answers.id + ";", function (error, result) {
									if (error) {
										throw error;
									} else {

										for (var i = 0 ; i < result.length ; i++) {
											totalPrice = result[i].price * userQuant;
											console.log("Thank you for your purchase!");
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

},800);



