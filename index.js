require("dotenv").config();

const App = require("./App");

const Database = require("./Database");
const db = new Database();

const app = new App();
app.start();
