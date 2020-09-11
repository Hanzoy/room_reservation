define(function(require) {

  var utils = require('utils');
  var bs = require('./tjhysjBS');
  var common = require('public/js/common');
  var page = require('public/js/page');

  /********子页面********/
  var viewConfig = {
    initialize: function(params) {
      /********注册子页面********/

    	this.params = params;
    	this.meetRoomName = params.meenRoomName;
    	var self = this;
    	common.basicDataRequest(window.APP_PATH + "/form/queryDatesOfThisWeek.do", {
    		date : params.date
		}).done(function(resp) {
			self.initTjhysj(resp);
		});
    	
      /********页面内事件通过eventMap统一管理********/
      this.eventMap = {
        '[data-action="tjhysj_search"]': this.tjhysjSearch
      };
    },
    
    initTjhysj: function(resp) {
    	var self = this;
    	var indexView = utils.loadCompiledPage('tjhysjIndexPage', require);
    	var buttons = [ {
  				text : '确定',
  				className : 'bh-btn-warning',
  				callback : function() {
  			  	   var flag = self.actionConfirm();
  			  	   if(!flag){
  			  		   return false;
  			  	   }
  				}
  			}, {
  				text : '关闭',
  				className : 'bh-btn-default',
  				callback : function() {
  				}
  			} ];
    	BH_UTILS.bhWindow(indexView.render(), 
    			'选择会议时间-<' + self.meetRoomName + '>',buttons,
  			{
  				width : '700px',
  				height : '550px',
  			});
        this.initAdvancedQueryAndTable(resp);
    },

    initAdvancedQueryAndTable: function(resp) {
    	
    	// 初始化日期 
		$('#tjhysj_beginDate').bhDateTimePicker({
			format: 'YYYY-MM-DD',
			useCurrent : false
		});
		$('#tjhysj_beginDate').bhDateTimePicker('setValue', resp.weekFirstDate);
		$('#tjhysj_endDate').bhDateTimePicker({
			format: 'YYYY-MM-DD',
			useCurrent : false
		});
		$('#tjhysj_endDate').bhDateTimePicker('setValue', resp.weekLastDate);
		
		$("#tjhysj_beginDate").on("dp.change", function(e) {
			$("#tjhysj_endDate").bhDateTimePicker('minDate', e.date);
		});
		$("#tjhysj_endDate").on("dp.change", function(e) {
			$("#tjhysj_beginDate").bhDateTimePicker('maxDate', e.date);
		});
		
		var datamodel = WIS_EMAP_SERV.getModel(bs.api.pageModel, 'queryMeetRoomStatusPeriod', "grid");
		var tableOptions = {
				datamodel: datamodel,
				url: window.APP_PATH + "/meetRoomOccupy/queryMeetRoomStatusPeriod.do",
				params: {
					meetRoomId : this.params.meetRoomId,
					beginDate : resp.weekFirstDate,
					endDate : resp.weekLastDate
				},
				action: 'queryMeetRoomStatusPeriod',
				customColumns: this.getCustomColumns(),
				pageable : false
			};
		$('#tjhysj-index-table').emapdatatable(tableOptions);
		
    },

    getCustomColumns: function() {
      var customColumns = [{
          colIndex: '0',
          type: 'checkbox'
      }, {
		  colField : "date",
		  type : "tpl",
		  column : {
			  cellsRenderer : function(row, column, value, rowData) {
				  return page.formatDateDisplay(value);
	          }
		  }
	  }, {
		  colField : "status",
		  type : "tpl",
		  column : {
			  cellClassName : function (row, dataField, cellText, rowData) {
	                if (cellText == "空闲") {
	                	return "tjhysj-status-available";
	                } else if (cellText == "占用") {
	                	return "tjhysj-status-occupied";
	                }
	            }
		  }
	  }];

      return customColumns;
    },
	
    /**
     * 根据时间范围搜索
     */
    tjhysjSearch : function() {
    	var beginDate = $.trim($('#tjhysj_beginDate').bhDateTimePicker('getValue'));
		var endDate = $.trim($('#tjhysj_endDate').bhDateTimePicker('getValue'));
		if (!beginDate || !endDate) {
			$.err("请选择开始时间和结束时间");
			return false;
		}
		if (beginDate  > endDate) {
			$.err("开始时间必须在结束时间之前");
			return false;
		}

		$('#tjhysj-index-table').emapdatatable("reloadFirstPage", {
			meetRoomId : this.params.meetRoomId,
			beginDate : page.formatDateParam(beginDate),
			endDate : page.formatDateParam(endDate)
		});
		
    },
    
	/**
	 * 选择日期
	 */
    actionConfirm : function() {
  	    var selectedRecords = $("#tjhysj-index-table").emapdatatable("checkedRecords");
  	    if (selectedRecords.length == 0) {
            BH_UTILS.bhDialogWarning({
				title : '提示！',
				content : '请选择一条记录！',
				buttons : [ {
					text : '确定'
				} ]
			});
            return false;
        }
  	    if(this.params.selectType == 0 && selectedRecords.length > 1){
  	    	  BH_UTILS.bhDialogWarning({
  				title : '提示！',
  				content : '只能选择一条记录！',
  				buttons : [ {
  					text : '确定'
  				} ]
  			});
             return false;
  	    }
  	    var selectDates = [];
		for ( var i in selectedRecords) {
			selectDates.push(selectedRecords[i].date);
		}
  	    if (this.params.callbackFunc) {
		    this.params.callbackFunc(selectDates,this.params.elementObject);
	    }
  	  return true;
    }
  };
  return viewConfig;
});
