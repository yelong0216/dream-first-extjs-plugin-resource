Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
		saveModuleServiceInterface : "module_service_interface!save.action",
		queryModuleServiceInterface : "module_service_interface!query.action",
		deleteModuleServiceInterface : "module_service_interface!delete.action",
		retrieveModuleServiceInterface : "module_service_interface!retrieve.action"
	};
	
	//============================ Model =========================
	Co.defineModel("ModuleServiceInterface", ["id","serviceId","interfaceName","interfaceUrl","interfaceState"]);
	//============================ Store =========================
	var moduleServiceInterfaceGridStore = Co.gridStore("moduleServiceInterfaceGridStore", API.queryModuleServiceInterface, "ModuleServiceInterface", {
		autoLoad : false,
		output : "tbar",
		sorters : [{
			property : "createTime",
			direction : "desc"
		}]
	}); 	
	//============================ View =========================
	var tbar = Co.toolbar("tbar", [{
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
			searchField : [],
			searchEmptyText : []
		}
	]);
	
	var columns = [
		Co.gridRowNumberer(),
		{header : "id", dataIndex : "id", width : 250, hidden : true},
		{header : "服务id", dataIndex : "serviceId", width : 250, hidden : false},
		{header : "接口名称", dataIndex : "interfaceName", width : 250, hidden : false},
		{header : "接口url", dataIndex : "interfaceUrl", width : 250, hidden : false},
		{header : "接口状态", dataIndex : "interfaceState", width : 250, hidden : false}
	];
	
	var moduleServiceInterfaceGrid = Co.grid("moduleServiceInterfaceGrid", moduleServiceInterfaceGridStore, columns, tbar, null, {
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
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "serviceId",
				name : "model.serviceId",
				fieldLabel : "服务id",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 16,
				maxLengthText: "服务id最多16个字！",
				enforceMaxLength: true
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "interfaceName",
				name : "model.interfaceName",
				fieldLabel : "接口名称",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 16,
				maxLengthText: "接口名称最多16个字！",
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
				id : "interfaceUrl",
				name : "model.interfaceUrl",
				fieldLabel : "接口url",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 64,
				maxLengthText: "接口url最多64个字！",
				enforceMaxLength: true
			}]
		},{
			columnWidth : 1,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "interfaceState",
				name : "model.interfaceState",
				fieldLabel : "接口状态",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 1,
				maxLengthText: "接口状态最多1个字！",
				enforceMaxLength: true
			}]
		}]
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	},{
		xtype : "hiddenfield",
		id : "creator",
		name : "model.creator"
	},{
		xtype : "hiddenfield",
		id : "createTime",
		name : "model.createTime"
	}]);
	
	var moduleServiceInterfaceFormWindow = Co.formWindow("新增", moduleServiceInterfaceForm, 650, 180, "fit", {
		okHandler : saveModuleServiceInterface
	});
	
	Ext.create("Ext.container.Viewport", {
		layout : "fit",
		items : moduleServiceInterfaceGrid
	});
	//============================ Function =========================
	function addModuleServiceInterface() {
		Co.resetForm(moduleServiceInterfaceForm, true);
		moduleServiceInterfaceFormWindow.setTitle("新增");
		moduleServiceInterfaceFormWindow.show();
	}
	
	function saveModuleServiceInterface() {
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