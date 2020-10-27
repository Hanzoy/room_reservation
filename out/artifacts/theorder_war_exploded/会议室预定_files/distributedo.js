define(function(require, exports, module) {
	var utils = require('utils');
	var bs = require('./distributedoBS.js');	
	var disAndRelayReocord = require('./disandrelayrecord/disandrelayrecord');
	var distrecord = require('./disandrelayrecord/distrecord/distrecord');
	var replyrecord = require('./disandrelayrecord/replyrecord/replyrecord');
	var hasDistAuthOptions = true;

	/**
	 * distType 0：传阅	1:分发  2:内部传阅  3:内部分发
	 * distAuthOption 分发后权限
	 * pageType 1：来源分发页面  0：来源其他
	 * 
	 */	
	var viewConfig = {
		initialize : function(wid,distType,distAuthOption,pageType,showCurrentDept,currentNodeId,formdata) {
			this.pushSubView([ disAndRelayReocord,distrecord,replyrecord]);			
			this.showCurrentDept = showCurrentDept;	
			this.userRangeList= formdata.userRangeList;
			var header = "传阅";
			if (distType == 1) {
				header = "分发";
			} else if (distType == 2) {
				header = "内部传阅";
			} else if (distType == 3) {
				header = "内部分发";
			} else if (distType == 4) {
				header = "传阅给保卫处";
			}
			var windowView = utils.loadCompiledPage('distributedoIndexPage', require);
			var title = formdata.TITLE;
			if (_.isEmpty(title)) {
				title = $('#formContainer [data-name="TITLE"]').text();
			}
			// var wid = $(document).data("WID");
			var pInstanceId = formdata.PROCESS_INST_ID;
			if (pInstanceId === "" || pInstanceId === null || pInstanceId === undefined) {
				pInstanceId = $("[data-name='PROCESS_INST_ID']").text();
			}
			
			//渲染分发后权限可选项
			$distAuthOptions = "";
			if (pageType == 1) {
				hasDistAuthOptions = false;			
			} else {
				var distAuthOptions = this.loadPropValues("distAuthOptions");
				var defaultDistAuth = this.loadPropValues("defaultDistAuth");	
				if ($.isEmpty(distAuthOptions)) {
					hasDistAuthOptions = false;					
				} else {					
					$distAuthOptions = this.buildDistAuthOption(defaultDistAuth,distAuthOptions);
				}
			}			
			
			utils.window({
				params : {
					width : '750px',
					height : '500px',
				},
				content : windowView.render({
					header:header,
					hasDistAuthOptions:hasDistAuthOptions,
					distAuthOptions:$distAuthOptions					
				}),
				title : header,
				buttons : [ {
					text : header,
					className : 'bh-btn-primary',
					callback : function() {						
						if($.isEmpty($('#distContainer [data-name="RECEIVE"]').val())) {
				    		 $.warn("接收人不能为空！");
							 return false;
				    	}
						var needSendMsg = false;
						var isClose = false;
				    	var sendTime = "";
				    	$("input[name='DIST_MSG']:checkbox:checked").each(function(){
				    		if ($(this).val() === "0") {
				    			needSendMsg = true;
				    		}
				    		if ($(this).val() === "1") {
				    			if ($.isEmpty($('#distContainer #datetimepicker').val())) {
				    				 $.warn("请选择定时提醒时间！");
				    				 isClose = true;
									 return false;
				    			}
				    			sendTime = $('#distContainer #datetimepicker').val();
				    		}														
						});	
				    	if (isClose) {
				    		return false;
				    	}
						var distAuth = "";
						if (pageType == 1) {
							distAuth = distAuthOption;
						} else {
							if ($("input[name='DIST_AUTH']:checkbox:checked").length > 1) {
								 $.warn(header +"后权限仅能选择一个！");
								 return false;
							}
							$("input[name='DIST_AUTH']:checkbox:checked").each(function(){
								distAuth += $(this).val();							
							});			
						}			
						var userIds = $('#distContainer [data-name="RECEIVE"]').attr('data-user-id').split(',');
					 	var params = {
							distribute : distType,
							distAuth:distAuth,
							userIds : userIds,
							bizKey : wid,
							title : title,
							remark: $("#distContainer .bh-txt-input__txtarea").val(),
							nodeName : $(document).data("taskName") || header,
							processInstanceId : pInstanceId || -1,
							nodeId:currentNodeId,
							needSendMsg:needSendMsg,
							sendTime:sendTime
						};

						bs.distribute(params).done(function(resp) {
							$.success(header + "成功!");
						}).fail(function(resp) {
							$.err(header + "失败!");
						});
					}
				}, {
					text : '取消',
					className : 'bh-btn-default',
					callback : function() {

					}
				} ]
			});
			
			$('#distContainer #datetimepicker').datetimepicker({
			    format: 'YYYY-MM-DD HH:mm:ss'
			});
			$("input[name='DIST_MSG']").click(function(){//点击事件
				_.each($("input[name='DIST_MSG']"),function(item) {
					if (item.checked && item.value === "1") {
						$("#distContainer .bhtc-input-group").toggleClass("bh-hide",false);
					} else {
						$("#distContainer .bhtc-input-group").toggleClass("bh-hide",true);
						$("#distContainer #datetimepicker").val("");
					}
				});
			});
			
			this.eventMap = {
				"[data-action=selectUser]" : this.selectUser				
			};
		},

		loadPropValues:function(key) {
			$value = "";
			var datas = WIS_EMAP_SERV.getData(bs.api.pageModel, 'T_OA_PROPS_QUERY',{PROP_KEY:key});
			var data = datas.rows[0];
			if (!$.isEmpty(data)) {
				$value = data.PROP_VALUE;
			}
			return $value;
		},
		
		buildDistAuthOption: function(defaultDistAuth,distAuthOptions) {
			$distAuthOptions = "";			
			var distAuthOptionsArr = distAuthOptions.split(',');
			if (_.indexOf(distAuthOptionsArr,"1") > -1) {
				$distAuthOptions += '<label class="bh-checkbox-label"><input type="checkbox" name="DIST_AUTH" value="1"';
				if (defaultDistAuth === "1") {
					$distAuthOptions += ' checked ';
				}	
				$distAuthOptions +=	'data-caption="分发"><i class="bh-choice-helper"></i>分发</label>';
			} 
			if (_.indexOf(distAuthOptionsArr,"0") > -1) {
				$distAuthOptions += '<label class="bh-checkbox-label"><input type="checkbox" name="DIST_AUTH" value="0"';
				if (defaultDistAuth === "0") {
					$distAuthOptions += ' checked ';
				}	
				$distAuthOptions +=	'data-caption="传阅"><i class="bh-choice-helper"></i>传阅</label>';
			}
			if (_.indexOf(distAuthOptionsArr,"3") > -1) {
				$distAuthOptions += '<label class="bh-checkbox-label"><input type="checkbox" name="DIST_AUTH" value="3"';
				if (defaultDistAuth === "3") {
					$distAuthOptions += ' checked ';
				}	
				$distAuthOptions += 'data-caption="内部分发"><i class="bh-choice-helper"></i>内部分发</label>';
			}
			if (_.indexOf(distAuthOptionsArr,"2") > -1) {
				$distAuthOptions += '<label class="bh-checkbox-label"><input type="checkbox" name="DIST_AUTH" value="2"';
				if (defaultDistAuth === "2") {
					$distAuthOptions += ' checked ';
				}	
				$distAuthOptions += 'data-caption="内部传阅"><i class="bh-choice-helper"></i>内部传阅</label>';
			}
			return $distAuthOptions;
		},
		
		selectUser : function() {				
			var initUserIds = [];
			var opts = {showCurrentDept:this.showCurrentDept,userRangeList: this.userRangeList};
			initUserIds = $('#distContainer [data-name="RECEIVE"]').attr('data-user-id').split(',');	
			$.selectTree(initUserIds, function(data) {// 选人框关闭时回调函数，data为当前选人控件返回值,
				// 此项必传，用于将选人弹框的返回值设置到页面
				var selUserIds = [];
				var userNames = [];
				$.each(data, function(n, element) {
					selUserIds.push(element.data);
					userNames.push(element.value);
				});
				$('#distContainer [data-name="RECEIVE"]').attr('data-user-id',selUserIds);
				$('#distContainer [data-name="RECEIVE"]').val(userNames);	
			},opts);			
		},

		isStrNull : function(str, removeBlank) {
			if (str && str != null && str != "") {
				str = str.toString();
				if (removeBlank) {
					str = str.replace(/\s/g, "");
				}
				if (str.length < 1) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},
		showDisAndRelayRecord : function(wid) {
			disAndRelayReocord.initialize(wid);
		}
	};

	return viewConfig;
});