module.exports = (app) => {
    app.post('/auth/login', (req, res) => {
        console.log(req.body);
        return res.json({
            username: req.body.username,
            password: req.body.password
        });
    } );
}