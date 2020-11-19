Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
		saveRole : rootPath+"/role/save",
		queryRole : rootPath+"/role/query",
		deleteRole : rootPath+"/role/delete",
		retrieveRole : rootPath+"/role/retrieve",
		
		getModuleTree : rootPath+"/module/getModuleTree?showRoot=true&showOpModule=true&recursion=true&showCheckbox=true&isAuth=false&showHiddenModule=true&parentModuleNo=-1&autoExpand=false",
		getRoleDataModuleTree : rootPath+"/module/getModuleTree?showRoot=true&showOpModule=true&&autoExpand=true&isAuth=false",
		
		queryRoleDataRight : rootPath+"/roleDataRight/query",
		saveRoleDataRight : rootPath+"/roleDataRight/save",
		retrieveRoleDataRight : rootPath+"/roleDataRight/retrieve",
		deleteRoleDataRight : rootPath+"/roleDataRight/delete",
		
		getRoleRightModuleIDs : rootPath+"/role/getRoleRightModuleIDs",
		copyRole : rootPath+"/role/copyRole"
	};
	var pointer = '<span style="color:red;font-weight:bold">*</span>';
	//============================ Model =========================
	Co.defineModel("Role", ["id","roleName","roleType","roleDesc","roleProperty","createTime"]);
	Co.defineModel("RoleDataRight", ["id","roleId","rightName","moduleId","params","expression","rightDesc", "roledatarightModuleName"])
	//============================ Store =========================
	var roleGridStore = Co.gridStore("roleGridStore", API.queryRole, "Role", {
		autoLoad : false,
		output : "tbar",
		sorters : [{
			property : "createTime",
			direction : "desc"
		}]
	}); 	
	var roleDataRightGridStore = Co.gridStore("roleDataRightGridStore", API.queryRoleDataRight, "RoleDataRight", {
		autoLoad : false,
		pageSize : 10,
		sorters : [{
			property : "createTime",
			direction : "desc"
		}],
		inner : true
	});
	//============================ View =========================
	var tbar = Co.toolbar("tbar", [{
			text : "操作角色",
			iconCls : "runIcon",
			enableToggle : true,
			toggleGroup : "roleTypeToggle",
			pressed : true,
			toggleHandler : function(button, state) {
				if (true == state) {
					Co.resetStore(roleGridStore);
					Co.load(roleGridStore, {"model.roleType" : "01"});
				}
			}
		},{
			text : "数据角色",
			iconCls : "executeIcon",
			enableToggle : true,
			toggleGroup : "roleTypeToggle",
			pressed : false,
			toggleHandler : function(button, state) {
				if (true == state) {
					Co.resetStore(roleGridStore);
					Co.load(roleGridStore, {"model.roleType" : "02"});
				}
			}
		},'-',{
			rid : "8a9b3e14437b187001437b2395f50006",
			xtype : "splitbutton",
			text : "新增",
			iconCls : "createIcon",
			handler : addRole,
			menu : Ext.create("Ext.menu.Menu", {
				items : {
					text : "数据角色",
					iconCls : "keyIcon",
					handler : addDataRole
				}
			}),
			showAtContextMenu : true
		},{
			rid : "8a9b3e14437b187001437b23d46c0007",
			type : "*",
			handler : deleteRole,
			showAtContextMenu : true
		},{
			rid : "8a9b3e14437b187001437b246f250008",
			type : "-",
			handler : editRole,
			showAtContextMenu : true
		}/*,{
			text : "复制",
			iconCls : "copyIcon",
			handler : copyRole
		}*/,"->",{
			rid : "8a9b3e14437b187001437b24cc940009",
			type : "@",
			handler : searchRole,
			searchField : ["roleName",{
				xtype : "cocomboboxdict",
				id : "roleProperty_toolbar",
				name : "roleProperty",
				type : "roleProperty",
				modelSearch : true
			}],
			searchEmptyText : ["请输入角色名称...", "请选择角色类型...", "请选择角色属性..."]
		}
	]);
	
	var roleDataRightTbar = Co.toolbar("roleDataRightTbar", [{
		type : "+",
		handler : addRoleDataRight
	},{
		type : "*",
		handler : deleteRoleDataRight
	},{
		type : "-",
		handler : editRoleDataRight
	}],{
		inner : true
	});
	
	var columns = [
//		Co.gridRowNumberer(),
		{header : "id", dataIndex : "id", width : 333, hidden : true},
		{header : "角色名称", dataIndex : "roleName", width : 150, hidden : false},
		{header : "角色类型", dataIndex : "roleType", width : 150, hidden : false, renderer : function(v) {
			return Co.dictText("roleType", v);
		}},
		{header : "角色属性", dataIndex : "roleProperty", width : 150, hidden : false, renderer : function(v) {
			return Co.dictText("roleProperty", v);
		}},
		{header : "角色描述", dataIndex : "roleDesc", width : 200, hidden : false},
		{header : "创建时间", dataIndex : "createTime", width : 333, hidden : true}
	];
	
	var roleDataRightColumns = [
		Co.gridRowNumberer(null,null,{inner : true}),
		{header : "id", dataIndex : "id", width : 120, hidden : true},
		{header : "角色ID", dataIndex : "roleId", width : 120, hidden : true},
		{header : "权限名称", dataIndex : "rightName", width : 120, hidden : false},
		{header : "模块名称", dataIndex : "roledatarightModuleName", width : 150, hidden : false},
		{header : "参数", dataIndex : "params", width : 100, hidden : false},
		{header : "表达式", dataIndex : "expression", width : 160, hidden : false},
		{header : "描述", dataIndex : "rightDesc", width : 200, hidden : true}
	];
	
	var roleGrid = Co.grid("roleGrid", roleGridStore, columns, tbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
				//if (parent.isGranted("8a9b3e14437b187001437b246f250008")) {
					editRole();
				//}
			}
		}
	});
	
	var roleDataRightGrid = Co.grid("roleDataRightGrid", roleDataRightGridStore, roleDataRightColumns, roleDataRightTbar, null, {
		height : 300,
		listeners : {
			itemdblclick : function(view, record) {
				editRoleDataRight();
			}
		},
		border : true
	});
	
	Co.load(roleGridStore);
	
	//模块树Store
	var moduleTreeStore = Co.treeStore("moduleTreeStore", API.getModuleTree, {
		autoLoad : false
	});
	
	//模块树
	var moduleTreePanel = Co.checkboxTree("moduleTreePanel", moduleTreeStore, {
		bodyCls : "panel-background-color",
		frame: false,
		autoScroll : true,
		bodyBorder : false,
//		height : 295
		height : 245
	}); 
	
	moduleTreeStore.load({
		callback : function() {
			resetModuleTree();
		}
	});
	         
	var roleForm = Co.form(API.saveRole, [{
		xtype : "fieldset",
		title: "基本信息",
        defaults: {anchor: "95%"},
        layout: "anchor",
        padding : "0 0 10 10",
        items : [{
			xtype : "textfield",
			id : "roleName",
			name : "model.roleName",
			fieldLabel : "角色名称",
			allowBlank : false,
			blankText : "角色名称不能为空",
			editable : true,
			readOnly : false,
			maxLength: 64,
			maxLengthText: "角色名称最多不能超过64字符",
			enforceMaxLength: true
    	}, Co.comboBoxDict("roleProperty", "model.roleProperty", "角色属性", "roleProperty",{
    		editable : false
    	}),
    	{
			xtype : "textfield",
			id : "roleDesc",
			name : "model.roleDesc",
			fieldLabel : "角色描述",
			allowBlank : true,
			editable : true,
			readOnly : false,
			maxLength: 128,
			maxLengthText: "角色描述最多不能超过128字符",
			enforceMaxLength: true
    	}]
	},{
		id : "operRight",
		xtype : "fieldset",
		title: "角色权限",
        defaults: {anchor: "95%"},
        layout: "fit",
        padding : "5 10 10 10",
        bodyCls : "panel-background-color",
        items : moduleTreePanel
	},{
		id : "dataRight",
		xtype : "fieldset",
		title: "数据权限",
        defaults: {anchor: "100%"},
        layout: "anchor",
        padding : "5 5 5 5",
        items : [roleDataRightGrid]
	},{
		xtype : "hiddenfield",
		id : "roleRights",
		name : "roleRights"
	},{
		xtype : "hiddenfield",
		id : "roleType",
		name : "model.roleType"
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	},{
		xtype : "hiddenfield",
		id : "tempId",
		name : "model.tempId"
	}]);
	
	var roleFormWindow = Co.formWindow("新增", roleForm, 650, 525, "fit", {
		okHandler : saveRole,
		autoScroll : true,
		buttons : [{
			text : "保存",
			iconCls : "form_saveIcon",
			handler : saveRole
		},{
			text : "重置",
			iconCls : "form_resetIcon",
			handler : function() {
				Co.resetForm(roleForm);
				resetModuleTree();
			}
		},{
			text : "取消",
			iconCls : "closeIcon",
			handler : function() {
				roleFormWindow.close();
			}
		}]
	});
	
	var roleDataRightForm = Co.form(API.saveRoleDataRight, [{
			xtype : "textfield",
			fieldLabel : "*权限名称",
			id : "rightName",
			name : "model.rightName",
			allowBlank : false,
			blankText : "权限名称不能为空",
			maxLength: 64,
			maxLengthText: "权限名称最多不能超过64字符",
			enforceMaxLength: true
		},
		Co.comboBoxTree("roledatarightModuleName", "*模块", API.getRoleDataModuleTree,{
			editable : true,
			allowBlank : false,
			blankText : "请选择模块",
			textEl : "roledatarightModuleName",
			valueEl : "moduleId",
			nodeParam : "parentModuleNo",
			idProperty : "extraParam3",
			valueId : "id"
		}),{
			xtype : "hiddenfield",
			id : "moduleId",
			name : "model.moduleId"
		},{
			xtype : "textfield",
			fieldLabel : "参数",
			id : "params",
			name : "model.params",
			maxLength: 128,
			maxLengthText: "参数最多不能超过128字符",
			enforceMaxLength: true
		},{
			xtype : "textarea",
			fieldLabel : "*权限表达式",
			id : "expression",
			name : "model.expression",
			allowBlank : false,
			blankText : "权限表达式不能为空",
			maxLength: 512,
			maxLengthText: "权限表达式最多不能超过512字符",
			enforceMaxLength: true
		},{
			xtype : "textfield",
			fieldLabel : "权限描述",
			id : "rightDesc",
			name : "model.rightDesc",
			maxLength: 128,
			maxLengthText: "权限描述最多不能超过128字符",
			enforceMaxLength: true
		},{
			xtype : "hiddenfield",
			id : "role_data_right_id",
			name : "model.id"
		},{
			xtype : "hiddenfield",
			id : "roleId",
			name : "model.roleId"
		}
	],{
		fieldMapping : {
			"role_data_right_id" : "id",
			"role_data_right_creator" : "creator",
			"role_data_right_createTime" : "createTime"
		}
	});
	
	var roleDataRightWindow = Co.formWindow("新增", roleDataRightForm, 550, 300, "fit", {
		okHandler : saveRoleDataRight,
		autoScroll : true
	});
	
	Ext.create("Ext.container.Viewport", {
		layout : "fit",
		items : roleGrid
	});
	//============================ Function =========================
	function addRole() {
		Co.resetForm(roleForm, true);
		resetModuleTree();
		Ext.getCmp("dataRight").setVisible(false);
		Ext.getCmp("operRight").setVisible(true);
		Ext.getCmp("roleType").setValue("01");
		roleFormWindow.setTitle("新增");
		roleFormWindow.show();
	}
	
	function addDataRole() {
		Co.resetForm(roleForm, true);
		Ext.getCmp("dataRight").setVisible(true);
		Ext.getCmp("operRight").setVisible(false);
		
		roleForm.getForm().findField("roleType").setValue("02");
		roleForm.getForm().findField("tempId").setValue(Co.uuid());
		roleFormWindow.setTitle("新增");
		roleDataRightGridStore.removeAll();
		roleFormWindow.show();
	}
	
	function getCheckedModule(node, selectedModules) {
		node.eachChild(function(child)  {    
			if (child.get("checked")) {
				selectedModules.push(child.data.id);
			}
			getCheckedModule(child, selectedModules);
	    });
	}
	function saveRole() {
		Co.formSave(roleForm, function(form, action){
			Co.alert("保存成功！", function(){
				roleFormWindow.hide();
				Co.reload(roleGridStore);
			});
		},null,{
			listeners : {
				"beforesave" : function() {
					//获得选择的模块
					var root = moduleTreePanel.getRootNode();
					//根据角色属性判断已选择的模块是否符合要求
					var roleProperty = Ext.getCmp("roleProperty").getValue();
					if (Co.isEmpty(roleProperty)) roleProperty = "01";
					if (checkRoleProperty(root, roleProperty)) {
						var selectedModules = [];
						moduleTreePanel.getChecked(root, selectedModules);
						//设置选择的模块到roleRights字段
						Ext.getCmp("roleRights").setValue(selectedModules.join(","));
						return true;
					} else {
						Co.showError("选择的权限与角色属性不匹配！");
					}
					return false;
				}
			}
		});
	}
	
	function getCheckedRoleProperty(root, checkedProps) {
		root.eachChild(function(child)  {    
			if (child.get("checked")) {
				checkedProps.push(child.data.extraParam4);
			}
			getCheckedRoleProperty(child, checkedProps);
	    }, this);
	}
	
	function checkRoleProperty(root, roleProperty) {
		var result = true,
			checkedProps = [];
			
		getCheckedRoleProperty(root, checkedProps);
		if (checkedProps.length > 0) {
			Ext.each(checkedProps, function(v){
				if (Co.isEmpty(v) || "null" == v) v = "01";
				if (v != "00" && v != roleProperty) {
					result = false;
					return false;
				}
			});
		}
	    
	    return result;
	}
	
	function editRole() {
		resetModuleTree();
		roleDataRightGridStore.removeAll();
		Co.formLoad(roleForm, roleGrid, API.retrieveRole, function(result, opts, selectedId){
			//加载角色下包含的权限ID
			Co.request(API.getRoleRightModuleIDs, {"model.id" : Ext.getCmp("id").getValue()}, function(result, opts){
				if (result.success) {
					Ext.getCmp("roleRights").setValue(result.msg);
					var roleType = Ext.getCmp("roleType").getValue();
					var canShow = true;
					if ("01" === roleType) {
						moduleTreePanel.loadChecked(Ext.getCmp("roleRights").getValue());
						Ext.getCmp("dataRight").setVisible(false);
						Ext.getCmp("operRight").setVisible(true);
					} else if ("02" === roleType) {
						var roleId = roleForm.getForm().findField("id").getValue();
						Ext.getCmp("dataRight").setVisible(true);
						Ext.getCmp("operRight").setVisible(false);
						roleDataRightForm.getForm().findField("roleId").setValue(roleId);
						Co.load(roleDataRightGridStore, {
							"model.roleId" : roleId || "-1"
						});
					} else {
						canShow = false;
					}
					if (canShow) {
						roleFormWindow.setTitle("修改");
						roleFormWindow.show();
					} else {
						Co.showError("角色类型不正确，不能修改！");
					}
				}
			},null,{
				showWait : false
			});
		});
	}
	
	function deleteRole() {
		Co.gridDelete(roleGrid, API.deleteRole, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(roleGridStore);
				});
			} else {
				Co.alert(result.msg);
			}
		},null,{
			listeners : {
				"beforedelete" : function(ids) {
					var selectedList = Co.getSelRec(roleGrid);
					if (roleGridStore.getCount() == selectedList.length) {
						alert("注意：此操作会将系统中的角色全部删除！这可能会导致无法登录系统！");						
					}
					return true;
				}
			}
		});	
	}
	
	function searchRole() {
		Co.load(roleGridStore);
	}
	
	function resetModuleTree() {
		moduleTreePanel.collapseAll();
		moduleTreePanel.getRootNode().expand();
		moduleTreePanel.reset();
	}
	
	function addRoleDataRight() {
		Co.resetForm(roleDataRightForm, true);
		var roleId = roleForm.getForm().findField("id").getValue() || roleForm.getForm().findField("tempId").getValue();
		roleDataRightForm.getForm().findField("roleId").setValue(roleId);
		
		roleDataRightWindow.setTitle("新增");
		roleDataRightWindow.show();
	}
	
	function deleteRoleDataRight() {
		Co.gridDelete(roleDataRightGrid, API.deleteRoleDataRight, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					var roleId = roleForm.getForm().findField("id").getValue() || roleForm.getForm().findField("tempId").getValue();
					Co.load(roleDataRightGridStore, {
						"model.roleId" : roleId
					});
				});
			} else {
				Co.alert(result.msg);
			}
		});	
	}
	
	function editRoleDataRight() {
		Co.formLoad(roleDataRightForm, roleDataRightGrid, API.retrieveRoleDataRight, function(result, opts, selectedId){
			roleDataRightWindow.setTitle("修改");
			roleDataRightWindow.show();
		});
	}
	
	function saveRoleDataRight() {
		Co.formSave(roleDataRightForm, function(form, action){
			Co.alert("保存成功！", function(){
				roleDataRightWindow.hide();
				var roleId = roleForm.getForm().findField("id").getValue() || roleForm.getForm().findField("tempId").getValue();
				Co.load(roleDataRightGridStore, {
					"model.roleId" : roleId
				});
			});
		});
	}
	
	function copyRole() {
		var ids = Co.getGridSelectionList(roleGrid);
		if (!Co.isEmpty(ids)) {
			Co.confirm("确定复制吗？", function(btn){
				if ("yes" === btn) {
					Co.request(API.copyRole, {"roleIds" : ids}, function(result){
						if (result.success) {
							Co.alert("复制成功！", function(){
								Co.reload(roleGridStore);							
							});
						} else {
							Co.showError(result.msg);
						}
					});
				}
			});
		} else {
			Co.showError("请选择要复制的角色！");
		}
	}
	
});