const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const secret = require('./../config/config').secret;
const Post = require('./../models/post');
const CommentModel = require('./../models/CommentModel');
const mongoose = require('mongoose');

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
                    res.status(401).json({ error: '認證失敗..你不是管理員啦！' });
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
            if (e.name === 'MongoError' && e.code === 11000) {
                return res.status(500).send({ errorMsg: 'User already exist!' });
            }
            return console.log(e);
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
            message: '新增文章成功~~',
            post: {
                name: post.name,
                content: post.content,
                postId: res.postId,
            }
        });
    });
    app.get('/posts', function (req, res) {
        Post.find({}, 'name postId').sort({ postId: -1 }).exec(function (err, postArray) {
            if (err) return console.log(err);
            // console.log(postArray);
            res.json({
                posts: postArray,
                message: '你得到所有文章了呢！！'
            });
        });
    });
    app.get('/posts/:post_id', function (req, res) {
        Post.findById({ _id: req.params.post_id }, function (err, post) {
            if (err) return res.status(500).json({ error: err.message });
            // 422 ???
            res.json({ post });
        })
    });
                                // 驗證是否為管理員
    app.put('/posts/:post_id', requireAuth, function (req, res) {
        Post.findByIdAndUpdate(req.params.post_id, { name: req.body.name, content: req.body.content }, (err, updatedPost) => {
            if (err) { console.log('update err：', err); }
            // console.log('update successed');
            // console.log(updatedPost);
            res.json({
                post: updatedPost,
                message: '文章更新成功了！'
            });
        });
    });
    
    app.delete('/posts/:post_id', requireAuth, function (req, res) {
        if(req.params.post_id === undefined || req.params.post_id === 'undefined') res.status(400).json({ error: `post_id === undefined` });
        const id = req.params.post_id;
        Post.findById({ _id: id }, function (err, post) {
            post.remove(function (err) {
                if (err) return res.status(422).json({ error: err.message });
                res.json({
                    _id: id,
                    message: '文章移除成功！'
                });
            });
        });
    });

    // below are api of comments

    app.post('/comments', async function (req, res) {
        let comment = new CommentModel();
        comment.post_id = mongoose.Types.ObjectId(req.body.post_id);
        comment.name = req.body.name;
        comment.when = req.body.when;
        comment.comment = req.body.comment;
        try {
            await comment.save();
        } catch (e) {
            console.log(e);
        }
        res.json({
            message: '新增comment成功~~',
            comment: {
                post_id: comment.post_id,
                commentId: comment.commentId,
                name: comment.name,
                when: comment.when,
                comment: comment.comment,
            },
        });
    });

    app.get('/comments/:post_id', function (req, res) {
        // console.log(req.params.post_id);
        CommentModel.find({ post_id: mongoose.Types.ObjectId(req.params.post_id) }, 'commentId name when comment').sort({ commentId: -1 }).exec(function (err, commentsArray) {
            if (err) return console.log(err);
            // console.log(commentsArray);
            res.json({
                comments: commentsArray,
                message: '你得到所有comments了呢！！'
            });
        });
    });

}