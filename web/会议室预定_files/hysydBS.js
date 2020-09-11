define(function(require) {

	var utils = require('utils');

	var bs = {
		turningForm : new TuringForm(".bh-docs-page", "./public/doc_resource/" + window.docResource),
		api : {
			formModel : 'public*commonpage/hysyd.do',
			formCreateUrl : window.APP_PATH + "/form/create.do",
			roomList : window.APP_PATH + "/public*commonpage/hysyd/getRoomList.do",
			zcrList : window.APP_PATH + "/form/getZcrList.do",
			formSaveUrl : window.APP_PATH + "/form/save.do",
			formSubmitUrl : window.APP_PATH + "/form/startFlow.do",
			pageModel : window.WIS_CONFIG.RESOURCE_SERVER + '/fe_components/mock/page_model.json',
			advancedQueryModel : window.WIS_CONFIG.RESOURCE_SERVER + '/fe_components/mock/advencedQueryModel.json',
			rowDataDetailUrl : window.WIS_CONFIG.RESOURCE_SERVER + '/fe_components/mock/userInfo.json',
			checkLeaderFree: contextPath + '/sys/oaxldrc/xldrc/checkLeaderFree.do',
		},
		getRowDataDetails : function() {
			return utils.fetch({
				url : this.api.xz,
				data : {},
				/** *parser用于对接口返回的数据做进一步处理** */
				parser : function(res) {

				}
			});
		},

		getInputData : function(name) {
			switch (name) {
			case 'ZS':
				return this.api.xz1;
			case 'xz2':
				return this.api.xz2;
			case 'xz3':
				return this.api.xz3;
			}
		},

		getFormCreate : function() {
			var def = $.Deferred();
			utils.doAjax(this.api.formCreateUrl).done(function(resp) {
				def.resolve(resp);
			}).fail(function(resp) {
				def.reject(resp);
			});
			return def.promise();
		},

		getRoomList : function(params, initData) {
			var def = $.Deferred();
			var arr_initData = initData.split(',');
			utils.doAjax(this.api.roomList, params).done(function(data) {
				var res = {
					roomList : data.datas.getRoomList.rows
				};
				if (res.roomList.length > 0) {
					res.isEmpty = false;
				} else {
					res.isEmpty = true;
				}
				if (arr_initData != "") {
					_.each(res.roomList, function(item) {
						if ($.inArray(item.NAME, arr_initData) > -1) {
							item.check = true;
						} else {
							item.check = false;
						}
					});
				}
				def.resolve(res);
			}).fail(function(res) {
				def.reject(res);
			});
			return def.promise();
		},

		getZcrList : function(params, initData) {
			var def = $.Deferred();
			var arr_initData = initData.split(',');
			BH_UTILS.doAjax(this.api.zcrList, params).done(function(data) {
				var res = {
					resultList : data.resultList
				};
				if (res.resultList.length > 0) {
					res.isEmpty = false;
				} else {
					res.isEmpty = true;
				}
				if (arr_initData != "") {
					_.each(res.resultList, function(item) {
						if ($.inArray(item.NAME, arr_initData) > -1) {
							item.check = true;
						} else {
							item.check = false;
						}
					});
				}
				def.resolve(res);
			}).fail(function(res) {
				def.reject(res);
			});
			return def.promise();
		},

		basicDataRequest : function(type, params) {
			var def = $.Deferred();
			utils.doAjax(this.api[type + "Url"], params).done(function(resp) {
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
		
		genMeetRoomDetail : function(meetRoomId, meetRoomName, meetRoomNameRemark, meetingDate) {
			if (meetRoomId == 'other_meetingroom') {
				meetRoomName = '';
			}
			return '' + 
				'<tr class="meet-room-tr" style="height:38px">' +
				'	<td class="hysjTh">' +
				'		<p align="center">' +
				'			<span class="hysjTdSpan">' +
				'				会&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;议&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室' +
				'			</span>' +
				'		</p>' +
				'	</td>' +
				'	<td colspan="3" style=" border-bottom: 1pt solid #D8DCF0;">' +
				'		<div style="margin: 2px;font-size:13px">' +
				'			<div class="control" style="float:left;width:70%">' +
				'				<input type="text" class="jqx-widget-content meet-room-name"' +
				'					style="border:0px; width: 100%;height: 28px;" value="' + (meetRoomName || '') + (meetRoomNameRemark || '') + '">' +
				'				<input type="hidden" class="meet-room-name-ori" value="' + (meetRoomName || '') + '">' + 
				'				<input type="hidden" class="meet-room-id" value="' + meetRoomId + '">' + 
				'			</div>' +
				'			<div style="float:right">' +
				'				<a href="javascript:void(0);" style="font-size:12px;" data-action="hysyd_changeMeetRoom">变更会议室</a>' +
				'				|' + 
				'				<a href="javascript:void(0);" style="font-size:12px;" data-action="hysyd_deleteMeetRoom">删除会议室</a>' + 
				'			</div>' +
				'		</div>' +
				'	</td>' +
				'</tr>' +
				'<tr class="meeting-time-tr">' + 
				'	<td class="hysjTh">' + 
				'		<p align="center">' + 
				'			<span class="hysjTdSpan">' + 
				'			日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期</span>' + 
				'		</p>'+
				'   </td>' + 
				'	<td style="border-bottom: 1pt solid #D8DCF0;">' + 
				'		<div style="margin: 2px;font-size:13px;">' + 
				'			<input style="border:0px"class="jqx-widget-content meeting-date"' + 
				'					type="text" style="width: 100%;" readonly="readonly" value="' + meetingDate + '">' + 
				'		</div>' + 
				'	</td>' + 
				'	<td class="hysjTh" >' + 
				'		<p align="center">' + 
				'		<span class="hysjTdSpan">' + 
				'				时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间</span>' + 
				'		</p></td>' + 
				'	<td style="border-bottom: 1pt solid #D8DCF0;">' + 
				'		<div class="form-validate-block" style="margin: 2px; font-size:13px">' + 
				'					<div class="control meeting-time-range">' + 
				'						<select class="bh-form-control hysjSelect" id="meetBeginHour">' + 
				'							<option value="06">06</option>' + 
				'							<option value="07">07</option>' + 
				'							<option value="08">08</option>' + 
				'							<option value="09">09</option>' + 
				'							<option value="10">10</option>' + 
				'							<option value="11">11</option>' + 
				'							<option value="12">12</option>' + 
				'							<option value="13">13</option>' + 
				'							<option value="14">14</option>' + 
				'							<option value="15">15</option>' + 
				'							<option value="16">16</option>' + 
				'							<option value="17">17</option>' + 
				'							<option value="18">18</option>' + 
				'							<option value="19">19</option>' + 
				'							<option value="20">20</option>' + 
				'							<option value="21">21</option>' + 
				'							<option value="22">22</option>' + 
				'						</select>' + 
				'						<span class="hysjSpan">:</span>' + 
				'						<select class="bh-form-control hysjSelect"  id="meetBeginMinute">' + 
				'							<option value="00">00</option>' + 
				'							<option value="05">05</option>' + 
				'							<option value="10">10</option>' + 
				'							<option value="15">15</option>' + 
				'							<option value="20">20</option>' + 
				'							<option value="25">25</option>' + 
				'							<option value="30">30</option>' + 
				'							<option value="35">35</option>' + 
				'							<option value="40">40</option>' + 
				'							<option value="45">45</option>' + 
				'							<option value="50">50</option>' + 
				'							<option value="55">55</option>' + 
				'						</select>' + 
				'						<span class="hysjSpan">-</span>' + 
				'						<select class="bh-form-control hysjSelect" id="meetEndHour">' + 
				'							<option value="06">06</option>' + 
				'							<option value="07">07</option>' + 
				'							<option value="08">08</option>' + 
				'							<option value="09">09</option>' + 
				'							<option value="10">10</option>' + 
				'							<option value="11">11</option>' + 
				'							<option value="12">12</option>' + 
				'							<option value="13">13</option>' + 
				'							<option value="14">14</option>' + 
				'							<option value="15">15</option>' + 
				'							<option value="16">16</option>' + 
				'							<option value="17">17</option>' + 
				'							<option value="18">18</option>' + 
				'							<option value="19">19</option>' + 
				'							<option value="20">20</option>' + 
				'							<option value="21">21</option>' + 
				'							<option value="22">22</option>' + 
				'						</select>' + 
				'						<span class="hysjSpan">:</span>' + 
				'						<select class="bh-form-control hysjSelect"  id="meetEndMinute">' + 
				'							<option value="00">00</option>' + 
				'							<option value="05">05</option>' + 
				'							<option value="10">10</option>' + 
				'							<option value="15">15</option>' + 
				'							<option value="20">20</option>' + 
				'							<option value="25">25</option>' + 
				'							<option value="30">30</option>' + 
				'							<option value="35">35</option>' + 
				'							<option value="40">40</option>' + 
				'							<option value="45">45</option>' + 
				'							<option value="50">50</option>' + 
				'							<option value="55">55</option>' + 
				'						</select>' + 
				'				</div>' + 
				'		</div>' + 
				'		<div style="float:right">' + 
				'			<a href="javascript:void(0);" class="" style="font-size:12px;" data-action="hysyd_updMeetTime">' + 
				'			<i class="iconfont icon-edit bh-mv-4" style="display:inline-block;"></i></a>' + 
				'		</div>' + 
				'	</td>' + 
				'</tr>';
		},
		submitInfo : function(formdata,self){
			bs.turningForm.saveUpload().done(function() {});
			$('footer.bh-clearfix').hide();
			bs.basicDataRequest("formSubmit", formdata).done(function(resp) {
				self.actionType = 2;
				$.success("提交成功!");
				$.bhPaperPileDialog.hide({
					ignoreCloseBeforeCallback : true
				});
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
					title : '提交失败！',
					content : errMsg,
					buttons : [ {
						text : '确定'
					} ]
				});
				$('footer.bh-clearfix').show();
			});
		},
	};

	return bs;
});
