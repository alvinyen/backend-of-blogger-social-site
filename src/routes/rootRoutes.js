const User = require('./../models/user');

module.exports = (app) => {
    app.post('/auth/login', function (req, res) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) { return console.log(err); }
            if (!user) { return res.status(403).json({ error: '用戶不存在~~' }) }
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (err) { return console.log(err); }
                if (!isMatch) { return res.status(403).json({ error: "密碼無效~~" }); }
                return res.json({
                    user: { name: user.username }
                });
            });
        });
    } ) ;
}