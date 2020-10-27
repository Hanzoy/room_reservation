define(function(require) {

	var utils = require('utils');
	
	var common = {
		turningForm : new TuringForm(".bh-docs-page", "./public/doc_resource/" + window.docResource),
		trim : function(str) {
			if (str === undefined || str === null || str === "") {
				return "";
			}
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		
		basicDataRequest : function(url, params) {
			var def = $.Deferred();
			utils.doAjax(url, params).done(function(resp) {
				if (resp.success) {
					def.resolve(resp);
				} else {
					def.reject(resp);
				}
			}).fail(function(resp) {
				def.reject(resp);
			});
			return def.promise();
		},
		commonSaveInfo : function(formdata, startDate, endDate, tableInfo, isClosed){
			//保存上传的附件
			common.turningForm.saveUpload().done(function() {});
			common.basicDataRequest(window.APP_PATH + "/admin/save.do", formdata).done(function(resp) {
				$.msg("保存成功！");
				if (isClosed) {					
					$.bhPaperPileDialog.hide({
						ignoreAllCallback : true
						// 忽略任何回调
					});
					// 关闭当前弹窗
					$(tableInfo).emapdatatable('reloadFirstPage',{'startDate':startDate,'endDate':endDate});
				}
			}).fail(function(resp) {
				var occupy = resp.occupy;
				if(occupy){
					$.each($(".meeting-time-tr"), function(n, element) {
						if(occupy.indexOf("," + n + ",") > -1){
							$(element).find("select").css({"border-color":"red"});
						}
					});
				}
				var errMsg = "";
				if (resp.message != undefined && resp.message != null && resp.message != "") {
					errMsg = resp.message;
				}
				$.err('保存失败！' + errMsg);
//				BH_UTILS.bhDialogWarning({
//					title : '保存失败！',
//					content : errMsg,
//					buttons : [ {
//						text : '确定'
//					} ]
//				});
				$('footer.bh-clearfix').show();
			});
		},
		
		//--------add by minwang01 at 2018-03-28  会议室预定管理列表新增刷新左边的树 start
		renderTree : function(){
        	var setting = {
        			async:{
        				enable: true,
        				type:"post",          			
        				url: window.APP_PATH + "/meetingRoom/getWeekList.do?actionInfo=dateTree",
        				dataFilter:function(treeId,parentNode,resp){
        					if(resp.datas){
        						 _.each(resp.datas, function(node) {
          							if(node.open){
          								startDate = node.startDate;
          								endDate = node.endDate;
          							}
          						 });
        					}
        					return resp.datas;
        				}
        			},
    				data: {
    					key: {
    						name: 'name'
    					},
    					simpleData: {
    						enable: true
    					}
    				},
        			view: {
        				showLine: false,
        				selectedMulti: false
        			},
        			callback: {
                		onClick: this.zTreeOnClick
                	}
        		};        	
        	$('#zTree-all').bhTree({
				setting: setting
			});
		},
		zTreeOnClick: function (event, treeId, treeNode) {
			startDate = treeNode.startDate;
			endDate = treeNode.endDate;
			$('#sysq-index-search').emapAdvancedQuery("clear");
			$('#sysq-index-table').emapdatatable('reloadFirstPage',{'startDate':startDate,'endDate':endDate});    
		}, 
		//--------add by minwang01 at 2018-03-28  会议室预定管理列表新增刷新左边的树 end
		

	};

	return common;
});
