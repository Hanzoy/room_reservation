$.extend({
	success : function(msg, fn, opts) {
		$.bhTip($.extend({
			content : msg || '',
			state : 'success'
		}, opts));
		if (fn) {
			fn.call(this);
		}
	},
	warn : function(msg, fn, opts) {
		$.bhTip($.extend({
			content : msg || '',
			state : 'warning'
		}, opts));
		if (fn) {
			fn.call(this);
		}
		// opts = $.extend({
		// title : '提示',
		// content : msg || '',
		// type : 'warning',
		// okCallback : function() {
		// if (fn) {
		// fn.call(this);
		// }
		// }
		// }, opts);
		// require('utils').dialog(opts);
	},
	/**
	 * 消息弹出框，弹出后一段时间后自动关闭
	 * 
	 * @param {[type]}
	 *            msg title 提示内容
	 * @param {Function}
	 *            fn 回调方法
	 * @param {[type]}
	 *            opts 配置的参数,如果使用此配置，则认为调用utils.dialog
	 */
	msg : function(msg, fn, opts) {
		// layer.msg($.escapeHtml(msg), $.extend({
		// time: 1500
		// }, opts), fn);
		$.bhTip($.extend({
			content : msg || '',
			state : 'success'
		}, opts));
		if (fn) {
			fn.call(this);
		}
	},
	err : function(msg, fn, opts) {
		$.bhTip($.extend({
			content : msg || '',
			state : 'danger'
		}, opts));
		if (fn) {
			fn.call(this);
		}
	},
	error : function(title, content) {
		BH_UTILS.bhDialogDanger({
			title : title || '',
			content : content || '',
			buttons : [ {
				text : '确定',
				callback : function() {

				}
			}, {
				text : '取消',
				callback : function() {

				}
			} ]
		});
	},
	confirm : function(msg, yes, no, opts) {
		BH_UTILS.bhDialogWarning({
			title : '请确认',
			content : msg || '',
			buttons : [ {
				text : '确定',
				callback : function() {
					if (yes) {
						yes.call(this);
					}
				}
			}, {
				text : '取消',
				callback : function() {
					if (no) {
						no.call(this);
					}
				}
			} ]
		});
	},

	succ : function(msg, fn, opts) {
		BH_UTILS.bhDialogSuccess({
			title : '成功',
			content : msg || '',
			callback : function() {
				if (fn) {
					fn.call(this);
				}
			}
		});
	},

	/**
	 * 纸质弹窗
	 */
	showPaperDialog : function(title, content, fn, opts) {
		$.bhPaperPileDialog.show($.extend({
			'title' : title || '',
			'content' : content,
			'render' : function(a1, a2) {
				if (fn) {
					fn.call(a2);
				}
			}
		}, opts));
	},
	/**
	 * 隐藏纸张对话框，会依次触发closeBefore()和close()
	 */
	hidePaperDialog : function() {
		$.bhPaperPileDialog.hide();
	},

	/**
	 * 等待进度条
	 */
	showLoading : function(text) {
		var $loading = $("#loading");
		if ($loading.size() < 1) {
			$loading = $("<div id='loading'></div>").prependTo($("body"));
			$loading.jqxLoader({
				width : 200,
				height : 60,
				text : text || '',
				imagePosition : 'top'
			});
		}
		$loading.jqxLoader("open");
	},
	/**
	 * 隐藏进度条
	 */
	hideLoading : function() {
		$("#loading").jqxLoader("close");
	},

	// 关闭窗口
	closeWin : function() {
		window.opener = null;
		window.open('', '_self');
		window.close();
	},

	//trim : function(str) {
	//	if (str === undefined || str === null || str === "") {
	//		return "";
	//	}
	//	return str.replace(/(^\s*)|(\s*$)/g, "");
	//},

	isEmpty : function(obj) {
		if (obj === undefined || obj === null || obj === "") {
			return true;
		}
		return false;
	},

	selectTree : function(initUsers, callbackFunc, opts, isSingle, position) {
		var showNoDept = false;
		var showCurrentDept = false;
		if (opts) {
			showNoDept = opts.showNoDept || false;
			showCurrentDept = opts.showCurrentDept || false;
		}
		
		// add by ly at 2017-5-4 start
		var multiFlag = true;
		if (isSingle) {
			multiFlag = false;
		}
		// add by ly at 2017-5-4 end
		
		var options = {
			multiple : multiFlag,// 是否是多选选人， 默认true
			userType : 'all', // teaher, student
			api : {
				getUsers : contextPath + "/sys/oasysconfig/queryUserList4Sel.do",
				getDepts : contextPath + "/sys/oasysconfig/queryDepartTree.do?showNoDept=" + showNoDept + "&showCurrentDept=" + showCurrentDept,
				getDeptUsers : contextPath + "/sys/oasysconfig/getDeptUsers.do",
				getDeptOfficeItems : contextPath + "/sys/oasysconfig/position/queryPositionList.do",
				getGroups : contextPath + "/sys/oasysconfig/group/get4NewSelTree.do",
				getGrqzs: contextPath + "/sys/oagrqz/queryGrqzList4Sel.do",
		        getGrqzUsers: contextPath + "/sys/oagrqz/queryGrqzUserList4Sel.do",
		        addToGrqz: contextPath + "/sys/oagrqz/addUserToGrqz.do",
			},
			initSelectedUsers : function() {
				return initUsers;
			},// user id，
			// 选人组件初始化时默认选中值列表，默认[]
			initAllUsers : [], // 必须满足结构：
			// [{"deptName":"","data":"","positions":"","value":"","deptCode":""}]
			callback : callbackFunc,
			positionList : position
		};
		options = $.extend(options, opts);
		var us = new UserSelector(options);
		us.init();
	},

	confirmDialog : function(title, yes, no) {
		BH_UTILS.bhDialogWarning({
			title : title || "",
			buttons : [ {
				text : '确定',
				callback : function() {
					if (yes) {
						yes.call(this);
					}
				}
			}, {
				text : '取消',
				callback : function() {
					if (no) {
						no.call(this);
					}
				}
			} ]
		});
	},

	errorDialog : function(title) {
		BH_UTILS.bhDialogDanger({
			title : title || "",
			buttons : [ {
				text : '确定',
				callback : function() {
				}
			} ]
		});
	},

	crossDomainRefresh : function() {
		window.opener.postMessage('refreshTaskWidget', '*');
		// if (IEVersion() == 9){
		if (window.opener) {
			window.opener.top.location.reload();
		}
		// }
	},

	IEVersion : function() {
		var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
		var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; // 判断是否IE<11浏览器
		var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; // 判断是否IE的Edge浏览器
		var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
		if (isIE) {
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			var fIEVersion = parseFloat(RegExp["$1"]);
			if (fIEVersion == 7) {
				return 7;
			} else if (fIEVersion == 8) {
				return 8;
			} else if (fIEVersion == 9) {
				return 9;
			} else if (fIEVersion == 10) {
				return 10;
			} else {
				return 6;// IE版本<=7
			}
		} else if (isEdge) {
			return 'edge';// edge
		} else if (isIE11) {
			return 11; // IE11
		} else {
			return -1;// 不是ie浏览器
		}
	}

});