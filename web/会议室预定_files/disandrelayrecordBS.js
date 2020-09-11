define(function(require, exports, module) {
	var utils = require('utils');
	var bs = {
	
		getTabInfo : function() {
			return utils.fetch({
				parser : function(res) {
					return {
						tabs : [ {
							index : 0,
							title : '办件'
						}, {
							index : 1,
							title : '阅件'
						}]
					};
				}
			});
		}
	};

	return bs;
});