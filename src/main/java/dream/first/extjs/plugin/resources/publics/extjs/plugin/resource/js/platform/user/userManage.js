Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
		saveUser : rootPath+"/user/save",
		queryUser : rootPath+"/user/query",
		deleteUser : rootPath+"/user/delete",
		retrieveUser : rootPath+"/user/retrieve",
		getOrgTree : rootPath+"/org/getOrgTree?showRoot=true",
		getOrgTreeLeft : rootPath+"/org/getOrgTree?showRoot=true&recursion=true&single=true",
		getRoleList : rootPath+"/role/getRoleList",
		queryRole : rootPath+"/role/query",
		queryUserExtraOrg : rootPath+"/userExtraOrg/queryUserExtraOrg",
		deleteUserExtraOrg : rootPath+"/userExtraOrg/deleteUserExtraOrg",
		resetPassword : rootPath+"/user/resetPassword",
		
		restPasswordV2 : rootPath + "/user/resetPasswordV2",
		
		unLockUser : rootPath+"/user/unLockUser",
		lockUser : rootPath+"/user/lockUser",
		
		queryUserWithCheck : rootPath+"/user/queryUserWithCheck",
		echoPassword : rootPath+"/user/echoPassword"
	};
	var selectedOrgNo;
	var selectedOrgId;
	var selectedOrgName;
	
	var pointer = '<span style="color:red;font-weight:bold">*</span>';
	//============================ Model =========================
	Co.defineModel("User", ["id","username","realName","gender","orgId","usrOrgName","post","title","tel","mobile","fax","email","office","isSuper","isLock","isUnIllegalModified","employeeId","employeeFullName"]);
	Co.defineModel("Role", ["id","roleName","roleType","roleDesc","roleProperty"]);
	Co.defineModel("UserExtraOrg", ["id","orgId","usrextraorgOrgName","usrextraorgRoleIds","usrextraorgRoleNames"]);
	//============================ Store =========================
	var userGridStore = Co.gridStore("userGridStore", API.queryUserWithCheck, "User", {
		autoLoad : false,
		output : "tbar",
		sorters : [{
			property : "usr.createTime",
			direction : "desc"
		}]
	}); 	
	var roleGridStore = Co.gridStore("roleGridStore", API.queryRole, "Role", {
		autoLoad : false,
		pageSize : Co.maxInt,
		sorters : [{
			property : "roleName",
			direction : "asc"
		}]
	}); 
	var userExtraOrgGridStore = Co.gridStore("userExtraOrgGridStore", API.queryUserExtraOrg, "UserExtraOrg", {
		autoLoad : false,
		pageSize : Co.maxInt,
		sorters : [{
			property : "createTime",
			direction : "desc"
		}]
	}); 
	//定义左侧树Store
	var orgTreeStore = Co.treeStore("orgTreeStore", API.getOrgTreeLeft, {
		autoLoad : false,
		nodeParam : "parentOrgNo",
		idProperty : "extraParam1",
		listeners : {
			load : function(){
				//默认选中
				var record = this.getNodeById(orgNo);
				var ss = orgTreePanel.getSelectionModel();
				ss.select(record);
			}
		}
	});
	
	orgTreeStore.load({
//		params : {"parentOrgNo" : orgNo || "-1"},
		callback : function() {
			orgTreePanel.getRootNode().expand(false);
			orgTreePanel.doLayout();
			orgTreePanel.getRootNode().expand(true);
		}
	});
	
	//============================ View =========================
	//定义左侧树
	var orgTreePanel = Co.tree("orgTreePanel", orgTreeStore, {
		width : 220,
		listeners : {
			selectionchange : function(me, rs, eOpts) {
				var org = rs[0];
				if (org) {
					selectedOrgNo = org.data.extraParam1;
					selectedOrgName = org.data.text;
					selectedOrgId = org.data.id;
					gridPanel.setTitle("已选中【" + selectedOrgName + "】");
					Co.load(userGridStore, {"orgNo" : selectedOrgNo});
				}
			}
		}
	}); 
	
	var tbar = Co.toolbar("tbar", [{
			rid : "8a866af34366c07c014366d0b5b00000",
			type : "+", 
			handler : addUser,
			showAtContextMenu : true
		},{
			rid : "8a866af34366c07c014366f7dc1c0040",
			type : "*",
			handler : deleteUser,
			showAtContextMenu : true
		},{
			rid : "8a866af34366c07c014366f7778b003f",
			type : "-",
			handler : editUser,
			showAtContextMenu : true
		},"-",{
			rid : "8a866af34366c07c014366f7778b003f",
			text : "密码重置",
			iconCls : "kgpgInfoIcon",
			handler : resetPasswordV2
		},{
			rid : "8a866af34366c07c014366f7778b003f",
			text : "解除锁定",
			iconCls : "keyIcon",
			handler : unLockUser
		},{
			rid : "8a866af34366c07c014366f7778b003f",
			text : "用户锁定",
			iconCls : "keyIcon",
			handler : lockUser
		},"-",{
			text : "密码回显",
			iconCls : "tagGreenIcon",
			handler : echoPassword
		},"->",{
			rid : "8a866af34366c07c014366f81a9b0041",
			type : "@",
			handler : searchUser,
			searchField : ["username","realName"],
			searchEmptyText : ["请输入帐号...","请输入姓名..."]
		}
	]);
	
	var userExtrOrgTbar = Co.toolbar("userExtrOrgTbar", [{
		text : "新增",
		iconCls : "createIcon",
		handler : addUserExtraOrg
	},{
		text : "删除",
		iconCls : "deleteIcon",
		handler : deleteUserExtraOrg
	}]);
	
	var columns = [
//		Co.gridRowNumberer(),
		{header : "id", dataIndex : "id", width : 100, hidden : true},
		{header : "状态", dataIndex : "isLock", width : 60, hidden : false, renderer : function(v){
			var color = "green", state = Co.dictText("loginLockState", v);
			if ("02" == v) {
				color = "red";
			}
			return "<font color='" + color + "'>" + (state ? state : "正常") + "</font>";
		}},
		{header : "密码", dataIndex : "isUnIllegalModified", width : 60, hidden : false, renderer : function(v){
			var color = "green", state = "正常";
			if (v === true) {
				color = "red";
				state = "篡改";
			}
			return "<font color='" + color + "'>" + state + "</font>";
		}},
		{header : "姓名", dataIndex : "realName", width : 100, hidden : false},
		{header : "帐号", dataIndex : "username", width : 100, hidden : false},
		{header : "性别", dataIndex : "gender", width : 66, hidden : false,align : "center" ,  renderer : function(v) {
			return Co.dictText("gender", v);
		}},
		{header : "所属科室", dataIndex : "usrOrgName", width : 180, hidden : false},
		{header : "岗位", dataIndex : "post", width : 150, hidden : false},
		{header : "职称", dataIndex : "title", width : 120, hidden : true},
		{header : "电话", dataIndex : "tel", width : 120, hidden : false},
		{header : "手机", dataIndex : "mobile", width : 120, hidden : false},
		{header : "传真", dataIndex : "fax", width : 120, hidden : true},
		{header : "Email", dataIndex : "email", width : 120, hidden : true},
		{header : "办公地点", dataIndex : "office", width : 200, hidden : true},
		{header : "备注", dataIndex : "remark", width : 250, hidden : true}
	];
	
	var roleColumns = [
		Co.gridRowNumberer(),
		{header : "id", dataIndex : "id", width : 80, hidden : true},
		{header : "角色名称", dataIndex : "roleName", width : 250, hidden : false},
		{header : "角色类型", dataIndex : "roleType", width : 100, hidden : false, renderer : function(v) {
			return Co.dictText("roleType", v);
		}},
		{header : "角色属性", dataIndex : "roleProperty", width : 100, hidden : false, renderer : function(v) {
			return Co.dictText("roleProperty", v);
		}},
		{header : "角色描述", dataIndex : "roleDesc", width : 200, hidden : false}
	];
	
	var userExtraOrgColumns = [
		Co.gridRowNumberer(),
		{header : "部门ID", dataIndex : "orgId", width : 250, hidden : true},
		{header : "角色ID", dataIndex : "usrextraorgRoleIds", width : 250, hidden : true},
		{header : "部门名称", dataIndex : "usrextraorgOrgName", width : 250, hidden : false},
		{header : "部门角色", dataIndex : "usrextraorgRoleNames", width : 250, hidden : false, editor : 
			Co.trigger("orgRoleName", "orgRoleName", "", function(){
				Co.roleSelector({
					callback : function(roleIds, roleNames) {
						//获得当前表格选中的记录，并设置值
						var record = userExtraOrgGrid.getSelectionModel().getSelection();
						if (record && record.length > 0) {
							record[0].set("usrextraorgRoleNames", roleNames);
							record[0].set("usrextraorgRoleIds", roleIds);
						}
					}
				},{
					editable : false,
					readOnly : false 
				});
			})
		}
	];
	
	var userGrid = Co.grid("userGrid", userGridStore, columns, tbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
				//if (parent.isGranted("8a866af34366c07c014366f7778b003f")) {
					editUser();
				//}
			}
		}
	});
	
	var roleGrid = Co.grid("roleGrid", roleGridStore, roleColumns, null, null, {
		hideBbar : true,
		listeners : {
			
		}
	});
	
	var userExtraOrgGrid = Co.grid("userExtraOrgGrid", userExtraOrgGridStore, userExtraOrgColumns, userExtrOrgTbar, null, {
		height : 185,
		border : true,
		hideBbar : true,
		plugins : [
			Ext.create("Ext.grid.plugin.CellEditing", {
				clicksToEdit : 1
			})
		]
	});
	
	//Co.load(userGridStore);//由默认选中所属科室时加载
	
	var gridPanel = Ext.create("Ext.panel.Panel",{
		title : "已选中【所属科室】",
		layout : "fit",
		items : userGrid
	});
	
	var userForm = Co.form(API.saveUser, [{
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
				id : "username",
				name : "model.username",
				fieldLabel : "帐号",
				beforeLabelTextTpl : pointer,
				allowBlank : false,
				blankText : "帐号不能为空",
				editable : true,
				readOnly : false,
				readOnlyCls : "x-text-disabled",
				maxLength: 32,
				maxLengthText: "帐号最多不能超过32字符",
				enforceMaxLength: true
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "realName",
				name : "model.realName",
				fieldLabel : "姓名",
				beforeLabelTextTpl : pointer,
				allowBlank : false,
				blankText : "姓名不能为空",
				editable : true,
				readOnly : false,
				maxLength: 16,
				maxLengthText: "姓名最多不能超过16字符",
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
				inputType : "password",
				id : "orig-password",
				fieldLabel : "密码",
				beforeLabelTextTpl : pointer,
				allowBlank : true,
				blankText : "密码不能为空",
				editable : true,
				readOnly : false,
				maxLength: 20,
				maxLengthText: "密码最多不能超过20字符",
				enforceMaxLength: true,
				hidden : true
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				inputType : "password",
				id : "re-password",
				fieldLabel : "确认密码",
				beforeLabelTextTpl : pointer,
				allowBlank : true,
				blankText : "确认密码不能为空",
				editable : true,
				readOnly : false,
				maxLength: 20,
				maxLengthText: "确认密码最多不能超过20字符",
				enforceMaxLength: true,
				validator : function(v) {
					var form = this.up("form").getForm();
					if (Co.isEmpty(form.findField("id").getValue()) && form.findField("orig-password").getValue() !== v) {
						return "两次密码输入不一致，请重新输入！";
					}
					return true;
				},
				hidden : true
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
			items : [
				Co.radioGroupDict("gender", "model.gender", "性别", "gender",{
					columns : [30+20,30+20],
					editable : false,
					allowBlank : false,
					beforeLabelTextTpl : pointer
				})
			]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [Co.trigger("usrOrgName", "usrOrgName", "所属科室", function(){
						Co.orgSelector({
							checkbox : false,
							callback : function(orgIds, orgNames, orgNos) {
								Ext.getCmp("usrOrgName").setValue(orgNames);
								Ext.getCmp("orgId").setValue(orgIds);
							},
							checkOrgId : Ext.getCmp("orgId").getValue()
						});
					},{
						readOnly : false,
						editable : false,
						allowBlank : false,
						blankText : "请选择所属科室",
						beforeLabelTextTpl : pointer,
					}
				)
			]
		},{
		xtype : "hiddenfield",
		id : "orgId",
		name : "model.orgId"
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
				id : "post",
				name : "model.post",
				fieldLabel : "岗位",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 128,
				maxLengthText: "岗位最多不能超过128字符",
				enforceMaxLength: true
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "title",
				name : "model.title",
				fieldLabel : "职称",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 128,
				maxLengthText: "职称最多不能超过128字符",
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
				id : "tel",
				name : "model.tel",
				fieldLabel : "电话",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 32,
				maxLengthText: "电话最多不能超过32字符",
				enforceMaxLength: true
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "mobile",
				name : "model.mobile",
				fieldLabel : "手机",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 32,
				maxLengthText: "手机最多不能超过32字符",
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
				id : "fax",
				name : "model.fax",
				fieldLabel : "传真",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 32,
				maxLengthText: "传真最多不能超过32字符",
				enforceMaxLength: true
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "email",
				name : "model.email",
				fieldLabel : "Email",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 64,
				maxLengthText: "Email最多不能超过64字符",
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
				id : "office",
				name : "model.office",
				fieldLabel : "办公地点",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 128,
				maxLengthText: "办公地点最多不能超过128字符",
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
				id : "remark",
				name : "model.remark",
				fieldLabel : "备注",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 256,
				maxLengthText: "备注最多不能超过256字符",
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
			items : [Co.trigger("employeeFullName", "employeeFullName", "关联人员", function(){
				Co.employeeSelector({//employeeJoinUserSelector
					checkbox : false,
					callback : function(employeeIDs, fullNames) {
						Ext.getCmp("employeeFullName").setValue(fullNames);
						Ext.getCmp("employeeId").setValue(employeeIDs);
					},
					selectedOrgNo : orgNo,
					selectedEmployeeIds : Ext.getCmp("employeeId").getValue(),
					//单选
					singleSelect : false//,
//					showOrgTree : false,
//					validateCertState : true,
//					validateCertStateCallback : function(selectedInvalidCertStateEmployee){
//						Co.showWarning("无法选择证书无效的人员！"+selectedInvalidCertStateEmployee.length);
//						return false;
//					}
				});
			},{
				readOnly : false,
				editable : false,
				allowBlank : true,
				blankText : "请选择关联的人员"
			}
		)
	]}]},{
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
				id : "padCode",
				name : "model.padCode",
				fieldLabel : "手持机序列号",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxLength: 32,
				maxLengthText: "手持机序列号最多不能超过32字符",
				enforceMaxLength: true,
				hidden : true
			}]
		}]
	},{
		xtype : "fieldset",
		title : "附属部门",
		defaults: {anchor: "100%"},
        layout: "anchor",
        padding : "5 5 5 5 ",
        items : [userExtraOrgGrid],
        hidden : true
	},{
		xtype : "hiddenfield",
		id : "password",
		name : "model.password"
	},{
		xtype : "hiddenfield",
		id : "extraOrgIds",
		name : "model.extraOrgIds"
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
	},{
		xtype : "hiddenfield",
		id : "usrRoles",
		name : "usrRoles"
	},{
		xtype : "hiddenfield",
		id : "usrRolesProperty",
		name : "usrRolesProperty"
	},{
		xtype : "hiddenfield",
		id : "isSuper",
		name : "model.isSuper"
	},{
		xtype : "hiddenfield",
		id : "loginFailTimes",
		name : "model.loginFailTimes"
	},{
		xtype : "hiddenfield",
		id : "isLock",
		name : "model.isLock"
	},{
		xtype : "hiddenfield",
		id : "initState",
		name : "model.initState"
	},{
		xtype : "hiddenfield",
		id : "userExtraOrgs",
		name : "userExtraOrgs"
	},{
		xtype : "hiddenfield",
		id : "employeeId",
		name : "model.employeeId"
	}],{
		border : false,
		frame : false
	});
	
	var tabPanel = Co.detailTab("userTabPanel", [{
		id : "userInfo",
		title : "基本信息",
		iconCls : "userIcon",
		items : userForm
	},{
		id : "roleInfo",
		title : "角色",
		iconCls : "folder_userIcon",
		items : roleGrid,
		listeners : {
			activate : function(tab, opts) {
				var selModel = roleGrid.getSelectionModel();
				selModel.deselectAll();
				Co.load(roleGridStore, null, function(){
					var roles = Ext.getCmp("usrRoles").getValue();
					if (!Co.isEmpty(roles)) {
						roles = roles.split(",");
						Ext.each(roles, function(id){
							var index = roleGridStore.find("id", id);
							if (-1 != index) {
								selModel.select(index, true);
							}
						});
						roleGrid.updateLayout();
					}
				});
			}
		}
	}]);
	
	var userFormWindow = Co.formWindow("新增", tabPanel, 650, 400, "fit", {
		okHandler : saveUser,
		realForm : userForm,
		listeners : {
			show : function(win, opts) {
				//如果是修改，则隐藏密码字段
				var form = userForm.getForm();
				var pwdVisible = true;
				var origPwd = form.findField("orig-password");
				var rePwd = form.findField("re-password");
				if (!Co.isEmpty(form.findField("id").getValue())) {
					pwdVisible = false;
					origPwd.setValue("-1");
					rePwd.setValue("-1");
				}
				//账号密码隐藏
//				origPwd.setVisible(pwdVisible);
//				rePwd.setVisible(pwdVisible);
				
				Co.load(userExtraOrgGridStore, {"model.userId" : Ext.getCmp("id").getValue()});
				
				Co.monEnter(userFormWindow, function(){
					userFormWindow.okHandler();
				});
				
				tabPanel.setActiveTab(0);
			}
		}
	});
	
	Ext.create("Ext.container.Viewport", {
		layout : "border",
		items : [
		         {
			region : "west",
			layout : "fit",
			title : "所属科室",  
			items : orgTreePanel,
			collapsible : true,
			split : true
		},
		{
			region : "center",
			items : gridPanel,
			layout : "fit",
			frame : false,
			border : false
		}],
		border : false
	});
	
	//============================ Function =========================
	function addUser() {
		Ext.getCmp("username").setReadOnly(false);
		Co.resetForm(userForm, true);
		if (roleGrid.getSelectionModel().getCount() > 0) {
			roleGrid.getSelectionModel().deselectAll();
		}
		if (!Co.isEmpty(selectedOrgNo)) {
			Ext.getCmp("orgId").setValue(selectedOrgId);
			Ext.getCmp("usrOrgName").setValue(selectedOrgName);
		}
		userFormWindow.setTitle("新增");
		userFormWindow.show();
	}
	
	function saveUser() {
		Co.formSave(userForm, function(form, action){
			if (action.result.success === true) {
				Co.alert("保存成功！", function(){
					if (roleGrid.getSelectionModel().getCount() > 0) {
						roleGrid.getSelectionModel().deselectAll();
					}
					userFormWindow.hide();
					Co.reload(userGridStore);
				});
			} else {
				Co.showError(action.result.msg);	
			}
		},null,{
			listeners : {
				beforesave : function() {
					//用户名和密码不能相同
//					var orig_pwd = Ext.getCmp("orig-password").getValue();
//					if (Ext.getCmp("username").getValue() == orig_pwd) {
//						Co.showError("密码和账号不能相同！");
//						return false;
//					}
//					if (Ext.getCmp("realName").getValue() == orig_pwd) {
//						Co.showError("密码和姓名不能相同！");
//						return false;
//					}
					
					//加密密码
//					var form = userForm.getForm();
//					if (Co.isEmpty(form.findField("id").getValue())) {
//						//form.findField("password").setValue(hex_sha1(orig_pwd));
//						form.findField("password").setValue(strEnc(orig_pwd, initKey1(), initKey2(), initKey3()));
//					}
					var selectRoles = Co.getGridSelectionList(roleGrid);
					if (!Co.isEmpty(selectRoles)) {
						Ext.getCmp("usrRoles").setValue(selectRoles);
					} else {
						Ext.getCmp("usrRoles").setValue("");
					}
					//判断角色互斥
					var selectRoles = Co.getSelRec(roleGrid), selectRolesArray = [];
					if (selectRoles && selectRoles.length > 0) {
						Ext.each(selectRoles, function(r){
							if ("01" == r.data.roleType) {
								selectRolesArray.push(Co.isEmpty(r.data.roleProperty) ? "01" : r.data.roleProperty);
							}
						});	
					}
					Ext.getCmp("usrRolesProperty").setValue(selectRolesArray.join(","));
					var userExtraOrgs = [];
					userExtraOrgGridStore.each(function(r){
						userExtraOrgs.push(r.data);
					});
					Ext.getCmp("userExtraOrgs").setValue(Ext.encode(userExtraOrgs));
					
					return true;
				}
			}
		});
	}
	
	function editUser() {
		//禁止修改用户帐号
		Ext.getCmp("username").setReadOnly(true);
		Co.resetForm(userForm, true);
		Co.formLoad(userForm, userGrid, API.retrieveUser, function(result, opts, selectedId){
			userFormWindow.setTitle("修改");
			userFormWindow.show();
		});
	}
	
	function deleteUser() {
		Co.gridDelete(userGrid, API.deleteUser, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(userGridStore);
				});
			} else {
				Co.alert(result.msg);
			}
		}, null, {
			listeners : {
				"beforedelete" : function(ids) {
					var canDelete = true;
					Ext.each(ids, function(v){
						var user = userGridStore.getById(v);
						if (user && "1" === user.get("isSuper")) {
							Co.showError("超级管理员不能删除！");
							canDelete = false;
							return false;
						}
					});
					return canDelete;
				}
			}
		});	
	}
	
	function searchUser() {
		Co.load(userGridStore);
	}
	
	function addUserExtraOrg() {
		Co.orgSelector({
			checkbox : false,
			callback : function(orgIds, orgNames, orgNos) {
				var record = new UserExtraOrg({
					orgId : orgIds,
					usrextraorgOrgName : orgNames
				});
				userExtraOrgGridStore.add(record);
			}
		});
	}
	
	function deleteUserExtraOrg() {
		Co.gridDelete(userExtraOrgGrid, API.deleteUserExtraOrg, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(userExtraOrgGridStore);
				});
			} else {
				Co.alert(result.msg);
			}
		});	
	}
	
	function resetPassword() {
		var ids = Co.getGridSelectionList(userGrid);
		if (ids) {
			Co.operatePwdCheck(function(){
				Co.confirm("确定重置吗？", function(btn){
					if (btn == "yes") {
						Co.request(API.resetPassword, {"userIds" : ids}, function(result){
							if (result.success) {
								Co.showInfo("密码重置成功！", function(){
									Co.reload(userGridStore);
								});
							} else {
								Co.showError(result.msg);	
							}
						});
					}
				});
			});
		} else {
			Co.showError("请选择一条记录！");
		}	
	}
	
	function unLockUser() {
		var records = Co.getSelRec(userGrid);
		if (records && records.length > 0) {
			var ids = [], canSubmit = true;
			Ext.each(records, function(r){
				if (r.data.isLock != "02") {
					Co.showError("未锁定用户不能解锁！");
					canSubmit = false;
					return false;
				}
				ids.push(r.data.id);
			});
			if (canSubmit) {
				Co.operatePwdCheck(function(){
					Co.confirm("确定解锁吗？", function(btn){
						if (btn == "yes") {
							Co.request(API.unLockUser, {"userIds" : ids}, function(result){
								if (result.success) {
									Co.showInfo("解锁成功！", function(){
										Co.reload(userGridStore);
									});
								} else {
									Co.showError(result.msg);	
								}
							});
						}
					});
				});
			}
		} else {
			Co.showError("请选择一条记录！");
		}	
	}
	
	/**
	 * 锁定用户
	 */
	function lockUser(){
		var records = Co.getSelRec(userGrid);
		if (records && records.length > 0) {
			var ids = [], canSubmit = true;
			Ext.each(records, function(r){
				if (r.data.isLock == "02") {
					Co.showError("已锁定用户不能解锁！");
					canSubmit = false;
					return false;
				}
				ids.push(r.data.id);
			});
			if (canSubmit) {
				Co.operatePwdCheck(function(){
					Co.confirm("确定锁定吗？", function(btn){
						if (btn == "yes") {
							Co.request(API.lockUser, {"userIds" : ids}, function(result){
								if (result.success) {
									Co.showInfo("锁定成功！", function(){
										Co.reload(userGridStore);
									});
								} else {
									Co.showError(result.msg);	
								}
							});
						}
					});
				});
			}
		} else {
			Co.showError("请选择一条记录！");
		}	
	}
	
	
	function echoPassword() {
		var records = Co.getSelRec(userGrid);
		if (records && records.length > 0) {
			if (records.length === 1) {
				Co.request(API.echoPassword, {"userIds" : records[0].data.id}, function(result){
					if (result.success) {
						Co.showInfo("密码：" + result.msg);
					} else {
						Co.showError(result.msg);
					}
				});
			} else {
				Co.showError("一次只能选择一条记录！");
			}
		} else {
			Co.showError("请选择一条记录！");
		}	
	}
	
	
	//=========================重置密码==========================
	
	//密码修改表单
	var resetPasswordForm = Co.form(API.restPasswordV2, [{
		inputType : "password",
		fieldLabel : "新密码",
		id : "newPassword_txt",
		name : "newPassword_txt",
		allowBlank : false,
		blankText : "请输入新密码",
		maxLength : 20,
		maxLengthText : "新密码长度不能超过20个字符",
		minLength : 8,
		minLengthText : "新密码长度不能少于8个字符",
		enforceMaxLength : true,
		validator : function(v) {
			if (!Co.isEmpty(v)) {
				if (!(v.match(/[\d]/) && v.match(/[0-9]/) && v.match(/[A-Za-z]/) && v.match(/[^\da-zA-Z]/))) return "密码应包含数字、字母和特殊字符";
			}
			return true;
		}
	},{
		inputType : "password",
		fieldLabel : "确认密码",
		id : "confirmPassword",
		name : "confirmPassword",
		allowBlank : false,
		blankText : "请输入确认密码",
		maxLength : 20,
		maxLengthText : "确认密码长度不能超过20个字符",
		enforceMaxLength : true,
		validator : function(v) {
			if (v !== this.up("form").getForm().findField("newPassword_txt").getValue()) {
				return "两次输入的密码必须相同";
			}
			return true;
		}
	},{
		xtype : "hiddenfield",
		id : "newPassword",
		name : "newPassword"
	},{
		xtype : "hiddenfield",
		id : "userIds",
		name : "userIds"
	}],{
		defaultType : "textfield"
	});
	
	
	//修改密码窗口
	var resetPasswordWindow = Co.formWindow("修改密码", resetPasswordForm, 400, 170, "fit", {
		okHandler : doResetPassword
	});	
	
	function doResetPassword() {
		Co.formSave(resetPasswordForm, function(form, action){
			Co.alert("密码重置成功！", function(){
				resetPasswordWindow.hide();
			});
		},null,{
			listeners : {
				beforesave : function() {
					Ext.getCmp("newPassword").setValue(strEnc(Ext.getCmp("newPassword_txt").getValue(), initKey1(), initKey2(), initKey3()));
					return true;
				}
			}
		});
	}
	
	function resetPasswordV2() {
		var ids = Co.getGridSelectionList(userGrid);
		if (ids) {
			Co.operatePwdCheck(function(){
				Co.resetForm(resetPasswordForm, true);
				Ext.getCmp("userIds").setValue(ids);
				resetPasswordWindow.show();
			});
		} else {
			Co.showError("请选择一条记录！");
		}	
	}
	
});