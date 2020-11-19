Co.initialize();

Ext.onReady(function() {
	var API = {
		saveReportSwfMapping : "report_swf!save.action",
		queryReportSwfMapping : "report_swf!query.action",
		deleteReportSwfMapping : "report_swf!delete.action",
		retrieveReportSwfMapping : "report_swf!retrieve.action"
	};
	
	var pointer = '<span style="color:red;font-weight:bold">*</span>';
	//============================ Model =========================
	Co.defineModel("ReportSwfMapping", ["id","fileSource","sourceId","fileUniqueNo","finishState"]);
	
	//============================ Store =========================
	var reportSwfMappingGridStore = Co.gridStore("reportSwfMappingGridStore", API.queryReportSwfMapping, "ReportSwfMapping", {
		autoLoad : false,
		output : "tbar",
		sorters : [{
			property : "createTime",
			direction : "desc"
		}]
	});
	
	//============================ View =========================
	var tbar = Co.toolbar("tbar", ["->",{
			type : "@",
			handler : searchKnowClass,
			searchField : ["fileSource"],
			searchEmptyText : ["..."]
		}
	]);
	
	var columns = [
		Co.gridRowNumberer(),
		{header : "id", dataIndex : "id", width : 180, hidden : true},
		{header : "报告类别", dataIndex : "ReportSwfMapping", width : 200, hidden : false},
		{header : "生成状态", dataIndex : "finishState", width : 200, hidden : false}
	];
	
	var reportSwfMappingGrid = Co.grid("reportSwfMappingGrid", reportSwfMappingGridStore, columns, tbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
				editReportSwfMapping();
			}
		}
	});
	
	Co.load(reportSwfMappingGridStore);
	
	Ext.create("Ext.container.Viewport", {
		layout : "fit",
		items : knowClassGrid
	});
	//============================ Function =========================
	function searchKnowClass() {
		Co.load(knowClassGridStore);
	}
});