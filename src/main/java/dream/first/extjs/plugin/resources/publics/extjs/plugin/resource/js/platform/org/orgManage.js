Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
		saveOrg : rootPath+"/org/save",
		queryOrg : rootPath+"/org/query",
		deleteOrg : rootPath+"/org/delete",
		retrieveOrg : rootPath+"/org/retrieve",
		getOrgTree : rootPath+"/org/getOrgTree?showRoot=true",
		getOrgTreeLeft : rootPath+"/org/getOrgTree?showRoot=true&recursion=true&single=true",
		
		queryOrgChildOrgCount : rootPath + "/org/queryOrgChildOrgCount"
	};
	var pointer = '<span style="color:red;font-weight:bold">*</span>';
	
	var selectedOrgNo;
	var selectedOrgName;
	//============================ Model =========================
	Co.defineModel("Org", ["id","orgNo","parentOrgNo","orgName","orgShortName","orgCode","orgType","charger","tel","fax","address","summary","orgOrder"]);
	//============================ Store =========================
	var orgGridStore = Co.gridStore("orgGridStore", API.queryOrg, "Org", {
		autoLoad : false,
		output : "tbar",
		sorters : [{
			property : "org.orgOrder",
			direction : "asc"
		},{
			property : "org.orgNo",
			direction : "asc"
		}]
	}); 	
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
	var orgTreePanel = Co.tree("orgTreePanel", orgTreeStore, {
		width : 300,
		listeners : {
			selectionchange : function(me, rs, eOpts) {
				var module = rs[0];
				if (module) {
					var orgNo = module.data.extraParam1;
					gridPanel.setTitle("已选中【" + module.data.text + "】");
					selectedOrgNo = orgNo;
					selectedOrgName = module.data.text;
					Co.load(orgGridStore, {"model.parentOrgNo" : orgNo});
				}
			}
		}
	}); 
	var tbar = Co.toolbar("tbar", [{
			rid : "8a9b3e14437b187001437b1e4a580002",
			type : "+", 
			handler : addOrg,
			showAtContextMenu : true
		},{
			rid : "8a9b3e14437b187001437b1e7a810003",
			type : "*",
			handler : deleteOrg,
			showAtContextMenu : true
		},{
			rid : "8a9b3e14437b187001437b1ec0690004",
			type : "-",
			handler : editOrg,
			showAtContextMenu : true
		},"->",{
			rid : "8a9b3e14437b187001437b1f8c750005",
			type : "@",
			handler : searchOrg,
			searchField : ["orgName"],
			searchEmptyText : ["请输入部门名称..."]
		}
	]);
	
	var columns = [
//		Co.gridRowNumberer(),
		{header : "id", dataIndex : "id", width : 80, hidden : true},
		{header : "部门编号", dataIndex : "orgNo", width : 120, hidden : true},
		{header : "上级部门", dataIndex : "parentOrgNo", width : 120, hidden : true},
		{header : "部门名称", dataIndex : "orgName", width : 250, hidden : false},
		{header : "部门简称", dataIndex : "orgShortName", width : 180, hidden : false},
		{header : "部门代码", dataIndex : "orgCode", width : 100, hidden : false},
		{header : "部门类型", dataIndex : "orgType", width : 100, hidden : false, renderer : function(v){
			return Co.dictText("orgType", v);
		}},
		{header : "负责人", dataIndex : "charger", width : 100, hidden : false},
		{header : "联系电话", dataIndex : "tel", width : 120, hidden : false},
		{header : "传真", dataIndex : "fax", width : 120, hidden : false},
		{header : "办公地址", dataIndex : "address", width : 200, hidden : true},
		{header : "简介", dataIndex : "summary", width : 200, hidden : true},
		{header : "顺序", dataIndex : "orgOrder", width : 60, hidden : false}
	];
	
	var orgGrid = Co.grid("orgGrid", orgGridStore, columns, tbar, null, {
		deleteId : "orgNo",
		listeners : {
			itemdblclick : function(view, record) {
				//if (parent.isGranted("8a9b3e14437b187001437b1ec0690004")) {
					editOrg();
				//}
			}
		}
	});
	
	//Co.load(orgGridStore);//由默认选中所属科室时加载
	
	var orgForm = Co.form(API.saveOrg, [
		Co.comboBoxTree("orgParentOrgName", "上级部门", API.getOrgTree,{
			editable : true,
			allowBlank : false,
			blankText : "请选择上级部门",
			textEl : "orgParentOrgName",
			valueEl : "parentOrgNo",
			nodeParam : "parentOrgNo",
			idProperty : "extraParam1",
			beforeLabelTextTpl : pointer,
		}),{
		xtype : "hiddenfield",
		id : "parentOrgNo",
		name : "model.parentOrgNo"
	},{
		xtype : "textfield",
		id : "orgName",
		name : "model.orgName",
		fieldLabel : "部门名称",
		beforeLabelTextTpl : pointer,
		allowBlank : false,
		blankText : "部门名称不能为空",
		editable : true,
		readOnly : false,
		maxLength: 64,
		maxLengthText: "部门名称最多不能超过64字符",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "orgShortName",
		name : "model.orgShortName",
		fieldLabel : "部门简称",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 64,
		maxLengthText: "部门简称最多不能超过64字符",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "orgCode",
		name : "model.orgCode",
		fieldLabel : "部门代码",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 64,
		maxLengthText: "部门代码最多不能超过64字符",
		enforceMaxLength: true
	},Co.comboBoxDict("orgType", "model.orgType", "部门类型", "orgType",{
		allowBlank : true,
		editable : false
	}),{
		xtype : "textfield",
		id : "charger",
		name : "model.charger",
		fieldLabel : "负责人",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 16,
		maxLengthText: "负责人最多不能超过16字符",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "tel",
		name : "model.tel",
		fieldLabel : "联系电话",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 32,
		maxLengthText: "联系电话最多不能超过32字符",
		enforceMaxLength: true
	},{
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
	},{
		xtype : "textfield",
		id : "address",
		name : "model.address",
		fieldLabel : "办公地址",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 128,
		maxLengthText: "办公地址最多不能超过128字符",
		enforceMaxLength: true
	},{
		xtype : "textareafield",
		id : "summary",
		name : "model.summary",
		fieldLabel : "简介",
		allowBlank : true,
		editable : true,
		readOnly : false,
		maxLength: 256,
		maxLengthText: "简介最多不能超过256字符",
		enforceMaxLength: true
	},{
		xtype : "numberfield",
		id : "orgOrder",
		name : "model.orgOrder",
		fieldLabel : "顺序",
		allowBlank : true,
		editable : true,
		readOnly : false,
		hideTrigger : true,
		minValue : 0,
		maxValue : Co.maxInt
	},Co.comboBoxDict("showChild", "model.showChild", "展示子节点", "showChild",{
		editable : false,
		allowBlank : false,
		blankText : "请选择是否展示子节点"
	}),{
		xtype : "hiddenfield",
		id : "oldParentOrgNo",
		name : "model.oldParentOrgNo"
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	},{
		xtype : "hiddenfield",
		id : "orgNo",
		name : "model.orgNo"
	}]);
	
	var orgFormWindow = Co.formWindow("新增", orgForm, 500, 520, "fit", {
		okHandler : saveOrg,
		listeners : {
			"show" : function() {
				//记录修改前的上级部门编号
				Ext.getCmp("oldParentOrgNo").setValue(Ext.getCmp("parentOrgNo").getValue());
				Ext.getCmp("showChild").setValue("01");
				Co.monEnter(this, saveOrg);
			}
		}
	});
	
	var gridPanel = Ext.create("Ext.panel.Panel", {
		title : "已选中【所属科室】",
		layout : "fit",
		items : orgGrid
	});
	
	Ext.create("Ext.container.Viewport", {
		layout : "border",
		items : [{
			region : "west",
			title : "所属科室",
			layout : "fit",
			items : orgTreePanel,
			split : true,
			collapsible : true
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
	function addOrg() {
		Co.resetForm(orgForm, true);
		if (!Co.isEmpty(selectedOrgNo)) {
			Ext.getCmp("parentOrgNo").setValue(selectedOrgNo);
			Ext.getCmp("orgParentOrgName").setValue(selectedOrgName);
		}
		orgFormWindow.setTitle("新增");
		orgFormWindow.show();
	}
	
	function saveOrg() {
		Co.formSave(orgForm, function(form, action){
			Co.alert("保存成功！", function(){
				orgFormWindow.hide();
				Co.reload(orgGridStore,null,function(){
					Co.flushGridStoreRecord(orgGrid,orgGridStore);
				});
				Co.reload(orgTreeStore);
			});
		});
	}
	
	function editOrg() {
		Co.formLoad(orgForm, orgGrid, API.retrieveOrg, function(result, opts, selectedId){
			orgFormWindow.setTitle("修改");
			orgFormWindow.show();
		}, null, {
			listeners : {
				"beforeload" : function(id) {
					if ("0000" === id) {
						Co.showError("系统内置数据不能修改！");
						return false;
					}
					return true;
				}
			}
		});
	}
	
	function deleteOrg() {
		var deleteConfirm = null;
		var ids = Co.getGridSelectionList(orgGrid, "orgNo");
		var idArray = ids.split(",");
		var canDelete = true;
		Ext.each(idArray, function(v){
			if ("0000" == v) {
				Co.showError("系统内置数据不能删除！");
				return false;
			}
		});
		if(idArray.length == 1){
			Co.request(API.queryOrgChildOrgCount,{"orgNo":ids},function(result){
				if(result.success){
					if( result.msg > 1 ){
						execDeleteOrg("该组织的下级组织将一并删除。确定删除吗？");
					} else {
						execDeleteOrg();
					}
				} else {
					Co.showError(result.msg);
				}
			})
		} else {
			execDeleteOrg("当删除的组织存在下级组织时，其下级组织将一并删除。确定删除吗？");
		}
//		Co.gridDelete(orgGrid, API.deleteOrg, function(result){
//			if (result.success === true) {
//				Co.alert("删除成功！", function(){
//					Co.reload(orgGridStore);
//					Co.reload(orgTreeStore);
//				});
//			} else {
//				Co.alert(result.msg);
//			}
//		}, null, {
//			listeners : {
//				"beforedelete" : function(ids) {
//					var canDelete = true;
//					Ext.each(ids, function(v){
//						if ("0000" == v) {
//							Co.showError("系统内置数据不能删除！");
//							canDelete = false;
//							return false;
//						}
//					});
//					if(canDelete){
//						if(ids.length == 1 ){
//							Co.request(API.queryOrgChildOrgCount,{"orgNo":ids},function(result){
//								if(result.success){
//									if( result.msg > 1 ){
//										deleteConfirm = "删除的组织存在下级组织时，其下级组织将一并删除。确定删除吗？";
//									}
//								} else {
//									Co.showError(result.msg);
//								}
//							})
//						} else {
//							deleteConfirm = "当删除的组织存在下级组织时，其下级组织将一并删除。确定删除吗？";
//						}
//					}
//					return canDelete;
//				}
//			},
//			msg : deleteConfirm
//		});	
	}
	
	function execDeleteOrg(msg){
		Co.gridDelete(orgGrid, API.deleteOrg, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(orgGridStore);
					Co.reload(orgTreeStore);
				});
			} else {
				Co.alert(result.msg);
			}
		},null,{
			msg : msg
		});
	}	
	
	function searchOrg() {
		Co.load(orgGridStore);
	}
});