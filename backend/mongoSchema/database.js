const mongoose = require("mongoose");
 class Database {
    constructor() {
        this.connection();
    }

    async connection() {
        mongoose.set('strictQuery', false);
        try {
            const uri = "mongodb+srv://aksn0204:aAKgkxCEiyXB5O59@cluster0.dpmnhfa.mongodb.net/GoodWill";
            await mongoose.connect(uri);
            console.log("connected to mongodb");
        }
        catch (error) {
            console.log(error);
        }

    }
}
module.exports = new Database();