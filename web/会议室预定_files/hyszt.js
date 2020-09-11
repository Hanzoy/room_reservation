define(function(require) {

	var utils = require('utils');
	var hysyd = require('../../public/commonpage/hysyd/hysyd');
	var common = require('public/js/common');

	/** ******子页面******* */
	var viewConfig = {
		initialize: function() {
			/** ******注册子页面******* */
			this.pushSubView([hysyd]);
			var self = this;
			this.beginDate = "";
			this.thList = [];
			this.meetRoomName = "";
			this.meetRoomCampus = "";
			var indexView = utils.loadCompiledPage('hysztIndexPage', require);
			this.$rootElement.html(indexView.render({}), true);

			common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});



			/** ******页面内事件通过eventMap统一管理******* */
			this.eventMap = {
				'[data-action="hyszt_apply"]': this.hysztApply,
				'[data-action="hyszt_search"]': this.hysztSearch,
				'#hyszt_campusSelect@change': this.hysztSearchByCampus,
				'[data-action="hyszt_lastWeek"]': this.hysztLastWeek,
				'[data-action="hyszt_nextWeek"]': this.hysztNextWeek,
				'[data-action="hyszt_currentWeek"]': this.hysztCurrentWeek,
				'#hyszt_searchInput@keypress' : this.hysztSearchBykey,
				'#hyszt_meetRoomTd@mouseenter': this.hysztMeetRoomDetail,
				'#hyszt_meetRoomTd@mouseleave': this.hysztMeetRoomDetailOut
			};
		},

		loadMeetRoomReserve: function(resp) {
			var meetRoomCalendar = utils.loadCompiledPage('meetRoomCalendar', require);
			$('#hyszt_formContainer').html(meetRoomCalendar.render({
				thList: resp.thList,
				occupyList: resp.occupyList
			}));
			var trs = $(".zhb-table-tr");		
			trs.each(function(index,item){
				var scPanels = $(item).find(".sc-panel-thingNoImg-1-container");
				var maxHeight = 120;
				scPanels.each(function(ii,tt){
					if($(tt).height()>120){
						maxHeight =  $(tt).height();
					}
				});
				$(item).height(maxHeight);					
			});	
		},

		hysztApply: function(event) {
			var self = this;
			var meetingDate = this.thList[$(event.target).attr("data-x-index")].date;
			var $meetRoomInfo = $(event.target).closest('tr').children().first();
			var meetRoomId = $meetRoomInfo.attr("data-x-meetRoomId");
			var meetRoomName = $meetRoomInfo.attr("data-x-meetRoomName");
			
			hysyd.initialize({
				meetingDate: meetingDate,
				meetRoomId: meetRoomId,
				meetRoomName: meetRoomName,
				type: 3,
				callbackFunc: function(datas) {
					common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {
						beginDate: self.beginDate,
						meetRoomName: self.meetRoomName,
						meetRoomCampus: self.meetRoomCampus
					}).done(function(resp) {
						self.beginDate = resp.beginDate;
						self.thList = resp.thList;
						self.loadMeetRoomReserve(resp);
					});
				}
			});
		
//			var meetingTimeArr = new Array();
//			meetingTimeArr.push({
//				meetingDate : meetingDate,
//				meetingHour : "00",
//				meetingMinute : "00"
//			});
//			common.basicDataRequest(window.APP_PATH + "/form/checkMeetingConfig.do", {
//				meetingTimes : JSON.stringify(meetingTimeArr),
//				showInWeek : 0,
//			}).done(function(resp) {
//				hysyd.initialize({
//					meetingDate: meetingDate,
//					meetRoomId: meetRoomId,
//					meetRoomName: meetRoomName,
//					type: 3,
//					callbackFunc: function(datas) {
//						common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {
//							beginDate: self.beginDate,
//							meetRoomName: self.meetRoomName,
//							meetRoomCampus: self.meetRoomCampus
//						}).done(function(resp) {
//							self.beginDate = resp.beginDate;
//							self.thList = resp.thList;
//							self.loadMeetRoomReserve(resp);
//						});
//					}
//				});
//			}).fail(function(resp) {
//				BH_UTILS.bhDialogWarning({
//					title : '提醒！',
//					content : resp.msg,
//					buttons : [ {
//						text : '确定'
//					} ]
//				});
//				return;
//			});
		},
		hysztSearchBykey: function(event){
			var kc = event.keyCode;
			if(kc == 13){
				var self = this;
				this.meetRoomName = $("#hyszt_searchInput").val();
				common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {
					beginDate: this.beginDate,
					meetRoomName: this.meetRoomName,
					meetRoomCampus: this.meetRoomCampus
				}).done(function(resp) {
					self.beginDate = resp.beginDate;
					self.thList = resp.thList;
					self.loadMeetRoomReserve(resp);
				});
			}
			
		},
		hysztSearch: function() {
			var self = this;
			this.meetRoomName = $("#hyszt_searchInput").val();
			common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {
				beginDate: this.beginDate,
				meetRoomName: this.meetRoomName,
				meetRoomCampus: this.meetRoomCampus
			}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});

		},

		hysztSearchByCampus: function() {
			var self = this;
			this.meetRoomCampus = $("#hyszt_campusSelect").val();
			common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {
				beginDate: this.beginDate,
				meetRoomCampus: this.meetRoomCampus
			}).done(function(resp) {
				$("#hyszt_searchInput").val("");
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});

		},

		hysztLastWeek: function() {
			var self = this;
			common.basicDataRequest(window.APP_PATH + "/form/queryLastWeekMeetRoomReserveList.do", {
				beginDate: this.beginDate,
				meetRoomName: this.meetRoomName,
				meetRoomCampus: this.meetRoomCampus
			}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});
		},

		hysztNextWeek: function() {
			var self = this;
			common.basicDataRequest(window.APP_PATH + "/form/queryNextWeekMeetRoomReserveList.do", {
				beginDate: this.beginDate,
				meetRoomName: this.meetRoomName,
				meetRoomCampus: this.meetRoomCampus
			}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});
		},


		hysztCurrentWeek: function() {
			var self = this;
			common.basicDataRequest(window.APP_PATH + "/form/queryCurrentWeekMeetRoomReserveList.do", {
				beginDate: "",
				meetRoomName: this.meetRoomName,
				meetRoomCampus: this.meetRoomCampus
			}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});
		},
		hysztMeetRoomDetailOut: function(event) {
//			$("#bhPopover").remove();
		},

		hysztMeetRoomDetail: function(event) {
			$("#bhPopover").remove();
			var $target = $(event.currentTarget);
			var meetRoomId = $target.attr("data-x-meetRoomId");
			if(meetRoomId == "other_meetingroom"){
				return ;
			}
			
			$.bhPopOver({
				content: this.buildPopOverContent($target),
				selector: $target,
				width: 401,
				height: 332,
				showCloseButton: true
			});
			var meetRoomPicUrl = './public/images/noImg.png';
			var imgSrc = $target.attr("data-x-meetRoomPic");
			var picurl = [];
			if(imgSrc){
				picurl = this.getUploaded1stFileUrl(imgSrc);
				$.bhGallery({
					showType: 'page', // 渲染的类型
					selector: '#u306', // 渲染的容器
					width: '100px',
					height: '100px',
					// 幻灯片图片列表
					dataSource: picurl
				});
				var content = '<div style="float:right;width:7%;height:100%" data-action="gallery" title="点击查看图片">' + 
				'<img src="public/images/fd.png" style="margin-top:10px;height:32px;">' + 
				'</div>';
		
				$('#u308').append(content);
				$('[data-action=gallery]').click(function() {
				    $.bhGallery({
				        dataSource: picurl,
				        height: 1000
				    });
				});
			} else {
				var imgcontent = '<img id="u306_img" class="img" src="' + meetRoomPicUrl + '">';
				$('#u306').append(imgcontent);
			}
		},

		buildPopOverContent: function($target) {
			var address = $target.attr("data-x-address");
			if(address && address.length > 32){
				address = address.substring(0,32) + "&nbsp;...";
			}
			var meetRoomCapacity = $target.attr("data-x-meetRoomCapacity");
		
			var meetRoomDevice = $target.attr("data-x-meetRoomDevice");
			if (meetRoomDevice && meetRoomDevice.length > 32) {
				meetRoomDevice = meetRoomDevice.substr(0, 32) + "&nbsp;...";
			}
			var content = '<div>' +
				'<div id="u306" class="ax_default _图片">' +
//				'<img id="u306_img" class="img" src="' + meetRoomPicUrl + '">' +
				'</div>' +
				'<div id="u308" class="ax_default _body_default">' +
				'<div id="u309" class="text" style="float:left;width:93%">' +
				'<p><span style="color:#CCCCCC;">地点：</span><span>' + address + '</span></p>' +
				'<p><span style="color:#CCCCCC;">容纳人数：</span><span>' + meetRoomCapacity + '人</span></p>' +
				'<p><span style="color:#CCCCCC;">设备信息：</span><span class="m_span">' + meetRoomDevice + '</span></p>' +
				'</div>' +
				'</div>' +
				'</div>';
			return content;
		},

		/**
		 * 获取上传文件
		 */
		getUploaded1stFileUrl: function(token) {
			var fileUrl = new Array();
			$.ajax({
				type: "post",
				url: contextPath + "/sys/emapcomponent/file/getUploadedAttachment/" + token + ".do",
				dataType: "json",
				async: false, // 默认为true 异步
				success: function(res) {
					if (res.success && res.items && res.items.length > 0) {
						$.each(res.items,function(i,v){
							fileUrl.push({image: v.fileUrl});
						});
					}
				}
			});
			return fileUrl;
		},

		// 弹框高度变化时,手动使页脚自适应的方法
		footerAdaptive: function() {
			$.bhPaperPileDialog.resetPageFooter(); // 改变页面的页脚位置
			$.bhPaperPileDialog.resetDialogFooter(); // 改变弹框的页脚位置
		},
	};

	return viewConfig;
});