Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
			saveModuleService : rootPath+"/moduleService/save",
			queryModuleService : rootPath+"/moduleService/query",
			deleteModuleService : rootPath+"/moduleService/delete",
			retrieveModuleService : rootPath+"/moduleService/retrieve",

			saveModuleServiceInterface : rootPath+"/moduleServiceInterface/save",
			queryModuleServiceInterface : rootPath+"/moduleServiceInterface/query",
			deleteModuleServiceInterface : rootPath+"/moduleServiceInterface/delete",
			retrieveModuleServiceInterface : rootPath+"/moduleServiceInterface/retrieve"
	};
	var pointer = '<span style="color:red;font-weight:bold">*</span>';
	//============================ Model =========================
	Co.defineModel("ModuleService", ["serviceCharger","onlineDate","baseUrl","serviceState","serviceVersion","serviceNameEn","serviceRemark","id","serviceName"]);
	Co.defineModel("ModuleServiceInterface", ["id","serviceId","interfaceName","interfaceUrl","interfaceState","interfaceDesc"]);
	//============================ Store =========================
	var moduleServiceGridStore = Co.gridStore("moduleServiceGridStore", API.queryModuleService, "ModuleService", {
		autoLoad : false,
		output : "moduleServiceTbar",
		sorters : [{
			property : "createTime",
			direction : "desc"
		}]
	}); 	
	//============================ View =========================
	var moduleServiceTbar = Co.toolbar("moduleServiceTbar", [{
		type : "+", 
		handler : addModuleService,
		showAtContextMenu : true
	},{
		type : "*",
		handler : deleteModuleService,
		showAtContextMenu : true
	},{
		type : "-",
		handler : editModuleService,
		showAtContextMenu : true
	},"->",{
		type : "@",
		handler : searchModuleService,
		searchField : ["serviceName","serviceNameEn","serviceCharger"],
		searchEmptyText : ["请输入服务名称...","请输入服务英文名称...","请输入负责人..."]
	}
	]);

	var moduleServiceColumns = [
		Co.gridRowNumberer(),
		{
			xtype : "actioncolumn",
			align : "center",
			header : "服务接口",
			width : 80,
			items : [{
				iconCls : "window_caise_listIcon",
				tooltip : "接口配置",
				handler : function(grid, rowIndex, colIndex) {
					var record = grid.getStore().getAt(rowIndex);
					if (record) {
						openModuleServiceInterfaceWindow(record);
					}
				}
			}]
		},
		{header : "id", dataIndex : "id", width : 125, hidden : true},
		{header : "服务状态", dataIndex : "serviceState", width : 80, hidden : false,renderer : function(v) {
			return Co.dictText("serviceState", v);
		}},
		{header : "服务名称", dataIndex : "serviceName", width : 150, hidden : false},
		{header : "服务英文名称", dataIndex : "serviceNameEn", width : 150, hidden : false},
		{header : "版本号", dataIndex : "serviceVersion", width : 100, hidden : false},
		{header : "负责人", dataIndex : "serviceCharger", width : 100, hidden : false},
		{header : "上线日期", dataIndex : "onlineDate", width : 150, hidden : false},
		{header : "根地址", dataIndex : "baseUrl", width : 300, hidden : false},
		{header : "服务备注", dataIndex : "serviceRemark", width : 125, hidden : true}
		];

	var moduleServiceGrid = Co.grid("moduleServiceGrid", moduleServiceGridStore, moduleServiceColumns, moduleServiceTbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
				editModuleService();
			}
		}
	});

	Co.load(moduleServiceGridStore);

	var moduleServiceForm = Co.form(API.saveModuleService, [{
		layout : "column",
		border : false,
		bodyCls : "panel-background-color",
		items : [{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "serviceName",
				name : "model.serviceName",
				fieldLabel : "服务名称",
				beforeLabelTextTpl : pointer,
				labelWidth : 100,
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 16,
				maxLengthText: "服务名称最多16个字！",
				enforceMaxLength: true
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "serviceNameEn",
				name : "model.serviceNameEn",
				fieldLabel : "服务英文名称",
				beforeLabelTextTpl : pointer,
				labelWidth : 100,
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 64,
				maxLengthText: "服务英文名称最多64个字！",
				enforceMaxLength: true
			}]
		}]
	},{
		layout : "column",
		border : false,
		bodyCls : "panel-background-color",
		items : [{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "serviceCharger",
				name : "model.serviceCharger",
				fieldLabel : "负责人",
				beforeLabelTextTpl : pointer,
				labelWidth : 100,
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 16,
				maxLengthText: "负责人最多16个字！",
				enforceMaxLength: true
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "datefield",
				id : "onlineDate",
				name : "model.onlineDate",
				fieldLabel : "上线日期",
				beforeLabelTextTpl : pointer,
				labelWidth : 100,
				allowBlank : false,
				editable : true,
				readOnly : false,
				format: Co.dateFormat
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
				id : "baseUrl",
				name : "model.baseUrl",
				fieldLabel : "根地址",
				beforeLabelTextTpl : pointer,
				labelWidth : 100,
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 64,
				maxLengthText: "根地址最多64个字！",
				enforceMaxLength: true
			}]
		}]
	},{
		layout : "column",
		border : false,
		bodyCls : "panel-background-color",
		items : [{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "serviceVersion",
				name : "model.serviceVersion",
				fieldLabel : "版本号",
				beforeLabelTextTpl : pointer,
				labelWidth : 100,
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 16,
				maxLengthText: "版本号最多16个字！",
				enforceMaxLength: true
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [Co.comboBoxDict("serviceState", "model.serviceState", "服务状态", "serviceState",{
				editable : false,
				allowBlank : false,
				beforeLabelTextTpl : pointer,
				labelWidth : 100,
				value:"01",
				blankText : "请选择服务状态！"
			})]
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
				xtype : "textarea",
				id : "serviceRemark",
				name : "model.serviceRemark",
				labelWidth : 100,
				fieldLabel : "服务备注",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 256,
				maxLengthText: "服务备注最多256个字！",
				enforceMaxLength: true
			}]
		}]
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	}]);

	var moduleServiceFormWindow = Co.formWindow("新增", moduleServiceForm, 800, 330, "fit", {
		okHandler : saveModuleService
	});

	Ext.create("Ext.container.Viewport", {
		layout : "fit",
		items : moduleServiceGrid
	});
	//============================ Function =========================
	function addModuleService() {
		Co.resetForm(moduleServiceForm, true);
		moduleServiceFormWindow.setTitle("新增");
		moduleServiceFormWindow.show();
	}

	function saveModuleService() {
		Co.formSave(moduleServiceForm, function(form, action){
			Co.alert("保存成功！", function(){
				moduleServiceFormWindow.hide();
				Co.reload(moduleServiceGridStore);
			});
		});
	}

	function editModuleService() {
		Co.formLoad(moduleServiceForm, moduleServiceGrid, API.retrieveModuleService, function(result, opts, selectedId){
			if (true === result.success) {
				moduleServiceFormWindow.setTitle("修改");
				moduleServiceFormWindow.show();
			} else {
				Co.showError(result.msg || "数据加载失败！");
			}
		});
	}

	function deleteModuleService() {
		Co.gridDelete(moduleServiceGrid, API.deleteModuleService, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(moduleServiceGridStore);
				});
			} else {
				Co.alert(result.msg);
			}
		});	
	}

	function searchModuleService() {
		Co.load(moduleServiceGridStore);
	}
	
	
	//=========================================服务接口========================================================
	
	
	var moduleServiceInterfaceGridStore = Co.gridStore("moduleServiceInterfaceGridStore", API.queryModuleServiceInterface, "ModuleServiceInterface", {
		autoLoad : false,
		output : "moduleServiceInterfaceTbar",
		sorters : [{
			property : "createTime",
			direction : "desc"
		}]
	}); 	
	//============================ View =========================
	var moduleServiceInterfaceTbar = Co.toolbar("moduleServiceInterfaceTbar", [{
			type : "+", 
			handler : addModuleServiceInterface,
			showAtContextMenu : true
		},{
			type : "*",
			handler : deleteModuleServiceInterface,
			showAtContextMenu : true
		},{
			type : "-",
			handler : editModuleServiceInterface,
			showAtContextMenu : true
		},"->",{
			type : "@",
			handler : searchModuleServiceInterface,
			searchField : ["interfaceName","interfaceDesc"],
			searchEmptyText : ["请输入接口名称...","请输入接口描述..."]
		}
	]);
	
	var moduleServiceInterfaceColumns = [
		Co.gridRowNumberer(),
		{header : "id", dataIndex : "id", width : 250, hidden : true},
		{header : "服务id", dataIndex : "serviceId", width : 250, hidden : true},
		{header : "接口名称", dataIndex : "interfaceName", width : 200, hidden : false},
		{header : "接口url", dataIndex : "interfaceUrl", width : 400, hidden : false},
		{header : "接口描述", dataIndex : "interfaceDesc", width : 200, hidden : false},
		{header : "接口状态", dataIndex : "interfaceState", width : 100, hidden : false,renderer : function(v) {
			return Co.dictText("interfaceState", v);
		}}
	];
	
	var moduleServiceInterfaceGrid = Co.grid("moduleServiceInterfaceGrid", moduleServiceInterfaceGridStore, moduleServiceInterfaceColumns, moduleServiceInterfaceTbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
				editModuleServiceInterface();
			}
		}
	});
	
	Co.load(moduleServiceInterfaceGridStore);
	
	var moduleServiceInterfaceForm = Co.form(API.saveModuleServiceInterface, [{
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
				id : "interfaceName",
				name : "model.interfaceName",
				fieldLabel : "接口名称",
				beforeLabelTextTpl : pointer,
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 512,
				maxLengthText: "接口名称最多512个字！",
				enforceMaxLength: true
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
				id : "interfaceUrl",
				name : "model.interfaceUrl",
				fieldLabel : "接口url",
				beforeLabelTextTpl : pointer,
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxLength: 512,
				maxLengthText: "接口url最多512个字！",
				enforceMaxLength: true
			}]
		}]
	},{
		layout : "column",
		border : false,
		bodyCls : "panel-background-color",
		items : [{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [Co.comboBoxDict("interfaceState", "model.interfaceState", "接口状态", "interfaceState",{
				editable : false,
				allowBlank : false,
				beforeLabelTextTpl : pointer,
				value:"01",
				blankText : "请选择接口状态！"
			})]
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
				xtype : "textarea",
				id : "interfaceDesc",
				name : "model.interfaceDesc",
				fieldLabel : "接口描述",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 256,
				maxLengthText: "服务备注最多256个字！",
				enforceMaxLength: true
			}]
		}]
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	},{
		xtype : "hiddenfield",
		id : "serviceId",
		name : "model.serviceId"
	}]);
	
	var moduleServiceInterfaceFormWindow = Co.formWindow("接口管理", moduleServiceInterfaceForm, 700, 320, "fit", {
		okHandler : saveModuleServiceInterface
	});
	
	var moduleServiceInterfaceWindow = Co.window("moduleServiceInterfaceWindow", moduleServiceInterfaceGrid, 800, 400, "fit",{
		maximized : true,
		listeners : {
			beforeshow : function() {
				Co.load(moduleServiceInterfaceGridStore, {"model.serviceId" : selectedId});
			}
		}
	});
	
	//============================ Function =========================
	function openModuleServiceInterfaceWindow(record) {
		selectedId = record.get("id");
		moduleServiceInterfaceWindow.setTitle("接口管理-"+record.get("serviceName"));
		moduleServiceInterfaceWindow.show();
	}
	
	
	function addModuleServiceInterface() {
		Co.resetForm(moduleServiceInterfaceForm, true);
		moduleServiceInterfaceFormWindow.setTitle("新增");
		moduleServiceInterfaceFormWindow.show();
	}
	
	function saveModuleServiceInterface() {
		//设置服务id
		Ext.getCmp("serviceId").setValue(selectedId);
		Co.formSave(moduleServiceInterfaceForm, function(form, action){
			Co.alert("保存成功！", function(){
				moduleServiceInterfaceFormWindow.hide();
				Co.reload(moduleServiceInterfaceGridStore);
			});
		});
	}
	
	function editModuleServiceInterface() {
		Co.formLoad(moduleServiceInterfaceForm, moduleServiceInterfaceGrid, API.retrieveModuleServiceInterface, function(result, opts, selectedId){
			if (true === result.success) {
				moduleServiceInterfaceFormWindow.setTitle("修改");
				moduleServiceInterfaceFormWindow.show();
			} else {
				Co.showError(result.msg || "数据加载失败！");
			}
		});
	}
	
	function deleteModuleServiceInterface() {
		Co.gridDelete(moduleServiceInterfaceGrid, API.deleteModuleServiceInterface, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(moduleServiceInterfaceGridStore);
				});
			} else {
				Co.alert(result.msg);
			}
		});	
	}
	
	function searchModuleServiceInterface() {
		Co.load(moduleServiceInterfaceGridStore);
	}
	
	
});