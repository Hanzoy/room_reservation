define(function(require) {

	var mock = {
		baseData : {
			selected : [ {
				xm : '张三11',
				zgh : '3222413131',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '313134331',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '313131611',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '317313331',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '3131375111',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '3131330931',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '3131653111',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '313133343431',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '3131317711',
				zw : '领导'
			} ],
			filterOptions : [ {
				key : '1',
				value : '33'
			}, {
				key : '2',
				value : '22'
			} ]
		},
		yyList : {
			selected : [],
			total : 12,
			datas : [ {
				xm : '张三11',
				zgh : '3222413131',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '313131',
				zw : '领导'
			}, {
				xm : '张三',
				zgh : '31314431',
				zw : '领导'
			} ]
		},
		treeModel : [ {
			"icon" : "./public/images/folder.png",
			"label" : "金智大学",
			value : '学校',
			id : '2',
			"expanded" : true,
			"items" : [ {
				"icon" : "./public/images/folder.png",
				"label" : "行政机构",
				value : '学院',
				id : '2',
				"items" : [ {
					"icon" : "./public/images/file.png",
					"label" : "校长办公室",
					value : '系',
					id : '2'
				} ]
			}, {
				"icon" : "./public/images/folder.png",
				"label" : "党群组织",
				value : '学院',
				id : '2',
				"items" : [ {
					"icon" : "./public/images/file.png",
					"label" : "校领导",
					value : '系',
					id : '2'
				} ]
			} ]
		} ]
	};

	return mock;
});
