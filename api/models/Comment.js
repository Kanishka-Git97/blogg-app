const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const CommentSchema = new Schema({
    comment: {type: String, require: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    post: {type: Schema.Types.ObjectId, ref: 'Post'}
},{
    timestamps: true,
})

const CommentModel = model('Comment', CommentSchema);

module.exports = CommentModel;