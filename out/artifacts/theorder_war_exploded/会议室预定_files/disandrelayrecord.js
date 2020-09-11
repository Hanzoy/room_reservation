define(function(require, exports, module) {

	var utils = require('utils');
	var bs = require('./disandrelayrecordBS');	
	var distrecord = require('./distrecord/distrecord');
	var replyrecord = require('./replyrecord/replyrecord');
	
	var viewConfig = {
		initialize: function(wid) {		
			var self = this;
			self.wid = wid;
			var indexView = utils.loadCompiledPage('disandreplayrecordIndexPage',require);			
			$.bhPaperPileDialog.show({
				content: indexView.render(),
				render: function() {					
				}
			});	
			this.initTab();
		},

		initTab : function() {
			var self = this;
			var tabTpl = utils.loadCompiledPage('disandreplayTabTpl', require);
			bs.getTabInfo().done(function(model) {
				$('.disandreplyrecord-tab-container').html(tabTpl.render(model), true);
				$('.disandreplyrecord-tab').jqxTabs({
					position : 'top'
				});
				self.initTabContent(0);
				$('.disandreplyrecord-tab').on('tabclick', function(event) {
					var tabIndex = event.args.item;
					self.initTabContent(tabIndex);
				});
			});
		},

		initTabContent : function(tabIndex) {		
			var $element = $('.disandreplyrecord-tab-content-' + tabIndex);
			switch (tabIndex) {
			case 0:
				distrecord.$rootElement = $element;
				distrecord.initialize({bizId:this.wid});
				break;
			case 1:
				replyrecord.$rootElement = $element;
				replyrecord.initialize({bizId:this.wid});
				break;				
			default:
				;
			}
		}
	};

	return viewConfig;
});