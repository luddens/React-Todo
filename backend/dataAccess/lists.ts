const mongoose = require("mongoose");
var uniqid = require("uniqid");

const ListSchema = mongoose.Schema({
	memberID: {
		type: String,
		index: true
	},
	listID: {
		type: String,
		index: false
	},
	creationDate: {
		type: Number,
		index: false
	},
	list: {
		type: Array,
		index: false
	}
});

var List = mongoose.model("List", ListSchema)

module.exports = List;

module.exports.getListbyUserId = function(memberID, callback){
	l(memberID);
	List.findOne({ memberID: memberID}, callback);
};

module.exports.updateList = function(memberID, listData, callback){
	listData.listID = uniqid();
	List.findOneAndUpdate( { memberID : memberID }, listData, { upsert : true }, callback );
	// List.updateOne( { memberID : memberID }, listData, { upsert : true }, callback );
};


export default {};