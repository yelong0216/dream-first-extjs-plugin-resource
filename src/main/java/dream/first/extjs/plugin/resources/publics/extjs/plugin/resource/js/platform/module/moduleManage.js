Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
			saveModule : rootPath+"/module/save",
			queryModule : rootPath+"/module/query",
			deleteModule : rootPath+"/module/delete",
			retrieveModule : rootPath+"/module/retrieve",
			getModuleTree : rootPath+"/module/getModuleTree?showRoot=true&showHiddenModule=true&autoExpand=true&isAuth=false",
			getModuleTreeLeft : rootPath+"/module/getModuleTree?showRoot=true&showOpModule=true&showHiddenModule=true&autoExpand=true&isAuth=false",
			
			replace : rootPath + "/module/replace"
	};
	var selectedModuleNo;
	var selectedModuleName;
	var pointer = '<span style="color:red;font-weight:bold">*</span>';
	//============================ Model =========================
	Co.defineModel("Module", ["id","moduleNo","parentModuleNo","moduleName","moduleType","moduleProperty","moduleUrl","moduleIcon","moduleOrder","moduleShow","moduleDesc","moduleSourceUrl"]);
	//============================ Store =========================
	//列表Store
	var moduleGridStore = Co.gridStore("moduleGridStore", API.queryModule, "Module", {
		autoLoad : false,
		output : "tbar",
		sorters : [{
			property : "module.moduleOrder",
			direction : "asc"
		}]
	}); 	

	//定义左侧树Store
	var moduleTreeStore = Co.treeStore("moduleTreeStore", API.getModuleTreeLeft, {
		nodeParam : "parentModuleNo",
		idProperty : "extraParam3"
	});

	//============================ View =========================
	//定义左侧树
	var moduleTreePanel = Co.tree("moduleTreePanel", moduleTreeStore, {
		width : 220,
		listeners : {
			selectionchange : function(me, rs, eOpts) {
				var module = rs[0];
				if (module && module.data.extraParam1 == "01") {
					var moduleNo = module.data.extraParam3;
					gridPanel.setTitle("已选中【" + module.data.text + "】");
					selectedModuleNo = moduleNo;
					selectedModuleName = module.data.text;
					Co.load(moduleGridStore, {"model.parentModuleNo" : moduleNo});
				}
			}
		}
	}); 

	var tbar = Co.toolbar("tbar", [{
		rid : "8a9b3e14437b187001437b2656db000a",
		type : "+", 
		handler : addModule,
		showAtContextMenu : true
	},{
		rid : "8a9b3e14437b187001437b288255000b",
		type : "*",
		handler : deleteModule,
		showAtContextMenu : true
	},{
		rid : "8a9b3e14437b187001437b28baf5000d",
		type : "-",
		handler : editModule,
		showAtContextMenu : true
	},{
		type : "-",
		text : "查找/替换",
		handler : replace,
		showAtContextMenu : true
	},"->",{
		rid : "8a9b3e14437b187001437b28e4bc000f",
		type : "@",
		handler : searchModule,
		searchField : ["moduleName",{
			xtype : "cocomboboxdict",
			id : "moduleType_search",
			name : "moduleType",
			type : "moduleType"
		}],
		searchEmptyText : ["请输入模块名称...","请选择模块类型"]
	}
	]);

	var columns = [
		Co.gridRowNumberer(),
		{header : "模块ID", dataIndex : "id", width : 142, hidden : true},
		{header : "模块编号", dataIndex : "moduleNo", width : 165, hidden : true},
		{header : "父模块编号", dataIndex : "parentModuleNo", width : 142, hidden : true},
		{header : "模块名称", dataIndex : "moduleName", width : 210, hidden : false},
		{header : "类型", dataIndex : "moduleType", width : 70, hidden : false, renderer : function(v) {
			return Co.dictText("moduleType", v);
		}},
		{header : "访问URL", dataIndex : "moduleUrl", width : 220, hidden : false},
		{header : "访问源URL", dataIndex : "moduleSourceUrl", width : 220, hidden : false},
		{header : "图标", dataIndex : "moduleIcon", width : 180, hidden : false},
		{header : "顺序", dataIndex : "moduleOrder", width : 70, hidden : false},
		{header : "是否显示", dataIndex : "moduleShow", width : 80, hidden : false, renderer : function(v) {
			return Co.dictText("moduleShow", v);
		}},
		{header : "模块属性", dataIndex : "moduleProperty", width : 80, hidden : false, renderer : function(v) {
			return Co.dictText("moduleProperty", v);
		}},
		{header : "模块描述", dataIndex : "moduleDesc", width : 180, hidden : true}
		];

	var moduleGrid = Co.grid("moduleGrid", moduleGridStore, columns, tbar, null, {
		deleteId : "moduleNo",
		listeners : {
			itemdblclick : function(view, record) {
				//if (parent.isGranted("8a9b3e14437b187001437b28baf5000d")) {
				editModule();
				//}
			}
		}
	});

	Co.load(moduleGridStore);

	var moduleForm = Co.form(API.saveModule, [{
		xtype : "displayfield",
		id : "moduleIDDisplay", 
		fieldLabel : "模块ID"
	},
	Co.comboBoxTree("moduleParentModuleName", "*父模块", API.getModuleTree,{
		editable : true,
		allowBlank : false,
		blankText : "请选择父模块",
		textEl : "moduleParentModuleName",
		valueEl : "parentModuleNo",
		nodeParam : "parentModuleNo",
		idProperty : "extraParam3"  //moduleNo
	}),{
		xtype : "hiddenfield",
		id : "parentModuleNo",
		name : "model.parentModuleNo"
	},{
		xtype : "textfield",
		id : "moduleName",
		name : "model.moduleName",
		fieldLabel : "*模块名称",
		allowBlank : false,
		blankText : "模块名称不能为空",
		editable : true,
		readOnly : false,
		maxLength: 64,
		maxLengthText: "模块名称最多不能超过64字符",
		enforceMaxLength: true
	},
	Co.comboBoxDict("moduleType", "model.moduleType", "*类型", "moduleType",{
		editable : false,
		allowBlank : false,
		blankText : "请选择类型",
		value : "01"
	}),{
		xtype : "textfield",
		id : "moduleUrl",
		name : "model.moduleUrl",
		fieldLabel : "访问URL",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 256,
		maxLengthText: "访问URL最多不能超过256字符",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "moduleSourceUrl",
		name : "model.moduleSourceUrl",
		fieldLabel : "访问源URL",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 256,
		maxLengthText: "访问URL最多不能超过256字符",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "moduleIcon",
		name : "model.moduleIcon",
		fieldLabel : "图标",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 64,
		maxLengthText: "图标最多不能超过64字符",
		enforceMaxLength: true
	},Co.comboBoxDict("moduleProperty", "model.moduleProperty", "模块属性", "moduleProperty",{
		editable : true,
		allowBlank : true
	}),{
		xtype : "textareafield",
		fieldLabel : "模块描述",
		id : "moduleDesc",
		name : "model.moduleDesc",
		maxLength: 128,
		maxLengthText: "模块描述最多不能超过128字符",
		enforceMaxLength: true
	},{
		xtype : "numberfield",
		id : "moduleOrder",
		name : "model.moduleOrder",
		fieldLabel : "顺序",
		allowBlank : true,
		editable : true, 
		readOnly : false,
		hideTrigger : true,
		minValue : 0,
		maxValue : Co.maxInt
	},
	Co.comboBoxDict("moduleShow", "model.moduleShow", "*是否显示", "moduleShow",{
		editable : false,
		allowBlank : false,
		blankText : "请选择是否显示",
		value : "01"
	}),Co.comboBoxDict("moduleLog", "model.moduleLog", "开启日志", "moduleLog",{
		editable : false,
		value : "01"
	}),{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	},{
		xtype : "hiddenfield",
		id : "moduleNo",
		name : "model.moduleNo"
	},{
		xtype : "hiddenfield",
		id : "oldParentModuleNo",
		name : "model.oldParentModuleNo"
	},{
		xtype : "hiddenfield",
		id : "oldModuleProperty",
		name : "model.oldModuleProperty"
	}]);

	var moduleFormWindow = Co.formWindow("新增", moduleForm, 500, 515, "fit", {
		okHandler : saveModule,
		listeners : {
			"show" : function() {
				var moduleIdCmp = Ext.getCmp("id");
				var moduleIDDisplay = Ext.getCmp("moduleIDDisplay");
				if (Co.isEmpty(moduleIdCmp.getValue())) {
					moduleIDDisplay.setValue("系统自动生成");
				} else {
					moduleIDDisplay.setValue(moduleIdCmp.getValue());
				}
				//记录修改前的父编号和属性
				Ext.getCmp("oldParentModuleNo").setValue(Ext.getCmp("parentModuleNo").getValue());
				Ext.getCmp("oldModuleProperty").setValue(Ext.getCmp("moduleProperty").getValue());
				Co.monEnter(this, saveModule);
			}
		}
	});

	var gridPanel = Ext.create("Ext.panel.Panel",{
		title : "已选中【功能模块】",
		layout : "fit",
		items : moduleGrid
	});
	Ext.create("Ext.container.Viewport", {
		layout : "border",
		items : [{
			region : "west",
			layout : "fit",
			title : "功能模块",  
			items : moduleTreePanel,
			collapsible : true,
			split : true
		},{
			region : "center",
			items : gridPanel,
			layout : "fit",
			frame : false,
			border : false
		}],
		border : false
	});
	//============================ Function =========================
	function addModule() {
		Co.resetForm(moduleForm, true);
		if (!Co.isEmpty(selectedModuleNo)) {
			Ext.getCmp("parentModuleNo").setValue(selectedModuleNo);
			Ext.getCmp("moduleParentModuleName").setValue(selectedModuleName);
		}
		moduleFormWindow.setTitle("新增");
		moduleFormWindow.show();
	}

	function saveModule() {
		Co.formSave(moduleForm, function(form, action){
			Co.alert("保存成功！", function(){
				moduleFormWindow.hide();
				Co.reload(moduleGridStore);
				Co.reload(moduleTreeStore);
			});
		},null,{
			listeners : {
				beforesave : function() {
					var moduleProperty = Ext.getCmp("moduleProperty").getValue();
					if (!Co.isEmpty(moduleProperty) && Co.isEmpty(Co.dictText("moduleProperty", Ext.String.trim(moduleProperty)))) {
						Co.showError("模块属性选择错误！");
						return false;
					}
					return true;
				}
			}		
		});
	}

	function editModule() {
		Co.formLoad(moduleForm, moduleGrid, API.retrieveModule, function(result, opts, selectedId){
			moduleFormWindow.setTitle("修改");
			moduleFormWindow.show();
		},null,{
			listeners : {
				"beforeload" : function(id) {
					if (id === "1") {
						Co.showError("系统内置模块不能修改！");
						return false;
					}
					return true;
				}
			}		
		});
	}

	function deleteModule() {
		Co.gridDelete(moduleGrid, API.deleteModule, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(moduleGridStore);
					Co.reload(moduleTreeStore);
				});
			} else {
				Co.alert(result.msg);
			}
		}, null, {
			listeners : {
				"beforedelete" : function(ids) {
					var canDelete = true;
					Ext.each(ids, function(id){
						if (id === "1") {
							Co.showError("系统内置模块不能删除！");
							canDelete = false;
							return false;
						}
					});
					return canDelete;
				}
			}
		});	
	}

	function searchModule() {
		Co.load(moduleGridStore);
	}
	
	
	//============================replace=========================
	
	var replaceForm = Co.form(API.replace, [{
		xtype : "textfield",
		id : "column",
		name : "column",
		fieldLabel : "column",
		allowBlank : false,
		beforeLabelTextTpl : pointer,
		blankText : "column不允许为空",
		editable : true,
		readOnly : false,
//		maxLength: 64,
//		maxLengthText: "模块名称最多不能超过64字符",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "find",
		name : "find",
		fieldLabel : "Find",
		allowBlank : false,
		beforeLabelTextTpl : pointer,
		blankText : "find不能为空",
		editable : true,
		readOnly : false,
//		maxLength: 64,
//		maxLengthText: "模块名称最多不能超过64字符",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "replaceWith",
		name : "replaceWith",
		fieldLabel : "Replace with",
		allowBlank : true,
		beforeLabelTextTpl : pointer,
//		blankText : "find不能为空",
		editable : true,
		readOnly : false,
//		maxLength: 64,
//		maxLengthText: "模块名称最多不能超过64字符",
		enforceMaxLength: true
	}/*,{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	}*/]);
	
	var replaceFormWindow = Co.formWindow("查找/替换", replaceForm, 600, 300, "fit", {
		okHandler : replaceSave
	});
	
	function replace() {
		replaceFormWindow.show();
	}
	
	function replaceSave(){

		Co.formSave(replaceForm, function(form, action){
			Co.alert("替换成功！", function(){
				replaceFormWindow.hide();
				Co.reload(moduleGridStore);
//				Co.reload(moduleTreeStore);
			});
		});
	}
	
});