Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
		saveIcon : rootPath+"/icon/save",
		queryIcon : rootPath+"/icon/query",
		deleteIcon : rootPath+"/icon/delete",
		retrieveIcon : rootPath+"/icon/retrieve"
	};
	
	//============================ Model =========================
	Co.defineModel("Icon", ["id","iconClass","iconPath","iconRemark"]);
	//============================ Store =========================
	var iconGridStore = Co.gridStore("iconGridStore", API.queryIcon, "Icon", {
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
			handler : addIcon,
			showAtContextMenu : true
		},{
			type : "*",
			handler : deleteIcon,
			showAtContextMenu : true
		},{
			type : "-",
			handler : editIcon,
			showAtContextMenu : true
		},/*{
			type : "-",
			handler : function(){
				Co.windowOpenByToken("/dict/index");
			},
			showAtContextMenu : true
		},*/"->",{
			type : "@",
			handler : searchIcon,
			searchField : ["iconClass"],
			searchEmptyText : ["请输入图标类名..."]
		}
	]);
	
	var columns = [
		Co.gridRowNumberer(),
		{header : "预览", dataIndex : "iconPath", width : 280, hidden : false, renderer : function(v) {
			return "<img src = '" + staticResourcesRootPath + "/" + v + "'/>";
		}},
		{header : "图标类名", dataIndex : "iconClass", width : 180, hidden : false, editor : {
			xtype : "textfield"
		}},
		{header : "图标路径", dataIndex : "iconPath", width : 300, hidden : false},
		{header : "图标备注", dataIndex : "iconRemark", width : 500, hidden : false}
	];
	
	var iconGrid = Co.grid("iconGrid", iconGridStore, columns, tbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
				editIcon();
			},
			edit : function(editor, e) {
				e.record.commit();
			}
		},
		plugins : [
			Ext.create("Ext.grid.plugin.CellEditing", {
				clicksToEdit : 1
			})
		]
	});
	
	Co.load(iconGridStore);
	
	var iconForm = Co.form(API.saveIcon, [{
		xtype : "textfield",
		id : "iconClass",
		name : "model.iconClass",
		fieldLabel : "图标类名",
		allowBlank : false,
		blankText : "请填写图标类名！",
		editable : true,
		readOnly : false,
		maxLength: 100,
		maxLengthText: "图标类名最多100个字！",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "iconPath",
		name : "model.iconPath",
		fieldLabel : "图标路径",
		allowBlank : false,
		blankText : "请填写图标路径！",
		editable : true,
		readOnly : false,
		maxLength: 100,
		maxLengthText: "图标路径最多100个字！",
		enforceMaxLength: true
	},{
		xtype : "textareafield",
		id : "iconRemark",
		name : "model.iconRemark",
		fieldLabel : "图标备注",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 100,
		maxLengthText: "图标备注最多100个字！",
		enforceMaxLength: true
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	}]);
	
	var iconFormWindow = Co.formWindow("新增", iconForm, 500, 255, "fit", {
		okHandler : saveIcon
	});
	
	Ext.create("Ext.container.Viewport", {
		layout : "fit",
		items : iconGrid
	});
	//============================ Function =========================
	function addIcon() {
		Co.resetForm(iconForm, true);
		iconFormWindow.setTitle("新增");
		iconFormWindow.show();
	}
	
	function saveIcon() {
		Co.formSave(iconForm, function(form, action){
			Co.alert("保存成功！", function(){
				iconFormWindow.hide();
				Co.reload(iconGridStore);
			});
		});
	}
	
	function editIcon() {
		Co.formLoad(iconForm, iconGrid, API.retrieveIcon, function(result, opts, selectedId){
			if (true === result.success) {
				iconFormWindow.setTitle("修改");
				iconFormWindow.show();
			} else {
				Co.showError(result.msg || "数据加载失败！");
			}
		});
	}
	
	function deleteIcon() {
		Co.gridDelete(iconGrid, API.deleteIcon, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(iconGridStore);
				});
			} else {
				Co.alert(result.msg);
			}
		});	
	}
	
	function searchIcon() {
		Co.load(iconGridStore);
	}
});