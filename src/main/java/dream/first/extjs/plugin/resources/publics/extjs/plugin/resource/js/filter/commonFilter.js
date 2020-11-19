var filterIndex = ModuleServiceInterface.filterIndex;

//=============筛选==================
var filterParamJson;
var currentStore;
var isShow = false;

var filterWindow =  Co.window("筛选",[{
	//html : "<iframe id='' scrolling = 'auto' frameborder = '0' width = '100%' height = '100%' src = 'https://www.baidu.com/'></iframe>"
	html: "<iframe id='filterIframe' name = 'filterWindow' scrolling = 'auto' frameborder = '0' width = '100%' height = '100%' src = ''></iframe>/p>"
}], 770, 400, "fit",{
	listeners : {
		show : function(tab, opts) {
			if(isShow == false ){
				document.getElementById("filterIframe").src = filterIndex+"?filters="+encodeURI(filterParamJson);
				isShow = true;
			}
			//filterWindow.maximize();
		}
	},
	buttons : [{
		text : "筛选",
		iconCls : "form_saveIcon",
		handler : function() {
			 document.getElementById("filterIframe").contentWindow.postMessage({"type":"filter"},'*');
			 //filterWindow.close();
		}
	},{
		text : "重置",
		iconCls : "form_resetIcon",
		handler : function() {
			 document.getElementById("filterIframe").contentWindow.postMessage({"type":"reset"},'*');
		}
	},{
		text : "关闭",
		iconCls : "closeIcon",
		handler : function() {
			filterWindow.close();
		}
	}]
});

/**
 * 打开筛选器
 * @param columns
 * @param config
 * @returns
 */
function openFilterWindow(columns,store,config){
	currentStore = store;
	filterParamJson = columnTofilterParamJson(columns,config);
	filterWindow.show();
}

/**
 * 刷新。恢复到页面最初状态
 * @returns
 */
function refresh(){
	try {
		document.getElementById("filterIframe").contentWindow.postMessage({"type":"refresh"},'*');
	} catch (e) {
	}
}

/**
 * 列转换为筛选条件json
 * @param {Object} columns Extjs 列对象
 * @param {Object} config 配置对象
 * 			fieldNameMapping:字段名称映射
 * 			fieldTypeMapping:字段类型映射
 * 			fieldDictTypeMapping:字典映射
 * 			fieldSupportOperatorsMapping:字段支持操作符映射
 */
function columnTofilterParamJson(columns,config){
	config = config || {};
	var filters = [];
	//字段映射
	var fieldNameMapping = config.fieldNameMapping || {};
	var fieldTypeMapping = config.fieldTypeMapping || {};
	var fieldSupportOperatorsMapping = config.fieldSupportOperatorsMapping || {};
	var fieldDictTypeMapping = config.fieldDictTypeMapping || {};
	var selectFieldTypeMapping = config.selectFieldTypeMapping || {};
	for (var i = 0; i < columns.length; i++) {
		var column = columns[i];
		if(column.hidden){
			continue;
		}
		var fieldName = column.dataIndex;//索引列字段名 通过这个名称与映射其他的属性
		if(Co.isEmpty(fieldName)){
			continue;
		}
		filters.push({
			//column与config配置中映射的查询信息
			"fieldName":fieldNameMapping[fieldName] || column.fieldName  ||column.dataIndex,
			"fieldText": column.fieldText || column.header,
			"supportOperators": fieldSupportOperatorsMapping[fieldName] || column.supportOperators,
			"fieldType" : fieldTypeMapping[fieldName] || column.fieldType || "String",
			"selectFieldType" : selectFieldTypeMapping[fieldName] || column.selectFieldType || null,//时间选择，但是是String类型的字段
			"dictType":fieldDictTypeMapping[fieldName] || column.dictType || fieldName
		});
	}
	var filterParamJson = JSON.stringify({"filters":filters});
	return filterParamJson;
}


/**
 * 添加消息监听器
 * @param e
 * @returns
 */
//window.addEventListener('message', function(e) {
addEvents(window,"message",function(e){
	var data = e.data;
	if(data.type == "filter"){
		//console.log(data.filters);
//		Co.resetStore(currentStore);//请空原查询条件
		Co.load(currentStore,{"filters":JSON.stringify(data.filters)});
		filterWindow.close();
	}
}, false);