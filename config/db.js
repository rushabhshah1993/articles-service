const mongoose = require('mongoose');
const config = require('config');
const db = config.get('MONGO_ATLAS_URI');

const connectDB = async () => {
    try {
        await mongoose.connect(
            db,
            {
                useNewUrlParser: true
            }
        );

        console.log("Mongo DB is connected");
    }
    catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
