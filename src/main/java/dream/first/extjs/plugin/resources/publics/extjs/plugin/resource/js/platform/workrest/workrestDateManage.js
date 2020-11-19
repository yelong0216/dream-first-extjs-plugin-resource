Coe.initialize();
Co.initialize();

Ext.onReady(function() {
	var API = {
			saveWorkrestDate : rootPath + "/workrestDate/save",
			queryWorkrestDate : rootPath + "/workrestDate/query",
			deleteWorkrestDate : rootPath + "/workrestDate/delete",
			retrieveWorkrestDate : rootPath + "/workrestDate/retrieve",

			generateWorkrestDate : rootPath + "/workrestDate/generateWorkrestDate",
			existWorkrestDate : rootPath + "/workrestDate/existWorkrestDate",

			yearTree : rootPath + "/workrestDate/yearTree",
			monthTree : rootPath + "/workrestDate/monthTree",

			modifyWorkrestDateType : rootPath + "/workrestDate/modifyWorkrestDateType",//修改日期类型
			removeWorkrestDate : rootPath + "/workrestDate/removeWorkrestDate"

	};
	var pointer = '<span style="color:red;font-weight:bold">*</span>';

	var currentYear;
	var currentMonth;

	var operatorType;//操作类型。生成、删除

	//============================ Model =========================
	Co.defineModel("WorkrestDate", ["id","dateType","dateValue","week"]);
	//============================ Store =========================
	var workrestDateGridStore = Co.gridStore("workrestDateGridStore", API.queryWorkrestDate, "WorkrestDate", {
		pageSize : 40,
		autoLoad : false,
		output : "workrestDateTbar",
		sorters : [{
			property : "dateValue",
			direction : "ASC"
		}]
	});

	//=============================定义左侧树=========================
	//定义左侧树Store
	var yearTreeStore = Co.treeStore("yearTreeStore", API.yearTree, {
		nodeParam : "id",
		idProperty : "id",
		listeners : {
			load : function(){
				//默认选中
				var record = this.getRootNode().getChildAt(0)
				var ss = yearTreePanel.getSelectionModel();
				ss.select(record);
			}
		}
	});
	var monthTreeStore = Co.treeStore("monthTreeStore", API.monthTree, {
		nodeParam : "id",
		idProperty : "id",
		listeners : {
			load : function(){
				//默认选中
				var record = this.getRootNode().getChildAt(0)
				var ss = monthTreePanel.getSelectionModel();
				ss.select(record);
			}
		}
	});
	//============================ View =========================
	//定义左侧树
	var yearTreePanel = Co.tree("yearTreePanel", yearTreeStore, {
		width : 150,
		listeners : {
			selectionchange : function(me, rs, eOpts) {
				var year = rs[0];
				if (year) {
					currentYear = year.data.id;
					yearTreePanel.setTitle("已选中【" + year.data.text + "】");
					Co.load(workrestDateGridStore, {"year" : currentYear,"month":currentMonth});
				}
			}
		}
	}); 

	var monthTreePanel = Co.tree("monthTreePanel", monthTreeStore, {
		width : 150,
		listeners : {
			selectionchange : function(me, rs, eOpts) {
				var month = rs[0];
				if (month) {
					currentMonth = month.data.id;
					monthTreePanel.setTitle("已选中【" + month.data.text + "】");
					Co.load(workrestDateGridStore, {"year" : currentYear,"month":currentMonth});
				}
			}
		}
	}); 


	//============================ View =========================
	var workrestDateTbar = Co.toolbar("workrestDateTbar", [{
		type : "+", 
		handler : addWorkrestDate,
		showAtContextMenu : true
	},{
		type : "*",
		handler : deleteWorkrestDate,
		showAtContextMenu : true
	},{
		type : "-",
		handler : editWorkrestDate,
		showAtContextMenu : true
	},"-",{
		text : "生成",
		handler : openGenerateWorkrestDate,
		showAtContextMenu : true
	},{
		text : "删除",
		handler : openRemoveWorkrestDate,
		showAtContextMenu : true
	},"->",{
		type : "@",
		handler : searchWorkrestDate,
		searchField : [{
			xtype : "cocomboboxdict",
			id : "dateTypeTbar",
			name : "dateType",
			type : "dateType",
			modelSearch : true
		}],
		searchEmptyText : ["请选择日期类型..."]
	}
	]);

	var workrestDateColumns = [
		Co.gridRowNumberer(),
		{header : "主键", dataIndex : "id", width : 333, hidden : true},
		{header : "日期", dataIndex : "dateValue", width : 333, hidden : false},
		{header : "日期类型", dataIndex : "dateType", width : 333, hidden : false,editor : 
			Co.comboBoxDict("dateType", "dateType", "", "dateType", {
				allowBlank : false,
				blankText : "请选择日期类型！",
				editable : false
			}),
			renderer : function(v){
				return Co.dictText("dateType",v);
			}
		},
		{header : "星期", dataIndex : "week", width : 150,sortable:false, hidden : false},
		];

	var workrestDateGrid = Co.grid("workrestDateGrid", workrestDateGridStore, workrestDateColumns, workrestDateTbar, null, {
		listeners : {
			itemdblclick : function(view, record) {
				editWorkrestDate();
			}
		},
		plugins : [
			Ext.create("Ext.grid.plugin.CellEditing", {
				clicksToEdit : 1,
				listeners : {
					"edit" : function(editor,obj){
						if(obj.originalValue != obj.value){//值变更后修改
							Co.request(API.modifyWorkrestDateType,{"id":obj.record.data.id,"dateType":obj.value},function(){
								Co.load(workrestDateGridStore);
							},null,{
								showWait :false
							});
						}
					}
				}
			})
			]
	});

	Co.load(workrestDateGridStore);

	var workrestDateForm = Co.form(API.saveWorkrestDate, [{
		layout : "column",
		border : false,
		bodyCls : "panel-background-color",
		items : [{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "datefield",
				id : "dateValue",
				name : "model.dateValue",
				beforeLabelTextTpl : pointer,
				fieldLabel : "日期",
				format : 'Y-m-d',
				minValue : "1970-01-01",
				maxValue : "2100-01-01",
				allowBlank : false,
				editable : false,
				readOnly : false,
				enforceMaxLength: false
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [Co.comboBoxDict("dateType", "model.dateType", "日期类型", "dateType",{
				beforeLabelTextTpl : pointer,
				editable : false,
				allowBlank : false
			})]
		}]
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	}]);

	var gridPanel = Ext.create("Ext.panel.Panel",{
		title : "工作/休息日",
		layout : "fit",
		items : workrestDateGrid
	});

	var leftPanel = Ext.create("Ext.panel.Panel",{
		layout : "border",
		items : [{
			region : "west",
			items : monthTreePanel,
			title : "月份",
			layout : "fit",
			collapsible : true,
			split : true
		},{
			region : "center",
			items : gridPanel,
			beforeLabelTextTpl : pointer,
			layout : "fit",
			collapsible : false,
			split : true
		}],
		border : false
	});

	var workrestDateFormWindow = Co.formWindow("新增", workrestDateForm, 650, 150, "fit", {
		okHandler : saveWorkrestDate
	});

	Ext.create("Ext.container.Viewport", {
		layout : "border",
		items : [{
			region : "west",
			layout : "fit",
			title : "年份",  
			items :[ yearTreePanel],
			collapsible : true,
			split : true
		},{
			region : "center",
			items : leftPanel,
			layout : "fit",
			collapsible : false,
			split : true
		}],
		border : false
	});
	//============================ Function =========================
	function addWorkrestDate() {
		Co.resetForm(workrestDateForm, true);
		workrestDateFormWindow.setTitle("新增");
		workrestDateFormWindow.show();
	}

	function saveWorkrestDate() {
		var dateValue = Ext.getCmp("dateValue").getValue();
		Co.request(API.existWorkrestDate,{"dateValue":dateValue},function(result){
			if(result.success){
				if(result.msg == "true"){
					Co.showConfirm("日期["+dateValue+"已经存在],确定继续保存吗？",function(btn){
						if(btn == "ok"){
							execSaveWorkrestDate();
						}
					});
				} else {
					execSaveWorkrestDate();
				}
			} else {
				Co.showError(result.msg);
			}
		});
	}


	function execSaveWorkrestDate(){
		Co.formSave(workrestDateForm, function(form, action){
			Co.alert("保存成功！", function(){
				workrestDateFormWindow.hide();
				Co.reload(workrestDateGridStore);
			});
		});
	}

	function editWorkrestDate() {
		Co.formLoad(workrestDateForm, workrestDateGrid, API.retrieveWorkrestDate, function(result, opts, selectedId){
			if (true === result.success) {
				workrestDateFormWindow.setTitle("修改");
				workrestDateFormWindow.show();
			} else {
				Co.showError(result.msg || "数据加载失败！");
			}
		});
	}

	function deleteWorkrestDate() {
		Co.gridDelete(workrestDateGrid, API.deleteWorkrestDate, function(result){
			if (result.success === true) {
				Co.alert("删除成功！", function(){
					Co.reload(workrestDateGridStore);
				});
			} else {
				Co.alert(result.msg);
			}
		});	
	}

	function searchWorkrestDate() {
		Co.load(workrestDateGridStore);
	}

	//=====================generate===================

	var generateWorkrestDateForm = Co.form(API.generateWorkrestDate, [{
		layout : "column",
		border : false,
		bodyCls : "panel-background-color",
		items : [{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "numberfield",
				id : "year",
				name : "year",
				fieldLabel : "年份",
				beforeLabelTextTpl : pointer,
				allowBlank : false,
				editable : true,
				readOnly : false,
				maxValue : 2100,
				minValue : 1970,
				enforceMaxLength: false
			}]
		},{
			columnWidth : .5,
			border : false,
			bodyCls : "panel-background-color",
			layout : "form",
			items : [{
				xtype : "textfield",
				id : "month",
				name : "month",
				fieldLabel : "月份",
				allowBlank : true,
				editable : true,
				readOnly : false,
				maxValue : 12,
				minValue : 1,
				enforceMaxLength: false
			}]
		}]
	},{
		xtype : "hiddenfield",
		id : "id",
		name : "model.id"
	}]);

	var genearteWorkrestDateFormWindow = Co.formWindow("生成日历", generateWorkrestDateForm, 650, 180, "fit", {
		okHandler : operatorWorkrestDate
	});

	function operatorWorkrestDate(){
		if(operatorType == "genearte"){
			generateWorkrestDate();
		} else if(operatorType == "remove"){
			removeWorkrestDate();
		}
	}

	function openGenerateWorkrestDate(){
		operatorType = "genearte";
		Co.resetForm(generateWorkrestDateForm, true);
		genearteWorkrestDateFormWindow.setTitle("生成日历");
		genearteWorkrestDateFormWindow.show();
	}

	/**
	 * 生成日历。验证是否存在
	 */
	function generateWorkrestDate(){
		var year = Ext.getCmp("year").getValue();
		var month = Ext.getCmp("month").getValue();
		Co.request(API.existWorkrestDate,{"year":year,"month" : month},function(result){
			if(result.success){
				if(result.msg == "true"){
					var confirm = "年份["+year+"]";
					if( null != month && month != ""){
						confirm = confirm + "，月份["+month+"]"
					}
					confirm  = confirm + "已经存在，确定要重新生成吗？";
					Co.showConfirm(confirm,function(btn){
						if(btn == "ok"){
							execGenerateWorkrestDateForm();
						}
					});
				} else {
					execGenerateWorkrestDateForm();
				}
			} else {
				Co.showError(result.msg);
			}
		});
	}

	/**
	 * 执行生成
	 */
	function execGenerateWorkrestDateForm(){
		Co.formSave(generateWorkrestDateForm, function(form, action){
			Co.alert("生成成功！", function(){
				genearteWorkrestDateFormWindow.hide();
				Co.load(yearTreeStore);
				Co.load(workrestDateGridStore, {"year" : currentYear,"month":currentMonth});
			});
		},null,{
			waitMsg : "正在生成..."
		});
	}

	//======================删除=========================

	function openRemoveWorkrestDate(){
		operatorType = "remove";
		Co.resetForm(generateWorkrestDateForm, true);
		genearteWorkrestDateFormWindow.setTitle("删除日历");
		genearteWorkrestDateFormWindow.show();
	}

	/**
	 * 生成日历。验证是否存在
	 */
	function removeWorkrestDate(){
		var year = Ext.getCmp("year").getValue();
		var month = Ext.getCmp("month").getValue();
		Co.request(API.removeWorkrestDate,{"year":year,"month" : month},function(result){
			if(result.success){
				Co.showInfo("删除成功！",function(){
					genearteWorkrestDateFormWindow.hide();
					Co.load(yearTreeStore);
					Co.load(workrestDateGridStore, {"year" : currentYear,"month":currentMonth});
				})
			} else {
				Co.showError(result.msg);
			}
		});
	}


});