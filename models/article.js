var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require('mongoose-relationship');

var articleSchema = mongoose.Schema({
    authors: [{ type: Schema.ObjectId, ref: 'User',  childPath: "articles" }],
    section: String,
    title: String,
    body: String,
    tags: [String],
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now }
});

articleSchema.plugin(relationship, { relationshipPathName:"authors" });

module.exports = mongoose.model('Article', articleSchema);