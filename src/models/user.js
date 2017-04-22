const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_FACTOR = require('./../config/config').SALT_FACTOR ;

const Schema = mongoose.Schema ;

//1個Schema對應1個document instance、對應1個collection的定義
const UserSchema = new Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        admin: {type: Boolean, default: false}
    },
    { timestamps: true }
);

//set UserSchema's pre hook to encrypt every time when .save() 
UserSchema.pre('save', function(next){
    const user = this ;
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err) ;
        // 如果沒錯就用salt去做hash，對密碼明文做加密
        bcrypt.hash(user.password, salt, (err, hash) => {
            // console.log(hash);
            if(err) return next(err) ;
            user.password = hash;
            next();
        }) ;
    } );
});

UserSchema.methods.comparePassword = function(password, callback){
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err) { return callback(err); }
        callback(null, isMatch);
    });
}

//指定Schema所對應的collection
//第1個參數代表collection名，進到mongodb之後首字會被轉為小寫、且會轉為復數型 (單複數同型就只會把首字轉為小寫)
module.exports = mongoose.model('User', UserSchema);
// users collection