define(function(require) {

	var utils = require('utils');
	var common = require('public/js/common');
	var page = require('public/js/page');

	/** ******子页面******* */
	var viewConfig = {
		initialize : function(params) {
			/** ******注册子页面******* */
			var self = this;
			this.beginDate = params.beginDate || "";
			if (params && params.beginDate && params.beginDate.length > 8) {
				this.beginDate = page.formatDateParam(params.beginDate);
			}
			this.thList = [];
			this.meetRoomName = "";
			this.meetRoomCampus = "";
			this.callbackFunc = params.callbackFunc;
			
			common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {
				beginDate : this.beginDate
			}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.showBghysjDialog(resp);
			});
			
			/** ******页面内事件通过eventMap统一管理******* */
			this.eventMap = {
				'[data-action="bghysj_apply"]' : this.bghysjApply,
				'[data-action="bghysj_search"]' : this.bghysjSearch,
				'#bghysj_campusSelect@change' : this.bghysjSearchByCampus,
				'[data-action="bghysj_lastWeek"]' : this.bghysjLastWeek,
				'[data-action="bghysj_nextWeek"]' : this.bghysjNextWeek,
				'[data-action="bghysj_currentWeek"]' : this.bghysjCurrentWeek,
				'#bghysj_searchInput@keypress' : this.bghysjSearchBykey,
				'#bghysj_meetRoomTd@mouseover' : this.bghysjMeetRoomDetail,
				'#bghysj_meetRoomTd@mouseout' : this.bghysjMeetRoomDetailOut,
				'[data-action="bghysj_back"]' : this.bghysjBack
			};
		},
		
		showBghysjDialog : function(resp) {
			var self = this;
			var indexView = utils.loadCompiledPage('bghysjIndexPage', require);
			$.bhPaperPileDialog.show({
				content : indexView.render({
				}),
				render : function() {
					self.loadMeetRoomReserve(resp);
				}
			});
		},
		
		loadMeetRoomReserve : function(resp) {
			var meetRoomCalendar = utils.loadCompiledPage('meetRoomCalendar', require);
			$('#bghysj_meetRoomReserve').html(meetRoomCalendar.render({
				thList : resp.thList,
				occupyList : resp.occupyList
			}));
			//设置单元格最小高度
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

		bghysjApply : function(event) {
			var meetingDate = this.thList[$(event.target).attr("data-x-index")].date;
			var $meetRoomInfo = $(event.target).closest('tr').children().first();
			var meetRoomId = $meetRoomInfo.attr("data-x-meetRoomId");
			var meetRoomName = $meetRoomInfo.attr("data-x-meetRoomName");
			this.callbackFunc({
				meetingDate : meetingDate, 
				meetRoomId : meetRoomId,
				meetRoomName : meetRoomName
			});
			
			$.bhPaperPileDialog.hide({
				ignoreAllCallback : true
			});
		},
		bghysjSearchBykey: function(event){
			var kc = event.keyCode;
			if(kc == 13){
				var self = this;
				this.meetRoomName = $("#bghysj_searchInput").val();
				common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {
					beginDate : this.beginDate,
					meetRoomName : this.meetRoomName,
					meetRoomCampus : this.meetRoomCampus
				}).done(function(resp) {
					self.beginDate = resp.beginDate;
					self.thList = resp.thList;
					self.loadMeetRoomReserve(resp);
				});
			}
			
		},
		bghysjSearch : function() {
			var self = this;
			this.meetRoomName = $("#bghysj_searchInput").val();
			common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {
				beginDate : this.beginDate,
				meetRoomName : this.meetRoomName,
				meetRoomCampus : this.meetRoomCampus
			}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});

		},
		
		bghysjSearchByCampus : function() {
			var self = this;
			this.meetRoomCampus = $("#bghysj_campusSelect").val();
			common.basicDataRequest(window.APP_PATH + "/form/queryMeetRoomReserveList.do", {
				beginDate : this.beginDate,
				meetRoomCampus : this.meetRoomCampus
			}).done(function(resp) {
				$("#bghysj_searchInput").val("");
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});

		},
		
		bghysjLastWeek : function() {
			var self = this;
			common.basicDataRequest(window.APP_PATH + "/form/queryLastWeekMeetRoomReserveList.do", {
				beginDate : this.beginDate,
				meetRoomName : this.meetRoomName,
				meetRoomCampus : this.meetRoomCampus
			}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});
		},
		
		bghysjNextWeek : function() {
			var self = this;
			common.basicDataRequest(window.APP_PATH + "/form/queryNextWeekMeetRoomReserveList.do", {
				beginDate : this.beginDate,
				meetRoomName : this.meetRoomName,
				meetRoomCampus : this.meetRoomCampus
			}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});
		},
		
		bghysjCurrentWeek : function(){
			var self = this;
			common.basicDataRequest(window.APP_PATH + "/form/queryCurrentWeekMeetRoomReserveList.do", {
				beginDate : "",
				meetRoomName : this.meetRoomName,
				meetRoomCampus : this.meetRoomCampus
			}).done(function(resp) {
				self.beginDate = resp.beginDate;
				self.thList = resp.thList;
				self.loadMeetRoomReserve(resp);
			});
		},
		bghysjMeetRoomDetailOut : function(event) {
			//$("#bhPopover").remove();
		},
		bghysjMeetRoomDetail : function(event) {
			$("#bhPopover").remove();
			var $target = $(event.currentTarget);
			var meetRoomId = $target.attr("data-x-meetRoomId");
			if(meetRoomId == "other_meetingroom"){
				return ;
			}
			$.bhPopOver({
				content : this.buildPopOverContent($target), 
				selector : $target,
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
		
		buildPopOverContent : function($target) {
			var address = $target.attr("data-x-address");
			if(address && address.length > 32){
				address = address.substring(0,32) + "&nbsp;...";
			}
			var meetRoomCapacity = $target.attr("data-x-meetRoomCapacity");
			var meetRoomDevice = $target.attr("data-x-meetRoomDevice");
			if(meetRoomDevice && meetRoomDevice.length > 32){
				meetRoomDevice = meetRoomDevice.substring(0,32) + "&nbsp;...";
			}
			var content = '<div>' + 
						      '<div id="u306" class="ax_default _图片">' + 
						          //'<img id="u306_img" class="img" src="' + meetRoomPicUrl + '">' + 
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
		getUploaded1stFileUrl : function(token) {
			var fileUrl = new Array();
			$.ajax({
				type : "post",
				url : contextPath + "/sys/emapcomponent/file/getUploadedAttachment/" + token + ".do",
				dataType : "json",
			    async : false, // 默认为true 异步
				success : function(res) {
					if (res.success && res.items && res.items.length > 0) {
						$.each(res.items,function(i,v){
							fileUrl.push({image: v.fileUrl});
						});
					}
				}
			});
			return fileUrl;
		},

		bghysjBack : function() {
			$.bhPaperPileDialog.hide({
				ignoreAllCallback : true
			});
		},
		
		// 弹框高度变化时,手动使页脚自适应的方法
		footerAdaptive : function() {
			$.bhPaperPileDialog.resetPageFooter(); // 改变页面的页脚位置
			$.bhPaperPileDialog.resetDialogFooter(); // 改变弹框的页脚位置
		},
	};

	return viewConfig;
});
