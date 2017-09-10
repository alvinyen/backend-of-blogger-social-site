const mongoose = require('mongoose');
const CouterModel = require('./CounterModel');

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    post_id: { type: Schema.Types.ObjectId },
    name: { type: Schema.Types.String },
    when: { type: Schema.Types.Date },
    comment: { type: Schema.Types.String },
    commentId: { type: Schema.Types.Number },
  },
  { timestamps: true }
);

// don't use arrow function here!!!
// arrow function會自動綁定外層的this，且綁了就不能再改..
// 這邊要的是動態的 this，也就是comment/document entiry
// 使用arrow function千萬要看時機...不要習慣了就全都用啊！！
commentSchema.pre('save', function (next) {
  CouterModel.findByIdAndUpdate({ _id: 'commentId' }, { $inc: { seq: 1 } }, { new: true, upsert: true }, (err, counter) => {
    if (err) { console.log('commentSchema pre save  error', err); return next(err); }
    this.commentId = counter.seq;
    next();
  });
});

module.exports = mongoose.model('Comment', commentSchema);
                                // collection name will be "comments"

// post_id: this.props.post_id,
// id: this.props.comments.commentsList.size,
// name: this.props.auth.currentUser.name, 
// when: new Date().valueOf(), 
// comment: this.state.message,