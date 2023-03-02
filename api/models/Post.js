const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const PostSchema = new Schema({
    title: {type: String, required: true},
    summary: {type: String, required: true},
    post: {type: String, required: true},
    file: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;