const mongoose = require("mongoose");

class Database {
    constructor() {
        // listeting connection to db
        mongoose.connection.on("open", () => {
            console.log("> DB Connected...");
        });
        mongoose.connection.on("error", (e) => {
            console.error(e);
        });

        this.connect();
    }

    async connect() {
        try {
            await mongoose.connect(process.env.DBURI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useCreateIndex: true,
                useUnifiedTopology: true,
            });
        } catch (e) {
            console.error("Database Error", e);
        }
    }
}

module.exports = Database;
