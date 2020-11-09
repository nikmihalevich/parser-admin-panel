const mysql = require("mysql2");
const OurProducts = require("../models/OurProductsModel");

const getOurProducts = () => {
  const DB_PREFIX = process.env.MYSQLDBPREFIX;

  let products;

  let productsDescription = [];
  let productsCharacteristic = [];
  let weightClassUnit = [];
  let categoryDescription = [];
  let productToCategory = [];

  function merge() {
    var result = [];

    Array.prototype.forEach.call(arguments, function (arr) {
      // Проходимся по переданным агрументам, функция принимает неограниченное количество аргументов
      if (Array.isArray(arr)) {
        for (e in arr) {
          // Проходимся по всем
          e = arr[e]; // переданным объектам
          var tmp = {},
            isAdd = true;

          result.some(function (i) {
            if (i.product_id == e.product_id) {
              tmp = i; // Если в массиве уже был объект с данным id, то берём его
              isAdd = false; // и запрещаем добавлять его в результат
              return true;
            }
          });

          for (prop in e) {
            tmp[prop] = e[prop]; // Изменяем/добавляем свойства из переданного объекта
          }

          if (isAdd) result.push(tmp);
        }
      }
    });

    return result;
  }

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
    .query("SELECT product_id, name FROM " + DB_PREFIX + "product_description")
    .then((res) => {
      res[0].forEach((value, i) => {
        productsDescription.push(value);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  MYSQLconnection.promise()
    .query(
      "SELECT weight_class_id, unit FROM " +
        DB_PREFIX +
        "weight_class_description"
    )
    .then((res) => {
      res[0].forEach((value, i) => {
        weightClassUnit.push(value);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  MYSQLconnection.promise()
    .query(
      "SELECT product_id, price, weight, weight_class_id FROM " +
        DB_PREFIX +
        "product"
    )
    .then((res) => {
      res[0].forEach((value, i) => {
        let params = {
          weight:
            value.weight.split(".")[0] > 1000
              ? value.weight.split(".")[0] / 1000
              : value.weight.split(".")[0],
          weight_class_id: value.weight_class_id,
          isConverted: value.weight.split(".")[0] > 1000,
        };
        productsCharacteristic.push({
          product_id: value.product_id,
          price: parseFloat(value.price).toFixed(2),
          params: params,
        });
      });
    })
    .then(() => {
      for (let i = 0; i < productsCharacteristic.length; i++) {
        for (let j = 0; j < weightClassUnit.length; j++) {
          if (
            productsCharacteristic[i].params.weight_class_id ===
            weightClassUnit[j].weight_class_id
          ) {
            if (productsCharacteristic[i].params.isConverted) {
              if (weightClassUnit[j].unit === "мл")
                productsCharacteristic[i].params.unit = "л";
              if (weightClassUnit[j].unit === "гр")
                productsCharacteristic[i].params.unit = "кг";
            } else {
              productsCharacteristic[i].params.unit = weightClassUnit[j].unit;
            }
          }
        }
      }

      products = merge(productsDescription, productsCharacteristic);
    })
    .catch((err) => {
      console.log(err);
    });

  MYSQLconnection.promise()
    .query(
      "SELECT category_id, name FROM " +
        DB_PREFIX +
        "category_description"
    )
    .then((res) => {
      res[0].forEach((value, i) => {
        categoryDescription.push(value);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  MYSQLconnection.promise()
    .query(
      "SELECT product_id, category_id FROM " +
        DB_PREFIX +
        "product_to_category"
    )
    .then((res) => {
      res[0].forEach((value, i) => {
        productToCategory.push(value)
        
      });
    })
    .then(() => {
      products.filter((product, key) => {
        // find by product_id object and insert category name with search in categoryDescription array by category_id
        
        for(let i = 0; i < productToCategory.length; i++) {
          if(product.product_id === productToCategory[i].product_id) {
            let catDesc = categoryDescription.find(catInfo => productToCategory[i].category_id === catInfo.category_id)
            product.category_name = catDesc.name
          }
        }

        return product
      })

      products.map(async (item, i) => {
        const product = new OurProducts(item);
        await product.save();
      });
      
    })
    .catch((err) => {
      console.log(err);
    });

  MYSQLconnection.end();
};

module.exports = getOurProducts;
