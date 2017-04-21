module.exports = (app) => {
    app.post('/test', (req, res) => {
        console.log(req.body);
        return res.json({
            name: req.body.name,
            age: req.body.age
        });
    } );
}