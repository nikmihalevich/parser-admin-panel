const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const inject = require("require-all");

// const middlewares = require("./middlewares");

class Application {
  constructor() {
    this.app = express();
    this.controllers = inject(__dirname + "/controllers");
    this.router = express.Router;

    this.settings();
    this.middlewaresBefore();
    this.routes();
    this.middlewaresAfter();
  }

  settings = () => {
    // Application settings
    this.app.set("port", process.env.PORT || 3000);
  };

  middlewaresBefore = () => {
    // middlewares
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
  };

  middlewaresAfter = () => {
    // middleware that should be connected after routes
    // this.app.use(middlewares.notFound);
    // this.app.use(middlewares.errorHandler);
  };

  routes = () => {
    // routes
    // dynamic dependencies injection
    try {
      for (const name in this.controllers) {
        if (name !== "index")
          this.app.use(`/${name}`, this.controllers[name](this.router));
      }
    } catch (e) {
      console.error(e);
    }
  };

  start = () => {
    this.app.listen(this.app.get("port"), () => {
      console.log(`> Server on port ${this.app.get("port")} running...`);
    });
  };
}

module.exports = Application;
