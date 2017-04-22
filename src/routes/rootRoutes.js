const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const secret = require('./../config/config').secret;

const genToken = (user) => {
    return jwt.sign(user, secret, {
        expiresIn: 3000
    });
 } ;

module.exports = (app) => {
    app.post('/auth/login', function (req, res) {
        console.log(req.body);
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) { return console.log(err); }
            if (!user) { return res.status(403).json({ error: '用戶不存在~~' }) }
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (err) { return console.log(err); }
                if (!isMatch) { return res.status(403).json({ error: "密碼無效~~" }); }
                return res.json({
                    token: genToken( {name: user.username} ),
                    user: { name: user.username }
                });
            });
        });
    } ) ;
    app.post('/auth/signup', async (req, res) => {
        let user = new User();
        user.username = req.body.username ;
        user.password = req.body.password ;
        try{
            await user.save();
            return res.json({
                token: genToken( { name: user.username } ),
                user: {name: user.username}
            });
        }catch(e){
            return console.log('oops...', e);
        }
    } );
}