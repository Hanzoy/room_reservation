define(function(require) {

	var page = {
		// formatFwSwLabel : function(col) {
		// $('[data-col="1"]').each(function() {
		// var label = $(this).find('label');
		// $line1 = $('<div class="vertical-align">' + label.text() + '</div>');
		// label.html('').append($line1);
		// });
		// $('[data-col="2"]').each(function() {
		// var obj = $(this);
		// var $line1, $line2;
		// var label = obj.find('label');
		// if (label.text().length > 4) {
		// if (label.text().length == 6) {
		// $line1 = $('<div class="vertical-align">' + label.text().substr(0, 4)
		// + '</div>');
		// $line2 = $('<div class="vertical-align">' + label.text().substr(4, 2)
		// + '</div>');
		// } else if (label.text().length == 7) {
		// $line1 = $('<div class="vertical-align">' + label.text().substr(0, 3)
		// + '</div>');
		// $line2 = $('<div class="vertical-align">' + label.text().substr(3, 4)
		// + '</div>');
		// } else {
		// var $line1 = $('<div class="vertical-align">' + label.text() +
		// '</div>');
		// }
		// label.html('');
		// label.css({
		// 'line-height' : '20px',
		// 'max-height' : ''
		// });
		// label.append($line1, $line2);
		// label.next().children().css('min-height', label.outerHeight());
		// } else {
		// var $line = $('<div class="vertical-align">' + label.text() +
		// '</div>');
		// label.html('').append($line);
		// }
		// });
		// $('.oa-red-form .bh-form-label').each(function() {
		// $(this).find('.vertical-align').append('<span></span>');
		// });
		// },

		formatMeetLabel : function() {
			$('.bh-form-group').each(function() {
				var label = $(this).find('label.bh-form-label');
				$line1 = $('<div class="vertical-align">' + label.text() + '</div>');
				label.html('').append($line1);
			});
		},
		
		/**
		 * yyyyMMdd to yyyy-MM-dd
		 */
		formatDateDisplay : function(date) {
			if (!date) {
				return "";
			}
			return date.substr(0,4) + "-" + date.substr(4,2) + "-" + date.substr(6,2);
		},

		/**
		 * yyyy-MM-dd to yyyyMMdd
		 */
		formatDateParam : function(date) {
			if (!date) {
				return "";
			}
			return date.substr(0,4) + date.substr(5,2) + date.substr(8,2);
		},
		
		/**
		 * 弹框高度变化时,手动使页脚自适应的方法
		 */
		footerAdaptive : function() {
			$.bhPaperPileDialog.resetPageFooter();
			$.bhPaperPileDialog.resetDialogFooter();
		},
		
		/**
		 * 获取光标位置函数
		 */
		getCursorPosition : function(ctrl) {
			var CaretPos = 0;	// IE Support
			if (document.selection) {
			ctrl.focus ();
				var Sel = document.selection.createRange ();
				Sel.moveStart ('character', -ctrl.value.length);
				CaretPos = Sel.text.length;
			}
			// Firefox support
			else if (ctrl.selectionStart || ctrl.selectionStart == '0')
				CaretPos = ctrl.selectionStart;
			return (CaretPos);
		},
		
		/**
		 * 干预查询模块		  
		 */
		interSearchData : function(searchData){
			_.each(searchData.controls, function(element) {
				if (element.name == "STATUS") {
					element.optionData = '[{"id":"0","name":"未办"},{"id":"1","name":"已办"}]';
				}	
				if (element.name == "USERROLE") {
					element.optionData = '[{"id":"1","name":"我的"}]';
				}	
			});
			return searchData;
		},
		
		interQuerySetting : function(data) {
			var searchData = [];
			_.each(JSON.parse(data), function(element) {
				if (element.name == "STATUS") {					
					if (element.value == 1) {
						element.builder = "notEqual";
					}
					element.value = "";
				}
				if (element.name == "USERROLE") {
					element.value = window.currentUserId;
				}
				searchData.push(element);
			});
			return searchData;
		}
	};

	return page;
});
