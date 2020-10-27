define(function(require, exports, module) {

	var config = {

		/*
		 * 业务线开发模式，转测时置false
		 */
		"DEBUG_MODE" : true,

		/*
		 * 资源服务器地址
		 */
		"RESOURCE_SERVER" : window.WIS_CONFIG.RESOURCE_SERVER,

		/*
		 * 主题 blue purple
		 */
		"THEME" : "purple",

		/*
		 * 服务器端生成配置API(API_BASE_PATH目录下) @example "/config.do"
		 * ./mock/serverconfig.json
		 */
		"SERVER_CONFIG_API" : workflowFlag == "0" ? WIS_CONFIG.PATH + "/sys/funauthapp/api/getAppConfig/" + WIS_CONFIG.APPNAME + "-" + WIS_CONFIG.APPID + ".do" : window.APP_PATH + "/initAppConfig/config.do?configType=" + window.configType,

		/*
		 * APP默认路由
		 */
		'APP_ENTRY' : "",

		/*
		 * APP标题
		 */
		"APP_TITLE" : window.WIS_CONFIG.APP_CN_NAME,

		/*
		 * 应用底部说明文本
		 */
		"FOOTER_TEXT" : "",
		
//		"AFTER_FRAMEWORK_INIT": function() {
//			WIS_EMAP_CONFIG['emapdatatable.fxss'] = true;
//		},
		/*
		 * 头部配置
		 */
		"HEADER" : {
			"dropMenuCallback" : function(item) {
				var url = WIS_CONFIG.PATH + "/sys/funauthapp/api/changeAppRole/" + WIS_CONFIG.APPNAME + "/" + item.id + ".do";
				$.ajax({
					url : url,
					type : 'post',
					async : false,
					error : function() {
						$.bhDialog({
							title : '切换失败',
							iconType : 'warning'
						});
					},
					success : function(data) {
						if (data && data.success == true) {
							location.href = WIS_CONFIG.PATH + "/sys/" + WIS_CONFIG.APPNAME + "/*default/index.do";
						} else {
							$.bhDialog({
								title : '切换失败',
								iconType : 'warning'
							});
							window.location.reload();
						}
					}
				});
			},
			"userInfo" : {
				"info" : [ window.currentUserId, window.currentUserName ]
			}
		},

		"BH_VERSION" : "1.2",
		"ISSENTRY" : false
			
	};

	return config;

});