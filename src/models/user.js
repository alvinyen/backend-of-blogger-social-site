const mongoose = require('mongoose');

const Schema = mongoose.Schema ;

//1個Schema對應1個document instance、對應1個collection的定義
const UserSchema = new Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

//指定Schema所對應的collection
//第1個參數代表collection名，進到mongodb之後首字會被轉為小寫、且會轉為復數型 (單複數同型就只會把首字轉為小寫)
module.exports = mongoose.model('User', UserSchema);
// users collection