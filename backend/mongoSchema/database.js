const mongoose = require("mongoose");
 class Database {
    constructor() {
        this.connection();
    }

    async connection() {
        mongoose.set('strictQuery', false);
        try {
            const uri = "mongodb://0.0.0.0:27017/GoodWill";
            await mongoose.connect(uri);
            console.log("connected to mongodb");
        }
        catch (error) {
            console.log(error);
        }

    }
}
module.exports = new Database();