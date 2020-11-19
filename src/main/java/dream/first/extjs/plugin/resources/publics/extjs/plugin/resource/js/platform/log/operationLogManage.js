Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
		saveLog : rootPath + "/log/save",
//		queryLog : rootPath + "/log/query",
		queryLog : rootPath + "/log/queryOperationLog",
		deleteLog : rootPath + "/log/delete",
		retrieveLog : rootPath + "/log/retrieve"
	};
	
	//============================ Model =========================
	Co.defineModel("Log", ["startTime","endTime","userName","userIp","requestPath","operTimes","operModule","requestParams","responseParams","logDesc","id","creator","createTime","updator","updateTime","state"]);
	//============================ Store =========================
	var logGridStore = Co.gridStore("logGridStore", API.queryLog, "Log", {
		autoLoad : false,
		output : "logTbar",
		sorters : [{
			property : "createTime",
			direction : "desc"
		}]
	});
		
	//============================ View =========================
	var logTbar = Co.toolbar("logTbar", ["->",{
			type : "@",
			handler : searchLog,
			searchField : ["userName"],
			searchEmptyText : ["请输入用户名称..."]
		}
	]);
	
	var logColumns = [
//		Co.gridRowNumberer(),
		{header : "开始时间", dataIndex : "startTime", width : 150, hidden : false},
		{header : "结束时间", dataIndex : "endTime", width : 150, hidden : false},
		{header : "用户名称", dataIndex : "userName", width : 100, hidden : false},
		{header : "用户IP", dataIndex : "userIp", width : 120, hidden : false},
		{header : "请求地址", dataIndex : "requestPath", width : 300, hidden : false},
		{header : "操作时间（ms）", dataIndex : "operTimes", width : 120, hidden : false},
		{header : "操作模块", dataIndex : "operModule", width : 150, hidden : false},
		{header : "请求参数", dataIndex : "requestParams", width : 1000, hidden : false},
		{header : "响应参数", dataIndex : "responseParams", width : 1000, hidden : true},
		{header : "描述", dataIndex : "logDesc", width : 500, hidden : false},
		{header : "主键标识", dataIndex : "id", width : 100, hidden : true},
		{header : "创建人", dataIndex : "creator", width : 62, hidden : true},
		{header : "创建时间", dataIndex : "createTime", width : 62, hidden : true},
		{header : "修改人", dataIndex : "updator", width : 62, hidden : true},
		{header : "修改时间", dataIndex : "updateTime", width : 62, hidden : true},
		{header : "状态", dataIndex : "state", width : 62, hidden : true}
	];
	
	var logGrid = Co.grid("logGrid", logGridStore, logColumns, logTbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
			}
		}
	});
	
	Co.load(logGridStore,{"model.eventType":eventType});
	
	Ext.create("Ext.container.Viewport", {
		layout : "fit",
		items : logGrid
	});
	//============================ Function =========================
	
	function searchLog() {
		Co.load(logGridStore);
	}
});