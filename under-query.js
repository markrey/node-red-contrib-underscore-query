module.exports = function(RED) {
	"use strict";
	var mustache = require("mustache");
	var _ = require("underscore");
	require("underscore-query")(_);

	function Query(config) {
	    RED.nodes.createNode(this, config);
	    this.query = config.query;
	    var node = this;
		node.on('input',function(msg){
			try {
				var strQuery = mustache.render(node.query, msg);
				var query = {};
				eval('query='+ strQuery);
				var res = _.query(msg.payload, query);
				msg.payload = res;
				node.send(msg);
			} catch (err) {
				node.warn(err)
			}
		});
	}
  	RED.nodes.registerType("Under-Query", Query);
}