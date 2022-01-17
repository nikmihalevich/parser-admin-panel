const mysql = require("mysql2");
const { forEach } = require("underscore");

const DB_PREFIX = process.env.MYSQLDBPREFIX ? process.env.MYSQLDBPREFIX : "oc_";

function twoDigits(d) {
	if(0 <= d && d < 10) return "0" + d.toString();
	if(-10 < d && d < 0) return "-0" + (-1*d).toString();
	return d.toString();
}

Date.prototype.toMysqlFormat = function() {
	return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

// create the connection to database
const MYSQLconnection = mysql.createPool({
	host: process.env.MYSQLHOST ? process.env.MYSQLHOST : "localhost",
	user: process.env.MYSQLUSER ? process.env.MYSQLUSER : "root",
	password: process.env.MYSQLPASS ? process.env.MYSQLPASS : "",
	database: process.env.MYSQLDB ? process.env.MYSQLDB : "testopencart",
});

MYSQLconnection.on("error", (err) => {
	console.log("Its error: ",err)
})

const updateProductPrice = async (product) => {
	return new Promise(async(resolve) => {
		try {
			let productId = product.product_id
			let price = product.average_price

			if (!price) return resolve()

			let res = await MYSQLconnection.promise()
				.query(
						"UPDATE " + 
						DB_PREFIX + "product SET price = " + price + " WHERE " + 
						DB_PREFIX + "product.product_id = '" + productId + "'"
					)
			
			return resolve()
		} catch (err) {
			console.error(err)
		}
	})
}

const updateOurProductsPrice = async (data) => {
	return new Promise(async(resolve) => {
		try {
			// let check array with ids and prices

			if(!data.length) return resolve({success: false, message: "Не найдено товаров для обновления!"})

			for(let i = 0; i < data.length; i++) {
				await updateProductPrice(data[i])
			}
			
			resolve({success: true, message: "Цены товаров успешно обновлены!"})
		}
		catch(error) {
			console.error("MYSQL ERROR: ", error)
			throw new Error(error)
		}
	})
}

module.exports = updateOurProductsPrice