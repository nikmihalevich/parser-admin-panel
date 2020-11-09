const mysql = require("mysql2");

const importOurProducts = (data) => {
	const DB_PREFIX = process.env.MYSQLDBPREFIX;

	// create the connection to database
	const MYSQLconnection = mysql.createConnection({
		host: process.env.MYSQLHOST,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPASS ? process.env.MYSQLPASS : "",
		database: process.env.MYSQLDB,
	});

	MYSQLconnection.connect((err) => {
		if (err) {
			return console.error("Ошибка: " + err.message);
		} else {
			console.log("Подключение к серверу MySQL успешно установлено");
		}
	});

	MYSQLconnection.promise()
		.query("UPDATE oc_product SET price=214.4 WHERE " + DB_PREFIX + "product.product_id = (SELECT " + DB_PREFIX + "product_description.product_id FROM " + DB_PREFIX + "product_description WHERE " + DB_PREFIX + "product_description.name = 'Огурцы соленые')")
		.then((res) => {
			console.log(res[0].changedRows) // work with this value - if < 0 INSERT new product
		})
		.catch((err) => {
			console.log(err);
		});

	MYSQLconnection.end();
}

module.exports = importOurProducts