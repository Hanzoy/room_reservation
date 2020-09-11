define(function(require) {

  var utils = require('utils');
  /********子页面********/
  var viewConfig = {
    initialize: function() {
    	var self = this;
    	$.post(contextPath + "/sys/oaxldrc/xldrc/queryLeadact.do", {
    		begintTime:currentDate + " 06:00:00",
            endTime:currentDate + " 23:59:59",
		}).done(function(resp) {
			self.initAdvancedQueryAndTable(resp);
		});
	    /********页面内事件通过eventMap统一管理********/
	    this.eventMap = {
	    	'#leaderInfo@mouseenter': this.leadactDetail,
	    	'#leaderInfo@mouseleave': this.leadactDetailOut,
	    	 '[data-action="leader_search"]': this.leaderSearch
	    };
    },
    initAdvancedQueryAndTable : function(resp){
    	var indexView = utils.loadCompiledPage('leaderFreeIndexPage', require);
    	var buttons = [{
				text : '关闭',
				className : 'bh-btn-default',
				callback : function() {
				}
			} ];
    	BH_UTILS.bhWindow(
    				indexView.render(), '校领导空闲信息',buttons,
			{
				width : '700px',
				height : '450px',
		});
    	// 初始化日期 
		$('#beginDate').bhDateTimePicker({
			format: 'YYYY-MM-DD',
			useCurrent : true
		});
		$('#beginDate').bhDateTimePicker('setValue', currentDate);
		var tableInfo = utils.loadCompiledPage('../../public/commonpage/leaderFree/leaderInfo');
		$('#leader-index-table').html(tableInfo.render({leaderList:resp.leaderInfo}));
    		
    },
    leadactDetailOut : function(){
    	$("#bhPopover").remove();
    },
    leadactDetail : function(event){
    	var $target = $(event.currentTarget);
    	var bt = $target.attr("data-bt");
    	var et = $target.attr("data-et");
    	var contentInfo = "<div>开始时间："+bt+"</div><div>结束时间："+et+"</div>";
		$.bhPopOver({
			content: contentInfo,
			selector: $target,
			width: 210,
			height: 90,
			showCloseButton: false
		});
    },
    leaderSearch : function(){
    	var dateInfo = $.trim($('#beginDate').bhDateTimePicker('getValue'));
    	$.post(contextPath + "/sys/oaxldrc/xldrc/queryLeadact.do", {
    		begintTime:dateInfo + " 06:00:00",
            endTime:dateInfo + " 23:59:59",
		}).done(function(resp) {
			var tableInfo = utils.loadCompiledPage('../../public/commonpage/leaderFree/leaderInfo');
			$('#leader-index-table').html(tableInfo.render({leaderList:resp.leaderInfo}));
		});
    }
  };
  return viewConfig;
});
