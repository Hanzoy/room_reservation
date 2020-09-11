define(function(require) {

	var utils = require('utils');
	var bs = require('./hysydBS');
	var tjyh4appro = require('../tjyh4appro/tjyh4appro');
	var common = require('public/js/common');
	var page = require('public/js/page');
	var oacomponent = require('public/js/oacomponent');

	/** ******子页面******* */
	var tjhysj = require('public/commonpage/tjhysj/tjhysj');
	var bghysj = require('public/commonpage/bghysj/bghysj');
	var leaderFree =require('public/commonpage/leaderFree/leaderFree');
	var distribute = require('modules/distribute/distributedo/distributedo');
	var distributerecord = require('modules/distribute/distributedo/disandrelayrecord/disandrelayrecord');
	var c_wid = "";
	
	var viewConfig = {
		initialize : function(params) {
			/** ******注册子页面******* */
			this.pushSubView([tjyh4appro, tjhysj, bghysj,leaderFree,distribute,distributerecord]);
			var self = this;
			this.params = params;
//			this.meetingDate = params.meetingDate;
			this.meetingDateDisplay = page.formatDateDisplay(params.meetingDate);
//			this.meetRoomId = params.meetRoomId;
			var meetRoomName = "";
			if (params.meetRoomId != "other_meetingroom") {
				meetRoomName = params.meetRoomName;				
			}
			this.meetRoomInfos = new Array( {
				meetRoomId : params.meetRoomId,
				meetRoomName : meetRoomName,
				meetingDate : params.meetingDate
			} );
			this.callbackFunc = params.callbackFunc;
			this.nextUserArr = [];
			this.nextUserArrSeled = [];
			this.isNextUserMultiSel = [];
			this.isFullschool = false;
			this.actionType = 0; // 动作类型：保存 = 1；提交 = 2
			this.commentContainer = [];
			this.currentNodeAttrs = [];
			this.showInWeek = 0;
			var indexView = utils.loadCompiledPage('hysydIndexPage', require);
			$.post(window.APP_PATH + "/prevForm.do").done(function(resp) {
				self.showInWeek = resp.showInWeek;
				$.bhPaperPileDialog.show({
					content : indexView.render({
						formTitle : resp.formTitle,
						meetRoomId : params.meetRoomId,
						meetRoomName : meetRoomName,
						meetingDate : self.meetingDateDisplay
					}),
					render : function() {
						// label两端对齐
						setTimeout(function() {
							page.formatMeetLabel();
							self.footerAdaptive();
						}, 0);
					
						var authorId = "";
						currentNodeAttrs = resp.nodeAttrs;
						oacomponent.formdata = {};
						if ($.isEmpty(params) || $.isEmpty(params.wid)) {
							// params.wid为空，证明是拟稿，先从后台取一个wid值
							c_wid = BH_UTILS.doSyncAjax(window.APP_PATH + "/form/getGUID.do");
							authorId = window.currentUserId;
							oacomponent.formdata.WID = c_wid;
						} else {
							c_wid = params.wid;
							var data = WIS_EMAP_SERV.getData(bs.api.formModel, 'T_OA_MEETING_QUERY', {
								WID : params.wid
							});
							oacomponent.formdata = data.rows[0];
							authorId = data.rows[0].AUTHOR_ID;
						}
						oacomponent.zhuozheng({
							WID : c_wid,
							canCreateWord : true,
							isStartFlow : true
						});
						oacomponent.oacomment({
							WID : c_wid
						});
						oacomponent.oangbm({
							authorId : authorId
						});
						/**
						 * 渲染OA文件编号组件
						 */
						oacomponent.oafilenumber({
							canBh : resp.nodeAttrs.canBh || false,
							isStartFlow : true
						});
						/**
						 * oa选人地址簿组件
						 */
						oacomponent.selectuser();
						self.renderForm(self.params,c_wid);
						if (resp.nextNodeItems.length > 1) {
							$("#nextNode").html("<select id='selectNode' name='selectNode' class='bh-form-control bh-mr-16'></select>");
							$.each(resp.nextNodeItems, function(index, e) {
								$("#selectNode").append("<option value='" + e.nodeId + "'>" + e.nodeName + "</option>");
								self.isNextUserMultiSel.push({
									nodeId : e.nodeId,
									isMultiSel : e.isMultiSel == "1"
								});
							});
						} else {
							var nodeItem = resp.nextNodeItems[0];
							$("#nextNode").html("<p class='bh-form-static bh-ph-8' style='background-color: #f0f1f9;'>" + nodeItem.nodeName + "</p><input type=hidden name='selectNode' id='selectNode' value='" + nodeItem.nodeId + "' />");
							self.isNextUserMultiSel.push({
								nodeId : nodeItem.nodeId,
								isMultiSel : nodeItem.isMultiSel == "1"
							});
						}
						self.renderNextUsers(false,"","");
						$("#sendRmdMsgCb").click(function() {
							if ($(this).attr("checked")) {
								$(this).attr("checked", false);
							} else {
								$(this).attr("checked", true);
							}
						});
						
						// 会议室名称备注
						$(".meet-room-name").keydown(function(e) {
//							var meetRoomName = $(e.target).val();
							var meetRoomName = $(e.target).next().val();
							var meetRoomId = $(e.target).next().next().val();
							if (meetRoomId != "other_meetingroom") {
								var cursorPosition = page.getCursorPosition(e.target);
								if (cursorPosition < meetRoomName.length) {
									return false;
								}
								// Backspace & Delete
								if (cursorPosition == meetRoomName.length
										&& (e.keyCode == 8 || e.keyCode == 46)) {
									return false;
								}
							}
						});
						
						//渲染分发传阅按钮
						if (!$.isEmpty(params) && !$.isEmpty(params.wid)) {
							self.loadCurrentNodeAttrs();
						}
						
						/** 增加消息提醒配置 2018-3-16 by zongwei begin  */
						if(window.WIS_CONFIG.IS_SEND_MESSAGE == 'true'){
							$('#needSendMsg').val("1");
						}
						/** 增加消息提醒配置 2018-3-16 by zongwei end  */
						
					},

					closeBefore : function() {
						BH_UTILS.bhDialogWarning({
							title : '页面即将关闭！',
							content : '会议申请单未保存，是否关闭？',
							buttons : [ {
								text : '确定',
								callback : function() {
									$.bhPaperPileDialog.hide({
										ignoreAllCallback : true
									});
								}
							}, {
								text : '取消',
								callback : function() {

								}
							} ]
						});
					},
					close : function() {
						if (self.params.type === 3) {
							self.callbackFunc();			
						} else if (self.actionType === 1) {
							$('#cg-index-table').emapdatatable('reloadFirstPage');// 起草保存，刷新草稿箱列表
						} else if (self.actionType === 2) {
							$(".jqx-tabs-title-container li")[0].click();
						}
					}
				});
				
				//add by ly at 2017-10-13 新版流程变量筛选 start
				$(".bh-docs-page").on('turingFormDataChange', function(e, obj){
					var colName = obj.name;
					var colVal = obj.value;
					var usrDefine = $(obj.control).parent().attr('turing-custom-property');
					
					if (usrDefine != '' && usrDefine != undefined && usrDefine != null){
						usrDefine = JSON.parse(usrDefine);
						var filterNodeOrActor = usrDefine[colName];
						
						if ('node' === filterNodeOrActor){
							$.post(window.APP_PATH + "/getBpmVarFilterNodeOrActor.do",{
								"colName":colName, 
								"colValue":colVal, 
								"filterNodeOrActor":filterNodeOrActor,
								"taskId":$(document).data("taskId")
							}).done(function(resp) {
								if (resp.nextNodeItems != null && resp.nextNodeItems != undefined && resp.nextNodeItems != ''){
									if (resp.nextNodeItems.length > 1) {
										$("#nextNode").html("<select id='selectNode' name='selectNode' class='bh-form-control bh-mr-16'></select>");
										$.each(resp.nextNodeItems, function(index, e) {
											$("#selectNode").append("<option value='" + e.nodeId + "'>" + e.nodeName + "</option>");
											self.isNextUserMultiSel.push({
												nodeId : e.nodeId,
												isMultiSel : e.isMultiSel == "1"
											});
										});
									} else {
										var nodeItem = resp.nextNodeItems[0];
										$("#nextNode").html("<p class='bh-form-static bh-ph-8' style='background-color: #f0f1f9;'>" + nodeItem.nodeName + "</p><input type=hidden name='selectNode' id='selectNode' value='" + nodeItem.nodeId + "' />");
										self.isNextUserMultiSel.push({
											nodeId : nodeItem.nodeId,
											isMultiSel : nodeItem.isMultiSel == "1"
										});
									}
									self.renderNextUsers(false,"","");
								}
							});
						}
						else if ('actor' === filterNodeOrActor){
							self.renderNextUsers(true,colName,colVal);
						}
					}
				});
				//add by ly at 2017-10-13 新版流程变量筛选 end
				
				
				$(".jqx-window-modal:eq(0)").hide();
			});

			/** ******页面内事件通过eventMap统一管理******* */
			this.eventMap = {
				'[data-action="hysyd_save"]' : this.actionSave,
				'[data-action="hysyd_saveClose"]' : this.actionSave,
				'[data-action="提交"]' : this.actionPublish,
				'[data-action="leader_free"]' : this.leaderFreeInfo,
				'[data-action="返回"]' : this.back,
				'#selectNode@change' : this.changeNode,
				'#selNextUsers@change' : this.changeUser,
				'#choosePeople #cpnfsBtn' : this.choosePeople,
				'#choosePeople #cpfsBtn' : this.initTjyh,
				'[data-action="hysyd_changeMeetRoom"]' : this.changeMeetRoom,
				'[data-action="hysyd_addMeetRoom"]' : this.addMeetRoom,
				'[data-action="hysyd_deleteMeetRoom"]' : this.deleteMeetRoom,
				'[data-action="hysyd_addMeetTime"]' : this.addMeetTime,
//				'[data-action="hysyd_deleteMeetTime"]' : this.deleteMeetTime,
				'[data-action="hysyd_updMeetTime"]':this.updMeetTime,
				'[data-action="分发"]' : this.actionDistribute,
				'[data-action="内部分发"]' : this.actionInterDistribute,
				'[data-action="传阅"]' : this.actionRelay,
				'[data-action="内部传阅"]' : this.actionInterRelay,
				'[data-action="分发传阅监控"]' : this.showDisAndRelayRecord
			};
		},

		renderForm : function(params,c_wid) {
			var datamodel = WIS_EMAP_SERV.getModel(bs.api.formModel, "T_OA_MEETING_QUERY", "form");
			bs.turningForm.loadPage2(datamodel, {
				readonly : false,
				extvars : window.extvars
			});
			if (!$.isEmpty(params) && !$.isEmpty(params.wid)) {
				// params参数里有wid，证明是已保存过的数据
				var data = WIS_EMAP_SERV.getData(bs.api.formModel, 'T_OA_MEETING_QUERY', {
					WID : params.wid
				});
				bs.turningForm.setValue(data.rows[0]);
			} else {
				utils.doAjax(window.APP_PATH + "/form/init.do").done(function(resp) {
					resp.WID = c_wid;
					bs.turningForm.setValue(resp);
				});
			}
		},

		initTabContent : function(tabIndex) {
			var $element = $('.sw-tab-content-' + tabIndex);
			switch (tabIndex) {
			case 0:
				zbsw.$rootElement = $element;
				zbsw.initialize();
				break;
			case 1:
				bjsw.$rootElement = $element;
				bjsw.initialize();
				break;
			case 2:
				cg.$rootElement = $element;
				cg.initialize();
				break;
			default:
				;
			}
		},

		changeNode : function() {
			$("#submitBtn").attr("data-action", "");
			$("#submitBtn").attr("disabled", true);
			$("#sendRmdMsgDiv").css("display", "none");
			$("#sendRmdMsgCb").attr("checked", false);
			this.renderNextUsers(false,"","");
		},

		renderNextUsers : function(flag,colName,colVal) {
			var self = this;
			$("#choosePeople").hide();
			$('#nextUserIds').val("");
			var nodeId = $("#selectNode").val();
			var nodeName = $("#selectNode").find("option:selected").text();
			if (nodeId === undefined || nodeId === "") {
				$("#choosePeople").html("无");
				$("#choosePeople").show();
				return;
			}
			$.post(window.APP_PATH + "/getNextNodeUsers.do", {
				taskId : $(document).data("taskId"),
				nextNodeId : nodeId,
				
				nextNodeName : nodeName,
				bpmFilterActor : flag,
				colName : colName,
				colValue : colVal
			}).done(function(resp) {
				// 清空已选择人员
				self.isFullschool = false;
				self.nextUserArr = [];
				self.nextUserArrSeled = [];
				if (resp.code === "2") {
					// 获取办理人失败
					// $.err(resp.msg || "获取下一步办理人失败！");
					$("#choosePeople").html("<p class='bh-form-static bh-ph-8' style='background-color: #f0f1f9;'></p>");
					return;
				} else if (resp.code === "1") {
					// 无办理人或获取办理人失败
					$("#choosePeople").html("<p class='bh-form-static bh-ph-8' style='background-color: #f0f1f9;'>无</p>");
				} else if (resp.isFullschool) {
					$("#choosePeople").html('<input class="bh-form-control bh-mr-16" type="text" readonly /><div id="cpfsBtn" class="choose-btn"></div>');
					$("#sendRmdMsgDiv").css("display", "block");
					self.nextUserArr = resp.datas.TABLE.rows;
					self.isFullschool = true;
				} else if (resp.datas.TABLE.rows.length === 1) {
					// 只有一个办理人无需选择
					$("#choosePeople").html("<p class='bh-form-static bh-ph-8' style='background-color: #f0f1f9;'>" + resp.datas.TABLE.rows[0].xm + "(" + resp.datas.TABLE.rows[0].dept + ")</p>");
					$('#nextUserIds').val(resp.datas.TABLE.rows[0].zgh);
					$("#sendRmdMsgDiv").css("display", "block");
				} else if (resp.datas.TABLE.rows.length > 1) {
					self.nextUserArr = resp.datas.TABLE.rows;
					// 多个办理人需选择
					if (self.isUserMultiSelect(nodeId)) {
						// 多选 - 弹出框
						$("#choosePeople").html('<input class="bh-form-control bh-mr-16" type="text" readonly /><div id="cpnfsBtn" class="choose-btn"></div>');
					} else {
						// 单选 - 下拉框
						$('#nextUserIds').val(resp.datas.TABLE.rows[0].zgh);
						$("#choosePeople").html("<select id='nextUserIds' class='bh-form-control bh-mr-16'></select>");
						$.each(resp.datas.TABLE.rows, function(index, e) {
							$("#nextUserIds").append("<option value='" + e.zgh + "'>" + e.xm + "(" + e.dept + ")</option>");
						});
						$('#nextUserIds').searchableSelect();
					}
					$("#sendRmdMsgDiv").css("display", "block");
				}
				$("#choosePeople").show();
				$("#submitBtn").attr("disabled", false);
				$("#submitBtn").attr("data-action", "提交");
			});
		},

		choosePeople : function() {
			var self = this;
			if (this.nextUserArr === undefined || this.nextUserArr === null || this.nextUserArr === [] || this.isNextUserMultiSel === undefined || this.isNextUserMultiSel === null || this.isNextUserMultiSel === []) {
				$.err("无可选择的办理人!");
				return;
			}
			var nodeId = $("#selectNode").val();
			if (nodeId === undefined || nodeId === null || nodeId === "") {
				$.warn("请选择流程节点！");
				return;
			}
			var win = $.bh_choose({
				title : '审批人列表',
				leftLocalData : self.nextUserArr,
				id : 'zgh',
				type : 'get',
				multiSelect : true,
				leftSourceAction : 'TABLE',
				placeholder : '搜索姓名或工号',
				rightLocalData : self.nextUserArrSeled,
				searchKeyName : 'searchVal',
				localSearchField : 'xm,zgh',
				rightcellsRenderer : function(row, column, value, rowData) {
					return '<p class="gm-member-row bh-clearfix" >' + ' <span class=" bh-col-md-6" style="width:100%" row="' + (row) + '">' + rowData.xm + '<span class="bh-ph-8">(' + rowData.dept + ')</span></span></p>';
				},
				leftcellsRenderer : function(row, column, value, rowData) {
					return '<p class="gm-member-row bh-clearfix" >' + ' <span class=" bh-col-md-6" style="width:100%" row="' + (row) + '">' + rowData.xm + '<span class="bh-ph-8">(' + rowData.dept + ')</span></span></p>';
				},
				callback : function(result) {
					self.selectUserCallback(result);
				}
			});
			win.show();
		},

		initTjyh : function(users) {
			var self = this;
			tjyh4appro.initialize({
				initUsers : this.nextUserArr,
				selected : this.nextUserArrSeled,
				callbackFunc : function(datas) {
					self.selectUserCallback(datas);
				},
				showNoDept : true
			});
		},

		selectUserCallback : function(result) {
			this.nextUserArrSeled = result;
			var nextUserNames = [];
			var nextUserIds = [];
			result.forEach(function(item) {
				nextUserNames.push(item.xm);
				nextUserIds.push(item.zgh);
			});
			$('#choosePeople .bh-form-control[type="text"]').val(nextUserNames.join(', '));
			$('#nextUserIds').val(nextUserIds.join(','));
		},

		changeUser : function(event) {
			$('#nextUserIds').val($(event.target).val());
		},

		actionSave : function(event) {
			var self = this;
			$type = $(event.currentTarget).attr('data-x-type');
			var $validate = bs.turningForm.isVaild();
			if (!$validate) {
				return;
			}
			
			//--校验会议室时间--start
			var checkResult = this.checkMeetingTime();
			if(!checkResult.flag){
				BH_UTILS.bhDialogWarning({
					title : '校验不通过！',
					content : checkResult.msg,
					buttons : [ {
						text : '确定'
					} ]
				});
				return;
			}
			//--校验会议室时间--end
			var formdata = bs.turningForm.getValue();
			if ($.isEmpty(this.params) || $.isEmpty(this.params.wid)) {
				if (this.showInWeek == 2) {
					formdata.SHOW_INWEEK = 1;
					formdata.SHOW_INWEEK_DISPLAY = "是";
				} else if (this.showInWeek == 0) {
					formdata.SHOW_INWEEK = 0;
					formdata.SHOW_INWEEK_DISPLAY = "否";
				}
			}
			formdata = $.extend(formdata, {
				formReadonly : false
			});
			var roomOccupy = this.saveMeetRoomOccupy(formdata);
			if (roomOccupy == null) {
				return;
			}
			formdata = $.extend(formdata, roomOccupy);
			//保存上传的附件
			bs.turningForm.saveUpload().done(function() {});
			if ($type == 1) {
				$('footer.bh-clearfix').hide();
			}			
			bs.basicDataRequest("formSave", formdata).done(function(resp) {
				self.actionType = 1;
				var tipMsg = "";
				if (self.params === undefined || self.params === null) {
					tipMsg = "请至草稿页面查看。";
				}
				$.success('会议申请单已成功保存。' + tipMsg);
				if ($type == 1) {
					$.bhPaperPileDialog.hide({
						ignoreCloseBeforeCallback : true
					});
				} else {
					self.loadCurrentNodeAttrs();
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
				BH_UTILS.bhDialogWarning({
					title : '保存失败!',
					content : errMsg,
					buttons : [ {
						text : '确定'
					} ]
				});
				$('footer.bh-clearfix').show();
			});
		
		},

		//提交流程
		actionPublish : function() {
			var self = this;
			var flag = bs.turningForm.isVaild();
			if (!flag) {
				return false;
			}
			
			//--校验会议室时间--start
			var checkResult = this.checkMeetingTime();
			if(!checkResult.flag){
				BH_UTILS.bhDialogWarning({
					title : '校验不通过!',
					content : checkResult.msg,
					buttons : [ {
						text : '确定'
					} ]
				});
				return;
			}
			//--校验会议室时间--end
			
			var formdata = bs.turningForm.getValue();
			if ($.isEmpty(this.params) || $.isEmpty(this.params.wid)) {
				if (this.showInWeek == 2) {
					formdata.SHOW_INWEEK = 1;
					formdata.SHOW_INWEEK_DISPLAY = "是";
				} else if (this.showInWeek == 0) {
					formdata.SHOW_INWEEK = 0;
					formdata.SHOW_INWEEK_DISPLAY = "否";
				}
			}
			var roomOccupy = this.saveMeetRoomOccupy(formdata);
			if (roomOccupy == null) {
				return;
			}
			formdata = $.extend(formdata, roomOccupy);
			
			// 消息提醒
			var needSendMsg = false;
			if ($("#sendRmdMsgDiv #needSendMsg").val() === "1") {
				needSendMsg = true;
			}
			if ($("#selectNode").val() === undefined || $("#selectNode").val() === null || $("#selectNode").val() === "") {
				$.warn("请选择下一步");
				return;
			}
			if ((this.isFullschool && ($('#nextUserIds').val() === undefined || $('#nextUserIds').val() === null || $('#nextUserIds').val() === "")) || (!this.isFullschool && this.nextUserArr != undefined && this.nextUserArr != null && this.nextUserArr.length > 0 && ($('#nextUserIds').val() === undefined || $('#nextUserIds').val() === null || $('#nextUserIds').val() === ""))) {
				$.warn("请选择办理人！");
				return;
			}
			var flowdata = {
				targetNodeId : $("#selectNode").val(),
				nextNodeActor : $("#nextUserIds").val(),
				needSendMsg : needSendMsg
			};
			formdata = $.extend(formdata, flowdata);
			
			formdata.roomOccupyStr = JSON.stringify(roomOccupy);
			//校验与会领导是否已经有会---
			var leaerInfo = formdata.CHLD;
			var resp = BH_UTILS.doSyncAjax(bs.api.checkLeaderFree,
					{roomOccupyStr : JSON.stringify(roomOccupy),leaerInfo : leaerInfo});
			if(resp && resp.resultFlag){
				var msg = "参会领导已有日程安排，确定继续提交？";
				$.confirm(msg, function() {
					bs.submitInfo(formdata,self);
				});
			} else {
				bs.submitInfo(formdata,self);
			}
			
		},
		
		isUserMultiSelect : function(nodeId) {
			var multiSelect = false;
			$.each(this.isNextUserMultiSel, function(index, e) {
				if (nodeId === e.nodeId) {
					multiSelect = e.isMultiSel;
					return;
				}
			});
			return multiSelect;
		},

		back : function() {
			$.bhPaperPileDialog.hide({
				ignoreAllCallback : true
			});
		},

		// 弹框高度变化时,手动使页脚自适应的方法
		footerAdaptive : function() {
			$.bhPaperPileDialog.resetPageFooter();
			$.bhPaperPileDialog.resetDialogFooter();
		},

		initCheckBox : function() {
			var sum = $('#xz ul li input').length;
			var num = $('#xz ul li input[checked]').length;
			if (sum === num) {
				$('#xz').find('input[data-caption="全选"]').prop('checked', true);
			}
			$('#xz').find('input[data-caption="全选"]').change(function() {
				$(this).nextAll('ul').find('input').prop('checked', this.checked);
				num *= this.checked;
			});
			$("#xz input[input-index='second-input']").change(function() {
				num += (this.checked - 0.5) * 2;
				var firstInput = $('#xz input[data-caption="全选"]');
				if (num === sum) {
					firstInput.prop('checked', true);
				} else {
					firstInput.prop('checked', false);
				}
			});
		},
		
		changeMeetRoom : function(event) {
			var self = this;
			var $tr =  $(event.target).closest("tr");
			var $trNext =  $tr.next();
			
			bghysj.initialize({
				beginDate : $trNext.find(".meeting-date").val(),
				callbackFunc : function(datas) {
					self.changeMeetRoomCallback($(event.target), datas);
				}
			});
		},
		
		changeMeetRoomCallback : function($target, meetRoomInfo) {
			var formdata = bs.turningForm.getValue();
			var meetingTimeArr = new Array();
			meetingTimeArr.push({
				meetingDate : meetRoomInfo.meetingDate,
				meetingHour : "00",
				meetingMinute : "00"
			});
			//校验是否能申请当前日期的会议
			common.basicDataRequest(window.APP_PATH + "/form/checkMeetingConfig.do", {
				meetingTimes : JSON.stringify(meetingTimeArr),
				showInWeek : formdata.SHOW_INWEEK ? formdata.SHOW_INWEEK : 0,
			}).done(function(resp) {
				var $td =  $target.parent().parent();
				$td.find(".meet-room-id").val(meetRoomInfo.meetRoomId);
				
				var meetRoomName = "";
				if (meetRoomInfo.meetRoomId != "other_meetingroom") {
					meetRoomName = meetRoomInfo.meetRoomName;
				}
				$td.find(".meet-room-name").val(meetRoomName);
				$td.find(".meet-room-name-ori").val(meetRoomName);
				
				var $nextTr = $target.closest("tr").next();
				$nextTr.find(".meeting-date").val(page.formatDateDisplay(meetRoomInfo.meetingDate));
				
				var $meetTimeSelect = $nextTr.find(".meeting-time-range");
				$meetTimeSelect.children("#meetBeginHour").val("06");
				$meetTimeSelect.children("#meetBeginMinute").val("00");
				$meetTimeSelect.children("#meetEndHour").val("06");
				$meetTimeSelect.children("#meetEndMinute").val("00");
			}).fail(function(resp) {
				$.warn(resp.msg);
//				BH_UTILS.bhDialogWarning({
//					title : '提示！',
//					content : resp.msg,
//					buttons : [ {
//						text : '确定'
//					} ]
//				});
			});
//			$.each($("#hysyd_meetRoomInfo").find("tr"), function(n, element) {
//				if (n < 2) {
//					return true;
//				}
//				element.remove();
//			});
//			
//			this.meetRoomId = meetRoomInfo.meetRoomId;
//			this.meetingDate = meetRoomInfo.meetingDate;
//			this.meetingDateDisplay = page.formatDateDisplay(meetRoomInfo.meetingDate);
//			$(".meet-room-name").val(this.meetRoomName);
//			$(".meeting-date").val(this.meetingDateDisplay);
//			
//			var meetTimeSelect = $(".meeting-time-tr").find(".meeting-time-range")[0];
//			$(meetTimeSelect).children("#meetBeginHour").val("06");
//			$(meetTimeSelect).children("#meetBeginMinute").val("00");
//			$(meetTimeSelect).children("#meetEndHour").val("06");
//			$(meetTimeSelect).children("#meetEndMinute").val("00");
		},
		
		addMeetRoom : function() {
			var self = this;
			bghysj.initialize({
				beginDate : "",
				callbackFunc : function(datas) {
					self.addMeetRoomCallback(datas);
				}
			});
			
		},
		
		addMeetRoomCallback : function(datas) {
//			var self = this;
			var formdata = bs.turningForm.getValue();
			var meetingTimeArr = new Array();
			meetingTimeArr.push({
				meetingDate : datas.meetingDate,
				meetingHour : "00",
				meetingMinute : "00"
			});
			//校验是否能申请当前日期的会议
			common.basicDataRequest(window.APP_PATH + "/form/checkMeetingConfig.do", {
				meetingTimes : JSON.stringify(meetingTimeArr),
				showInWeek : formdata.SHOW_INWEEK ? formdata.SHOW_INWEEK : 0,
			}).done(function(resp) {
				$("#hysyd_meetRoomInfo tbody").append(bs.genMeetRoomDetail(datas.meetRoomId, 
						datas.meetRoomName, "", page.formatDateDisplay(datas.meetingDate)));
				
				// 会议室名称备注
				$(".meet-room-name").keydown(function(e) {
//					var meetRoomName = $(e.target).val();
					var meetRoomName = $(e.target).next().val();
					var meetRoomId = $(e.target).next().next().val();
					if (meetRoomId != "other_meetingroom") {
						var cursorPosition = page.getCursorPosition(e.target);
						if (cursorPosition < meetRoomName.length) {
							return false;
						}
						// Backspace & Delete
						if (cursorPosition == meetRoomName.length
								&& (e.keyCode == 8 || e.keyCode == 46)) {
							return false;
						}
					}
				});
				
			}).fail(function(resp) {
				$.warn(resp.msg);
//				BH_UTILS.bhDialogWarning({
//					title : '提示！',
//					content : resp.msg,
//					buttons : [ {
//						text : '确定'
//					} ]
//				});
			});
			this.footerAdaptive();
		},
		
		addMeetTime : function() {
//			var self = this;
//			if (!this.meetRoomId) {
//				BH_UTILS.bhDialogWarning({
//					title : '提示！',
//					content : '请先选择会议室',
//					buttons : [ {
//						text : '确定'
//					} ]
//				});
//				return;
//			}
//			tjhysj.initialize({
//				meetRoomId : this.meetRoomId, 
//				meenRoomName:this.meetRoomName,
//				date : this.meetingDate,
//				callbackFunc : function(datas) {
//					self.addMeetTimeCallback(datas);
//				}
//			});
		},
		
		updMeetTime : function(event) {
			var self = this;
			var $tr =  $(event.target).closest("tr");
			var $trPrev =  $tr.prev();

			var meetRoomId = $trPrev.find(".meet-room-id").val();
			if (!meetRoomId) {
				$.warn("请先选择会议室！");
				return;
			}
			
			var meetingDate = $tr.find(".meeting-date").val();
			if (!meetingDate) {
				$.warn("请先选择会议日期！");
				return;
			}
			
			tjhysj.initialize({
				meetRoomId : meetRoomId, 
				meenRoomName : $trPrev.find(".meet-room-name").val(),
				date : meetingDate,
				selectType : 0,
				elementObject : $tr,
				callbackFunc : function(datas, elementObject) {
					self.updMeetTimeCallback(datas, elementObject);
				}
			});
		},
		
		updMeetTimeCallback : function(datas, elementObject) {
			var self = this;
			var formdata = bs.turningForm.getValue();
			var meetingTimeArr = new Array();
			for (var i = 0; i < datas.length; i++) {				
				meetingTimeArr.push({
					meetingDate : datas[i],
					meetingHour : "00",
					meetingMinute : "00"
				});
			}
			//校验是否能申请当前日期的会议
			common.basicDataRequest(window.APP_PATH + "/form/checkMeetingConfig.do", {
				meetingTimes : JSON.stringify(meetingTimeArr),
				showInWeek : formdata.SHOW_INWEEK ? formdata.SHOW_INWEEK : 0,
			}).done(function(resp) {
				//校验通过的直接添加
				for (var i in datas) {
					if (elementObject) {
						elementObject.find('.meeting-date').val(page.formatDateDisplay(datas[i]));
					} else {
						$("#hysyd_meetRoomInfo tbody").append(bs.genMeetRoomDetail(
								self.meetRoomId, self.meetRoomName, page.formatDateDisplay(datas[i])));
					}
				}
			}).fail(function(resp) {
				$.warn(resp.msg);
//				BH_UTILS.bhDialogWarning({
//					title : '提示！',
//					content : resp.msg,
//					buttons : [ {
//						text : '确定'
//					} ]
//				});
			});
			this.footerAdaptive();
		},
		
		deleteMeetRoom : function(event) {
			var $tr =  $(event.target).closest("tr");
			$tr.next().remove();
			$tr.remove();
			this.footerAdaptive();
		},
		
		saveMeetRoomOccupy : function(formdata) {
			var flag = true;
			var meetRoomList = new Array();
			$.each($(".meet-room-tr"), function(n, element) {
				var meetRoomId = $(element).find(".meet-room-id").val();
				var meetRoomName = $(element).find(".meet-room-name-ori").val();
				var meetRoomNameAll = $(element).find(".meet-room-name").val();
				
				if (!meetRoomId || !meetRoomNameAll) {
					$.warn("请输入会议室名称！");
					flag = false;
					return false;
				}
				if (meetRoomId != "other_meetingroom" && meetRoomNameAll.indexOf(meetRoomName) != 0) {
					$.warn("会议室名称输入有误，请重新输入！");
					flag = false;
					return false;
				}
				
				var meetRoomNameRemark = "";
				if (meetRoomId == "other_meetingroom") {
					meetRoomNameRemark = meetRoomNameAll;
				} else if (meetRoomNameAll != meetRoomName) {
					meetRoomNameRemark = meetRoomNameAll.substring(meetRoomNameAll.indexOf(meetRoomName)
							+ meetRoomName.length, meetRoomNameAll.length);
				}
				
				meetRoomList.push({
					meetRoomId : meetRoomId,
					meetRoomName : meetRoomName,
					meetRoomNameRemark : meetRoomNameRemark,
					meetingId : formdata.WID,
					meetingName : formdata.TITLE,
					departId : formdata.DEPT_ID,
					departName : formdata.DEPT_NAME,
				});
			});
			
			if (!flag) {
				return null;
			}
			
			var occupyTimeList = new Array();
			$.each($(".meeting-time-tr"), function(n, element) {
				var meetingDate = page.formatDateParam($(element).find(".meeting-date").val());
				var meetBeginHour = "";
				var meetBeginMinute = "";
				var meetEndHour = "";
				var meetEndMinute = "";
				$.each($(element).find(".meeting-time-range"), function(n, element) {
					meetBeginHour = $(element).children("#meetBeginHour").val();
					meetBeginMinute = $(element).children("#meetBeginMinute").val();
					meetEndHour = $(element).children("#meetEndHour").val();
					meetEndMinute = $(element).children("#meetEndMinute").val();
					
				});
				
				occupyTimeList.push({
					meetingDate : meetingDate,
					beginTime : meetBeginHour + ":" + meetBeginMinute,
					endTime : meetEndHour + ":" + meetEndMinute
				});
			});
			
			var meetRoomOccupy = new Array();
			for (var i = 0; i < meetRoomList.length; i++) {
				meetRoomOccupy.push($.extend(meetRoomList[i], occupyTimeList[i]));
			}
			
			var meetRoomOccupyDto = {
//				addOrUpd : 1,
				meetRoomOccupy : JSON.stringify(meetRoomOccupy)
			};
			
			return meetRoomOccupyDto;
		},
		
		//会议室时间校验
		checkMeetingTime : function(){
			//会议室时间校验(时间大小校验)---start----
			var flag = true;
			var msg ="";
			$.each($(".meeting-time-tr"), function(n, element) {
				$(element).find("select").css({"border-color":""});
				var meetBeginHour = "";
				var meetBeginMinute = "";
				var meetEndHour = "";
				var meetEndMinute = "";
				$.each($(element).find(".meeting-time-range"), function(n, element) {
					meetBeginHour = $(element).children("#meetBeginHour").val();
					meetBeginMinute = $(element).children("#meetBeginMinute").val();
					meetEndHour = $(element).children("#meetEndHour").val();
					meetEndMinute = $(element).children("#meetEndMinute").val();
				});
				var beginTime =  meetBeginHour + ":" + meetBeginMinute;
				var endTime =  meetEndHour + ":" + meetEndMinute;
				if(beginTime >= endTime){
					$(element).find("select").css({"border-color":"red"});
					flag = false;
				}
			});
			if(!flag){
				msg = "会议的开始时间必须在结束时间之前";
			} else {
				//如果会议的时间没有错误，则校验会议时间是否重复
				$.each($(".meeting-time-tr"), function(n, element) {
					var meetRoomId1 = $(element).prev().find(".meet-room-id").val();
					$(element).find("select").css({"border-color":""});
					var meetingDate = page.formatDateParam($(element).find(".meeting-date").val());
					var meetBeginHour = "";
					var meetBeginMinute = "";
					var meetEndHour = "";
					var meetEndMinute = "";
					$.each($(element).find(".meeting-time-range"), function(n, element) {
						meetBeginHour = $(element).children("#meetBeginHour").val();
						meetBeginMinute = $(element).children("#meetBeginMinute").val();
						meetEndHour = $(element).children("#meetEndHour").val();
						meetEndMinute = $(element).children("#meetEndMinute").val();
					});
					var b1 =  meetingDate + " " + meetBeginHour + ":" + meetBeginMinute;
					var e1 = meetingDate + " " + meetEndHour + ":" + meetEndMinute;
					$.each($(".meeting-time-tr"), function(i, e) {
						if(i <= n){
							return true;
						}
						
						var meetRoomId2 = $(e).prev().find(".meet-room-id").val();
						if (meetRoomId1 != meetRoomId2) {
							return true;
						}
						
						$(e).find("select").css({"border-color":""});
						var d2 = page.formatDateParam($(e).find(".meeting-date").val());
						var bh2 = "";
						var bm2 = "";
						var eh2 = "";
						var em2 = "";
						$.each($(e).find(".meeting-time-range"), function(i, e) {
							bh2 = $(e).children("#meetBeginHour").val();
							bm2 = $(e).children("#meetBeginMinute").val();
							eh2 = $(e).children("#meetEndHour").val();
							em2 = $(e).children("#meetEndMinute").val();
						});
						var b2 =  d2 + " " + bh2 + ":" + bm2;
						var e2 = d2 + " " + eh2 + ":" + em2;
						//校验日期是否重复
						if((b2<e1 && b2>= b1) || (e2<=e1 && e2>b1) || (b2<=b1 && e2>=e1)){
							flag =false;
							msg = "第" + (n+1) + "条会议时间和第"+(i+1)+"条会议时间重复！";
							$(element).find("select").css({"border-color":"red"});
							$(e).find("select").css({"border-color":"red"});
							return false;
						}
					});
					if(!flag){
						return false;
					}
				});
			}
			var checkResult = {
					flag:flag,
					msg:msg
			};
			return checkResult;
			//---------------------------end---
		},
		
		//修改时间格式
		changeDate :function(beginDate){
			var year = beginDate.substr(0,4);
			var month = beginDate.substr(4,2);
			var day = beginDate.substr(6,2);
			date = year + "-" + month + "-"+ day;
			return date;
		},
		
		changeDate2 :function(beginDate){
			var year = beginDate.substr(0,4);
			var month = beginDate.substr(5,2);
			var day = beginDate.substr(8,2);
			date = year + month +day;
			return date;
		 },
		 leaderFreeInfo : function(){
			 leaderFree.initialize();
		 },
		 
		 loadCurrentNodeAttrs:function() {			
				if (self.currentNodeAttrs.canFenfa) {
					$("[data-action='分发']").toggleClass("bh-hide",false);
				}
				if (self.currentNodeAttrs.canChuanyue) {
					$("[data-action='传阅']").toggleClass("bh-hide",false);
				}
				if (self.currentNodeAttrs.canInterDist) {
					$("[data-action='内部分发']").toggleClass("bh-hide",false);
				}
				if (self.currentNodeAttrs.canInterCirculate) {
					$("[data-action='内部传阅']").toggleClass("bh-hide",false);
				}
				if (self.currentNodeAttrs.canFenfa || self.currentNodeAttrs.canChuanyue || self.currentNodeAttrs.canInterDist || self.currentNodeAttrs.canInterCirculate) {
					$("[data-action='分发传阅监控']").toggleClass("bh-hide",false);
				}
			},
			
			actionRelay : function() {			
				this.bulidDistributeBody(0,false);
			},
			
			actionDistribute : function() {		
				this.bulidDistributeBody(1,false);
			},

			actionInterRelay:function() {
				this.bulidDistributeBody(2,true);
			},
			
			actionInterDistribute:function() {
				this.bulidDistributeBody(3,true);
			},
			
			bulidDistributeBody:function(type,showCurrentDept) {
				var formdata = bs.turningForm.getValue();
				$('body,html').animate({
					scrollTop : 0
				}, 0);
				distribute.initialize(c_wid, type,"",0,showCurrentDept,0, formdata);
			},
			
			showDisAndRelayRecord : function() {
				distributerecord.initialize(c_wid);
			}
	};

	return viewConfig;
});
