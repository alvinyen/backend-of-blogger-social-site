const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CouterModel = require('./CounterModel');

const postSchema = new Schema(
  {
    name: { type: String },
    content: { type: String },
    postId: { type: Number },
  },
  { timestamps: true }
);

                      // don't use arrow function here!!!
                      // arrow function會自動綁定外層的this，且綁了就不能再改..
                      // 這邊要的是動態的 this，也就是post/document entiry
                      // 使用arrow function千萬要看時機...不要習慣了就全都用啊！！
postSchema.pre('init', function (next) {
  CouterModel.findByIdAndUpdate({ _id: 'postId' }, { $inc: { seq: 1 } }, { new: true, upsert: true }, (err, counter) => {
    if (err) { console.log('postSchema pre save  error', err); return next(err); }
    this.postId = counter.seq;
    next();
  });
});

module.exports = mongoose.model('Post', postSchema);
                                // collection name will be posts
