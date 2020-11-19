Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
		saveSystemParams : rootPath + "/systemParams/save",
		querySystemParams : rootPath + "/systemParams/query",
		deleteSystemParams : rootPath + "/systemParams/delete",
		retrieveSystemParams : rootPath + "/systemParams/retrieve"
	};
	
	//============================ Model =========================
	Co.defineModel("SystemParams", ["id","paramName","paramCode","paramValue"]);
	//============================ Store =========================
	var systemParamsGridStore = Co.gridStore("systemParamsGridStore", API.querySystemParams, "SystemParams", {
		autoLoad : false,
		output : "systemParamsTbar",
		sorters : [{
			property : "createTime",
			direction : "desc"
		}]
	});
		
	//============================ View =========================
	var systemParamsTbar = Co.toolbar("systemParamsTbar", [{
			type : "+", 
			handler : addSystemParams,
			showAtContextMenu : true
		},{
			type : "*",
			handler : deleteSystemParams,
			showAtContextMenu : true
		},{
			type : "-",
			handler : editSystemParams,
			showAtContextMenu : true
		},"->",{
			type : "@",
			handler : searchSystemParams,
			searchField : ["paramName","paramCode","paramValue"],
			searchEmptyText : ["请输入参数名称...","请输入参数代码...","请输入参数值..."]
		}
	]);
	
	var systemParamsColumns = [
//		Co.gridRowNumberer(),
		{header : "主键", dataIndex : "id", width : 250, hidden : true},
		{header : "参数名称", dataIndex : "paramName", width : 300, hidden : false},
		{header : "参数代码", dataIndex : "paramCode", width : 300, hidden : false},
		{header : "参数值", dataIndex : "paramValue", width : 200, hidden : false}
	];
	
	var systemParamsGrid = Co.grid("systemParamsGrid", systemParamsGridStore, systemParamsColumns, systemParamsTbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
				editSystemParams();
			}
		}
	});
	
	Co.load(systemParamsGridStore);
	
	var systemParamsForm = Co.form(API.saveSystemParams, [{
		layout : "column",
		border : false,
		bodyCls : "panel-background-color",
		items : [{
			columnWidth : 1,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "paramName",
				name : "model.paramName",
				fieldLabel : "参数名称",
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 64,
				maxLengthText: "参数名称最多64个字！",
				enforceMaxLength: false
			}]
		}]
	},{
		layout : "column",
		border : false,
		bodyCls : "panel-background-color",
		items : [{
			columnWidth : 1,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "paramCode",
				name : "model.paramCode",
				fieldLabel : "参数代码",
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 64,
				maxLengthText: "参数代码最多64个字！",
				enforceMaxLength: false
			}]
		}]
	},{
		layout : "column",
		border : false,
		bodyCls : "panel-background-color",
		items : [{
			columnWidth : 1,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "paramValue",
				name : "model.paramValue",
				fieldLabel : "参数值",
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 256,
				maxLengthText: "参数值最多256个字！",
				enforceMaxLength: false
			}]
		}]
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	}]);
	
	var systemParamsFormWindow = Co.formWindow("新增", systemParamsForm, 650, 190, "fit", {
		okHandler : saveSystemParams
	});
	
	Ext.create("Ext.container.Viewport", {
		layout : "fit",
		items : systemParamsGrid
	});
	//============================ Function =========================
	function addSystemParams() {
		Co.resetForm(systemParamsForm, true);
		systemParamsFormWindow.setTitle("新增");
		systemParamsFormWindow.show();
	}
	
	function saveSystemParams() {
		Co.formSave(systemParamsForm, function(form, action){
			Co.alert("保存成功！", function(){
				systemParamsFormWindow.hide();
				Co.reload(systemParamsGridStore);
			});
		});
	}
	
	function editSystemParams() {
		Co.formLoad(systemParamsForm, systemParamsGrid, API.retrieveSystemParams, function(result, opts, selectedId){
			if (true === result.success) {
				systemParamsFormWindow.setTitle("修改");
				systemParamsFormWindow.show();
			} else {
				Co.showError(result.msg || "数据加载失败！");
			}
		});
	}
	
	function deleteSystemParams() {
		Co.gridDelete(systemParamsGrid, API.deleteSystemParams, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(systemParamsGridStore);
				});
			} else {
				Co.alert(result.msg);
			}
		});	
	}
	
	function searchSystemParams() {
		Co.load(systemParamsGridStore);
	}
});