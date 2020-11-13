const mysql = require("mysql2");
const { forEach } = require("underscore");

const DB_PREFIX = process.env.MYSQLDBPREFIX ? process.env.MYSQLDBPREFIX : "oc_";

/* **********

TODO:
1) Get product info (object) from array + 
2) Check exist name in table product +
	a) if not exist add row 
	b) if exist - update data
3) Check exist category in table categories and if not exist - add, then update product relation + 
4) Check exist brand in table brands and if not exist - add, then update product relation +
5) Check how to "fix" category path display in admin panel opencart +

************* */

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
		_CATEGORY_: "Бакалея",
		_NAME_: "макароны Витки",
		_BRAND_: "Hewlett-Packard",
		_QUANTITY_: "10",
		_PRICE_: "18,5"
	},
	{
		_CATEGORY_: "Бакалея | Макароны, паста",
		_NAME_: "макароны плетеные",
		_BRAND_: "Bottega del Sole",
		_QUANTITY_: "20",
		_PRICE_: "19,5"
	},
	{
		_CATEGORY_: "Бакалея | Макароны, паста | паста",
		_NAME_: "макароны круглые",
		_BRAND_: "Bottega del Sole",
		_QUANTITY_: "30",
		_PRICE_: "19,5"
	},
	{
		_CATEGORY_: "Бакалея | Макароны, паста",
		_NAME_: "Огурцы соленые",
		_BRAND_: "Bottega del Sole",
		_QUANTITY_: "30",
		_PRICE_: "19,5"
	}
]

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

const addBrand = async (name, callback) => {
	try {
		let id = await MYSQLconnection.promise().query("SELECT MAX(manufacturer_id) AS max_id FROM " + DB_PREFIX + "manufacturer")
		id = id[0][0].max_id + 1

		res = await MYSQLconnection.promise()
			.query(
					"INSERT INTO " + DB_PREFIX + "manufacturer (manufacturer_id, name, sort_order) VALUES (" + id + ", '" + name + "', 0)"
				)
		res = await MYSQLconnection.promise()
			.query(
					"INSERT INTO " + DB_PREFIX + "manufacturer_to_store (manufacturer_id, store_id) VALUES (" + id + ", 0)"
				)
		callback()
	} catch (err) {
		console.error(err)
	}
}

const checkBrand = (product) => {
	return new Promise(async (resolve) => {
		try {
			if(product._BRAND_) {
				let res = await MYSQLconnection.promise()
				.query(
						"SELECT manufacturer_id as brand_id FROM " + DB_PREFIX + "manufacturer WHERE " + 
						DB_PREFIX + "manufacturer.name = '" + product._BRAND_.trim() + "'"
					)
	
				if(res[0].length === 0)
					addBrand(product._BRAND_, resolve)
				else
					resolve()
			} else {
				resolve()
			}
		} catch (err) {
			console.error(err)
		}
	})
}

const getPrice = (price) => {
	let p = parseFloat(price.replace(",", "."))
	return p.toFixed(4)
}

const addProduct = async (product, callback) => {
	try {
		let res
		let date = new Date().toMysqlFormat()
		let price = product._PRICE_
		let brand_id = 0
	
		brand_id = await MYSQLconnection.promise()
			.query(
					"SELECT manufacturer_id as brand_id FROM " + DB_PREFIX + "manufacturer WHERE " + 
					DB_PREFIX + "manufacturer.name = '" + product._BRAND_ + "'"
				)
		
		if(brand_id[0].length > 0)
			brand_id = brand_id[0][0].brand_id
		else
			brand_id = 0
	
		let id = await MYSQLconnection.promise().query("SELECT MAX(product_id) AS max_id FROM " + DB_PREFIX + "product")
		id = id[0][0].max_id + 1
	
		res = await MYSQLconnection.promise()
			.query(
				"INSERT INTO " + DB_PREFIX + "product (product_id, model, quantity, price, sku, upc, ean, jan, isbn, mpn, location, stock_status_id, manufacturer_id, tax_class_id, date_added, date_modified, length_class_id, sort_order, status) VALUES ("+ id +", '1', "+parseInt(product._QUANTITY_)+", "+price+", ' ', ' ', ' ', ' ', ' ', ' ', ' ', 7, "+brand_id+", 9, '" + date +"', '"+ date +"', 1, 1, 1)"
			)
	
		res = await MYSQLconnection.promise()
			.query(
				"INSERT INTO " + DB_PREFIX + "product_description (product_id, language_id, name, description, tag, meta_title, meta_description, meta_keyword) VALUES (" + id + ", 1, '" + product._NAME_ + "', ' ', ' ', '" +product._NAME_+ "', ' ', ' ')"
			)
		
		res = await MYSQLconnection.promise()
			.query(
				"INSERT INTO " + DB_PREFIX + "product_to_store (product_id, store_id) VALUES (" + id + ", 0)"
			)
			
		res = await MYSQLconnection.promise()
			.query(
				"INSERT INTO " + DB_PREFIX + "product_to_layout (product_id, store_id, layout_id) VALUES (" + id + ", 0, 0)"
			)
	
		if(product._CATEGORY_) {
			let category_name = product._CATEGORY_.split('|')
			category_name = category_name[category_name.length-1].trim()
			let category_id = await MYSQLconnection.promise()
				.query(
						"SELECT category_id FROM " + DB_PREFIX + "category_description WHERE " + 
						DB_PREFIX + "category_description.name = '" + category_name + "'"
					)
	
			if(category_id[0].length > 0) {
				category_id = category_id[0][0].category_id
		
				res = await MYSQLconnection.promise()
					.query(
						"INSERT INTO " + DB_PREFIX + "product_to_category (product_id, category_id) VALUES (" + id + ", " + category_id + ")"
					)
			}
		}
		
		callback()
	} catch (err) {
		console.error(err)
	}
}

const checkProduct = async (product) => {
	return new Promise(async(resolve) => {
		try {
			// if it will be necessary to take into account not filling the field, 
			// then if it is necessary to take into account the incompleteness of the field, 
			// then it must be done through the string sql query
			let price = product._PRICE_ 
			let quantity = product._QUANTITY_
			let res = await MYSQLconnection.promise()
				.query(
						"UPDATE " + 
						DB_PREFIX + "product SET price=" + price + ", quantity="+quantity+" WHERE " + 
						DB_PREFIX + "product.product_id = (SELECT " + 
						DB_PREFIX + "product_description.product_id FROM " + 
						DB_PREFIX + "product_description WHERE " + 
						DB_PREFIX + "product_description.name = '" + product._NAME_ + "')"
					)
			
			if(res[0].changedRows === undefined)
				addProduct(product, resolve)

			return resolve()
		} catch (err) {
			console.error(err)
		}
	})
}

const addCategory = (name, parent_id, level) => {
	return new Promise( async (resolve) => {
		try {
			let date = new Date().toMysqlFormat()
			let id = await MYSQLconnection.promise().query("SELECT MAX(category_id) AS max_id FROM " + DB_PREFIX + "category")
			id = id[0][0].max_id + 1

			res = await MYSQLconnection.promise()
				.query(
						"INSERT INTO " + DB_PREFIX + "category (category_id, parent_id, top, `column`, date_added, date_modified, sort_order, status) VALUES ("+ id +", "+ parent_id +", 1, 1, '" + date +"', '"+ date +"', 1, 1)"
					)

			res = await MYSQLconnection.promise()
				.query(
						"INSERT INTO " + DB_PREFIX + "category_description (category_id, language_id, name, description, meta_title, meta_description, meta_keyword) VALUES (" + id + ", 1, '" + name + "', ' ', '" + name + "', ' ', ' ')"
					)

			res = await MYSQLconnection.promise()
				.query(
						"INSERT INTO " + DB_PREFIX + "category_path (category_id, path_id, level) VALUES (" + id + ", " + id + ", 0)"
					)
				
			res = await MYSQLconnection.promise()
				.query(
						"INSERT INTO " + DB_PREFIX + "category_to_store (category_id, store_id) VALUES (" + id + ", 0)"
					)

			return resolve(id)
		} catch(err) {
			console.error(err)
		} 
	})

}

const repairCategories = (parent_id = 0) => {
	return new Promise(async (resolve) => {
		try {
			let categories = await MYSQLconnection.promise().query("SELECT * FROM " + DB_PREFIX + "category WHERE parent_id = " + parent_id)
		
			if(!categories[0]) return resolve()

			for(let i = 0; i < categories[0].length; i++) {
				let category = categories[0][i]
				await MYSQLconnection.promise().query("DELETE FROM " + DB_PREFIX + "category_path WHERE category_id = " + category.category_id)
				
				let level = 0

				let category_path = await MYSQLconnection.promise().query("SELECT * FROM " + DB_PREFIX + "category_path WHERE category_id = " + parent_id + " ORDER BY level ASC")

				for(let j = 0; j < category_path[0].length; j++) {
					let result = category_path[0][j]
					await MYSQLconnection.promise().query("INSERT INTO " + DB_PREFIX + "category_path SET category_id = " + category.category_id + ", path_id = " + result.path_id + ", level = " + level)
					level++
				}

				await MYSQLconnection.promise().query("REPLACE INTO " + DB_PREFIX + "category_path SET category_id = " + category.category_id + ", path_id = " + category.category_id + ", level = " + level)
				repairCategories(category.category_id)
			}
			return resolve()
		}
		catch(err) {
			console.error(err.stack)
		}
	})
}

const checkCategory = (product) => {
	return new Promise(async (resolve) => {
		try {
			if(!product._CATEGORY_) return resolve()
			let catergories = product._CATEGORY_.split('|')
	
			if(catergories.length === 0) resolve()
	
			let parent_id = 0
			let level = 0
		
			for(let i = 0; i < catergories.length; i++) {
				let res = await MYSQLconnection.promise()
					.query(
							"SELECT category_id FROM " + DB_PREFIX + "category_description WHERE " + 
							DB_PREFIX + "category_description.name = '" + catergories[i].trim() + "'"
						)
				
				let isExistCategory = !!res[0].length
	
				if(!isExistCategory)
					parent_id = await addCategory(catergories[i].trim(), parent_id, level)
				else 
					parent_id = res[0][0].category_id
	
				level++
			}
	
			return resolve()
		} catch (err) {
			console.error(err)
		}
	})
}

const importOurProducts = async (data) => {
	return new Promise(async(resolve) => {
		try {
			if(!data.length) return resolve({success: false, message: "Файл пуст!"})
			if(data[0]['_NAME_'] === undefined) return resolve({success: false, message: "Файл не подходит для импорта товаров"})

			for(let i = 0; i < data.length; i++) {
				await checkBrand(data[i])
				await checkCategory(data[i])
				await checkProduct(data[i])
			}

			await repairCategories()
			// await new Promise(_res => {setTimeout(() => {_res()}, data.length * 100)}) // fix me. delay after end mysql connection
			
			resolve({success: true, message: "Данные успешно импортированы в БД"})
		}
		catch(error) {
			console.error("MYSQL ERROR: ", error)
			throw new Error(error)
		}
	})
}

module.exports = importOurProducts