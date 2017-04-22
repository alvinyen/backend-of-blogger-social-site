const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const secret = require('./../config/config').secret;
const Post = require('./../models/post');

const genToken = (user) => {
    return jwt.sign(user, secret, {
        expiresIn: 3000
    });
};

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'token失效~~你要重新登入喔！！' });
                } else {
                    return res.status(401).json({ error: '認證失敗' });
                }
            } else {
                if (decoded.admin === true) {
                    next();
                } else {
                    res.status(401).json({ error: '認證失敗..' });
                }
            }
        });
    } else {
        return res.status(403).json({
            error: '請提供token yo~~'
        });
    }
}

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
                    token: genToken({ name: user.username, admin: user.admin }),
                    user: { name: user.username, admin: user.admin }
                });
            });
        });
    });
    app.post('/auth/signup', async (req, res) => {
        let user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        try {
            await user.save();
            return res.json({
                token: genToken({ name: user.username }),
                user: { name: user.username }
            });
        } catch (e) {
            return console.log('oops...', e);
        }
    });
    app.post('/posts', requireAuth, async function (req, res) {
        let post = new Post();
        post.name = req.body.name;
        post.content = req.body.content;
        try {
            await post.save();
        } catch (e) {
            console.log(e);
        }
        res.json({
            message: '新增文章成功~~'
        });
    });
}