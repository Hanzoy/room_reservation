define(function(require, exports, module) {

	var utils = require('utils');
	var bs = require('./replyrecordBS');
	var common = require('public/js/common');	
	var page = require('public/js/page');
	var initParamQuerySetting = "";
	
	var viewConfig = {
		initialize: function(param){
			var self = this;
			self.bizId = param.bizId;
			initParamQuerySetting = '[[{"name":"IS_FF","value":"0","linkOpt":"and","builder":"equal"},{"name":"IS_FF","value":"2","linkOpt":"or","builder":"equal"}],{"name":"BIZ_ID","value":"'+ param.bizId +'","linkOpt":"and","builder":"equal"}]';
			var view = utils.loadCompiledPage('replyrecordIndexPage',require);
            this.$rootElement.html(view.render({}), true);        
            this.initView();
            $('#replyrecord_index_table').on('click', '[data-action=deleteReplyRecord]',function(e){
				$.confirm("您确定要删除这条记录？", function() {
					var wid =  $(e.target).attr('data-x-wid');
					var taskId =  $(e.target).attr('data-x-taskid');
					var userId =  $(e.target).attr('data-x-userid');
					var params = {
						wid:wid,
						appId:WIS_CONFIG.APPID,
						taskId: taskId,
			    		bizId:self.bizId,
			    		disUserId:userId
					};	
					 common.basicDataRequest(bs.api.delDisReceiverUrl,params).done(function(resp) {
					 	 $.msg("删除成功");				 	
					 	$('#replyrecord_index_table').emapdatatable('reloadFirstPage'); 
					 	$('#zReplyRecordTree').bhTree('destroyTree');
	        			self.renderTree();
					 }).fail(function(resp) {
						 $.err("删除失败！" + (resp.message || ""));
					});
				});
			});
		},

		initView: function() {
			this.renderTree();
			this._initAdvanceQuery();
            this._initTable();
        },
        
        actionDeleteDistRecord: function(e){    
        	var self = this;
        	$.confirm("您确定要删除这条记录？", function() {
        		var wid = $(e.target).attr('data-x-wid');
        		var taskId = $(e.target).attr('data-x-taskid');
				var userId =  $(e.target).attr('data-x-userid');
				var params = {
					wid:wid,
		    		bizId:self.wid,
		    		taskId:taskId,
		    		userId:userId
				};	
				 common.basicDataRequest(bs.api.delDisReceiverUrl,params).done(function(resp) {
				 	 $.msg("删除成功");				 	
				 	$('#replyrecord_index_table').emapdatatable('reloadFirstPage'); 
				 	$('#zDistRecordTree').bhTree('destroyTree');
        			self.renderTree();
				 }).fail(function(resp) {
					 $.err("删除失败！" + (resp.message || ""));
				});
			});
        },       
       
        _initAdvanceQuery: function() {
            var searchData = WIS_EMAP_SERV.getModel(bs.api.pageModel, 'G_DisAndReplyRecord', "search");
            searchData = page.interSearchData(searchData);
            var $query = $('#replyrecordAdvancedQuery').emapAdvancedQuery({
                data: searchData,
                contextPath : WIS_CONFIG.PATH,
                schema: true
            });
            $query.on('search', this._searchCallback);
        },

        _searchCallback: function(e, data, opts) {
        	data = page.interQuerySetting(data);
            $('#replyrecord_index_table').emapdatatable('reload', {
                querySetting: JSON.stringify(data.concat(JSON.parse(initParamQuerySetting)))
            });
        },
        
        _initTable: function() {         	
            var tableOptions = {
                pagePath: bs.api.pageModel,
                action: 'G_DisAndReplyRecord',
                params: {
                	querySetting:initParamQuerySetting,
                },
                customColumns: [{
                    colIndex: '1',
                    type: 'tpl',
                    column: {
                        text: '操作',
                        align: 'center',
                        cellsAlign: 'center',
                        cellsRenderer: function(row, column, value, rowData) {
                        	if (rowData.CREATOR_ID == window.currentUserId && rowData.STATUS == 0) {
                        		    return '<a href="javascript:void(0)" data-action="deleteReplyRecord" data-x-wid=' + rowData.WID + ' data-x-userid=' + rowData.USER_ID + ' data-x-taskid=' + rowData.TASK_ID +' >' + '删除' + '</a>';
                              } else {
                            	  return '<div></div>';
                              }
                        }
                    }
                },{
                	colField: 'NAME',
                    type: 'tpl',
                    column: {
                        cellsRenderer: function(row, column, value, rowData) {
                        	if (rowData.STATUS == 1) {
                        		return '<div class="bh-pull-left">' + value + '<i class="iconfont icon-check bh-mh-8 bh-color-success-2"></i></div>';
                        	} else {
                        		return '<div class="bh-pull-left">' + value + '</div>';
                        	}
                            
                        }
                    }
                },{
                	colField: 'STATUS',
                    type: 'tpl',
                    column: {
                        cellsRenderer: function(row, column, value, rowData) {
                        	if (value == 0) {
                        		return '<div class="bh-pull-left">未办</div>';
                        	} else {
                        		return '<div class="bh-pull-left">已办</div>';
                        	}  
                        }
                    }
                }]
            };
            $('#replyrecord_index_table').emapdatatable(tableOptions);
        },
        
        renderTree: function(searchParams){ 
        	var originalParams = ["bizId", this.bizId,"type","0,2"];
        	if (!_.isEmpty(searchParams)) {
        		_.each(searchParams, function(element) {
        			originalParams.push(element);
    			});
        	}
        	var setting = {  
        			async:{         				
        				enable: true,
        				type:"post",          			
        				url: contextPath + "/sys/oapublic/distAndRelayRecordTree.do",        				
        				otherParam: originalParams,
        				dataFilter:function(treeId,parentNode,resp){
        					return resp.datas;
        				}
        			},
    				data: {
    					key: {
    						name: 'label'
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
        	$('#zReplyRecordTree').bhTree({
				setting: setting
			});
        },
        
        zTreeOnClick: function (event, treeId, treeNode) {         	
        	if (treeNode.isParent) {
        		$('#replyrecord_index_table').emapdatatable('reloadFirstPage');      
        	} else {  
        		var params = {DEPT_ID:treeNode.id};
         		var searchdata = $('#replyrecordAdvancedQuery').emapAdvancedQuery("getValue");
         		if (!_.isEmpty) {
         			searchdata = page.interQuerySetting(searchdata);
         			params.push({querySetting:JSON.stringify(searchdata)});
         		}        		
         		$('#replyrecord_index_table').emapdatatable('reload', params);           
        	}   
        }
	};

	return viewConfig;
});