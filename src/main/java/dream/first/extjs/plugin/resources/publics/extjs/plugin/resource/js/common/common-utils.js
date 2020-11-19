/**
 * 时间工具类
 * 包含时间的转换功能
 * 
 * @author PengFei
 */
var DateUtils = {

		/**
		 * yyyy-MM-dd
		 */
		YYYY_MM_DD_BAR : "yyyy-MM-dd",

		/**
		 * yyyy/MM/dd
		 */
		YYYY_MM_DD_SLASH : "yyyy/MM/dd",

		/**
		 * yyyy-MM-dd HH:mm:ss
		 */
		YYYY_MM_DD_HH_MM_SS : "yyyy-MM-dd HH:mm:ss",

		/**
		 * 字符串转换为时间
		 * 
		 * @param date {String} 需要转换为时间的字符串
		 * @param parsePatterns {String/Array<String>} 需要被转换的时间字符串格式。支持一个或多个格式，多个格式按照格式的先后顺序进行解析。
		 */
		parseDate :  function(date, parsePatterns) {
			//如果不是数组，转换为数组
			if(!Array.isArray(parsePatterns)){
				parsePatterns = [parsePatterns];
			}
			for (var i = 0; i < parsePatterns.length; i++) {
				switch (parsePatterns[i]) {
				case this.YYYY_MM_DD_BAR:
					return new Date(date.replace(/-/g,"/")) ;//兼容IE、火狐、谷歌
				case this.YYYY_MM_DD_SLASH:
					return new Date(date) ;
				case this.YYYY_MM_DD_HH_MM_SS:
					var arr1 = date.split(" "); 
					var sdate = arr1[0].split('-'); 
					return new Date(sdate[0], sdate[1]-1, sdate[2]); 
				default:
					break;
				}
			}
			console.error("不支持的格式："+parsePatterns);
		},

		/**
		 * 格式化时间为指定的格式
		 * 
		 * @param date {Date} 需要被格式化的时间
		 * @param pattern {String} 格式
		 */
		format : function (date, pattern) {
			var o = {
					"M+": date.getMonth() + 1, //月份 
					"d+": date.getDate(), //日 
					"h+": date.getHours(), //小时 
					"m+": date.getMinutes(), //分 
					"s+": date.getSeconds(), //秒 
					"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
					"S": date.getMilliseconds() //毫秒 
			};
			if (/(y+)/.test(pattern))
				pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o){
				if (new RegExp("(" + k + ")").test(pattern)) {
					pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return pattern;
		}

}