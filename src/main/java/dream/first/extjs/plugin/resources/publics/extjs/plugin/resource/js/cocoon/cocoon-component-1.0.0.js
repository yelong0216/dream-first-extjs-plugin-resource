//解决ExtJS中文排序问题
Ext.data.Store.prototype.applySort = function() {
	if (this.sortInfo && !this.remoteSort) {
		var s = this.sortInfo, f = s.field;
		var st = this.fields.get(f).sortType;
		var fn = function(r1, r2) {
			var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
			if (typeof(v1) == "string") {
				return v1.localeCompare(v2);

			}
			return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
		};
		this.data.sort(s.direction, fn);
		if (this.snapshot && this.snapshot != this.data) {
			this.snapshot.sort(s.direction, fn);
		}
	}
};

/**
 * 定义Tree
 * @class Co.tree.Panel
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var tree = Ext.create("Co.tree.Panel", {});
 */
Ext.define("Co.tree.Panel", {
	extend : "Ext.tree.Panel",
	alias : "widget.cotree",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.tree.Panel配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			rootVisible : false,
			autoScroll : true,
			border : false,
			bodyBorder : false
		});
		me.callParent();		
	}
});

/**
 * 定义GridTree
 * @class Co.tree.Panel
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var tree = Ext.create("Co.tree.GridTreePanel", {});
 */
Ext.define("Co.tree.GridTreePanel", {
	extend : "Ext.tree.Panel",
	alias : "widget.cogridtree",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.tree.Panel配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var userColumns = me.config.columns;
		var columns = [];
		Ext.each(userColumns, function(c){
			columns.push({
				xtype : "treecolumn",
				header : c.header,
				width : c.width,
				dataIndex : c.dataIndex
			});
		});
		Ext.apply(me, {
			rootVisible : false,
			autoScroll : true,
			border : false,
			bodyBorder : false,
			columns : columns
		});
		me.callParent();		
	}
});

/**
 * 定义带复选框的Tree
 * @class Co.tree.CheckboxTree
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var checkBoxTree = Ext.create("Co.tree.CheckboxTree", {});
 */
Ext.define("Co.tree.CheckboxTree", {
	extend : "Co.tree.Panel",
	alias : "widget.cocheckboxtree",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config config 配置项，请参考Co.tree.Panel配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			listeners : {
				"checkchange" : function(node, checked) {
					if (checked) {         
						node.eachChild(function  (child)  {                 
							me.setChecked(child, true);         
						});       
					} else {         
						node.eachChild(function  (child)  {                
							me.setChecked(child, false);         
						});       
					}              
				}
			}
		});

		me.callParent();
	},
	/**
	 * 设置节点及其子节点的选中状态
	 * @param {Object} node 节点
	 * @param {boolean} checked 选中状态，true：选中，false：取消选中
	 */
	setChecked : function(node, checked) {
		node.set('checked', checked);      
		if (node.isNode) {        
			node.eachChild(function(child)  {                
				this.setChecked(child, checked);         
			}, this);      
		}  
	},
	/**
	 * 获得选中的节点及其子节点的ID
	 * @param {Object} node 选中的节点
	 * @param {Array} selectedModules 选中节点及其子节点的ID
	 */
	getChecked : function(node, selectedModules) {
		node.eachChild(function(child)  {    
			if (child.get("checked")) {
				selectedModules.push(child.data.id);
			}
			this.getChecked(child, selectedModules);
		}, this);
	},
	/**
	 * 重置所有节点（非选中状态）
	 */
	reset : function() {
		var root = this.getRootNode();
		this.setChecked(root, false);
	},
	/**
	 * 根据Store中的数据，设置选中状态
	 * @param {String} ids ID集合，通过“,”分隔
	 */
	loadChecked : function(ids) {
		ids = ids.split(",");
		if (ids) {
			var store = this.getStore();
			Ext.each(ids, function(v){
				var node = store.getNodeById(v);
				if (node) {
					node.set("checked", true);
				}
			});	


		}
	}
});

/**
 * 定义表格Store
 * @class Co.data.Store
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var store = Ext.create("Co.data.Store", {});
 */
Ext.define("Co.data.Store", {
	extend : "Ext.data.Store",
	alias : "store.costore",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.data.Store配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		Ext.apply(me.config, {
			pageSize : me.config.pageSize || 30,
			proxy : {
				type : "ajax",
				url : me.config.url,
				actionMethods : {
					read : "POST"
				},
				reader : {
					type : "json",
					totalProperty : "total",
					root : "root"
				}
			},
			remoteSort : true,
			listeners : Ext.applyIf(me.config.listeners || {}, {
				beforeload : function(store, operation, eOpts) {
					Co.setStore(store);
				}
			})
		});
		me.callParent([me.config]);
	}
});

/**
 * 定义表格
 * @class Co.grid.Panel
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var grid = Ext.create("Co.grid.Panel", {});
 */
Ext.define("Co.grid.Panel", {
	extend : "Ext.grid.Panel",
	alias : "widget.cogrid",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.grid.Panel配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var bbar = me.config.bbar || [];
		if (!Ext.isArray(bbar)) {
			bbar = [bbar];
		}

		if (!(true === me.config.hidePagingbar)) {
			bbar.push("->");
			bbar.push({
				xtype : "pagingtoolbar",
				store : me.config.store,
				displayInfo : true,
				emptyMsg : "没有符合条件的记录",
				padding : me.config.pagingbarPadding || "6 8 6 8",
				margin : me.config.pagingbarMargin || "0 6 0 0",
			});
		}
		//构造右键菜单
		var contextMenu;
		if (me.tbar) {
			if (me.tbar.items.length > 0) {
				contextMenu = Ext.create("Ext.menu.Menu", {
					id : me.id + "_context_menu",
					items : []
				});
				var isGranted = true;//parent.isGranted || opener.parent.isGranted;
				me.tbar.items.each(function(v){
//					if (true === v.showAtContextMenu && isGranted(v.rid)) {
					if (true === v.showAtContextMenu) {
						contextMenu.add(Ext.create("Ext.menu.Item", v));  
					}
				});
			}
		}

		var configViewConfig = me.config.viewConfig;
		
		var gridViewConfig = {
				stripeRows : true,
				forceFit : me.config.forceFit === undefined ? true : me.config.forceFit,
						loadMask : false === me.config.loadMask ? false : {
							msg : "正在加载..."
						},
						emptyText: me.config.emptyText || "",//"<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
						deferEmptyText: me.config.deferEmptyText === undefined ? true : me.config.deferEmptyText
		}

		gridViewConfig["plugins"] = configViewConfig === undefined ? null : configViewConfig.plugins;
		gridViewConfig["listeners"] = configViewConfig === undefined ? null : configViewConfig.listeners;
		
		Ext.apply(me, {
			selModel : me.config.selModel || (null !== me.config.selModel ? Ext.create("Ext.selection.CheckboxModel", {checkOnly : undefined === me.config.checkOnly ? false : me.config.checkOnly, mode : me.config.checkboxSelMode || "MULTI", listeners : me.config.checkboxModelListeners || {} }) : null),
			multiSelect : me.config.multiSelect === undefined ? true : me.config.multiSelect,
					frame : me.config.frame === undefined ? false : me.config.frame,
							border : me.config.border === undefined ? false : me.config.border,
									viewConfig : gridViewConfig,
									bbar : bbar,
									listeners : Ext.applyIf(me.config.listeners || {}, {
										"itemcontextmenu" : function(view, record, item, index, e, eOpts) {
											e.preventDefault();
											if (contextMenu && contextMenu.items.length > 0) {
												contextMenu.showAt(e.getXY());
											}
										}
									})
		});

		if (me.config.hideBbar === true) {
			delete me.bbar;
		}
		me.callParent();
	}
});

/**
 * 定义树Store
 * @class Co.data.TreeStore
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var treeStore = Ext.create("Co.data.TreeStore", {});
 */
Ext.define("Co.data.TreeStore", {
	extend : "Ext.data.TreeStore",
	alias : "store.cotreestore",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.data.TreeStore配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};

		Ext.define("__Co_data_TreeStore__", {
			extend : "Ext.data.Model",
			fields : ["id", "text", "leaf", "extraParam1", "extraParam2", "extraParam3", "extraParam4"],
			idProperty : me.config.idProperty || "id"
		});

		var root = {};
		root["name"] = "根节点";
		root[me.config.idProperty || "id"] = -1;

		Ext.apply(me.config, {
			model : "__Co_data_TreeStore__",
			proxy : {
				type : "ajax",
				url : me.config.url,
				reader : "json"
			},
			root : root
		});
		me.callParent([me.config]);
	}
});

/**
 * 定义下拉树
 * @class Co.form.field.ComboBoxTree
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var comboTree = Ext.create("Co.form.field.ComboBoxTree", {});
 */
Ext.define("Co.form.field.ComboBoxTree", {
	extend : "Ext.form.field.ComboBox",
	alias : "widget.comboboxtree",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.form.field.ComboBox配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var treeContentEl = "treeDiv_" + Ext.id();
		var tree = Ext.create("Co.tree.Panel", {
			id : "comboBoxTree_" + Ext.id(),
			width : me.config.width,
			store : Ext.create("Co.data.TreeStore", {
				url : me.config.url,
				nodeParam : me.config.nodeParam || "node",
				autoLoad : false,
				idProperty : me.config.idProperty
			}),
			listeners : {
				itemclick : function(view, record, item, index, e, eOpts) {
					if (record) {
						var value = record.data[me.config.valueId || me.config.idProperty || "id"];
						var text = record.data.text;
						if (me.config.textEl) {
							if (Ext.isString(me.config.textEl)) {
								me.config.textEl = Ext.getCmp(me.config.textEl);
							}
						} else {
							me.config.textEl = Ext.getCmp("comboBoxTreeTextEl");
						}
						if (me.config.valueEl) {
							if (Ext.isString(me.config.valueEl)) {
								me.config.valueEl = Ext.getCmp(me.config.valueEl);
							}
						} else {
							me.config.valueEl = Ext.getCmp("comboBoxTreeValueEl");
						}
						me.config.textEl.setValue(text);
						me.config.valueEl.setValue(value);
						me.collapse();
					}
				}
			}
		});

		Ext.apply(me, {
			store : Ext.create("Ext.data.SimpleStore", {
				fields : [],
				data : [[]]
			}),
			maxHeight : me.config.maxHeight || 300,
			blankText : me.config.blankText || "不能为空",
			emptyText : me.config.emptyText || "请选择...",
			editable : false,
			queryMode : "local",
			tpl : "<tpl for='.'><div style='height:" + (me.config.maxHeight || 300) + "px;'><div id='" + treeContentEl +"'></div></div></tpl>",
			listeners : {
				select : Ext.emptyFn,
				expand : function(field, opts) {
					tree.getStore().load({
						callback : function() {
							tree.getRootNode().expand(false);
							if (!tree.rendered) {
								tree.render(treeContentEl);
							} else {
								tree.doLayout();
							}

							if (me.config.autoExpand === true) {
								tree.expandAll();
							}
						}
					});
				}
			}
		});
		me.callParent();
	}
});

/**
 * 定义表单窗口
 * @class Co.window.FormWindow
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var window = Ext.create("Co.window.FormWindow", {});
 */
Ext.define("Co.window.FormWindow", {
	extend : "Ext.window.Window",
	alias : "widget.formwindow",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			layout : me.config.layout || "fit",
			width : me.config.width || 500,
			height : me.config.height || 500,
			closeable : true,
			maximizable:true,
			closeAction : me.config.closeAction || "hide",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : false,
			buttonAlign : "center",
			items : me.config.form,
			listeners : Ext.applyIf(me.config.listeners || {}, {
				show : function(win, opts) {
					if (me.config.focusEl) {
						me.config.form.getForm().findField(me.config.focusEl).focus();
					}

					Co.monEnter(me, function(){
						if (me.config && me.config.okHandler) {
							me.config.okHandler();
						}
					});
				}
			}),
			buttons : me.config.buttons || ([{
				text : me.config.saveButtonText || "保存",
				iconCls : "form_saveIcon",
				handler : me.config.okHandler
			},{
				text : me.config.resetButtonText || "重置",
				iconCls : "form_resetIcon",
				hidden : me.config.resetHidden == null ? true : me.config.resetHidden,
						handler : function() {
							Co.resetForm(me.config.realForm || me.config.form);
						}
			},{
				text : me.config.cancelButtonText || "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();
	}
});

/**
 * 定义弹出窗口
 * @class Co.window.Window
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var window = Ext.create("Co.window.Window", {});
 */
Ext.define("Co.window.Window", {
	extend : "Ext.window.Window",
	alias : "widget.cowindow",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			layout : me.config.layout || "fit",
			width : me.config.width || 500,
			height : me.config.height || 500,
			closeable : true,
			maximizable: undefined === me.config.maximizable ? true : me.config.maximizable,
					closeAction : me.config.closeAction || "hide",
					resizable : undefined === me.config.resizable ? false : me.config.resizable,
							modal : undefined === me.config.modal ? true : me.config.modal,
									shadow : undefined === me.config.shadow ? true : me.config.shadow,
											frame : undefined === me.config.frame ? false : me.config.frame,
													border : undefined === me.config.border ? false : me.config.border,
															buttonAlign : "center",
															items : me.config.items,
															buttons : me.config.buttons || ([{
																text : "关闭",
																iconCls : "closeIcon",
																handler : function() {
																	me.close();
																}
															}])
		});

		me.callParent();
	}
});

/**
 * 定义TaskFormWindow，用于工作流中弹窗展示工作任务
 * @class Co.window.TaskFormWindow
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var tree = Ext.create("Co.window.TaskFormWindow", {});
 */
Ext.define("Co.window.TaskFormWindow", {
	extend : "Ext.window.Window",
	alias : "widget.cotaskformwindow",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			layout : me.config.layout || "fit",
			width : me.config.width || 500,
			height : me.config.height || 500,
			closeable : true,
			maximizable:true,
			closeAction : "hide",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : false,
			buttonAlign : "center",
			items : me.config.items,
			buttons : me.config.buttons || ([{
				text : me.config.submitButtonText || "提交",
				iconCls : "form_saveIcon",
				handler : me.config.submitHandler
			},{
				text : me.config.sendbackButtonText || "退回",
				iconCls : "form_resetIcon",
				handler : me.config.sendbackHandler 
			},{
				text : me.config.cancelButtonText || "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();
	}
});

/**
 * 定义表单
 * @class Co.form.Panel
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var form = Ext.create("Co.form.Panel", {});
 */
Ext.define("Co.form.Panel", {
	extend : "Ext.form.Panel",
	alias : "widget.coformpanel",
	config : {},
	/**
	 * 配置项
	 * @param {Object} config 配置项，请参考Ext.form.Panel配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;

		Ext.apply(me, {
			fieldDefaults : {
				labelWidth : me.config.labelWidth || 80,
				labelAlign : me.config.labelAlign || "right",
				anchor : '95%'
			},
			frame : undefined === me.config.frame ? true : me.config.frame,
					border : undefined === me.config.border ? false : me.config.border,
							bodyPadding : 10,
							autoScroll : me.config.autoScroll || true,
							bodyCls: "panel-background-color",
							fieldMapping : me.config.fieldMapping
		});

		me.callParent();
	}
});

/**
 * 定义详情表单
 * @class Co.form.DetailPanel
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var form = Ext.create("Co.form.DetailPanel", {});
 */
Ext.define("Co.form.DetailPanel", {
	extend : "Ext.form.Panel",
	alias : "widget.codetailformpanel",
	config : {},
	/**
	 * 配置项
	 * @param {Object} config 配置项，请参考Ext.form.Panel配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;

		Ext.apply(me, {
			fieldDefaults : {
				labelWidth : 80,
				labelAlign : "right",
				anchor : '98%'
			},
			frame : false,
			border : false,
			bodyPadding : 10,
			autoScroll:true,
			bodyCls: "panel-background-color",
			fieldMapping : me.fieldMapping || me.config.fieldMapping
		});

		me.callParent();
	},
	/**
	 * 加载详情数据
	 * @param {Object} id 数据标识
	 * @param {Function} callback 加载完成回调函数。参数：result, opts。通过result.success可判断数据加载结果，true为成功；false为失败。
	 */
	load : function(id, callback) {
		var me = this;
		var params = {};
		params["model.id"] = id;
		Co.request(me.url, params, function(result,opts){
			if(true === result.success) {
				var model = result.data;
				var fieldMapping = me.fieldMapping || {};
				me.getForm().getFields().each(function(v){
					v.setValue(model[fieldMapping[v.id] ? fieldMapping[v.id] : v.id]);
				});
				if (callback) callback(result, opts);
			} else {
				if (callback) {
					callback(result, opts);
				} else {
					Co.showError(result.msg || "数据加载失败！", null, result);
				}
			}
		}, function(result, opts){
			if (callback) {
				callback(result, opts);
			} else {
				Co.showError(result.msg || "服务端异常，数据加载失败！", null, result);
			}
		}, {
			waitMsg : "正在加载..."
		});
	}
});

/**
 * 定义本地ComboBox
 * @class Co.form.field.ComboBoxLocal
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var combox = Ext.create("Co.form.field.ComboBoxLocal", {});
 */
Ext.define("Co.form.field.ComboBoxLocal", {
	extend : "Ext.form.field.ComboBox",
	alias : "widget.cocomboboxlocal",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.form.field.ComboBox配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			store : Ext.create("Ext.data.ArrayStore", {
				fields : ["text", "value"],
				data : me.config.data
			}),
			mode : "local",
			triggerAction : "all",
			displayField : "text",
			valueField : "value",
			emptyText : me.config.emptyText || "请选择..."
		});

		me.callParent();
	},
	/**
	 * 加载指定的数据
	 * @param {} data
	 */
	load : function(data) {
		this.getStore().proxy.data = data;
		this.getStore().reload();
	}
});

/**
 * 定义字典性质的ComboBox
 * @class Co.form.field.ComboBoxDict
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var combox = Ext.create("Co.form.field.ComboBoxDict", {
 * 		id : "gender",
 * 		name : "model.gender",
 * 		type : "gender"
 * });
 */
Ext.define("Co.form.field.ComboBoxDict", {
	extend : "Ext.form.field.ComboBox",
	alias : "widget.cocomboboxdict",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.form.field.ComboBox配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			store : me.config.type + "Store",
			displayField : "dictText",
			valueField : "dictValue",
			queryMode : "local",
			emptyText : me.config.emptyText || "请选择..."
		});
		me.callParent();
	}
});

/**
 * 定义从服务端加载数据的ComboBox
 * @class Co.form.field.ComboBoxRemote
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var combox = Ext.create("Co.form.field.ComboBoxRemote", {
 * 		autoLoad : true
 * 		url : "getData.action"
 * });
 */
Ext.define("Co.form.field.ComboBoxRemote", {
	extend : "Ext.form.field.ComboBox",
	alias : "widget.cocomboboxremote",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.form.field.ComboBox配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			store : Ext.create("Ext.data.Store", {
				fields : [{name : "text"}, {name : "value"}],
				autoLoad : undefined === me.config.autoLoad ? true : false,
						proxy : {
							type : "ajax",
							url : me.config.url,
							reader : {
								type : "json"
							}
						}
			}),
			displayField : "text",
			valueField : "value",
			triggerAction : me.config.triggerAction || "all",
			emptyText : me.config.emptyText || "请选择..."
		});
		me.callParent();
	},
	/**
	 * 重新加载ComboBox数据
	 * @param {Object} params 参数
	 */
	load : function(params) {
		Co.load(this.getStore(), params);
	}
});
/**
 * 定义字典性质的Radio
 * @class Co.form.field.RadioGroupDict
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var combox = Ext.create("Co.form.field.RadioGroupDict", {
 * 		id : "gender",
 * 		name : "model.gender",
 * 		type : "gender"
 * });
 */
Ext.define("Co.form.field.RadioGroupDict", {
	extend : "Ext.form.RadioGroup",
	alias : "widget.coradiogroupdict",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.form.field.Radio配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		try {
			var me = this;
			var items = [];
			Ext.getStore(me.config.type + "Store").each(function(v){
				items.push({
					boxLabel : v.data.dictText,
					name : me.config.name,
					inputValue : v.data.dictValue
				});
			});
			Ext.apply(me, {items : items});
			me.callParent();
		} catch (e) {

		}
	}
});
/**
 * 定义字典性质的CheckBox
 * @class Co.form.field.CheckboxGroupDict
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var combox = Ext.create("Co.form.field.CheckboxGroupDict", {
 * 		id : "gender",
 * 		name : "model.gender",
 * 		type : "gender"
 * });
 */
Ext.define("Co.form.field.CheckboxGroupDict", {
	extend : "Ext.form.CheckboxGroup",
	alias : "widget.cocheckboxgroupdict",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.form.field.Radio配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var items = [];

		Ext.getStore(me.config.type + "Store").each(function(v){
			items.push({
				boxLabel : v.data.dictText,
				name : me.config.name,
				inputValue : v.data.dictValue
			});
		});

		Ext.apply(me, {items : items});
		me.callParent();
	}
});
/**
 * 定义工具条。工具条支持符号描述功能，如：+：新增，-：修改，*：删除，@：查询，@@：高级查询；支持xtype定义。
 * @class Co.toolbar.Toolbar
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var tbar = Ext.create("Co.toolbar.Toolbar", {
 * 		id : "tbar",
 * 		items : [{
 * 			type : "+",
 * 			handler : addUser
 * 		}]
 * });
 */
Ext.define("Co.toolbar.Toolbar", {
	extend : "Ext.toolbar.Toolbar",
	alias : "widget.cotoolbar",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.toolbar.Toolbar配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var items = me.config.items;
		var realItems = [];
		if (items) {
			if (!Ext.isArray(items)) {
				items = [items];
			}

			//默认情况下取消字体的默认粗体
			var defaultButtonFontDivText = "<span style = 'font-weight:normal;color:black;'>${text}</span>";

			if (Ext.isArray(items)) {
				var isGranted = true;//parent.isGranted || opener.parent.isGranted;
				Ext.each(items, function(v){
					if (Ext.isObject(v)) {
						//if (isGranted(v.rid)) {
						if(true) {
							var type = v.type;
							var handler = v.handler;
							if("+" === type) {
								var text = v.text || "新增";
								var defaultButtonFontDiv = v.defaultButtonFontDiv == undefined ? true : v.defaultButtonFontDiv;
								if(defaultButtonFontDiv){
									text = defaultButtonFontDivText.replace("${text}",text);
								}
								realItems.push({
									text : text,
									iconCls : v.iconCls || "new",
									handler : handler,
									id : v.id,
									rid : v.rid,
									showAtContextMenu : v.showAtContextMenu
								});
							} else if ("-" === type) {
								var text = v.text || "修改";
								var defaultButtonFontDiv = v.defaultButtonFontDiv == undefined ? true : v.defaultButtonFontDiv;
								if(defaultButtonFontDiv){
									text = defaultButtonFontDivText.replace("${text}",text);
								}
								realItems.push({
									text : text,
									iconCls : v.iconCls || "update",
									handler : handler,
									id : v.id,
									rid : v.rid,
									showAtContextMenu : v.showAtContextMenu
								});
							} else if ("*" === type) {
								var text = v.text || "删除";
								var defaultButtonFontDiv = v.defaultButtonFontDiv == undefined ? true : v.defaultButtonFontDiv;
								if(defaultButtonFontDiv){
									text = defaultButtonFontDivText.replace("${text}",text);
								}
								realItems.push({
									text : text,
									iconCls : v.iconCls || "delete",
									handler : handler,
									id : v.id,
									rid : v.rid,
									showAtContextMenu : v.showAtContextMenu
								});
							}else if ("@" === type) {
								var searchField = v.searchField;
								var searchEmptyText = v.searchEmptyText;
								if (searchField) {
									if (!Ext.isArray(searchField)) {
										searchField = [searchField]; 
									}
									if (!Ext.isArray(searchEmptyText)) {
										searchEmptyText = [searchEmptyText];
									}
									var length = searchEmptyText.length;
									var i = 0;
									Ext.each(searchField, function(field){
										var isObject = Ext.isObject(field);
										var fieldName = isObject ? field.name : field;
										var searchObj = {
												xtype : "textfield",
												id : fieldName + "_input_" + Ext.id(),
												name : isObject && false === field.modelSearch ? fieldName : "model." + fieldName,
														emptyText : i < length ? (searchEmptyText[i++] || "") : "",
																enableKeyEvents : true,
																listeners : {
																	specialKey : function(field, e) {
																		Co.checkEnter(field, handler);
																	}
																}
										};
										if (isObject) {
											Ext.applyIf(searchObj, field);
											if (!Co.isEmpty(field.xtype)) {
												Ext.apply(searchObj, {
													xtype : field.xtype
												});
											}
											if (!Co.isEmpty(field.id)) {
												Ext.apply(searchObj, {
													id : field.id
												});
											}
										}
										realItems.push(searchObj);
									});
									if (searchField.length > 0) {
										var text = v.text || "查询";
										var defaultButtonFontDiv = v.defaultButtonFontDiv == undefined ? true : v.defaultButtonFontDiv;
										if(defaultButtonFontDiv){
											text = defaultButtonFontDivText.replace("${text}",text);
										}
										realItems.push({
											text :text,
											iconCls : "query",
											handler : handler
										});
									}
								}
							} else if ("@@" === type) {
								var text = v.text || "高级查询";
								var defaultButtonFontDiv = v.defaultButtonFontDiv == undefined ? true : v.defaultButtonFontDiv;
								if(defaultButtonFontDiv){
									text = defaultButtonFontDivText.replace("${text}",text);
								}
								realItems.push({
									text : text,
									iconCls : "previewIcon",
									handler : handler,
									id : v.id,
									rid : v.rid
								});
							} else {
								var text = v.text;
								var defaultButtonFontDiv = v.defaultButtonFontDiv == undefined ? true : v.defaultButtonFontDiv;
								if(defaultButtonFontDiv){
									text = defaultButtonFontDivText.replace("${text}",text);
								}
								v.text = text;
								realItems.push(v);
							}
						}
					} else {
						realItems.push(v);
					}
				});	
			} 
		}

		Ext.apply(me, {
			items : realItems
		});

		me.callParent();
	}
});

/**
 * 用户选择器
 * @class Co.selector.User
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var userSelector = Ext.create("Co.selector.User", {});
 * userSelector.show();
 */
Ext.define("Co.selector.User", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var API = {
				queryUser : platformRootPath + "/user/query",
				getOrgTreeLeft : platformRootPath + "/org/getOrgTree?showRoot=true&recursion=true",
				getRoleTreeLeft : platformRootPath + "/role/getRoleTree"
		};

		var selectorLeftTypeConfig = me.config.selectorLeftTypeConfig || {};//选择分类配置
		var orgTreePanelConfig = me.config.orgTreePanelConfig || {};//组织树配置
		var roleTreePanelConfig = me.config.roleTreePanelConfig || {};//组织树配置

		/*
		 * 	可支持的参数。
		 *	roleNames 角色名称，多个角色名称用逗号分隔
		 * 
		 */
		var queryParams = me.config.queryParams || {};

		var selectedOrgNo,
		selectedOrgId,
		selectedOrgName,
		selectedRoleId,
		selectedUserNameArray = [],
		selectedRealNameArray = [];
		//============================ Model =========================
		Co.defineModel("User", ["id","username","realName","usrOrgName","usrOrgNo"]);
		Co.defineModel("Role", ["id","roleName","roleType","roleDesc"]);
		//============================ Store =========================
		//定义左侧树Store
		var orgTreeStore = Co.treeStore("orgTreeStore", API.getOrgTreeLeft, {
			nodeParam : "parentOrgNo",
			idProperty : "extraParam1"
		});

		var roleTreeStore = Co.treeStore("roleTreeStore", API.getRoleTreeLeft, {
			idProperty : "id"
		});
		//============================ View =========================
		var orgTreePanel = Co.tree("userSelectorOrgTreePanel", orgTreeStore, {
			title : orgTreePanelConfig.title || "所属科室",
			hidden : orgTreePanelConfig.hidden == null ? false : orgTreePanelConfig.hidden,
			iconCls : "chart_organisationIcon",
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var org = rs[0];
					if (org) {
						selectedOrgNo = org.data.extraParam1;
						selectedOrgName = org.data.text;
						selectedOrgId = org.data.id;
						Co.resetStore(userSelectorUserGridStore);
						var params = {};
						Ext.Object.each(queryParams, function(key, value, me){
							params[key] = value;
						});
						params["orgNo"] = selectedOrgNo;
						Co.load(userSelectorUserGridStore, params);
					}
				}
			}
		}); 

		var roleTreePanel = Co.tree("userSelectorRoleTreePanel", roleTreeStore, {
			title : roleTreePanelConfig.title || "角色",
			hidden : roleTreePanelConfig.hidden || false,
			iconCls : "folder_userIcon",
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var role = rs[0];
					if (role) {
						selectedRoleId = role.data.id;
						Co.resetStore(userSelectorUserGridStore);
						var params = {};
						Ext.Object.each(queryParams, function(key, value, me){
							params[key] = value;
						});
						params["roleId"] = selectedRoleId;
						Co.load(userSelectorUserGridStore, params);
					}
				}
			}
		}); 

		var selectedUserMemo = Ext.create("Ext.form.field.Text", {
			id : "selectedUserMemo",
			editable : false
		});

		var selectedUserIdHidden = Ext.create("Ext.form.field.Hidden", {
			id : "selectedUserIdHidden",
			editable : false
		});

		var userSelectorUserGridStore = Co.gridStore("userSelectorUserGridStore", API.queryUser, "User", {
			autoLoad : false,
			output : "userSelectorTbar",
			pageSize : Co.maxInt,
			sorters : [{
				property : "usr.realName",
				direction : "asc"
			}]
		});

		var userSelectorTbar = Co.toolbar("userSelectorTbar", ["->",{
			type : "@",
			handler : searchUser,
			searchField : ["realName"],
			searchEmptyText : ["请输入姓名..."]
		}
		]);

		var userSelectorColumns = [
//			//Co.gridRowNumberer(),
			{header : "帐号", dataIndex : "username", width : 100, hidden : true,sortable:false},
			{header : "姓名", dataIndex : "realName", width : 100, hidden : false,sortable:false},
			{header : "所属部门", dataIndex : "usrOrgName", width : 230, hidden : false,sortable:false},
			{header : "部门编号", dataIndex : "usrOrgNo", width : 180, hidden : true,sortable:false}
			];

		var userSelectorUserGrid = Co.grid("userSelectorUserGrid", userSelectorUserGridStore, userSelectorColumns, userSelectorTbar, null,{
			checkboxSelMode : me.config.singleSelect === true ? "SINGLE" : "MULTI",
					hideBbar : true,
//					checkOnly : true,
					checkboxModelListeners : {
						select : function(view, record, index, eOpts ) {
							Ext.Array.push(selectedUserNameArray, record.get("username"));
							Ext.Array.push(selectedRealNameArray, record.get("realName"));
							selectedUserMemo.setValue(selectedRealNameArray.join(","));
							selectedUserIdHidden.setValue(selectedUserNameArray.join(","));
						},
						deselect : function(view, record, index, eOpts ) {
							Ext.Array.remove(selectedUserNameArray, record.get("username"));
							Ext.Array.remove(selectedRealNameArray, record.get("realName"));
							selectedUserMemo.setValue(selectedRealNameArray.join(","));
							selectedUserIdHidden.setValue(selectedUserNameArray.join(","));
						},
						itemdblclick : function(view, record) {
							selectUser();
						}
					},
					listeners : {
						itemdblclick : function(view, record) {
							selectUser();
						}
					}
//					,
//					features: [Ext.create("Ext.grid.feature.Grouping", {  
//					groupByText : "用本字段分组",  
//					showGroupsText : "显示分组",  
//					groupHeaderTpl: ["{name:this.getOrgName} ({rows.length})",{
//					getOrgName : function(orgNo) {
//					var record = userSelectorUserGridStore.findRecord("usrOrgNo", orgNo);
//					return record.get("usrOrgName");
//					}
//					}],
//					startCollapsed : false
//					})]
		});  
		Ext.apply(me, {
			title : me.config.title || "选择用户",
			layout : "fit",
			width : me.config.width || 700,
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : [{
				layout : "border",
				border : false,
				items : [{
					region: "west",
					title: "选择分类",
					width : 220,
					iconCls: "expand-allIcon",
					split: true,
					autoScroll: false,
					layout: "accordion",
					collapsible: true,
					margins: "0 0 0 2",
					layoutConfig: {
						animate: true
					},
					hidden : selectorLeftTypeConfig.hidden || false,
					items: [orgTreePanel, roleTreePanel]
				},{
					region : "center",
					items : userSelectorUserGrid,
					layout : "fit",
					frame : false
				},{
					region : "south",
					layout : "fit",
					items : selectedUserMemo,
					frame : false,
					border : false
				}]
			}],
			listeners : {
				show : function() {
					var params = {};
					Ext.Object.each(queryParams, function(key, value, me){
						params[key] = value;
					});

					if ("role" === me.config.activeItem) {
						roleTreePanel.expand();
						if (me.config.roleId) {
							params["roleId"] = me.config.roleId;
							Co.load(userSelectorUserGridStore, params);
						}
					} else {
						if (me.config.orgId) {
							params["model.orgId"] = me.config.orgId;
							Co.load(userSelectorUserGridStore, params);
						} else {
							Co.load(userSelectorUserGridStore, params);
						}
					}
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectUser
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function searchUser() {
			var params = {};
			Ext.Object.each(queryParams, function(key, value, me){
				params[key] = value;
			});
			if (me.config.orgId) {
				params["model.orgId"] = me.config.orgId || null;
			}
			Co.load(userSelectorUserGridStore, params);
		}

		function selectUser() {
			var callback = me.config.callback;
			if (callback) {
				callback(selectedUserIdHidden.getValue(), selectedUserMemo.getValue());
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(selectedUserIdHidden.getValue());
				}
				if (displayField) {
					displayField.setValue(selectedUserMemo.getValue());
				}
			}
			me.close();
		}
	}
});

/**
 * 角色选择器
 * @class Co.selector.Role
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var roleSelector = Ext.create("Co.selector.Role", {});
 * roleSelector.show();
 */
Ext.define("Co.selector.Role", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 组件初始化
	 */
	initComponent : function() {
		var me = this;
		var API = {
				queryRole : platformRootPath + "/role/queryRole"
		};
		//============================ Model =========================
		Co.defineModel("Role", ["id","roleName"]);
		//============================ Store =========================
		var roleSelectorRoleGridStore = Co.gridStore("roleSelectorRoleGridStore", API.queryRole, "Role", {
			autoLoad : false,
			output : "roleSelectorTbar",
			pageSize : Co.maxInt,
			sorters : [{
				property : "createTime",
				direction : "desc"
			}]
		}); 
		var roleSelectorTbar = Co.toolbar("roleSelectorTbar", [{
			id : "selectCountLabel",
			xtype : "label",
			text : "已选择 0 个角色",
			hidden : true
		},"->",{
			type : "@",
			handler : searchRole,
			searchField : ["roleName"],
			searchEmptyText : ["请输入角色名称..."]
		}
		],{
			margin : "0 0 0 10"
		});

		var selectCountLabel = Ext.getCmp("selectCountLabel");

		var roleSelectorColumns = [
//			//Co.gridRowNumberer(),
			{header : "角色名称", dataIndex : "roleName", width : 350, hidden : false}
			];

		var roleSelectorRoleGrid = Co.grid("roleSelectorRoleGrid", roleSelectorRoleGridStore, roleSelectorColumns, roleSelectorTbar, null,{
			hideBbar : true,
			checkOnly : true,
			listeners : {
				select: function() {
					updateSelectCountLabel();
				},
				deselect : function() {
					updateSelectCountLabel();
				}
			}
		});  

		Ext.apply(me, {
			title : me.config.title || "选择角色",
			layout : "fit",
			width : me.config.width || 500, 
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : roleSelectorRoleGrid,
			listeners : {
				show : function() {
					Co.load(roleSelectorRoleGridStore);
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectRole
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function searchRole() {
			Co.load(roleSelectorRoleGridStore);
		}

		function updateSelectCountLabel() {
			selectCountLabel.setText("已选择 " + Co.getSelRecCount(roleSelectorRoleGrid) + " 个角色");
		}

		function selectRole() {
			var records = Co.getSelRec(roleSelectorRoleGrid);
			var roleIds = [];
			var roleNames = [];
			Ext.each(records, function(v){
				roleIds.push(v.data.id); 
				roleNames.push(v.data.roleName);
			});
			var callback = me.config.callback;
			if (callback) {
				callback(roleIds.join(","), roleNames.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(roleIds.join(","));
				}
				if (displayField) {
					displayField.setValue(roleNames.join(","));
				}
			}
			me.close();
		}
	}
});

/**
 * 所属科室选择器
 * @class Co.selector.Org
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var orgSelector = Ext.create("Co.selector.Org", {});
 * orgSelector.show();
 */
Ext.define("Co.selector.Org", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 组件初始化
	 */
	initComponent : function() {
		var me = this;
		var checkbox = true === me.config.checkbox || "true" === me.config.checkbox || "TRUE" === me.config.checkbox ? true : false;

		var API = {
				getOrgTreeAll : platformRootPath+"/org/getOrgTree?showRoot=true&recursion=true" + (checkbox ? "&checkbox=" + checkbox : "")
		};
		var selectedOrgNo;
		var selectedOrgName;
		var selectedOrgId;
		var checkedOrgIds = [], checkedOrgNames = [], checkedOrgNos = [];

		//定义OrgTreeStore
		var orgTreeStore = Co.treeStore("orgTreeStore_" + Ext.id(), API.getOrgTreeAll, {
			autoLoad : false,
			listeners : {
				load : function(){
					//默认选中
//					var record = this.getRootNode().getChildAt(0)
					var record = this.getNodeById(me.config.checkOrgId);
					var ss = orgTreePanel.getSelectionModel();
					ss.select(record);
				}
			}
		});
		//============================ View =========================
		var selectedOrgMemo = Ext.create("Ext.form.field.Text", {
			id : "selectedOrg",
			editable : false
		});

		//定义OrgTree
		var orgTreePanel = Co.tree("orgTreePanel_" + Ext.id(), orgTreeStore, {
			viewConfig : {
				loadMask : {
					msg : "正在加载..."
				}
			},
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					if (!checkbox) {
						var org = rs[0];
						if (org) {
							checkedOrgIds = [];
							checkedOrgNames = [];
							checkedOrgNos = [];
							checkedOrgIds.push(org.data.id);
							checkedOrgNames.push(org.data.text);
							checkedOrgNos.push(org.data.extraParam1);
							selectedOrgMemo.setValue(checkedOrgNames.join(","));
						}
					}
				},
				checkchange : function(node, checked) {
					if (checkbox) {
						if (checked) {
							checkedOrgIds.push(node.data.id);
							checkedOrgNames.push(node.data.text);
							checkedOrgNos.push(node.data.extraParam1);
						} else {
							Ext.Array.remove(checkedOrgIds, node.data.id);
							Ext.Array.remove(checkedOrgNames, node.data.text);
							Ext.Array.remove(checkedOrgNos, node.data.extraParam1);
						}
						selectedOrgMemo.setValue(checkedOrgNames.join(","));
					}
				},
				celldblclick : function(view, record) {//双击事件
					selectOrg();
				}
			}
		}); 

		Ext.apply(me, {
			title : me.config.title || "选择所属科室",
			layout : "fit",
			width : me.config.width || 500, 
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : [{
				layout : "border",
				items : [{
					region : "center",
					items : orgTreePanel,
					layout : "fit",
					frame : false,
					border : false
				},{
					region : "south",
					items : selectedOrgMemo,
					layout : "fit",
					frame : false,
					border : false
				}],
				border : false
			}],
			listeners : {
				show : function() {
					orgTreeStore.load({
						params : me.config.params,
						callback : function() {
							orgTreePanel.getRootNode().expand(false);
							orgTreePanel.doLayout();
							orgTreePanel.getRootNode().expand(true);
						}
					});
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectOrg
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function selectOrg() {
			var callback = me.config.callback;
			if (callback) {
				callback(checkedOrgIds.join(","), checkedOrgNames.join(","), checkedOrgNos.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(checkedOrgIds.join(","));
				}
				if (displayField) {
					displayField.setValue(checkedOrgNames.join(","));
				}
			}
			me.close();
		}
	}
});

/**
 * 样品分类选择器
 * @class Co.selector.SampleClass
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var sampleClassSelector = Ext.create("Co.selector.SampleClass", {});
 * sampleClassSelector.show();
 */
Ext.define("Co.selector.SampleClass", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 组件初始化
	 */
	initComponent : function() {
		var me = this;
		var orgId = me.config.orgId;
		var orgName = me.config.orgName;

		var API = {
//				getOrgTreeAll : "org!getOrgTree.action?showRoot=true&recursion=true&single=true",
//				getSampleTree : "sample_class!getSampleClassTree.action"
				getOrgTreeAll : ModuleServiceInterface.getOrgTree+"?showRoot=true&recursion=true&single=true",
				getSampleTree : ModuleServiceInterface.getSampleClassTree
		};
		var selectedSampleClassNo;
		var selectedSampleClassName;
		var selectedSampleClassId;

		//定义OrgTreeStore
		var orgTreeStore = Co.treeStore("orgTreeStore_" + Ext.id(), API.getOrgTreeAll, {
			autoLoad : false,
			listeners : {
				load : function(){
					var ss = orgTreePanel.getSelectionModel();
					//默认选中
					var record;
					if(me.config.selectedOrgId){//默认选中的组织id
						record = this.getNodeById(me.config.selectedOrgId);
					} else {//默认选中第一个
						record = this.getRootNode().getChildAt(0);
					}
					ss.select(record);
				}
			}
		});
		//============================ View =========================
		var selectedSampleClassMemo = Ext.create("Ext.form.field.Text", {
			id : "selectedSampleClass",
			editable : false
		});

		//定义OrgTree
		var orgTreePanel = Co.tree("orgTreePanel_" + Ext.id(), orgTreeStore, {
			width : 250,
			height : 406,
			viewConfig : {
				loadMask : {
					msg : "正在加载..."
				}
			},
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var org = rs[0];
					if (org) {
						orgId = org.data.id;
						sampleClassTreePanel.setTitle("已选中【" + org.data.text + "】");


						var selModel = sampleClassTree.getSelectionModel();
						sampleClassTreeStore.load({
							params : {"orgId" : orgId},
							callback : function() {
								var r = sampleClassTree.getRootNode();
								sampleClassTree.getRootNode().expand(false);
								sampleClassTree.doLayout();
								sampleClassTree.getRootNode().expand();
							}
						});


					}
				}
			}
		}); 

		var sampleClassTreeStore = Co.treeStore("sampleClassTreeStore_" + Ext.id(), API.getSampleTree, {
			autoLoad : false,
			listeners : {
				load : function(){
					//默认选中
//					var record = this.getRootNode().getChildAt(0)
					var record = this.getNodeById(me.config.checkSampleClassId);
					var ss = sampleClassTree.getSelectionModel();
					ss.select(record);
				}
			}
		});

		var sampleClassTree = Co.gridTree("sampleClassTree_" + Ext.id(), sampleClassTreeStore, [{
			header : "名称",
			width : 350,
			dataIndex : "text"
		}],{
			viewConfig : {
				loadMask : {
					msg : "正在加载..."
				}
			},
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var sc = rs[0];
					if (sc) {
						selectedSampleClassNo = sc.data.extraParam1;
//						selectedSampleClassName = sc.data.text;//这个值待序号
						selectedSampleClassId = sc.data.id;
						selectedSampleClassName = sc.data.extraParam2;//不带序号的值

						selectedSampleClassMemo.setValue(selectedSampleClassName);
					}
				},
				celldblclick : function(view, record) {//双击事件
					selectSampleClass();
				}
			}
		});

		var sampleClassTreePanel = Ext.create("Ext.panel.Panel",{
			title : "已选中【" + orgName + "】",
			layout : "fit",
			items : sampleClassTree
		});

		Ext.apply(me, {
			title : me.config.title || "选择样品分类",
			layout : "fit",
			width : me.config.width || 650, 
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : [{
				layout : "border",
				items : [{
					region : "west",
					layout : "fit",
					title : "所属科室",  
					items : orgTreePanel,
					collapsible : true,
					split : true
				},{
					region : "center",
					items : sampleClassTreePanel,
					layout : "fit",
					frame : false,
					border : false
				},{
					region : "south",
					layout : "fit",
					items : selectedSampleClassMemo,
					frame : false,
					border : false,
					hidden : true
				}],
				border : false
			}],
			listeners : {
				show : function() {
					orgTreeStore.load({
						params : {"parentOrgNo" : me.config.parentOrgNo || "-1"},
						callback : function() {
							orgTreePanel.getRootNode().expand(false);
							orgTreePanel.doLayout();
							orgTreePanel.getRootNode().expand(me.config.parentOrgNo ? true : false);
						}
					});
					//这里不用在加载。orgTree默认选中时就会加载
					/*sampleClassTreeStore.load({
						params : {"orgId" : orgId},
						callback : function() {
							var r = sampleClassTree.getRootNode();
							sampleClassTree.getRootNode().expand(false);
							sampleClassTree.doLayout();
							sampleClassTree.getRootNode().expand();
						}
					});*/
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectSampleClass
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function selectSampleClass() {
			var callback = me.config.callback;
			if (callback) {
				callback(selectedSampleClassId, selectedSampleClassName, selectedSampleClassNo);
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(selectedSampleClassId);
				}
				if (displayField) {
					displayField.setValue(selectedSampleClassName);
				}
			}
			me.close();
		}
	}
});

/**
 * 项目选择器
 * @class Co.selector.Project
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var projectSelector = Ext.create("Co.selector.Project", {});
 * projectSelector.show();
 */
Ext.define("Co.selector.Project", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 组件初始化
	 */
	initComponent : function() {
		var me = this,
		sampleClassId = me.config.sampleClassId,
		poaId = me.config.poaId,
		sampleId = me.config.sampleId;

		var API = {
//				queryPoaProject : "project!queryPoaProject.action",
//				retrievePoaProject : "poa_project!retrievePoaProject.action"
				queryPoaProject : ModuleServiceInterface.queryPoaProject,
				retrievePoaProject : ModuleServiceInterface.retrievePoaProject
		};

		//============================ Model =========================
		Co.defineModel("Project", ["id","projectNo","projectName","projectRemark"]);
		//============================ Store =========================
		var projectSelectorProjectGridStore = Co.gridStore("projectSelectorProjectGridStore", API.queryPoaProject, "Project", {
			autoLoad : false,
			sorters : [{
				property : "projectNo",
				direction : "asc"
			}],
			pageSize : Co.maxInt
		});

		var projectSelectorColumns = [
//			//Co.gridRowNumberer(),
			{header : "id", dataIndex : "id", width : 90, hidden : true},
			{header : "项目名称", dataIndex : "projectName", width : 300, hidden : false},
			{header : "项目备注", dataIndex : "projectRemark", width : 200, hidden : false, editor : {
				xtype : "textfield",
				maxLength : 200,
				maxLengthText : "项目备注最多200个字符！",
				enforceMaxLength : true
			}}
			];

		var projectSelectorProjectGrid = Co.grid("projectSelectorProjectGrid", projectSelectorProjectGridStore, projectSelectorColumns, null, null,{
			hideBbar : true,
			checkOnly : true,
			plugins : [
				Ext.create("Ext.grid.plugin.CellEditing", {
					clicksToEdit : 1
				})
				]
		});

		Ext.apply(me, {
			title : me.config.title || "选择检测项目",
			layout : "fit",
			width : me.config.width || 600, 
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : projectSelectorProjectGrid,
			listeners : {
				show : function() {
					Co.load(projectSelectorProjectGridStore, {"sampleClassId" : sampleClassId}, function(){
						//根据sampleClassId和poaId获得已保存的项目，并自动勾选
						Co.request(API.retrievePoaProject, {"sampleId" : sampleId, "poaId" : poaId}, function(result, opts){
							if (result.success) {
								var selModel = projectSelectorProjectGrid.getSelectionModel();
								selModel.deselectAll();
								//获得选中的项目ID
								var projects = result.msg;
								if (!Co.isEmpty(projects)) {
									projects = eval("(" + projects + ")");
									Ext.each(projects, function(project){
										var index = projectSelectorProjectGridStore.find("id", project.id);
										if (-1 != index) {
											selModel.select(index, true);
											projectSelectorProjectGridStore.getAt(index).set("projectRemark", project.projectRemark);
										}
									});
								}
							}
						},null,{
							showWait : false
						});
					});
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectTestProject
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function selectTestProject() {
			var records = Co.getSelRec(projectSelectorProjectGrid);
			if (records.length == 0) {
				Co.showError("请选择检测项目！");
				return false;
			}
			if (records.length < projectSelectorProjectGridStore.getCount()) {
				Co.confirm("您选择的试验项目数量为【" + records.length + "】个，确定吗？", function(btn){
					if (btn === "yes") {
						doSelectTestProject(records);
					}
				});
			} else {
				doSelectTestProject(records);
			}
		}

		function doSelectTestProject(records) {
			var projectIds = [];
			var projectNames = [];
			var projectRemarks = [];
			var projectArray = [];
			Ext.each(records, function(v){
				projectIds.push(v.data.id); 
				projectNames.push(v.data.projectName);
				projectRemarks.push(v.data.projectRemark);
				projectArray.push(v.data);
			});
			var callback = me.config.callback;
			if (callback) {
				callback(projectIds.join(","), projectNames.join(","), projectRemarks.join(","), projectArray);
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(projectIds.join(","));
				}
				if (displayField) {
					displayField.setValue(projectNames.join(","));
				}
			}
			me.close();
		}
	}
});

/**
 * 项目选择器(按所属科室选择)
 * @class Co.selector.ProjectByOrg
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var projectSelector = Ext.create("Co.selector.ProjectByOrg", {});
 * projectSelector.show();
 */
Ext.define("Co.selector.ProjectByOrg", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 组件初始化
	 */
	initComponent : function() {
		var me = this;
		var me = this;
		var orgId = me.config.orgId;
		var orgName = me.config.orgName;

		var API = {
				getOrgTreeAll : ModuleServiceInterface.getOrgTree+"?showRoot=true&recursion=true&single=true",
				queryProjectByOrgId : ModuleServiceInterface.queryProject
		};

		//============================ Model =========================
		Co.defineModel("Project", ["id","projectNo","projectName"]);
		//============================ Store =========================
		var projectSelectorProjectGridStore = Co.gridStore("projectSelectorProjectGridStore_" + Ext.id(), API.queryProjectByOrgId, "Project", {
			autoLoad : false,
			sorters : [{
				property : "projectNo",
				direction : "asc"
			}],
			pageSize : Co.maxInt
		});

		//定义OrgTreeStore
		var orgTreeStore = Co.treeStore("orgTreeStore_" + Ext.id(), API.getOrgTreeAll, {
			autoLoad : false
		});

		//============================ View =========================
		//定义OrgTree
		var orgTreePanel = Co.tree("orgTreePanel_" + Ext.id(), orgTreeStore, {
			width : 250,
			height : 406,
			viewConfig : {
				loadMask : {
					msg : "正在加载..."
				}
			},
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var org = rs[0];
					if (org) {
						orgId = org.data.id;
						projectGridPanel.setTitle("已选中【" + org.data.text + "】");
						Co.load(projectSelectorProjectGridStore, {"orgId" : orgId},function(){
							var selModel = projectSelectorProjectGrid.getSelectionModel();
							//默认勾选
							if(me.config.checkProjectIds){
								//获得选中的项目ID
								Ext.each(me.config.checkProjectIds, function(projectId){
									var index = projectSelectorProjectGridStore.find("id", projectId);
									if (-1 != index) {
										selModel.select(index, true);
										//expertSelectorGridStore.getAt(index).set("projectRemark", project.projectRemark);
									}
								});
							}
						});
					}
				},
				load : function(){
					//默认选中
					var record = this.getRootNode().getChildAt(0)
					//var record = this.getNodeById(defaultSelectedRemindName || selectedRemindName);
					var ss = orgTreePanel.getSelectionModel();
					ss.select(record);
				}
			}
		}); 

		var projectSelectorColumns = [
//			//Co.gridRowNumberer(),
			{header : "id", dataIndex : "id", width : 90, hidden : true},
			{header : "项目名称", dataIndex : "projectName", width : 300, hidden : false}
			];

		var projectSelectorProjectGrid = Co.grid("projectSelectorProjectGrid_" + Ext.id(), projectSelectorProjectGridStore, projectSelectorColumns, null, null,{
			checkOnly : false,
			hideBbar : true,
			listeners : {
				itemdblclick : function(view, record) {
					selectProject();
				},
			}
		});

		var projectGridPanel = Ext.create("Ext.panel.Panel",{
			title : "已选中【" + orgName + "】",
			layout : "fit",
			items : projectSelectorProjectGrid
		});

		Ext.apply(me, {
			title : me.config.title || "选择检测项目",
			layout : "fit",
			width : me.config.width || 680, 
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : [{
				layout : "border",
				items : [{
					region : "west",
					layout : "fit",
					title : "所属科室",  
					items : orgTreePanel,
					collapsible : true,
					split : true
				},{
					region : "center",
					items : projectGridPanel,
					layout : "fit",
					frame : false,
					border : false
				}],
				border : false
			}],
			listeners : {
				show : function() {
					orgTreeStore.load({
						params : {"parentOrgNo" : me.config.parentOrgNo || "-1"},
						callback : function() {
							orgTreePanel.getRootNode().expand(false);
							orgTreePanel.doLayout();
							orgTreePanel.getRootNode().expand(me.config.parentOrgNo ? true : false);
						}
					});
					Co.load(projectSelectorProjectGridStore, me.config.orgId ? {"orgId" : me.config.orgId} : "-1");
				},
				itemdblclick : function(view, record) {
					selectProject();
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectProject
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function selectProject() {
			var records = Co.getSelRec(projectSelectorProjectGrid);
			var projectIds = [];
			var projectNames = [];
			Ext.each(records, function(v){
				projectIds.push(v.data.id); 
				projectNames.push(v.data.projectName);
			});
			var callback = me.config.callback;
			if (callback) {
				callback(projectIds.join(","), projectNames.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(projectIds.join(","));
				}
				if (displayField) {
					displayField.setValue(projectNames.join(","));
				}
			}
			me.close();
		}
	}
});

/**
 * 设备选择器
 * @class Co.selector.Device
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var deviceSelector = Ext.create("Co.selector.Device", {});
 * deviceSelector.show();
 */
Ext.define("Co.selector.Device", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var API = {
				queryDevice : "device_info!querySelectorDevice.action"
		};
		//============================ Model =========================
		Co.defineModel("Device", ["id","deviceNo","filesNo","isSource","deviceName","productNo","manufacturer","specification","deviceModel","measureName","measureRange","accuracyGrade","sourceUnit","sourceCycle","sourcePlanTime","sourceTime","sourceResult","verificationNo","buyDate","price","producerID","storePlace","acceptTime","acceptState","deviceState","keeper","fixedAssetNo","remark","groupID","labID","expDate","deviceinfoOrgName"]);
		//============================ Store =========================
		var deviceGridStore = Co.gridStore("deviceGridStore", API.queryDevice, "Device", {
			autoLoad : false,
			sorters : [{
				property : "deviceno",
				direction : "asc"
			}],
			groupField : "deviceinfoOrgName",
			pageSize : Co.maxInt
		}); 	

		var columns = [
//			//Co.gridRowNumberer(),
			{header : "id", dataIndex : "id", width : 34, hidden : true},
			{header : "设备编号", dataIndex : "deviceNo", width : 100, hidden : false},
			{header : "设备名称", dataIndex : "deviceName", width : 250, hidden : false},
			{header : "型号", dataIndex : "deviceModel", width : 100, hidden : false},
			{header : "出厂编号", dataIndex : "productNo", width : 100, hidden : false},
			{header : "有效期", dataIndex : "expDate", width : 100, hidden : false, renderer : function(v){
				var today = Ext.Date.format(new Date(), Co.dateFormat);
				var warnDay = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.MONTH, 2), Co.dateFormat);
				if (v < today) {
					return "<font color='red'>" + v + "</font>";
				} else if (v <= warnDay) {
					return "<font color='green'>" + v + "</font>";
				}
				return v;
			}}
			];

		var deviceGrid = Co.grid("deviceGrid", deviceGridStore, columns, null, null, {
			checkOnly : false,
			hideBbar : true,
			features: [Ext.create("Ext.grid.feature.Grouping", {  
				groupByText : "用本字段分组",  
				showGroupsText : "显示分组",  
				groupHeaderTpl: ["{name} ({rows.length})"],
				startCollapsed : false
			})],
			listeners : {
				select : function(grid, record) {
					var today = Ext.Date.format(new Date(), Co.dateFormat);
					if (record.data.expDate < today) {
						deviceGrid.getSelectionModel().deselect(record);
					}
				},
				itemdblclick : function(view, record) {
					selectDevice();
				},
			}
		});

		Ext.apply(me, {
			title : me.config.title || "选择设备",
			layout : "fit",
			width : me.config.width || 750,
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : deviceGrid,
			listeners : {
				show : function() {
					Co.load(deviceGridStore, {"model.groupID" : me.config.orgId, "projectId" : me.config.projectId, "sampleClassId" : me.config.sampleClassId});
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectDevice
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function selectDevice() {
			var records = Co.getSelRec(deviceGrid);
			var deviceIds = [];
			var deviceNames = [];
			Ext.each(records, function(v){
				deviceIds.push(v.data.id); 
				deviceNames.push(v.data.deviceName);
			});
			var callback = me.config.callback;
			if (callback) {
				callback(deviceIds.join(","), deviceNames.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(deviceIds.join(","));
				}
				if (displayField) {
					displayField.setValue(deviceNames.join(","));
				}
			}
			me.close();
		}
	}
});

/**
 * 设备选择器(按所属科室选择)
 * @class Co.selector.DeviceByOrg
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var deviceSelector = Ext.create("Co.selector.DeviceByOrg", {});
 * deviceSelector.show();
 */
Ext.define("Co.selector.DeviceByOrg", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 组件初始化
	 */
	initComponent : function() {
		var me = this;
		var me = this;
		var orgId = me.config.orgId;
		var orgName = me.config.orgName;

		var API = {
				getOrgTreeAll : ModuleServiceInterface.getOrgTree+"?showRoot=true&recursion=true&single=true",
				queryDevice : ModuleServiceInterface.queryDevice
		};
		var tbarId = "deviceTbar_" + Ext.id();
		//============================ Model =========================
		Co.defineModel("Device", ["id","deviceNo","filesNo","isSource","deviceName","productNo","manufacturer","specification","deviceModel","measureName","measureRange","accuracyGrade","sourceUnit","sourceCycle","sourcePlanTime","sourceTime","sourceResult","verificationNo","buyDate","price","producerID","storePlace","acceptTime","acceptState","deviceState","keeper","fixedAssetNo","remark","groupID","labID","expDate","deviceinfoOrgName"]);
		//============================ Store =========================
		var deviceGridStore = Co.gridStore("deviceGridStore", API.queryDevice, "Device", {
			autoLoad : false,
			output : tbarId,
			sorters : [{
				property : "deviceno",
				direction : "asc"
			}],
			pageSize : Co.maxInt
		}); 	

		var columns = [
//			//Co.gridRowNumberer(),
			{header : "id", dataIndex : "id", width : 34, hidden : true},
			//{header : "设备编号", dataIndex : "deviceNo", width : 100, hidden : false},
			{header : "设备控制编号", dataIndex : "deviceNo", width : 100, hidden : false},
			{header : "设备名称", dataIndex : "deviceName", width : 250, hidden : false},
			{header : "型号", dataIndex : "deviceModel", width : 100, hidden : false},
			{header : "出厂编号", dataIndex : "productNo", width : 100, hidden : false},
			{header : "有效期", dataIndex : "expDate", width : 100, hidden : false, renderer : function(v){
				var today = Ext.Date.format(new Date(), Co.dateFormat);
				var warnDay = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.MONTH, 2), Co.dateFormat);
				if (v < today) {
					return "<font color='red'>" + v + "</font>";
				} else if (v <= warnDay) {
					return "<font color='orange'>" + v + "</font>";
				}
				return v;
			}}
			];

		var tbar = Co.toolbar(tbarId, ["->",{
			type : "@",
			searchField : ["deviceName"],
			searchEmptyText : ["请输入设备名称..."],
			handler : searchDevice
		}]);

		var deviceGrid = Co.grid("deviceGrid_" + Ext.id(), deviceGridStore, columns, tbar, null, {
			checkOnly : false,
			hideBbar : true,
			listeners : {
				itemdblclick : function(view, record) {
					selectDevice();
				},
			}
		});

		//定义OrgTreeStore
		var orgTreeStore = Co.treeStore("orgTreeStore_" + Ext.id(), API.getOrgTreeAll, {
			autoLoad : false
		});

		//============================ View =========================
		//定义OrgTree
		var orgTreePanel = Co.tree("orgTreePanel_" + Ext.id(), orgTreeStore, {
			width : 250,
			height : 406,
			viewConfig : {
				loadMask : {
					msg : "正在加载..."
				}
			},
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var org = rs[0];
					if (org) {
						orgId = org.data.id;
						deviceGridPanel.setTitle("已选中【" + org.data.text + "】");
						Co.load(deviceGridStore, {"orgId" : orgId});
					}
				},load : function(){
					//默认选中
					var record = this.getRootNode().getChildAt(0)
					//var record = this.getNodeById(defaultSelectedRemindName || selectedRemindName);
					var ss = orgTreePanel.getSelectionModel();
					ss.select(record);
				}
			}
		}); 

		var deviceGridPanel = Ext.create("Ext.panel.Panel",{
			title : "已选中【" + orgName + "】",
			layout : "fit",
			items : deviceGrid
		});

		Ext.apply(me, {
			title : me.config.title || "选择设备",
			layout : "fit",
			width : me.config.width || 780, 
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : [{
				layout : "border",
				items : [{
					region : "west",
					layout : "fit",
					title : "所属科室",  
					items : orgTreePanel,
					collapsible : true,
					split : true
				},{
					region : "center",
					items : deviceGridPanel,
					layout : "fit",
					frame : false,
					border : false
				}],
				border : false
			}],
			listeners : {
				show : function() {
					orgTreeStore.load({
						params : {"parentOrgNo" : me.config.parentOrgNo || "-1"},
						callback : function() {
							orgTreePanel.getRootNode().expand(false);
							orgTreePanel.doLayout();
							orgTreePanel.getRootNode().expand(me.config.parentOrgNo ? true : false);
						}
					});
					//Co.load(deviceGridStore, me.config.orgId ? {"orgId" : me.config.orgId} : "-1");
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectDevice
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function selectDevice() {
			var records = Co.getSelRec(deviceGrid);
			var deviceIds = [];
			var deviceNames = [];
			Ext.each(records, function(v){
				deviceIds.push(v.data.id); 
				deviceNames.push(v.data.deviceName);
			});
			var callback = me.config.callback;
			if (callback) {
				callback(deviceIds.join(","), deviceNames.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(deviceIds.join(","));
				}
				if (displayField) {
					displayField.setValue(deviceNames.join(","));
				}
			}
			me.close();
		}

		function searchDevice() {
			Co.load(deviceGridStore);
		}
	}
});
/**
 * 部门用户选择器
 * @class Co.selector.User
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var groupUserSelector = Ext.create("Co.selector.GroupUser", {});
 * groupUserSelector.show();
 */
Ext.define("Co.selector.GroupUser", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var API = {
				queryUser : ModuleServiceInterface.queryUser,
				getOrgTreeLeft : ModuleServiceInterface.getOrgTree+"?showRoot=true&recursion=true"
		};
		var selectedOrgNo,
		selectedOrgId,
		selectedOrgName,
		selectedRoleId,
		selectedUserNameArray = [],
		selectedRealNameArray = [];
		//============================ Model =========================
		Co.defineModel("User", ["id","username","realName","usrOrgName","usrOrgNo"]);
		//============================ Store =========================
		//定义左侧树Store
		var orgTreeStore = Co.treeStore("orgTreeStore", API.getOrgTreeLeft, {
			nodeParam : "parentOrgNo",
			idProperty : "extraParam1"
		});
		//============================ View =========================
		var orgTreePanel = Co.tree("userSelectorOrgTreePanel", orgTreeStore, {
			title : "组织架构",
			iconCls : "chart_organisationIcon",
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var org = rs[0];
					if (org) {
						selectedOrgNo = org.data.extraParam1;
						selectedOrgName = org.data.text;
						selectedOrgId = org.data.id;
						Co.resetStore(userSelectorUserGridStore);
						Co.load(userSelectorUserGridStore, {"orgNo" : selectedOrgNo});
					}
				}
			}
		}); 

		var selectedUserMemo = Ext.create("Ext.form.field.Text", {
			id : "selectedUserMemo",
			editable : false
		});

		var selectedUserIdHidden = Ext.create("Ext.form.field.Hidden", {
			id : "selectedUserIdHidden",
			editable : false
		});

		var userSelectorUserGridStore = Co.gridStore("userSelectorUserGridStore", API.queryUser, "User", {
			autoLoad : false,
			output : "userSelectorTbar",
			pageSize : Co.maxInt,
			sorters : [{
				property : "usr.realName",
				direction : "asc"
			}]
		});

		var userSelectorTbar = Co.toolbar("userSelectorTbar", ["->",{
			type : "@",
			handler : searchUser,
			searchField : ["realName"],
			searchEmptyText : ["请输入姓名..."]
		}
		]);

		var userSelectorColumns = [
//			//Co.gridRowNumberer(),
			{header : "帐号", dataIndex : "username", width : 100, hidden : false},
			{header : "姓名", dataIndex : "realName", width : 100, hidden : false},
			{header : "所属部门", dataIndex : "usrOrgName", width : 180, hidden : false},
			{header : "部门编号", dataIndex : "usrOrgNo", width : 180, hidden : true}
			];

		var userSelectorUserGrid = Co.grid("userSelectorUserGrid", userSelectorUserGridStore, userSelectorColumns, userSelectorTbar, null,{
			checkboxSelMode : me.config.singleSelect === true ? "SINGLE" : "MULTI",
					hideBbar : true,
//					checkOnly : true,
					checkboxModelListeners : {
						select : function(view, record, index, eOpts ) {
							Ext.Array.push(selectedUserNameArray, record.get("username"));
							Ext.Array.push(selectedRealNameArray, record.get("realName"));
							selectedUserMemo.setValue(selectedRealNameArray.join(","));
							selectedUserIdHidden.setValue(selectedUserNameArray.join(","));
						},
						deselect : function(view, record, index, eOpts ) {
							Ext.Array.remove(selectedUserNameArray, record.get("username"));
							Ext.Array.remove(selectedRealNameArray, record.get("realName"));
							selectedUserMemo.setValue(selectedRealNameArray.join(","));
							selectedUserIdHidden.setValue(selectedUserNameArray.join(","));
						}
					}
//		,
//		features: [Ext.create("Ext.grid.feature.Grouping", {  
//		groupByText : "用本字段分组",  
//		showGroupsText : "显示分组",  
//		groupHeaderTpl: ["{name:this.getOrgName} ({rows.length})",{
//		getOrgName : function(orgNo) {
//		var record = userSelectorUserGridStore.findRecord("usrOrgNo", orgNo);
//		return record.get("usrOrgName");
//		}
//		}],
//		startCollapsed : false
//		})]
		});  
		Ext.apply(me, {
			title : me.config.title || "选择用户",
			layout : "fit",
			width : me.config.width || 700,
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : [{
				layout : "border",
				border : false,
				items : [{
					region: "west",
					title: "选择分类",
					width : 220,
					iconCls: "expand-allIcon",
					split: true,
					autoScroll: false,
					layout: "accordion",
					collapsible: true,
					margins: "0 0 0 2",
					id : "orgTreePanel",
					layoutConfig: {
						animate: true
					},
					items: [orgTreePanel]
				},{
					region : "center",
					items : userSelectorUserGrid,
					layout : "fit",
					frame : false
				},{
					region : "south",
					layout : "fit",
					items : selectedUserMemo,
					frame : false,
					border : false
				}]
			}],
			listeners : {
				show : function() {
					if (me.config.orgId) {
						if(me.config.showOrgTree == false){
							//隐藏组织机构
							Ext.getCmp("orgTreePanel").setVisible(false);
						}
						Co.load(userSelectorUserGridStore, {"model.orgId" : me.config.orgId});
					}
				}
			},

			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectUser
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function searchUser() {
			Co.load(userSelectorUserGridStore, me.config.orgId ? {"model.orgId" : me.config.orgId} : null);
		}

		function selectUser() {
			var callback = me.config.callback;
			if (callback) {
				callback(selectedUserIdHidden.getValue(), selectedUserMemo.getValue());
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(selectedUserIdHidden.getValue());
				}
				if (displayField) {
					displayField.setValue(selectedUserMemo.getValue());
				}
			}
			me.close();
		}
	}
});

/**
 * 客户选择器
 * @class Co.selector.Customer
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var customerSelector = Ext.create("Co.selector.Customer", {});
 * customerSelector.show();
 */
Ext.define("Co.selector.Customer", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var API = {
				queryCustomer : "customer!query.action"
		};
		//============================ Model =========================
		Co.defineModel("Customer", ["id","customerNo","isFormal","customerType","customerClass","customerSource","customerName","tel","fax","addr","postcode","groupID","customerOrgName"]);
		//============================ Store =========================
		var customerGridStore = Co.gridStore("customerGridStore", API.queryCustomer, "Customer", {
			autoLoad : false,
			output : "customerSelectorTbar",
			sorters : [{
				property : "customerName",
				direction : "asc"
			}]
		}); 		

		var customerSelectorTbar = Co.toolbar("customerSelectorTbar", ["->",{
			type : "@",
			handler : searchCustomer,
			searchField : ["customerName"],
			searchEmptyText : ["请输入客户名称..."]
		}
		],{
			margin : "0 0 0 10"
		});

		var columns = [
//			//Co.gridRowNumberer(),
			{header : "id", dataIndex : "id", width : 45, hidden : true},
			{header : "客户名称", dataIndex : "customerName", width : 300, hidden : false}
			];

		var customerGrid = Co.grid("customerGrid", customerGridStore, columns, customerSelectorTbar, null, {
			checkboxSelMode : me.config.singleSelect === true ? "SINGLE" : "MULTI"
		});

		Ext.apply(me, {
			title : me.config.title || "选择客户",
			layout : "fit",
			width : me.config.width || 500,
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : customerGrid,
			listeners : {
				show : function() {
					Co.load(customerGridStore, me.config.orgId ? {"model.groupID" : me.config.orgId} : null);
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectCustomer
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function searchCustomer() {
			Co.load(customerGridStore);
		}

		function selectCustomer() {
			var records = Co.getSelRec(customerGrid);
			var customerIds = [];
			var customerNames = [];
			var tels = [], addrs = [], postcodes = [], faxs = [];
			Ext.each(records, function(v){
				customerIds.push(v.data.id); 
				customerNames.push(v.data.customerName);
				tels.push(v.data.tel); 
				addrs.push(v.data.addr); 
				postcodes.push(v.data.postcode); 
				faxs.push(v.data.fax);
			});
			var callback = me.config.callback;
			if (callback) {
				callback(customerIds.join(","), customerNames.join(","), tels.join(","), addrs.join(","), postcodes.join(","), faxs.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(customerIds.join(","));
				}
				if (displayField) {
					displayField.setValue(customerNames.join(","));
				}
			}
			me.close();
		}
	}
});

/**
 * 样品选择器
 * @class Co.selector.Sample
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var sampleSelector = Ext.create("Co.selector.Sample", {});
 * sampleSelector.show();
 */
Ext.define("Co.selector.Sample", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var API = {
				querySample : "sample_detail!querySelectorSample.action"
		};
		//============================ Model =========================
		Co.defineModel("Sample", ["ID","SAMPLENO","SAMPLEBIZNO","PRODUCTIONNO","SAMPLEDETAILSAMPLENAME","SAMPLEDETAILPRODUCER","SAMPLEDETAILSAMPLEMODEL","SAMPLEDETAILSAMPLESTATE","SAMPLEDETAILORGNAME","SAMPLEDETAILRECEIVETIME","SAMPLEDETAILCLASSNAME"]);
		//============================ Store =========================
		var sampleGridStore = Co.gridStore("sampleGridStore", API.querySample, "Sample", {
			autoLoad : false,
			pageSize : Co.maxInt
		}); 		

		var sampleSelectorTbar = Co.toolbar("sampleSelectorTbar", [{
			type : "@",
			fieldLabel : "样品编号",
			handler : searchSample,
			searchField : ["sampleNo"],
			searchEmptyText : ["请扫描样品编号..."]
		}
		],{
			margin : "0 0 0 10"
		});

		var columns = [
//			//Co.gridRowNumberer(),
			{header : "id", dataIndex : "ID", width : 45, hidden : true},
			{header : "编号", dataIndex : "SAMPLEBIZNO", width : 150, hidden : false},
			{header : "名称", dataIndex : "SAMPLEDETAILSAMPLENAME", width : 200, hidden : false},
			{header : "型号", dataIndex : "SAMPLEDETAILSAMPLEMODEL", width : 100, hidden : false},
			{header : "出厂编号", dataIndex : "PRODUCTIONNO", width : 100, hidden : false},
			{header : "生产厂商", dataIndex : "SAMPLEDETAILPRODUCER", width : 200, hidden : false},
			{header : "接样日期", dataIndex : "SAMPLEDETAILRECEIVETIME", width : 100, hidden : false}
			];

		var sampleGrid = Co.grid("sampleGrid", sampleGridStore, columns, sampleSelectorTbar, null, {
			hideBbar : true,
			checkOnly : true
		});

		Ext.apply(me, {
			title : me.config.title || "选择样品",
			layout : "fit",
			width : me.config.width || 800,
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : sampleGrid,
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectSample
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		var searchField = Ext.ComponentQuery.query("textfield[name='model.sampleNo']")[0];

		function searchSample() {
			var value = searchField.getValue();
			if (!Co.isEmpty(value)) {
				Co.request(API.querySample, {"model.sampleNo" : value,"tokenID" : me.config.tokenID, "model.flowState" : "02"}, function(result, opts){
					if (result.total > 0) {
						Ext.each(result.root, function(r){
							var add = true;
							sampleGridStore.each(function(s){
								if (s.data.SAMPLENO == r.SAMPLENO) {
									add = false;
									return false;
								}
							});
							if (add) {
								sampleGridStore.add(r);
							}
						});
					}
					searchField.setValue("");
					searchField.focus();
				});
			}
		}

		function selectSample() {
			var records = Co.getSelRec(sampleGrid);
			if (records.length == 0) {
				Co.showError("请选择样品！");
				return false;
			}
			var sampleIds = [];
			var sampleNos = [];
			var sampleBizNos = [];
			var sampleNames = [];
			Ext.each(records, function(v){
				sampleIds.push(v.data.ID); 
				sampleNos.push(v.data.SAMPLENO);
				sampleBizNos.push(v.data.SAMPLEBIZNO);
				sampleNames.push(v.data.SAMPLEDETAILSAMPLENAME);
			});
			var callback = me.config.callback;
			if (callback) {
				callback(sampleIds.join(","), sampleNos.join(","), sampleBizNos.join(","), sampleNames.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(sampleIds.join(","));
				}
				if (displayField) {
					displayField.setValue(sampleNames.join(","));
				}
			}
			me.close();
		}
	}
});

/**
 * 人员选择器
 * @class Co.selector.Employee
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var employeeSelector = Ext.create("Co.selector.Employee", {});
 * employeeSelector.show();
 */
Ext.define("Co.selector.Employee", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var API = {
				queryEmployee : ModuleServiceInterface.queryEmployee,
				getOrgTreeLeft : ModuleServiceInterface.getOrgTree+"?showRoot=true&recursion=true&single=true"
		};
		var selectedOrgNo;
		var selectedOrgId;
		var selectedOrgName;
		//============================ Model =========================
		Co.defineModel("Employee", ["id","fullName","sex","post","employeeOrgName"]);
		//============================ Store =========================
		//定义左侧树Store
		var orgTreeStore = Co.treeStore("orgTreeStore", API.getOrgTreeLeft, {
			nodeParam : "parentOrgNo",
			idProperty : "extraParam1",
			listeners : {
				load : function(){
					if(me.config.selectedOrgNo){
						//默认选中
						var record = this.getNodeById(me.config.selectedOrgNo);
						var ss = orgTreePanel.getSelectionModel();
						ss.select(record);
					} else {
						//默认选中
						var record = this.getRootNode().getChildAt(0)
						var ss = orgTreePanel.getSelectionModel();
						ss.select(record);
					}
				}
			}
		});
		orgTreeStore.load({
//			params : {"parentOrgNo" : orgNo || "-1"},
			callback : function() {
				orgTreePanel.getRootNode().expand(false);
				orgTreePanel.doLayout();
				orgTreePanel.getRootNode().expand(true);
			}
		});

		//============================ View =========================
		var orgTreePanel = Co.tree("employeeSelectorOrgTreePanel", orgTreeStore, {
			width : 260,
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var org = rs[0];
					if (org) {
						selectedOrgNo = org.data.extraParam1;
						selectedOrgName = org.data.text;
						selectedOrgId = org.data.id;
						Co.load(employeeSelectorUserGridStore, {"orgNo" : selectedOrgNo});
					}
				}
			}
		}); 

		var employeeSelectorUserGridStore = Co.gridStore("employeeSelectorUserGridStore", API.queryEmployee, "Employee", {
			autoLoad : false,
			output : "employeeSelectorTbar",
			pageSize : Co.maxInt,
			sorters : [{
				property : "employee.fullName",
				direction : "asc"
			}],
			listeners : {
				load : function(){
					//选中默认勾选的人员
					if(me.config.selectedEmployeeIds){
						var selModel = employeeSelectorUserGrid.getSelectionModel();
						//获得选中的项目ID
						Ext.each(me.config.selectedEmployeeIds, function(employeeId){
							var index = employeeSelectorUserGridStore.find("id", employeeId);
							if (-1 != index) {
								selModel.select(index, true);
							}
						});
					}
				}
			}
		}); 

		var employeeSelectorTbar = Co.toolbar("employeeSelectorTbar", ["->",{
			type : "@",
			handler : searchEmployee,
			searchField : ["fullName"],
			searchEmptyText : ["请输入姓名..."]
		}
		]);

		var employeeSelectorColumns = [
//			//Co.gridRowNumberer(),
			{header : "姓名", dataIndex : "fullName", width : 80, hidden : false},
			{header : "性别", dataIndex : "sex", width : 50, hidden : false, renderer : function(v){
				if ("01" == v) {
					return "男";
				} else if ("02" == v) {
					return "女";
				}
			}},
			{header : "岗位", dataIndex : "post", width : 150, hidden : false},
			{header : "部门", dataIndex : "employeeOrgName", width : 180, flex : 1, hidden : true}
			];

		var employeeSelectorUserGrid = Co.grid("employeeSelectorUserGrid", employeeSelectorUserGridStore, employeeSelectorColumns, employeeSelectorTbar, null,{
			checkboxSelMode : me.config.singleSelect === true ? "SINGLE" : "MULTI",
					hideBbar : true,
					listeners : {
						itemdblclick : function(view, record) {
							selectEmployee();
						}
					}
		});  
		Ext.apply(me, {
			title : me.config.title || "选择人员",
			layout : "fit",
			width : me.config.width || 750,
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : [{
				layout : "border",
				border : false,
				items : [{
					region : "west",
					layout : "fit",
					title : "所属科室",  
					items : orgTreePanel,
					collapsible : true,
					split : true
				},{
					region : "center",
					items : employeeSelectorUserGrid,
					layout : "fit",
					frame : false
				}]
			}],
			listeners : {
				show : function() {
					Co.load(employeeSelectorUserGridStore, me.config.orgId ? {"model.groupID" : me.config.orgId} : null);
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectEmployee
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function searchEmployee() {
			Co.load(employeeSelectorUserGridStore, me.config.orgId ? {"model.groupID" : me.config.orgId} : null);
		}

		function selectEmployee() {
			var records = Co.getSelRec(employeeSelectorUserGrid);
			var employeeIDs = [];
			var fullNames = [];
			Ext.each(records, function(v){
				employeeIDs.push(v.data.id); 
				fullNames.push(v.data.fullName);
			});
			var callback = me.config.callback;
			if (callback) {
				callback(employeeIDs.join(","), fullNames.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(employeeIDs.join(","));
				}
				if (displayField) {
					displayField.setValue(fullNames.join(","));
				}
			}
			me.close();
		}
	}
});

/**
 * 人员选择器，关联用户
 * @class Co.selector.Employee
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var employeeSelector = Ext.create("Co.selector.EmployeeJoinUser", {});
 * employeeSelector.show();
 */
Ext.define("Co.selector.EmployeeJoinUser", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var API = {
				queryEmployee : ModuleServiceInterface.queryEmployeeJoinUser,
				getOrgTreeLeft : ModuleServiceInterface.getOrgTree+"?showRoot=true&recursion=true&single=true"
		};
		var selectedOrgNo;
		var selectedOrgId;
		var selectedOrgName;
		//============================ Model =========================
		Co.defineModel("Employee", ["id","fullName","sex","post","employeeOrgName","username","userRealName","userId","certState"]);
		//============================ Store =========================
		//定义左侧树Store
		var orgTreeStore = Co.treeStore("orgTreeStore", API.getOrgTreeLeft, {
			nodeParam : "parentOrgNo",
			idProperty : "extraParam1",
			listeners : {
				load : function(){
					if(me.config.selectedOrgNo){
						//默认选中
						var record = this.getNodeById(me.config.selectedOrgNo);
						var ss = orgTreePanel.getSelectionModel();
						ss.select(record);
					} else {
						//默认选中
						var record = this.getRootNode().getChildAt(0)
						var ss = orgTreePanel.getSelectionModel();
						ss.select(record);
					}
				}
			}
		});
		orgTreeStore.load({
			params : {"parentOrgNo" : me.config.parentOrgNo || "-1"},
			callback : function() {
				orgTreePanel.getRootNode().expand(false);
				orgTreePanel.doLayout();
				orgTreePanel.getRootNode().expand(true);
			}
		});

		//============================ View =========================
		var orgTreePanel = Co.tree("employeeSelectorOrgTreePanel", orgTreeStore, {
			width : 260,
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var org = rs[0];
					if (org) {
						selectedOrgNo = org.data.extraParam1;
						selectedOrgName = org.data.text;
						selectedOrgId = org.data.id;
						Co.load(employeeSelectorUserGridStore, {"orgNo" : selectedOrgNo});
					}
				}
			}
		}); 

		var employeeSelectorUserGridStore = Co.gridStore("employeeSelectorUserGridStore", API.queryEmployee, "Employee", {
			autoLoad : false,
			output : "employeeSelectorTbar",
			pageSize : Co.maxInt,
			sorters : [{
				property : "usr.realName",
				direction : "asc"
			}],
			listeners : {
				load : function(){
					//选中默认勾选的人员
					if(me.config.selectedEmployeeIds){
						var selModel = employeeSelectorUserGrid.getSelectionModel();
						//获得选中的项目ID
						Ext.each(me.config.selectedEmployeeIds, function(employeeId){
							var index = employeeSelectorUserGridStore.find("id", employeeId);
							if (-1 != index) {
								selModel.select(index, true);
							}
						});
					}
				}
			}
		}); 

		var employeeSelectorTbar = Co.toolbar("employeeSelectorTbar", ["->",{
			type : "@",
			handler : searchEmployee,
			searchField : ["userRealName"],
			searchEmptyText : ["请输入姓名..."]
		}
		]);

		var employeeSelectorColumns = [
//			//Co.gridRowNumberer(),
			{header : "姓名", dataIndex : "fullName", width : 80, hidden : true},
			{header : "性别", dataIndex : "sex", width : 50, hidden : true, renderer : function(v){
				if ("01" == v) {
					return "男";
				} else if ("02" == v) {
					return "女";
				}
			}},
			{header : "账号", dataIndex : "username", width : 180, flex : 1, hidden : true},
			{header : "姓名", dataIndex : "userRealName", width : 100, hidden : false},
			{header : "岗位", dataIndex : "post", width : 150, flex : 1, hidden : false},
			{header : "部门", dataIndex : "employeeOrgName", width : 180, flex : 1, hidden : true},
			{header : "用户id", dataIndex : "userId", width : 180, flex : 1, hidden : true},
			{header : "资质状态", dataIndex : "certState", width : 80, hidden : false,renderer : function(v){
				if ("01" == v) {
					return "<span style = 'color:green'>有效</span>";
				} else if ("02" == v) {
					return "<span style = 'color:red'>无效</span>";
				}
			}},
			];

		var employeeSelectorUserGrid = Co.grid("employeeSelectorUserGrid", employeeSelectorUserGridStore, employeeSelectorColumns, employeeSelectorTbar, null,{
			checkboxSelMode : me.config.singleSelect === true ? "SINGLE" : "MULTI",
					hideBbar : true,
					listeners : {
						itemdblclick : function(view, record) {
							selectEmployee();
						}
					}
		});  
		Ext.apply(me, {
			title : me.config.title || "选择人员",
			layout : "fit",
			width : me.config.width || 750,
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : [{
				layout : "border",
				border : false,
				items : [{
					region : "west",
					layout : "fit",
					title : "所属科室",  
					items : orgTreePanel,
					id : "orgTreePanel",
					collapsible : true,
					split : true
				},{
					region : "center",
					items : employeeSelectorUserGrid,
					layout : "fit",
					frame : false
				}]
			}],
			listeners : {
				show : function() {
					if(me.config.showOrgTree == false){
						//隐藏组织机构
						Ext.getCmp("orgTreePanel").setVisible(false);
					}
					Co.load(employeeSelectorUserGridStore, me.config.orgId ? {"model.groupID" : me.config.orgId} : null);
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectEmployee
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function searchEmployee() {
			Co.load(employeeSelectorUserGridStore, me.config.orgId ? {"model.groupID" : me.config.orgId} : null);
		}

		function selectEmployee() {
			var records = Co.getSelRec(employeeSelectorUserGrid);
			var employeeIDs = [];
			var fullNames = [];
			var usernames = [];
			var userRealNames = [];
			var userIds = [];

			//选中得无效得证书人员
			var selectedInvalidCertStateEmployee = [];

			Ext.each(records, function(v){
				var employee = v.data;
				employeeIDs.push(employee.id); 
				fullNames.push(employee.fullName);
				usernames.push(employee.username);
				userRealNames.push(employee.userRealName);
				userIds.push(employee.userId);
				if( employee.certState == '02' ){
					selectedInvalidCertStateEmployee.push(employee);
				}
			});

			if(me.config.validateCertState == true){
				if(selectedInvalidCertStateEmployee.length >= 1){
					//如果存在证书无效的人员则调用回调方法。回调方法只有返回true时才会往下面执行
					var validateCertStateCallback = me.config.validateCertStateCallback;
					if(validateCertStateCallback){
						var result = validateCertStateCallback(selectedInvalidCertStateEmployee);
						if(!result){
							return;
						}
					} else {
						var invalidEmployeeName = "";
						for (var i = 0; i < selectedInvalidCertStateEmployee.length; i++) {
							invalidEmployeeName += selectedInvalidCertStateEmployee[i].userRealName+",";
						}
						invalidEmployeeName = invalidEmployeeName.substring(0,invalidEmployeeName.length-1);
						Co.showWarning("人员【"+invalidEmployeeName+"】证书状态是无效的！");
						return;
					}
				}
			}

			var callback = me.config.callback;
			if (callback) {
				callback(usernames.join(","),userRealNames.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(employeeIDs.join(","));
				}
				if (displayField) {
					displayField.setValue(fullNames.join(","));
				}
			}
			me.close();
		}
	}
});

/**
 * 标准选择器(按所属科室选择)
 * @class Co.selector.StandardByOrg
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var standardSelector = Ext.create("Co.selector.StandardByOrg", {});
 * standardSelector.show();
 */
Ext.define("Co.selector.StandardByOrg", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 组件初始化
	 */
	initComponent : function() {
		var me = this;
		var me = this;
		var orgId = me.config.orgId;
		var orgName = me.config.orgName;

		var API = {
				//getOrgTreeAll : "org!getOrgTree.action?showRoot=true&recursion=true&single=true",
				getOrgTreeAll : ModuleServiceInterface.getOrgTree+"?showRoot=true&recursion=true&single=true",
				queryStandard : ModuleServiceInterface.queryStandard
		};
		var tbarId = "standardTbar_" + Ext.id();
		//============================ Model =========================
		Co.defineModel("Standard", ["id","standardNo","standardName","standardState","isAbility","groupID","labID","standardOrgName"]);
		//============================ Store =========================
		var standardGridStore = Co.gridStore("standardGridStore_" + Ext.id(), API.queryStandard, "Standard", {
			autoLoad : false,
			output : tbarId,
			sorters : [{
				property : "standardNo",
				direction : "asc"
			}],
			pageSize : Co.maxInt
		}); 	

		var columns = [
			//Co.gridRowNumberer(),
			{header : "id", dataIndex : "id", width : 200, hidden : true},
			{header : "状态", dataIndex : "standardState", width : 50, hidden : false,renderer : function(v) {
				var standardState = Co.dictText("standardState", v);
				if ("01" === v) {
					return "<font color='green'>" + standardState + "</font>";
				} else if ("02" === v) {
					return "<font color='red'>" + standardState + "</font>";
				}
				return standardState;
			}},
			{header : "标准编号", dataIndex : "standardNo", width : 130, hidden : false},
			{header : "标准名称", dataIndex : "standardName", width : 300, hidden : false}, 
			{header : "检测能力范围", dataIndex : "isAbility", width : 100, hidden : false,renderer : function(v) {
				return Co.dictText("abilityState", v);
			}}
			];

		var tbar = Co.toolbar(tbarId, ["->",{
			type : "@",
			searchField : ["standardName"],
			searchEmptyText : ["请输入标准名称..."],
			handler : searchStandard
		}]);

		var standardGrid = Co.grid("standardGrid_" + Ext.id(), standardGridStore, columns, tbar, null, {
			checkOnly : false,
			hideBbar : true,
			listeners : {
				itemdblclick : function(view, record) {
					selectStandard();
				},
			}
		});

		//定义OrgTreeStore
		var orgTreeStore = Co.treeStore("orgTreeStore_" + Ext.id(), API.getOrgTreeAll, {
			autoLoad : false
		});

		//============================ View =========================
		//定义OrgTree
		var orgTreePanel = Co.tree("orgTreePanel_" + Ext.id(), orgTreeStore, {
			width : 250,
			height : 406,
			viewConfig : {
				loadMask : {
					msg : "正在加载..."
				}
			},
			listeners : {
				selectionchange : function(me, rs, eOpts) {
					var org = rs[0];
					if (org) {
						orgId = org.data.id;
						standardGridPanel.setTitle("已选中【" + org.data.text + "】");
						Co.load(standardGridStore, {"orgId" : orgId});
					}
				},
				load : function(){
					//默认选中
					var record = this.getRootNode().getChildAt(0)
					//var record = this.getNodeById(defaultSelectedRemindName || selectedRemindName);
					var ss = orgTreePanel.getSelectionModel();
					ss.select(record);
				}
			}
		}); 

		var standardGridPanel = Ext.create("Ext.panel.Panel",{
			title : "已选中【" + orgName + "】",
			layout : "fit",
			items : standardGrid
		});

		Ext.apply(me, {
			title : me.config.title || "选择标准",
			layout : "fit",
			width : me.config.width || 780, 
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : [{
				layout : "border",
				items : [{
					region : "west",
					layout : "fit",
					title : "所属科室",  
					items : orgTreePanel,
					collapsible : true,
					split : true
				},{
					region : "center",
					items : standardGridPanel,
					layout : "fit",
					frame : false,
					border : false
				}],
				border : false
			}],
			listeners : {
				show : function() {
					orgTreeStore.load({
						params : {"parentOrgNo" : me.config.parentOrgNo || "-1"},
						callback : function() {
							orgTreePanel.getRootNode().expand(false);
							orgTreePanel.doLayout();
							orgTreePanel.getRootNode().expand(me.config.parentOrgNo ? true : false);
						}
					});
					Co.load(standardGridStore, me.config.orgId ? {"orgId" : me.config.orgId} : "-1");
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectStandard
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function selectStandard() {
			var records = Co.getSelRec(standardGrid);
			var standardIds = [];
			var standardNames = [];
			Ext.each(records, function(v){
				standardIds.push(v.data.id); 
				standardNames.push(v.data.basisName);
			});
			var callback = me.config.callback;
			if (callback) {
				callback(standardIds.join(","), standardNames.join(","));
			} else {
				var valueFieldId = me.config.valueField;
				var displayFieldId = me.config.displayField;
				var valueField = Ext.getCmp(valueFieldId);
				var displayField = Ext.getCmp(displayFieldId);
				if (valueField) {
					valueField.setValue(standardIds.join(","));
				}
				if (displayField) {
					displayField.setValue(standardNames.join(","));
				}
			}
			me.close();
		}

		function searchStandard() {
			Co.load(standardGridStore);
		}
	}
});

/**
 * 条码选择器
 * @class Co.selector.BarCode
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var barCodeSelector = Ext.create("Co.selector.BarCode", {});
 * barCodeSelector.show();
 */
Ext.define("Co.selector.BarCode", {
	extend : "Ext.window.Window",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项，请参考Ext.window.Window配置项
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 组件初始化
	 */
	initComponent : function() {
		var me = this;
		var API = {
				queryBarCode : "bar_code_server!query.action",
				updateBarCodeUseTypeToUsed : "bar_code_server!updateBarCodeUseTypeToUsed.action"
		};
		//============================ Model =========================
		Co.defineModel("BarCodeRecord", ["id","sampleNo","sampleBizNo","useType"]);
		//============================ Store =========================
		var barCodeSelectorRoleGridStore = Co.gridStore("barCodeSelectorRoleGridStore", API.queryBarCode, "BarCodeRecord", {
			autoLoad : false,
			output : "barCodeSelectorTbar",
			pageSize : Co.maxInt,
			sorters : [{
				property : "createTime",
				direction : "desc"
			}],
			groupField : "useType"
		}); 

		var barCodeSelectorTbar = Co.toolbar("barCodeSelectorTbar", ["->",{
			type : "@",
			handler : searchBarCode,
			searchField : ["sampleNo"],
			searchEmptyText : ["请输入样品编号..."]
		}
		],{
			margin : "0 0 0 10"
		});

		var barCodeSelectorColumns = [
			//Co.gridRowNumberer(),
			{header : "样品编号", dataIndex : "sampleBizNo", width : 300, hidden : false}
			];

		var barCodeSelectorRoleGrid = Co.grid("barCodeSelectorRoleGrid", barCodeSelectorRoleGridStore, barCodeSelectorColumns, barCodeSelectorTbar, null,{
			hideBbar : true,
			checkOnly : true,
			listeners : {

			},
			features: [Ext.create("Ext.grid.feature.Grouping", {  
				groupByText : "用本字段分组",  
				showGroupsText : "显示分组",  
				groupHeaderTpl: ["{name:this.getUseTypeName} ({rows.length})",{
					getUseTypeName : function(useType) {
						if ("01" == useType) return "未使用";
						else if ("02" == useType) return "已使用";
						else return "其他";
					}
				}],
				startCollapsed : false
			})]
		});  

		Ext.apply(me, {
			title : me.config.title || "选择条码",
			layout : "fit",
			width : me.config.width || 400, 
			height : me.config.height || 500,
			closeable : true,
			closeAction : "destroy",
			resizable : false,
			modal : true,
			shadow : true,
			frame : false,
			border : true,
			buttonAlign : "center",
			items : barCodeSelectorRoleGrid,
			listeners : {
				show : function() {
					Co.load(barCodeSelectorRoleGridStore);
				}
			},
			buttons : me.config.buttons || ([{
				text : "确定",
				iconCls : "form_saveIcon",
				handler : selectBarCode
			},{
				text : "取消",
				iconCls : "closeIcon",
				handler : function() {
					me.close();
				}
			}])
		});

		me.callParent();

		function searchBarCode() {
			Co.load(barCodeSelectorRoleGridStore);
		}

		function selectBarCode() {
			var records = Co.getSelRec(barCodeSelectorRoleGrid),
			barCodeIds = [],
			barCodeNos = [],
			barCodeBizNos = [];
			Ext.each(records, function(v){
				barCodeIds.push(v.data.id);
				barCodeNos.push(v.data.sampleNo);
				barCodeBizNos.push(v.data.sampleBizNo);
			});
			var callback = me.config.callback;
			if (callback) {
				//将选择的编号设置为已使用
				Ext.Ajax.request({
					url : API.updateBarCodeUseTypeToUsed,
					params : "barCodeIds=" + barCodeIds.join(","),
					method : "POST",
					success : function(response, opts) {
						var result = Ext.decode(response.responseText);
						if (result.success) {
							callback(barCodeNos.join(","), barCodeBizNos.join(","));
						} else {
							Co.showError("条码状态更新失败！");
						}
					},
					failure : function(response, opts) {
						Co.showError("服务端异常，条码状态更新失败！");
					}
				});
			}
			me.close();
		}
	}
});

/**
 * 自定义触发器
 * @class Co.trigger.Trigger
 * @author TangShuo
 * @version 1.0.0
 * @example
 * var employeeSelector = Ext.create("Co.trigger.Trigger", {
 * 	  triggerHandler : function() {}
 * });
 */
Ext.define("Co.trigger.Trigger",{
	extend: "Ext.form.field.Trigger",
	alias: "widget.cotrigger",
	config : {},
	/**
	 * 构造函数
	 * @param {Object} config 配置项。triggerHandler：点击事件触发后调用的回调函数。其他配置请参考Ext.form.field.Trigger配置项。
	 */
	constructor : function(config) {
		var me = this;
		me.config = config || {};
		me.callParent([me.config]);
	},
	/**
	 * 初始化组件
	 */
	initComponent : function() {
		this.callParent();
	},
	/**
	 * 点击触发事件。调用config中的triggerHandler。
	 */
	onTriggerClick: function() {
		var me = this;
		me.config.triggerHandler();
	}
});