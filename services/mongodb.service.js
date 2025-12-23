const mongoose = require("mongoose");
function dbConnect() {
    mongoose
        .connect(process.env.MONGO_URL)
        .then((response) => {
            console.log("DB Connected!");
        })
        .catch((err) => {
            console.error("ERROR while connecting DB");
        });

}

module.exports = dbConnect