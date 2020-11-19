Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
			saveDict : rootPath+"/dict/save",
			queryDict : rootPath+"/dict/query",
			deleteDict : rootPath+"/dict/delete",
			retrieveDict : rootPath+"/dict/retrieve",
			modifyDict : rootPath+"/dict/modify"
	}; 

	//============================ Model =========================
	Co.defineModel("Dict", ["id","dictType","dictValue","dictText","dictOrder"]);
	//============================ Store =========================
	var dictGridStore = Co.gridStore("dictGridStore", API.queryDict, "Dict", {
		autoLoad : false,
		output : "tbar",
		sorters : [{
			property : "createTime",
			direction : "desc"
		}]
	});

	//============================ View =========================
	var tbar = Co.toolbar("tbar", [{
		rid : "8a9b3e14437b187001437b29b9790013",
		type : "+", 
		handler : addDict,
		showAtContextMenu : true
	},{
		rid : "8a9b3e14437b187001437b29e4a70016",
		type : "*",
		handler : deleteDict,
		showAtContextMenu : true
	},{
		rid : "8a9b3e14437b187001437b2a0d5e0019",
		type : "-",
		handler : editDict,
		showAtContextMenu : true
	},"->",{
		rid : "8a9b3e14437b187001437b2a47d3001c",
		type : "@",
		handler : searchDict,
		searchField : ["dictText","dictType"],
		searchEmptyText : ["请输入名称...","请输入类型..."]
	}
	]);

	var columns = [
		Co.gridRowNumberer(),
		{header : "id", dataIndex : "id", width : 250, hidden : true},
		{header : "类型", dataIndex : "dictType", width : 250, hidden : false},
		{header : "值", dataIndex : "dictValue", width : 250, hidden : false},
		{header : "显示名称", dataIndex : "dictText", width : 250, hidden : false},
		{header : "顺序", dataIndex : "dictOrder", width : 250, hidden : false}
		];

	var dictGrid = Co.grid("dictGrid", dictGridStore, columns, tbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
				editDict();
			}
		}
	});

	Co.load(dictGridStore);

	var dictForm = Co.form(API.saveDict, [{
		xtype : "textfield",
		id : "dictType",
		name : "model.dictType",
		fieldLabel : "类型",
		allowBlank : false,
		blankText : "类型不能为空",
		editable : true,
		readOnly : false,
		maxLength: 64,
		maxLengthText: "类型最多不能超过64字符",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "dictValue",
		name : "model.dictValue",
		fieldLabel : "值",
		allowBlank : false,
		blankText : "值不能为空",
		editable : true,
		readOnly : false,
		maxLength: 64,
		maxLengthText: "值最多不能超过64字符",
		enforceMaxLength: true
	},{
		xtype : "textfield",
		id : "dictText",
		name : "model.dictText",
		fieldLabel : "显示名称",
		allowBlank : false,
		blankText : "显示名称不能为空",
		editable : true,
		readOnly : false,
		maxLength: 64,
		maxLengthText: "显示名称最多不能超过64字符",
		enforceMaxLength: true
	},{
		xtype : "numberfield",
		id : "dictOrder",
		name : "model.dictOrder",
		fieldLabel : "顺序",
		allowBlank : true,
		editable : true,
		readOnly : false,
		hideTrigger : true,
		minValue : 0,
		maxValue : Co.maxInt
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	}]);

	var dictFormWindow = Co.formWindow("新增", dictForm, 450, 225	, "fit", {
		okHandler : saveDict
	});

	Ext.create("Ext.container.Viewport", {
		layout : "fit",
		items : dictGrid,
		border : false,
		frame : false
	});
	//============================ Function =========================
	function addDict() {
		Co.resetForm(dictForm, true);
		dictFormWindow.setTitle("新增");
		dictFormWindow.show();
	}

	function saveDict() {
//		var params2 = {};
//		params2["abc"] = "123";

//		var params = dictForm.getForm().getValues();

//		params["pengfei"]="鞥费";
//		//加密提交的数据
//		Ext.Object.each(params2, function(key, value, me){
//		params[key] = value; 
//		});
//		console.log(params);
//		Co.request(API.saveDict,params);

		Co.formSave(dictForm, function(form, action){
			Co.alert("保存成功！", function(){
				dictFormWindow.hide();
				Co.reload(dictGridStore);
			});
		});
	}

	function editDict() {
		Co.formLoad(dictForm, dictGrid, API.retrieveDict, function(result, opts, selectedId){
			dictFormWindow.setTitle("修改");
			dictFormWindow.show();
		});
	}

	function deleteDict() {
		Co.gridDelete(dictGrid, API.deleteDict, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(dictGridStore);
				});
			} else {
				Co.alert(result.msg);
			}
		});	
	}

	function searchDict() {
		Co.load(dictGridStore);
	}

});