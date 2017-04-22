const mongoose = require('mongoose');

const Schema = mongoose.Schema ;
const PostSchema = new Schema(
    {
        name: {type: String},
        content: {type: String},
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);