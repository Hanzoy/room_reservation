define(function(require) {

	var oacomponent = {

		/**
		 * 表单所有字段值
		 */
		formdata: {},

		turningForm: {},

		/**
		 * 卓正控件组件
		 */
		zhuozheng: function(paramData) {
			WIS_EMAP_INPUT.extend({
				xtype: 'zhuozheng',
				init: function(ele, params) {
					if (paramData.canCreateWord) {
						$(ele).html('<a href="#" id="edit">编辑正文</a>');
						$('#edit', ele).click(function(e) {
							var bizData = oacomponent.turningForm.getValue();
							var res = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/checkHasDoc.do", {
								bizId: bizData.WID
							});
							if (res.hasDoc) {
								// 如果有正文了，直接编辑正文
								var createWordURL = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/getLinkUrl.do", {
									url: "/sys/zhuozheng/create.do?bizId=" + paramData.WID
								});
								document.location.href = createWordURL;
							} else {
								$.post(contextPath + "/sys/zhuozheng/getQcTemplateList.do?appName=" + window.WIS_CONFIG.APPNAME + "&fileType=" + bizData.FILE_TYPE).done(function(resp) {
									if (resp.templateList) {
										if (resp.templateList.length === 0) {
											// 没有起草模板，正常起草正文
											var createWordURL = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/getLinkUrl.do", {
												url: "/sys/zhuozheng/create.do?bizId=" + paramData.WID
											});
											document.location.href = createWordURL;
										} else if (resp.templateList.length === 1) {
											// 有一个起草模板，调起草模板
											var createWordURL = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/getLinkUrl.do", {
												url: "/sys/zhuozheng/createWithTmpl.do?bizId=" + paramData.WID + "&templateId=" + resp.templateList[0].templateId
											});
											document.location.href = createWordURL;
										} else {
											// 有多个起草模板，先弹出选择模板框
											var html = "<div style='width:100%;text-align:center'><select class='bh-form-control' style='width:100%' id='selTemp' name='selTemp'>";
											$.each(resp.templateList, function(i, v) {
												html += "<option value=" + v['templateId'] + ">" + v['templateName'] + "</option>";
											});
											html += "</select></div>";
											BH_UTILS.bhWindow(html, "请选择起草模板", [{
												text: '确认',
												className: 'bh-btn-warning',
												callback: function() {
													var createWordURL = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/getLinkUrl.do", {
														url: "/sys/zhuozheng/createWithTmpl.do?bizId=" + paramData.WID + "&templateId=" + $("#selTemp").val()
													});
													document.location.href = createWordURL;
												}
											}, {
												text: '取消',
												className: 'bh-btn-default',
												callback: function() {}
											}], {
												height: 180,
												width: 350
											}, {
												close: function() {
													// 确认和取消的时候，都会进入这里
													dailog.remove(); // 需要手动销毁
												}
											});
										}
									}
								});
							}
						});
					} else if (paramData.canTaohong) {
						$(ele).html('<a href="#" id="taohong">编辑正文</a>');
						$('#taohong', ele).click(function(e) {
							if ($.isEmpty(paramData.WID)) {
								$.err("无法获取WID！");
								return;
							}
							var res = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/checkHasDoc.do", {
								bizId: paramData.WID
							});
							if (!res.hasDoc) {
								$.err("暂无正文！");
								return;
							}
							var taohongURL = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/getLinkUrl.do", {
								url: "/sys/zhuozheng/taohong.do?bizId=" + paramData.WID + "&appName=" + window.WIS_CONFIG.APPNAME
							});
							document.location.href = taohongURL;
						});
					} else if (paramData.canQG) {
						$(ele).html('<a href="#" id="edit">修订正文</a>');
						$('#edit', ele).click(function(e) {
							if ($.isEmpty(paramData.WID)) {
								$.err("无法获取WID！");
								return;
							}
							var res = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/checkHasDoc.do", {
								bizId: paramData.WID
							});
							if (!res.hasDoc) {
								$.err("暂无正文！");
								return;
							}
							var editWordURL = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/getLinkUrl.do", {
								url: "/sys/zhuozheng/normalEdit.do?bizId=" + paramData.WID
							});
							document.location.href = editWordURL;
						});
					} else if (paramData.canEditWord) {
						$(ele).html('<a href="#" id="edit">编辑正文</a>');
						$('#edit', ele).click(function(e) {
							if ($.isEmpty(paramData.WID)) {
								$.err("无法获取WID！");
								return;
							}
							var res = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/checkHasDoc.do", {
								bizId: paramData.WID
							});
							if (!res.hasDoc) {
								$.err("暂无正文！");
								return;
							}
							var editWordURL = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/getLinkUrl.do", {
								url: "/sys/zhuozheng/revisionEdit.do?bizId=" + paramData.WID
							});
							document.location.href = editWordURL;
						});
					} else {
						$(ele).html('<a href="#" id="read">查看正文</a>');
						$('#read', ele).click(function(e) {
							if ($.isEmpty(paramData.WID)) {
								$.err("无法获取WID！");
								return;
							}
							var res = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/checkHasDoc.do", {
								bizId: paramData.WID
							});
							if (!res.hasDoc) {
								$.err("暂无正文！");
								return;
							}
							var readWordURL = BH_UTILS.doSyncAjax(contextPath + "/sys/zhuozheng/getLinkUrl.do", {
								url: "/sys/zhuozheng/read.do?bizId=" + paramData.WID
							});
							document.location.href = readWordURL;
						});
					}
				},
				setValue: function(ele, name, val, root) {},
				getValue: function(ele, formData) {},
				disable: function(ele) {},
				enable: function(ele) {},
				readonly: function(ele, params) {
					WIS_EMAP_INPUT.component[$(ele).attr("xtype")].init(ele, params);
				}
			});
		},

		/**
		 * oa意见组件
		 */
		oacomment: function(paramData) {
			WIS_EMAP_INPUT.extend({
				xtype: 'oacomment',
				init: function(ele, params) {
					var columnName = $(ele).attr("data-name");
					var orderby = "";
					var dateformat = "";
					var distinct = "";
					if (!$.isEmpty(params)) {
						orderby = params.orderby || "timeasc";
						dateformat = params.dateformat || "yyyy-MM-dd HH:mm";
						distinct = params.distinct || "0";
					}
					if (!$.isEmpty(columnName)) {
						$.post(window.APP_PATH + "/getCommentListByColName.do", {
							WID: paramData.WID,
							columnName: columnName,
							orderby: orderby,
							dateformat: dateformat,
							distinct: distinct
						}).done(
							function(resp) {
								var html = "";
								if ($.isEmpty(resp.commentList) || resp.commentList.length === 0) {
									html = "<div style='font-size:16px;height : 28px;width: 100%;display: inline-flex;padding-top: 2px;padding-bottom: 2px;'></div>";
								} else {
									$.each(resp.commentList, function(j, e) {
										var nr = e.NR;
										nr = nr.replace(/\r\n/g,"<BR>");
										nr = nr.replace(/\n/g,"<BR>");
										if (paramData.type === 1) {
											// 管理员编辑
											html = html + "<div id='comment" + columnName + j + "' style='font-size: 16px;display: inline-flex; width: 100%;padding-top: 2px;padding-bottom: 2px;'>" + "<div style='width: 89%; display:inline-block'>" + "<div id='comment" + columnName + j + "NR'>" + nr + "</div>" + "<div id='comment" + columnName + j + "SIGN'>---" + e.USER_NAME + " " + e.CREATE_TIME + "</div>" + "</div>" + "<div style='display:inline-block'>" + "<a href='javascript:void(0);' data-div-id='comment" + columnName + j + "' data-comment-id='" + e.WID + "' data-comment-name='" + columnName + "' data-action='编辑意见'>编辑</a>" + "&nbsp;|&nbsp;" + "<a href='javascript:void(0);' data-div-id='comment" + columnName + j + "' data-comment-id='" + e.WID + "' data-comment-name='" + columnName + "' data-action='删除意见'>删除</a>" + "</div>" + "</div>";
										} else {
											html = html + "<div style='!important'>";
											html = html + "<div >" + nr + "</div>";
											var resp = BH_UTILS.doSyncAjax(window.APP_PATH + "/hasSign.do", {
												USER_ID: e.USER_ID
											});
											if (resp.hasSign) {
												html = html + "<div style=\"height:53px;\"><div style='float:right;'>------<img style='width:100px;height:53px' src='" + window.APP_PATH + "/showSign.do?USER_ID=" + e.USER_ID + "'>&nbsp;&nbsp;&nbsp;&nbsp;" + e.CREATE_TIME + "</div></div>";
											} else {
												html = html + "<div style='float:right;'>------" + e.USER_NAME + " " + e.CREATE_TIME + "</div>";
											}
											html = html + "</div></br>";
										}
									});
								}
								$(ele).html(html);
							});
					}
				},
				setValue: function(ele, name, val, root) {},
				getValue: function(ele, formData) {},
				disable: function(ele) {},
				enable: function(ele) {},
				readonly: function(ele, params) {
					WIS_EMAP_INPUT.component.oacomment.init(ele, params);
				}
			});
		},

		/**
		 * OA拟稿部门组件
		 */
		oangbm: function(paramData) {
			WIS_EMAP_INPUT.extend({
				xtype: 'oangbm',
				init: function(ele, params) {
					var dataName = $(ele).attr("data-name");
					var dataVal = oacomponent.formdata[dataName];
					var deptLevel = 2; // 默认部门层级为2级
					if (!$.isEmpty(params) && !$.isEmpty(params.deptlevel)) {
						deptLevel = params.deptlevel;
					}
					// 根据创建人ID获取所在部门
					$.post(window.APP_PATH + "/form/getDeptList.do", {
						authorId: paramData.authorId || "",
						deptLevel: deptLevel
					}).done(function(resp) {
						if (resp.deptList.length > 1) {
							var html = "<select class='bh-form-control' style='width:100%;font-size:10.5pt;' id='_ngbm' name='_ngbm'>";
							$.each(resp.deptList, function(index, value) {
								if (dataVal === value.NAME) {
									html += "<option selected value='" + value.ID + "'>" + value.NAME + "</option>";
								} else {
									html += "<option value='" + value.ID + "'>" + value.NAME + "</option>";
								}
							});
							html += "</select>";
							$(ele).html(html);
							$('#_ngbm', ele).on('change', function() {
								$(ele).trigger('_formChange');
								$(ele).trigger('_setFormDataValue', {
									field: "DEPT_ID",
									value: $('#_ngbm', ele).val()
								});
							});
						} else if (resp.deptList.length === 1) {
							$(ele).html(resp.deptList[0].NAME + "<div style='display:none;'><select class='bh-form-control' id='_ngbm' name='_ngbm'><option value=" + resp.deptList[0].ID + ">" + resp.deptList[0].NAME + "</option></select></div>");
						}
						$(ele).trigger('_formChange');
						$(ele).trigger('_setFormDataValue', {
							field: "DEPT_ID",
							value: $('#_ngbm', ele).val()
						});
					});
				},
				setValue: function(ele, name, val, root) {},
				getValue: function(ele, formData) {
					return $('#_ngbm :selected', ele).text();
				},
				disable: function(ele) {},
				enable: function(ele) {},
				readonly: function(ele, params) {
					var dataName = $(ele).attr("data-name");
					$(ele).html(oacomponent.formdata[dataName]);
				}
			});
		},

		/**
		 * OA文号组件
		 */
		oafilenumber: function(paramData) {
			WIS_EMAP_INPUT.extend({
				xtype: 'oafilenumber',
				init: function(ele, params) {
					var dataName = $(ele).attr("data-name");
					var fileNo = oacomponent.formdata[dataName];
					var db_fileOrg = "";
					var db_fileYear = "";
					var db_fileNumber = "";
					var numbertype = "codeyearno_ref_withfiletype"; // 默认“机关代字+年份+号（关联文件分类，按文件分类编号）”形式
					if (!$.isEmpty(params) && !$.isEmpty(params.numbertype)) {
						numbertype = params.numbertype;
					}
					$(ele).data({
						componentParams: params
					});
					var orgHtml = "";
					var yearHtml = "";
					var numberHtml = "";
					if (numbertype === "codeyearno_ref_withfiletype" || numbertype === "codeyearno_ref_withcode") {
						if (!$.isEmpty(fileNo)) {
							db_fileOrg = fileNo.substr(0, fileNo.indexOf("〔"));
							db_fileYear = fileNo.substr((fileNo.indexOf("〔") + 1), 4);
							db_fileNumber = fileNo.substr(fileNo.indexOf("〕") + 1);
						}
						if ($.isEmpty(db_fileYear)) {
							db_fileYear = new Date().getFullYear();
						}
						orgHtml += "<select style='width:140px;display:inline;font-size:10.5pt;' class='bh-form-control' id='_selectOrg' name='_selectOrg'><option value=''>请选择...</option></select>";
						var fileType = oacomponent.formdata["FILE_TYPE"];
						if (!$.isEmpty(fileType)) {
							$.post(window.APP_PATH + "/organWord/getOrganWord.do", {
								FILE_TYPE: fileType
							}).done(function(resp) {
								$("#_selectOrg").empty();
								$.each(resp.organWordList, function(i, e) {
									if (e.NAME === db_fileOrg) {
										$("#_selectOrg").append("<option WID='" + e.WID + "' value='" + e.NAME + "'  selected>" + e.NAME + "</option>");
									} else {
										$("#_selectOrg").append("<option WID='" + e.WID + "' value='" + e.NAME + "'>" + e.NAME + "</option>");
									}
								});
								$(ele).trigger('_formChange');
							});
						}
						// 切换文件分类时，重现获取机关代字
						$('.bh-docs-page [data-name="FILE_TYPE"]').on("change", function(event) {
							var fileType = event.args.item.value || "";
							if (!$.isEmpty(fileType)) {
								$.post(window.APP_PATH + "/organWord/getOrganWord.do", {
									FILE_TYPE: fileType
								}).done(function(resp) {
									$("#_selectOrg").empty();
									$.each(resp.organWordList, function(i, e) {
										if (e.NAME === db_fileOrg) {
											$("#_selectOrg").append("<option WID='" + e.WID + "' value='" + e.NAME + "'  selected>" + e.NAME + "</option>");
										} else {
											$("#_selectOrg").append("<option WID='" + e.WID + "' value='" + e.NAME + "'>" + e.NAME + "</option>");
										}
									});
									$(ele).trigger('_formChange'); // 获取完机关代字后，告知form调用getValue方法
								});
							}
						});
					} else if (numbertype === "codeyearno") {
						if (!$.isEmpty(fileNo)) {
							db_fileOrg = fileNo.substr(0, fileNo.indexOf("〔"));
							db_fileYear = fileNo.substr((fileNo.indexOf("〔") + 1), 4);
							db_fileNumber = fileNo.substr(fileNo.indexOf("〕") + 1);
						}
						if ($.isEmpty(db_fileYear)) {
							db_fileYear = new Date().getFullYear();
						}
						orgHtml += "<select style='width:140px;display:inline;font-size:10.5pt;' class='bh-form-control' id='_selectOrg' name='_selectOrg'><option value=''>请选择...</option></select>";
						$.post(window.APP_PATH + "/organWord/getOrganWord.do", {
							FILE_TYPE: ""
						}).done(function(resp) {
							$("#_selectOrg").empty();
							$.each(resp.organWordList, function(i, e) {
								if (e.NAME === db_fileOrg) {
									$("#_selectOrg").append("<option  WID='" + e.WID + "' value='" + e.NAME + "'  selected>" + e.NAME + "</option>");
								} else {
									$("#_selectOrg").append("<option WID='" + e.WID + "' value='" + e.NAME + "'>" + e.NAME + "</option>");
								}
							});
							$(ele).trigger('_formChange');
						});
					} else if (numbertype === "yearno") {
						if (!$.isEmpty(fileNo)) {
							db_fileOrg = fileNo.substr(0, fileNo.indexOf("〔"));
							db_fileYear = fileNo.substr((fileNo.indexOf("〔") + 1), 4);
							db_fileNumber = fileNo.substr(fileNo.indexOf("〕") + 1);
						}
						if ($.isEmpty(db_fileYear)) {
							db_fileYear = new Date().getFullYear();
						}
						orgHtml = "";
					}
					yearHtml += "〔<input id='_fileYear' name='_fileYear' style='width:48px;display:inline;font-size:10.5pt;' class='bh-form-control' type='text' value='" + db_fileYear + "' />〕";
					numberHtml += "<input id='_fileNumber' name='_fileNumber' style='width:48px;display:inline;font-size:10.5pt;' class='bh-form-control' type='text' value='" + db_fileNumber + "' />号<a href='#' name='btn_no' id='btn_no'>&nbsp;&nbsp;编号</a>";

					var isStartFlow = paramData.isStartFlow || false; // 是否起草节点
					var numberInStartFlow = false; // 起草是否可编号
					if (!$.isEmpty(params) && !$.isEmpty(params.numberinstartflow)) {
						if (params.numberinstartflow === "1") {
							numberInStartFlow = true;
						}
					}
					if (isStartFlow && numberInStartFlow) {
						paramData.canBh = true;
					}
					if (paramData.canBh) {
						$(ele).html(orgHtml + yearHtml + numberHtml);
					} else {
						if (!$.isEmpty(db_fileNumber)) {
							// 没有编号权限，如果已经编过号，只读状态显示
							$(ele).html(oacomponent.formdata[dataName]);
						} else {
							$(ele).html(orgHtml + yearHtml);
						}
					}
					$('#_selectOrg', ele).on('change', function() {
						$(ele).trigger('_formChange'); // 获取完机关代字后，告知form调用getValue方法
						$("#_fileNumber").val(""); // 重新选择机关代字，将文号清空
						$('#_fileNumber', ele).trigger('change');
					}); // 机关代字变化时，告知form调用getValue方法
					$('#_fileYear', ele).on('change', function() {
						var rep = /^\d{4}$/;
						var fileYear = $('#_fileYear', ele).val();
						if (!rep.test(fileYear)) {
							$.warn("年份格式不对");
							$('#_fileYear', ele).val(new Date().getFullYear());
							return;
						}
						$(ele).trigger('_formChange'); // 获取完机关代字后，告知form调用getValue方法
						$("#_fileNumber").val(""); // 编辑年份，将文号清空
						$('#_fileNumber', ele).trigger('change');
					});
					$('#_fileNumber', ele).on('change', function() {
						var fileNumber = $('#_fileNumber', ele).val();
						if ($.isEmpty(fileNumber)) {
							return;
						}
						var rep = /^[1-9]+[0-9]*]*$/; // 判断正整数
						fileNumber = $.trim(fileNumber);
						if (!rep.test(fileNumber)) {
							$.warn("编号请输入正整数！");
							$('#_fileNumber', ele).val("");
							$('#_fileNumber', ele).trigger("change");
							return;
						}
						if (fileNumber > 9999) {
							$.warn("当前系统仅支持小于10000的编号！");
							$('#_fileNumber', ele).val("");
							$('#_fileNumber', ele).trigger("change");
							return;
						}
						if (numbertype === "codeyearno_ref_withfiletype") {
							var fileType = $('.bh-docs-page [data-name="FILE_TYPE"]').val() || "";
							if ($.isEmpty(fileType)) {
								$.warn("请选择文件分类！");
								return;
							}
						} else if (numbertype === "codeyearno_ref_withcode") {
							var selOrg = $("#_selectOrg", ele).val() || "";
							if ($.isEmpty(selOrg)) {
								$.warn("请选择机关代字！");
								return;
							}
						} else if (numbertype === "codeyearno") {
							var selOrg = $("#_selectOrg", ele).val() || "";
							if ($.isEmpty(selOrg)) {
								$.warn("请选择机关代字！");
								return;
							}
						} else if (numbertype === "yearno") {}
						$(ele).trigger('_formChange');
					});
					$("#btn_no", ele).click(function(e) {
						var prefixNo = "";
						if (numbertype === "codeyearno_ref_withfiletype") {
							var fileType = $('.bh-docs-page [data-name="FILE_TYPE"]').val() || "";
							if ($.isEmpty(fileType)) {
								$.warn("请选择文件分类！");
								return;
							}
							prefixNo = fileType + "〔" + $("#_fileYear").val() + "〕";
						} else if (numbertype === "codeyearno_ref_withcode") {
							var selOrg = $("#_selectOrg", ele).val() || "";
							if ($.isEmpty(selOrg)) {
								$.warn("请选择机关代字！");
								return;
							}
							prefixNo = selOrg + "〔" + $("#_fileYear").val() + "〕";
						} else if (numbertype === "codeyearno") {
							var selOrg = $("#_selectOrg", ele).val() || "";
							if ($.isEmpty(selOrg)) {
								$.warn("请选择机关代字！");
								return;
							}
							prefixNo = selOrg + "〔" + $("#_fileYear").val() + "〕";
						} else if (numbertype === "yearno") {
							prefixNo = "〔" + $("#_fileYear").val() + "〕";
						}
						if (!$.isEmpty(prefixNo)) {
							$.post(window.APP_PATH + "/fileNumber/getMaxFileNumber.do", {
								columnName: dataName,
								noType: numbertype,
								prefixNo: prefixNo,
								bizId: oacomponent.formdata["WID"]
							}).done(function(resp) {
								var maxnumber = resp.maxFileNumber + 1;
								$('#_fileNumber', ele).val(maxnumber);
								$('#_fileNumber', ele).trigger('change');
							});
						}
					});
				},
				setValue: function(ele, name, val, root) {},
				getValue: function(ele, formData) {
					var dataName = $(ele).attr("data-name");
					var fileNo = oacomponent.formdata[dataName];
					var db_fileNumber = "";
					var params = $(ele).data("componentParams");
					var numbertype = "codeyearno_ref_withfiletype"; // 默认“机关代字+年份+号（关联文件分类，按文件分类编号）”形式
					if (!$.isEmpty(params) && !$.isEmpty(params.numbertype)) {
						numbertype = params.numbertype;
					}
					if (numbertype === "codeyearno_ref_withfiletype" || numbertype === "codeyearno_ref_withcode" || numbertype === "codeyearno") {
						if (!$.isEmpty(fileNo)) {
							db_fileNumber = fileNo.substr(fileNo.indexOf("〕") + 1);
						}
						if (paramData.canBh || $.isEmpty(db_fileNumber)) {
							fileNo = ($("#_selectOrg", ele).val() || "") + ("〔" + $("#_fileYear").val() + "〕") + ($("#_fileNumber", ele).val() || "");
						}
					} else if (numbertype === "yearno") {
						if (!$.isEmpty(fileNo)) {
							db_fileNumber = fileNo.substr(fileNo.indexOf("〕") + 1);
						}
						if (paramData.canBh || $.isEmpty(db_fileNumber)) {
							fileNo = ("〔" + $("#_fileYear").val() + "〕") + ($("#_fileNumber", ele).val() || "");
						}
					}
					return fileNo;
				},
				disable: function(ele) {},
				enable: function(ele) {},
				readonly: function(ele, params) {
					var dataName = $(ele).attr("data-name");
					var dataValue = oacomponent.formdata[dataName];
					if (!$.isEmpty(dataValue)) {
						$(ele).html(oacomponent.formdata[dataName] + "号");
					}
				}
			});
		},

		/**
		 * 选人地址簿
		 */
		selectuser: function(paramData) {
			WIS_EMAP_INPUT.extend({
				xtype: 'selectuser',
				init: function(ele, params) {
					//人员是单选还是多选
					var singlesel = "false";
					if (params) {
						singlesel = params.singlesel || "false";
					}
					var isSingle = false;
					if (singlesel === "true") {
						isSingle = true;
					}
					var dataName = $(ele).attr("data-name");
					var dbValue = oacomponent.formdata[dataName] || "";
					var dbValue_display = "";
					var res = BH_UTILS.doSyncAjax(contextPath + "/sys/oapublic/oauser/displayUserIds.do", {
						userIds: dbValue
					});
					dbValue_display = res.userNames || "";
					var html = "<input  class='bh-form-control' id='input_user_name' style='background: #fff;' type='text' value='" 
						+ dbValue_display + "' readonly />"
						+"<a href='javascript:void(0);' class='inputChooseA' id='selUser'>选择</a>";
					html += "<input type='hidden' id='input_user_id' value='" + dbValue + "' />";
					$(ele).html(html);
					$("#selUser", ele).click(function(e) {
						var initSel = [];
						var userIds = $("#input_user_id", ele).val() || "";
						if (!$.isEmpty(userIds)) {
							initSel = userIds.split(",");
						}
						$.selectTree(initSel, function(data) {
							var ids = "";
							var names = "";
							$.each(data, function(i, obj) {
								if ($.isEmpty(names)) {
									names = obj.value;
								} else {
									names = names + "," + obj.value;
								}
								if ($.isEmpty(ids)) {
									ids = obj.data;
								} else {
									ids = ids + "," + obj.data;
								}
							});
							$("#input_user_name", ele).val(names);
							$("#input_user_id", ele).val(ids);
							$(ele).trigger('_formChange');
						}, {}, isSingle);
					});
				},
				setValue: function(ele, name, val, root) {},
				getValue: function(ele, formData) {
					return $("#input_user_id", ele).val();
				},
				disable: function(ele) {},
				enable: function(ele) {},
				readonly: function(ele, params) {
					var dataName = $(ele).attr("data-name");
					var userids = oacomponent.formdata[dataName] || "";
					if (!$.isEmpty(userids)) {
						// 将工号翻译成姓名
						var res = BH_UTILS.doSyncAjax(contextPath + "/sys/oapublic/oauser/displayUserIds.do", {
							userIds: userids
						});
						$(ele).html(res.userNames || "");
					}
				}
			});
		},

		/**
		 * 可选可输组件
		 */
		selinput: function(paramData) {
			WIS_EMAP_INPUT.extend({
				xtype: 'selinput',
				init: function(ele, params) {
					var dicType = "";
					if (!$.isEmpty(params)) {
						dicType = params.dictype || "";
					}
					var dataName = $(ele).attr("data-name");
					var dbValue = oacomponent.formdata[dataName] || "";
					var $control = $("<div class='chooseInput' style='position:relative;'><input style='font-size:10.5pt;' class='bh-form-control input_text_zb' type='text' value='" + dbValue + "' /></div>");
					$(ele).append($control);
					// 文本框获取焦点
					$(".input_text_zb", $control).focus(function() {
						$.post(contextPath + "/sys/oasysconfig/dictionary/getDicListByType.do", {
							dicType: dicType
						}).done(function(resp) {
							if ($('.moreDetail', $control).length == 0) {
								var divstr = '<div class="moreDetail"><ul></ul></div>'
								$(".input_text_zb", $control).parent('.chooseInput').append(divstr);
								var dicList = resp.dicList;
								$(dicList).each(function(index, item) {
									$(".moreDetail ul", $control).append('<li data-wid="' + item.WID + '">' + item.DICNAME + ' <i class="iconfont icon-add"></i></li>');
								});
							}
						});
					});
					$control.on('mouseleave', function() {
						$(".input_text_zb", $control).parent('.chooseInput').find(".moreDetail").remove();
					});
					$control.on('click', "ul", function(e) {
						var curLi = e.target;
						var chooseText = "";
						if (curLi.tagName === 'LI') {
							chooseText = $(curLi).text();
						} else {
							chooseText = $(curLi).parent('li').text();
						}
						var beforeText = $(".input_text_zb", $control).val();
						if (beforeText.trim() === '') {
							$(".input_text_zb", $control).val(chooseText.trim());
						} else {
							$(".input_text_zb", $control).val(beforeText + ',' + chooseText.trim());

						}
						$(ele).trigger('_formChange');
					});
					$(".input_text_zb", $control).change(function() {
						$(ele).trigger('_formChange'); // 一旦文本框发生改变，通过该方法调用组件getValue方法
					});
				},
				setValue: function(ele, name, val, root) {},
				getValue: function(ele, formData) {
					return $(".input_text_zb", ele).val();
				},
				disable: function(ele) {},
				enable: function(ele) {},
				readonly: function(ele, params) {
					var dataName = $(ele).attr("data-name");
					var dataValue = oacomponent.formdata[dataName] || "";
					$(ele).html(dataValue);
				}
			});
		}

	};

	return oacomponent;
});