const mysql = require("mysql2");

const DB_PREFIX = process.env.MYSQLDBPREFIX ? process.env.MYSQLDBPREFIX : "oc_";

function twoDigits(d) {
	if(0 <= d && d < 10) return "0" + d.toString();
	if(-10 < d && d < 0) return "-0" + (-1*d).toString();
	return d.toString();
}

Date.prototype.toMysqlFormat = function() {
	return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

const importData = [
	{
		_CATEGORY_: "Бакалея | Макароны, паста",
		_NAME_: "макароны Витки",
		_BRAND_: "Bottega del Sole",
		_QUANTITY_: "10",
		_PRICE_: "18,7"
	},
	// {
	// 	_CATEGORY_: "Бакалея | Макароны, паста",
	// 	_NAME_: "макароны плетеные",
	// 	_BRAND_: "Bottega del Sole",
	// 	_QUANTITY_: "20",
	// 	_PRICE_: "19,5"
	// },
	// {
	// 	_CATEGORY_: "Бакалея | Макароны, паста",
	// 	_NAME_: "макароны круглые",
	// 	_BRAND_: "Bottega del Sole",
	// 	_QUANTITY_: "30",
	// 	_PRICE_: "19,5"
	// },
	// {
	// 	_CATEGORY_: "Бакалея | Макароны, паста",
	// 	_NAME_: "Огурцы соленые",
	// 	_BRAND_: "Bottega del Sole",
	// 	_QUANTITY_: "30",
	// 	_PRICE_: "19,5"
	// }
]

// create the connection to database
const MYSQLconnection = mysql.createConnection({
	host: process.env.MYSQLHOST ? process.env.MYSQLHOST : "localhost",
	user: process.env.MYSQLUSER ? process.env.MYSQLUSER : "root",
	password: process.env.MYSQLPASS ? process.env.MYSQLPASS : "",
	database: process.env.MYSQLDB ? process.env.MYSQLDB : "opencart",
});

MYSQLconnection.connect((err) => {
	if (err) {
		return console.error("Ошибка: " + err.message);
	} else {
		console.log("Подключение к серверу MySQL успешно установлено");
	}
});

const createNewRowProduct = async (product) => {
	let res
	let price = parseFloat(product._PRICE_.replace(",", "."))
	price = price.toFixed(4)

	let id = await MYSQLconnection.promise().query("SELECT MAX(product_id) AS max_id FROM " + DB_PREFIX + "product")
	id = id[0][0].max_id + 1

	let date = new Date().toMysqlFormat()

	res = await MYSQLconnection.promise()
		.query(
			"INSERT INTO " + DB_PREFIX + "product (product_id, model, quantity, price, sku, upc, ean, jan, isbn, mpn, location, stock_status_id, manufacturer_id, tax_class_id, date_added, date_modified) VALUES ("+ id +", '1', "+parseInt(product._QUANTITY_)+", "+price+", ' ', ' ', ' ', ' ', ' ', ' ', ' ', 5, 0, 9, '" + date +"', '"+ date +"')"
		)

	res = await MYSQLconnection.promise()
		.query(
			"INSERT INTO " + DB_PREFIX + "product_description (product_id, language_id, name, description, tag, meta_title, meta_description, meta_keyword) VALUES (" + id + ", 1, '" + product._NAME_ + "', ' ', ' ', '" +product._NAME_+ "', ' ', ' ')"
		)
	console.log(res[0])
}

const checkProduct = (product) => {
	MYSQLconnection.promise()
		.query(
				"UPDATE oc_product SET price=214.5 WHERE " + 
				DB_PREFIX + "product.product_id = (SELECT " + 
				DB_PREFIX + "product_description.product_id FROM " + 
				DB_PREFIX + "product_description WHERE " + 
				DB_PREFIX + "product_description.name = '" + product._NAME_ + "')"
			)
		.then((res) => {
			if(res[0].changedRows !== undefined)
				console.log("Changed rows: ", res[0].changedRows) // work with this value - if < 0 INSERT new product
			else if(res[0].changedRows === undefined) {
				createNewRowProduct(product)
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

const importOurProducts = (data) => {

	importData.map((item, key) => {
		checkProduct(item)
	})

	// MYSQLconnection.end();
}

importOurProducts()
//module.exports = importOurProducts