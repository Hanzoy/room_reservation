define(function(require, exports, module) {
	var utils = require('utils');
	var bs = {
			api : {
				pageModel : 'modules/distribute.do',
				distributeUrl : contextPath + "/sys/oahysyd/todistribute.do",
			},

			distribute: function(params) {
				var def = $.Deferred();
				utils.doAjax(this.api.distributeUrl,params).done(function(resp) {
					if (resp.success) {
						def.resolve(resp);
					} else {
						def.reject(resp);
					}
				}).fail(function(resp) {
					def.reject(resp);
				});
				return def.promise();
			}
	};
	return bs;
});
