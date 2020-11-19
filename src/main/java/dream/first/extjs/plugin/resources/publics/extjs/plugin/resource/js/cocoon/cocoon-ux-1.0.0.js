var TOKEN = "X-Auth-Token";

//连接失败
var CONNECT_FAILURE_MSG = "系统开小差了，请稍后再试!";//网络连接错误，请重试！
//服务无效
var SERVER_INVALID_MSG = "系统开小差了，请稍后再试!";//服务端异常，操作失败！

/**
 * CocoonUX工具类
 * @class Co
 * @author TangShuo
 * @version 1.0.0
 */
var Co = {
		/**
		 * 参考Ext.getCmp
		 * @return Ext.Component 
		 */
		get: Ext.getCmp,
		/**
		 * 参考Ext.String.format
		 * @param {String} string
		 * @param {Mixed} values
		 * @return String 
		 */
		format: Ext.String.format,
		/**
		 * 参考Ext.util.Format.number
		 * @param {Number} v
		 * @param {String} format
		 * @return String
		 */
		formatNum: Ext.util.Format.number,
		/**
		 * 参考Ext.Date.format
		 * @param {Date} date
		 * @param {String} format
		 * @return String 
		 */
		formatDate: Ext.Date.format,
		/**
		 * 参考Ext.encode
		 * @param {Object} obj
		 * @return String
		 */
		encode: Ext.encode,
		/**
		 * 参考Ext.decode
		 * @param {String} json
		 * @param {Boolean} safe
		 * @return Object
		 */
		decode: Ext.decode,
		/**
		 * 参考Ext.isEmpty
		 * @param {Object} value
		 * @param {Boolean} allowEmptyString
		 * @return Boolean
		 */
		isEmpty: function(str) {
			str = str || "";
			if (String.trim) {
				return Ext.isEmpty(("" + str).trim());
			} else {
				return Ext.isEmpty(str);
			}
		},    
		/**
		 * 整数最大值
		 * @cfg {Integer} maxInt
		 */
		maxInt: 2147483647,
		/**
		 * 空格
		 * @cfg {String} space
		 */
		space: "&nbsp;&nbsp;",
		/**
		 * 日期时间格式：Y-m-d H:i:s.u(年-月-日 时:分:秒)
		 * @cfg {String} datetimeFormat
		 */
		datetimeFormat: "Y-m-d H:i:s.u",
		/**
		 * 日期格式：Y-m-d(年-月-日)
		 * @cfg {String} dateFormat
		 * @type String
		 */
		dateFormat : "Y-m-d",
		/**
		 * 默认Ajax请求超时时间，30秒
		 * @cfg {Integer} timeout
		 */
		timeout: 30000,
		/**
		 * 默认表格一页记录数量
		 * @cfg {Integer} pageSize
		 */
		pageSize: 20,
		/**
		 * 消息框标题
		 * @cfg {String} msgTitle
		 */
		msgTitle : "提示",
		/**
		 * 设置Cookie
		 * @param {String} name Cookie名称
		 * @param {String} value Cookie值
		 */
		setCookie : function(name, value) {
			Ext.util.Cookies.set(name, value, new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)), contextPath);
		},
		/**
		 * 获得Cookie值
		 * @param {String} name Cookie名称
		 * @return {String} Cookie值
		 */
		getCookie : function(name) {
			return Ext.util.Cookies.get(name);
		},
		/**
		 * 获得UUID
		 * @return {String} UUID
		 */
		uuid : function() {
			return new Ext.data.UuidGenerator().generate().replace(/-/g, "");
		},
		/**
		 * 初始化函数。需要在Ext.onReady方法前加入此方法进行初始化。
		 * @param {Integer} timeout Ajax请求超时时间（毫秒）
		 */
		initialize : function(timeout, paths) {
			this.timeout = timeout || this.timeout;
			Ext.Loader.setConfig({
				enabled : true,
				paths : paths
			});
			Ext.tip.QuickTipManager.init();
			Ext.BLANK_IMAGE_URL = staticResourcesRootPath+"/js/extjs/resources/s.gif";
		},
		/**
		 * 显示消息提示框
		 * @param {String} msg 消息
		 * @param {Function} fn 回调函数
		 */
		alert : function(msg, fn) {
			Ext.Msg.alert(Co.msgTitle, msg, fn);
		},
		/**
		 * 显示INFO消息框
		 * @param {String} msg 消息
		 * @param {Function} fn 回调函数
		 */
		showInfo : function(msg, fn) {
			Ext.Msg.show({
				title : Co.msgTitle,
				msg : msg,
				modal : true,
				fn : fn,
				buttons : Ext.Msg.OK,
				icon : Ext.Msg.INFO
			});
		}, 
		/**
		 * 显示ERROR消息框
		 * @param {String} msg 消息
		 * @param {Function} fn 回调函数
		 */
		showError : function(msg, fn, result) {
			Ext.MessageBox.buttonText.cancel = "详情";
			Ext.Msg.show({
				title : Co.msgTitle,
				msg : msg,
				modal : true,
				fn : function(buttonId, text, opt) {
					if ("ok" === buttonId) {
						if (fn) fn(buttonId, text, opt);
					}
				},
				buttons : Ext.Msg.OK,
				icon : Ext.Msg.ERROR
			});
		}, 
		/**
		 * 显示ERROR消息框
		 * @param {String} msg 消息
		 * @param {Function} fn 回调函数
		 */
		showErrorByDetail : function(msg, fn, result) {
			Ext.MessageBox.buttonText.cancel = "详情";
			Ext.Msg.show({
				title : Co.msgTitle,
				msg : msg,
				modal : true,
				fn : function(buttonId, text, opt) {
					if ("ok" === buttonId) {
						if (fn) fn(buttonId, text, opt);
					} else if ("cancel" === buttonId) {
						var win = Co.window("错误详情",[{
							xtype : "textarea",
							readOnly : true,
							value : result && result.exception ? result.exception : msg
						}], 600, 400, "fit", {
							maximizable : true,
							buttons : [{
								text : "关闭",
								iconCls : "closeIcon",
								handler : function() {
									if (fn) fn(buttonId, text, opt);
									win.close();
								}
							}]
						}).show();
					}
				},
				buttons : Ext.Msg.OKCANCEL,
				icon : Ext.Msg.ERROR
			});
		}, 
		/**
		 * 显示WARNING消息框
		 * @param {String} msg 消息
		 * @param {Function} fn 回调函数
		 */
		showWarning : function(msg, fn) {
			Ext.Msg.show({
				title : Co.msgTitle,
				msg : msg,
				modal : true,
				fn : fn,
				buttons : Ext.Msg.OK,
				icon : Ext.Msg.WARNING
			});
		}, 
		/**
		 * 显示WARNING消息框
		 * 
		 * 有 确定和查看按钮
		 * 
		 * @param {String} msg 消息
		 * @param {Function} fn 回调函数
		 */
		showWarningByLook : function(msg, fn) {
			Ext.MessageBox.buttonText.cancel = "查看";
			Ext.Msg.show({
				title : Co.msgTitle,
				msg : msg,
				modal : true,
				fn : fn,
				buttons : Ext.Msg.OKCANCEL,
				icon : Ext.Msg.WARNING
			});
		}, 
		/**
		 * 显示WAIT消息框
		 * @param {String} msg
		 */
		showWait : function(msg) {
			return Ext.Msg.show({
				title : Co.msgTitle,
				msg : msg || "正在处理...",
				wait : true,
				waitConfig : {
					interval : 150
				}
			});
		},
		/**
		 * 显示CONFIRM消息框
		 * @param {String} msg 消息
		 * @param {Function} fn 回调函数
		 */
		confirm : function(msg, fn) {
			Ext.Msg.confirm(Co.msgTitle, msg, fn);
		}, 
		/**
		 * 显示CONFIRM消息框 确定和取消 按钮
		 * @param {String} msg 消息
		 * @param {Function} fn 回调函数
		 */
		showConfirm : function(msg, fn) {
			Ext.MessageBox.buttonText.cancel = "取消";
			Ext.Msg.show({
				title : Co.msgTitle,
				msg : msg,
				modal : true,
				fn : fn,
				buttons : Ext.Msg.OKCANCEL,
				icon : Ext.Msg.QUESTION
			});
		}, 
		/**
		 * 显示PROMPT消息框
		 * @param {String} msg 消息
		 * @param {Function} fn 回调函数
		 * @param {Object} defaultValue 默认值
		 */
		prompt : function(msg, fn, defaultValue) {
			Ext.Msg.prompt(Co.msgTitle, msg, fn, null, false, defaultValue);
		},
		/**
		 * 显示表单Ajax调用异常消息框
		 * @param {Ext.form.Basic} form 表单对象
		 * @param {Ext.form.action.Action} action Action对象，通过action.result可获得服务端返回的结果，其中包括success和msg属性
		 */
		showFormFailure : function(form, action) {
			switch (action.failureType) {
			case Ext.form.action.Action.CONNECT_FAILURE:
				if(action.response.status == "999"){//登录超时。不用提示，有统一的提示。这里在提示，就会出现两个提示

				} else {
					Co.showError(CONNECT_FAILURE_MSG);
				}
				break;
			case Ext.form.action.Action.SERVER_INVALID:
				Co.showError(action.result.msg || SERVER_INVALID_MSG, null, action.result);
				break;
				/* default:
	    		Co.showError(action.result.msg || SERVER_INVALID_MSG, null, action.result);    */
			}
		},
		/**
		 * 显示Ajax调用异常
		 * @param {String} responseText 服务端返回的信息
		 */
		showAjaxException : function(responseText) {
			//request 和 form 保存时，超时会调用这个方法
			if(Co.isEmpty(responseText)){
//				this.showError(SERVER_INVALID_MSG);
				return;
			}
			var result = Ext.decode(responseText);
			if(!result){
				this.showError(SERVER_INVALID_MSG);
			} else {
				this.showError(result.msg || SERVER_INVALID_MSG, null, result);
			}
		},
		/**
		 * 获得表格选取的记录ID
		 * @param {Ext.grid.Panel} grid 表格
		 * @param {String} id 要获得记录的ID标识，若不指定，默认取记录的id属性
		 * @return {String} 获得的记录标识，用逗号分隔
		 */
		getGridSelectionList : function(grid, id) {
			var selectionArray = [];
			var selectedList = Co.getSelRec(grid);
			if (selectedList.length > 0) {
				Ext.each(selectedList, function(item, index, allItems) {
					selectionArray.push(id ? item.data[id] : item.data.id);
				});	
			}
			return selectionArray.join(",");
		},
		/**
		 * 提交表单
		 * @param {Ext.form.Panel} form 表单
		 * @param {Fuction} successCallback 参数(form, action)。服务端返回的JSON结果中如果success === true，则调用此方法。可通过action.result.msg获取服务端返回的msg信息。
		 * @param {Function} failureCallback 参数(form, action)。服务端返回的JSON结果中如果success === false，则调用此方法。可通过action.result.msg获取服务端返回的msg信息。
		 * @config {Object} config 配置项，重点说明listeners配置项，可配置表单“提交前”和“服务端返回结果后”的监听函数，分别是function beforesave()和function aftersave(form, action)。监听函数返回boolean值，true：继续向下执行，false：终止执行。其他配置项参考Ext.form.Panel配置项。
		 */
		formSave : function(form, successCallback, failureCallback, config) {
			config = config || {};
			config.waitMsg = config.waitMsg || "正在保存...";

			var basicForm = form.getForm();
			if (basicForm.isValid()) {
				if (config.listeners && config.listeners["beforesave"] && !config.listeners["beforesave"]()) return false;
				var params = basicForm.getValues();
				//params["OPER_USER"] = parent.loginUsername;
				if (Co.isEmpty(params["model.id"])) {
					params["isModify"] = false;
				} else {
					params["isModify"] = true;
				}
//				Co.request(basicForm.url, params, function(result, opts){
//				var action = {
//				result : result
//				};
//				if (config.listeners && config.listeners["aftersave"] && !config.listeners["aftersave"](form, action)) return false;
//				if (successCallback) {
//				successCallback(basicForm, action);
//				} else {
//				Co.alert("保存成功！");
//				}
//				}, function(result, opts){
//				var action = {
//				result : result
//				};
//				if (config.listeners && config.listeners["aftersave"] && !config.listeners["aftersave"](form, action)) return false;
//				if (failureCallback) {
//				failureCallback(basicForm, action);
//				} else {
//				Co.showFormFailure(basicForm, action);
//				}
//				}, config);
				//添加token
				//params = Co.addTokenParam(params);
				Ext.Ajax.timeout = 30000;
				form.getForm().submit({
					waitTitle : config.waitTitle || "提示",
					waitMsg : config.waitMsg || "正在保存...",
					params : params,
					submitEmptyText : false,
					//timeout : 6,
					success : function(form, action) {
						if (config.listeners && config.listeners["aftersave"] && !config.listeners["aftersave"](form, action)) return false; 
						if (successCallback) {
							successCallback(form, action);
						} else {
							Co.alert("保存成功！");
						}
					},
					failure : function(form, action) {
						if (config.listeners && config.listeners["aftersave"] && !config.listeners["aftersave"](form, action)) return false;
						if (failureCallback) {
							failureCallback(form, action);
						} else {
							Co.showFormFailure(form, action);
						}
					}
				});
			}
		},
		/**
		 * 将在表格中选择的记录信息加载到表单中
		 * @param {Ext.form.Panel} form 表单
		 * @param {Ext.grid.Panel} grid 表格
		 * @param {String} loadUrl 数据加载URL
		 * @param {Function} successCallback 参数(result,opts)。服务端正常响应情况下调用，可通过result.success和result.msg获得服务端返回信息。
		 * @param {Function} failureCallback 参数(result,opts)。服务端异常响应情况下调用，可通过result.success和result.msg获得服务端返回信息。
		 * @param {Object} config 配置项。重点说明listeners配置项，可配置表单“数据加载前”和“数据加载成功后”的监听函数，分别是function beforeload()和function afterload(result, model)。监听函数返回boolean值，true：继续向下执行，false：终止执行
		 */
		formLoad : function(form, grid, loadUrl, successCallback, failureCallback, config) {
			config = config || {};
			var loadId = grid.deleteId || "id";
			var ids = Co.getGridSelectionList(grid, loadId);

			if (!Co.isEmpty(ids)) {
				var id = ids.split(",");
				if (id.length == 1) {
					var params = {};
					params[false === config.useModelLoad ? loadId : "model." + loadId] = id[0];
					Co.formLoadWithoutGrid(form, loadUrl, params, successCallback, failureCallback, config, id[0]);
				} else {
					Co.showError("只能选择一条记录！");
				}
			} else {
				Co.showError("请选择一条记录！");
			}
		},
		/**
		 * 表单信息加载。不与表格关联。
		 * @param {Ext.form.Panel} form 表单
		 * @param {String} loadUrl 数据加载url
		 * @param {Object} params 参数
		 * @param {Function} successCallback 成功回调函数，参数：result, opts。可通过result.success和result.msg获得服务端返回信息。
		 * @param {Function} failureCallback 服务端异常回调函数，参数：result, opts。可通过result.success和result.msg获得服务端返回信息。
		 * @param {Object} config 配置项，参考formLoad方法配置项。
		 * @param {Object} paramsWithoutWrap 没有经过二次包装的参数。若定义此参数，则在successCallback和failureCallback方法回调函数的第3个参数中使用此参数值，否则使用params参数值。
		 */
		formLoadWithoutGrid : function(form, loadUrl, params, successCallback, failureCallback, config, paramsWithoutWrap) {
			config = config || {};
			Ext.apply(config.waitMsg, "正在加载...");

			if (config.listeners && config.listeners["beforeload"] && !config.listeners["beforeload"](paramsWithoutWrap || params)) return false;
			if (loadUrl) {
				Co.request(loadUrl, params, function(result,opts){
					if(true === result.success) {
						var model = result.data;
						var fieldMapping = form.fieldMapping || {};
						form.getForm().getFields().each(function(v){
							var fieldName = v.name;
							// radio自动赋值
							if ((v.xtype == 'radiofield' || v.xtype == 'radio') && !Co.isEmpty(fieldName)) {
								var fieldNames = fieldName.split(".");
								var fieldId = (fieldNames.length > 1) ? fieldNames[1] : fieldNames[0];
								fieldValue = model[fieldMapping[fieldId] ? fieldMapping[fieldId] : fieldId];
								if (v.inputValue == fieldValue) {
									v.setValue(true);
								}
							}
							// checkbox自动赋值
							else if (!Co.isEmpty(fieldName) && (v.xtype == 'checkbox' || v.xtype == 'checkboxfield')) {
								var fieldNames = fieldName.split(".");
								var fieldId = (fieldNames.length > 1) ? fieldNames[1] : fieldNames[0];
								fieldValue = model[fieldMapping[fieldId] ? fieldMapping[fieldId] : fieldId];
								if (fieldValue) {
									var filedValues = fieldValue.replace(" ").split(",");
									if (Ext.Array.contains(filedValues, v.inputValue)) {
										v.setValue(true);
									}
								}
							} else {
								var fieldValue = model[fieldMapping[v.id] ? fieldMapping[v.id] : v.id];
								v.setValue(fieldValue);
							}
						});
					}
					if (config.listeners && config.listeners["afterload"] && !config.listeners["afterload"](result, model)) return false;
					if (successCallback) {
						successCallback(result, opts, paramsWithoutWrap || params);
					} else {
						if (false === result.success) {
							Co.showError(result.msg || "数据加载失败！", null, result);
						}
					}
				}, function(result, opts){
					if (config.listeners && config.listeners["afterload"] && !config.listeners["afterload"](result, model)) return false;
					if (failureCallback) {
						failureCallback(result, opts, paramsWithoutWrap || params);
					} else {
						Co.showError(result.msg || "服务端异常，数据加载失败！", null, result);
					}
				}, config);
			} else {
				if (successCallback) {
					successCallback(null, null, paramsWithoutWrap || params);
				}
			}
		},
		/**
		 * 删除表格中选择的记录
		 * @param {Ext.grid.Panel} grid 表格
		 * @param {String} url 数据删除服务端URL
		 * @param {Function} successCallback 参数(result,opts)。服务端正常响应情况下调用，可通过result.success和result.msg获得服务端返回信息。
		 * @param {Function} failureCallback 参数(result,opts)。服务端异常响应情况下调用，可通过result.success和result.msg获得服务端返回信息。
		 * @param {Object} config 配置项，重点说明listeners配置项，可配置“删除请求提交前”和“服务端返回信息后”的监听函数，分别是function beforedelete(idArray)，参数为待删除记录的ID数组；afterdelete(result, idArray)，参数包括删除结果和已删除的记录ID数组。监听函数返回boolean值，true：继续向下执行，false：终止执行。
		 */
		gridDelete : function(grid, url, successCallback, failureCallback, config) {
			config = config || {};
			var ids = Co.getGridSelectionList(grid, grid.deleteId || "id");
			var deleteParams = config.deleteParams || {};
			if (ids) {
				if (config.listeners && config.listeners["beforedelete"] && !config.listeners["beforedelete"](ids.split(","))) return false;
				Co.confirm(config.msg || "确定删除吗？", function(btn){
					if (btn == "yes") {
						deleteParams["deleteIds"] = ids;
						Co.request(url, deleteParams, function(result, opts){
							if (config.listeners && config.listeners["afterdelete"] && !config.listeners["afterdelete"](result, ids.split(","))) return false;
							if (successCallback) {
								successCallback(result, opts);
							} else {
								Co.alert("删除成功！");	
							}
						}, function(result, opts){
							if (config.listeners && config.listeners["afterdelete"] && !config.listeners["afterdelete"](result, ids.split(","))) return false;
							if (failureCallback) {
								failureCallback(result, opts);
							} else {
								Co.showError(result.msg || "服务端异常，数据删除失败！", null, result);
							}
						});
					}
				});
			} else {
				Co.showError("请选择一条记录！");
			}
		},
		/**
		 * 创建装载表单的窗体
		 * @param {String} title 标题
		 * @param {Ext.form.Panel} form 表单
		 * @param {Integer} width 窗口宽度
		 * @param {Integer} height 窗口高度
		 * @param {String} layout 窗口布局，默认为"fit"，自适应布局
		 * @param {Object} config 主要配置项：layout("fit")；width(500)；height(500),focusEl(窗体显示后焦点位置，元素的ID)；okHandler(表单中的组件收到回车事件后的调用函数)，其他参考Ext.window.Window的config配置项
		 * @return {Co.window.FormWindow}
		 */
		formWindow : function(title, form, width, height, layout, config) {
			config = config || {};
			Ext.apply(config, {
				title : title,
				width : width,
				height : height,
				layout : layout,
				form : form
			});
			return Ext.create("Co.window.FormWindow", config);
		},
		/**
		 * 创建装载表单的窗体，窗体没有标题
		 * @param {Ext.form.Panel} form 表单
		 * @param {Integer} width 窗口宽度
		 * @param {Integer} height 窗口高度
		 * @param {String} layout 窗口布局，默认为"fit"，自适应布局
		 * @param {Object} config 主要配置项：layout("fit")；width(500)；height(500),focusEl(窗体显示后焦点位置，元素的ID)；okHandler(表单中的组件收到回车事件后的调用函数)，其他参考Ext.window.Window的config配置项
		 * @return {Co.window.FormWindow}
		 */
		formWindowWithoutTitle : function(form, width, height, layout, config) {
			config = config || {};
			Ext.apply(config, {
				header : false,
				width : width,
				height : height,
				layout : layout,
				form : form
			});
			return Ext.create("Co.window.FormWindow", config);
		},
		/**
		 * 创建装载文件表单的窗体
		 * @param {String} title 标题
		 * @param {Ext.form.Panel} form 表单
		 * @param {Integer} width 窗口宽度
		 * @param {Integer} height 窗口高度
		 * @param {String} layout 窗口布局，默认为"fit"，自适应布局
		 * @param {Object} config 主要配置项：layout("fit")；width(500)；height(500),focusEl(窗体显示后焦点位置，元素的ID)；okHandler(表单中的组件收到回车事件后的调用函数)，其他参考Ext.window.Window的config配置项
		 * @return {Co.window.FormWindow}
		 */
		fileFormWindow : function(title, form, width, height, layout, config) {
			config = config || {};
			Ext.apply(config, {
				title : title,
				width : width,
				height : height,
				layout : layout,
				form : form
			});
			return Ext.create("Co.window.FileFormWindow", config);
		},
		/**
		 * 创建弹出窗体
		 * @param {String} title 标题
		 * @param {Object[]} items 窗体中包含的组件
		 * @param {Integer} width 窗口宽度
		 * @param {Integer} height 窗口高度
		 * @param {String} layout 窗口布局，默认为"fit"，自适应布局
		 * @param {Object} config 主要配置项：layout("fit")；width(500)；height(500),其他参考Ext.window.Window的config配置项
		 * @return {Co.window.FormWindow}
		 */
		window : function(title, items, width, height, layout, config) {
			config = config || {};
			Ext.apply(config, {
				title : title,
				width : width,
				height : height,
				layout : layout,
				items : items
			});
			return Ext.create("Co.window.Window", config);
		},
		/**
		 * 创建工作流中使用的弹出窗体
		 * @param {String} title 标题
		 * @param {Object[]} items 窗体中包含的组件
		 * @param {Integer} width 窗口宽度
		 * @param {Integer} height 窗口高度
		 * @param {String} layout 窗口布局，默认为"fit"，自适应布局
		 * @param {Object} config 主要配置项：layout("fit")；width(500)；height(500),其他参考Ext.window.Window的config配置项
		 * @return {Co.window.TaskFormWindow}
		 */
		taskWindow : function(title, items, width, height, layout, config) {
			config = config || {};
			Ext.apply(config, {
				title : title,
				width : width,
				height : height,
				layout : layout,
				items : items
			});
			return Ext.create("Co.window.TaskFormWindow", config);
		},
		/**
		 * 创建下拉树
		 * @param {String} id 树ID
		 * @param {String} fieldLabel 下拉标签
		 * @param {String} url 下拉树数据源URL
		 * @param {String} config 主要配置项：textEl(选择的节点文字显示元素ID)；valueEl(选择的节点值存放元素ID)；nodeParam(分级加载时向服务端传递的节点ID参数名)；autoExpand(树加载完成后是否自动全部展开)，其他参考Ext.form.field.ComboBox的config配置项
		 * @return {Co.form.field.ComboBoxTree}
		 */
		comboBoxTree : function(id, fieldLabel, url, config) {
			config = config || {};
			//拼接token
//			url = Co.urlAddToken(url);
			Ext.apply(config, {
				id : id,
				fieldLabel : fieldLabel,
				url : url
			});
			return Ext.create("Co.form.field.ComboBoxTree", config);

		},
		/**
		 * 创建树
		 * @param {String} id 树ID
		 * @param {Ext.data.TreeStore} store 树Store
		 * @param {Object} config 参考Ext.tree.Panel的config配置项
		 * @return {Co.tree.Panel}
		 */
		tree : function(id, store, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				store : store
			});
			return Ext.create("Co.tree.Panel", config);
		},
		/**
		 * 创建表格树
		 * @param {String} id 树ID
		 * @param {Ext.data.TreeStore} store 树Store
		 * @param {Array} columns 表格列
		 * @param {Object} config 参考Ext.tree.Panel的config配置项
		 * @return {Co.tree.GridTreePanel}
		 */
		gridTree : function(id, store, columns, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				store : store,
				columns : columns
			});
			return Ext.create("Co.tree.GridTreePanel", config);
		},
		/**
		 * 创建复选框树
		 * @param {String} id 树ID
		 * @param {Ext.data.TreeStore} store 树Store
		 * @param {Object} config 配置项，参考Ext.tree.Panel配置项
		 * @return {Co.tree.CheckboxTree}
		 */
		checkboxTree : function(id, store, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				store : store
			});
			return Ext.create("Co.tree.CheckboxTree", config);
		},
		/**
		 * 创建表格分页工具条
		 * @param {Ext.data.Store} store 表格Store
		 * @return {Ext.toolbar.Paging}
		 */
		pagingtoolbar : function(store) {
			return {
				xtype : "pagingtoolbar",
				store : store,
				displayInfo : true,
				emptyMsg : "没有符合条件的记录"
			};
		},
		/**
		 * 创建表格
		 * @param {String} id 表格ID
		 * @param {Ext.data.Store} store 表格Store
		 * @param {Array} columns 表格列
		 * @param {Co.toolbar.Toolbar/Object[]} tbar 表格上方工具条
		 * @param {Object/Object[]} bbar 表格下方工具条，若为null，默认加载pagingtoolbar分页组件
		 * @param {Object} config 参考Ext.grid.Panel的config配置项
		 * @return {Co.grid.Panel}
		 */
		grid : function(id, store, columns, tbar, bbar, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				store : store,
				columns : columns,
				tbar : tbar,
				bbar : bbar
			});
			return Ext.create("Co.grid.Panel", config);
		},
		/**
		 * 定义模型
		 * @param {String} modelName 模型名称
		 * @param {Object[]/String[]} fields 模型中包含的字段
		 */
		defineModel : function(modelName, fields) {
			Ext.define(modelName, {
				extend : "Ext.data.Model",
				fields : fields
			});
		},
		/**
		 * 创建树Store
		 * @param {String} id Store id
		 * @param {String} url 数据源URL
		 * @param {Object} config 参考Ext.data.TreeStore的config配置项
		 * @return {Co.data.TreeStore}
		 */
		treeStore : function(id, url, config) {
			config = config || {};
			//拼接token
			url = Co.urlAddToken(url);
			Ext.apply(config, {
				id : id,
				url : url
			});
			return Ext.create("Co.data.TreeStore", config);
		},
		/**
		 * 定义表格Store
		 * @param {String} id Store id
		 * @param {String} url 数据源URL
		 * @param {Ext.data.Model} model
		 * @param {Object} config 主要配置项：autoLoad(true：自动加载数据)；output(Store加载时获取extraParams的组件ID)；sorters(默认的排序字段和顺序)，其他参考Ext.data.Store的config配置项
		 * @return {Co.data.Store}
		 */
		gridStore : function(id, url, model, config) {
			config = config || {};
			//拼接token
			url = Co.urlAddToken(url);
			Ext.apply(config, {
				id : id,
				url : url,
				model : model
			});
			return Ext.create("Co.data.Store", config);
		},
		/**
		 * 加密Store
		 * @param {} id
		 * @param {} url
		 * @param {} model
		 * @param {} config
		 * @return {}
		 */
		gridEncryptStore : function(id, url, model, config) {
			config = config || {};
			//拼接token
			url = Co.urlAddToken(url);
			Ext.apply(config, {
				id : id,
				url : url,
				model : model
			});
			return Ext.create("Co.data.EncryptStore", config);
		},
		/**
		 * 检测组件上是否接收到回车事件，如果收到调用fn进行处理
		 * @param {Object} field 组件
		 * @param {Function} fn 回调函数
		 */
		checkEnter : function(field, fn) {
			var e = Ext.EventObject;
			var isComboBox = false;
			if (e.getKey() == e.ENTER) {
				if (field instanceof Ext.form.field.ComboBox) {
					isComboBox = true;
					if (field.isExpanded && field.picker.highlightedItem) {
						return;
					}
				}
				fn();
				if (isComboBox) {
					field.collapse();
				}
				e.stopEvent();
			}
		},
		/**
		 * 按页数加载表格数据
		 * @param {Ext.data.Store} store 表格Store
		 * @param {Integer} page 页码
		 * @param {Object} params 请求参数
		 */
		loadPage: function (store, page, params, callback) {
			if (store) {
				//添加token
				params = params = Co.addTokenParam(params);
				//params["OPER_USER"] = parent.loginUsername;
				if (params) {
					Ext.apply(store.proxy.extraParams, params);
				}
				if (store instanceof Ext.data.TreeStore) {
					store.load();
				} else {
					store.loadPage(page, callback ? {
						callback : callback
					} : null);
				}
			}
		},
		/**
		 * 加载表格数据
		 * @param {Ext.data.Store} store 表格Store
		 * @param {Object} params 请求参数
		 */
		load: function (store, params, callback) {
			Co.loadPage(store, 1, params, callback);
		},
		/**
		 * 重新加载表格数据
		 * @param {Ext.data.Store} store 表格Store
		 * @param {Object} params 请求参数
		 */
		reload: function (store, params, callback) {
			Co.loadPage(store, store.currentPage, params, callback);
		},
		/**
		 * 设置表格Store查询参数
		 * @param {Ext.data.Store} Store，Ext.data.Store或Ext.data.TreeStore
		 * @return {Boolean} 设置结果。true：设置成功；false：设置失败
		 */
		setStore : function (store) {
			if (!(store instanceof Ext.data.TreeStore) && store.isLoading()) {
				return false;
			}

			Ext.apply(store.proxy.extraParams, Co.getValue(store.output));

			return true;
		},
		/**
		 * 清除表格Store查询参数
		 * @param {} store Store，Ext.data.Store或Ext.data.TreeStore
		 * @return {Boolean} 结果。true：设置成功；false：设置失败
		 */
		resetStore : function(store) {
			if (!(store instanceof Ext.data.TreeStore) && store.isLoading()) {
				return false;
			}
			store.proxy.extraParams = {};
		},
		/**
		 * 获得组件对象上的值
		 * @param {Object} objects 待获得值的组件对象
		 * @param {Boolean} notContainsChildren true：不包含对象的子节点中的值
		 * @return {Object} 组件对象值
		 */
		getValue : function (objects, notContainsChildren) {
			if (Co.isEmpty(objects)) {
				return {}
			}
			var g, f = {}, d, b, j, m, k, i, a, cname;

			function _getValue(n) {
				cname = n.name;
				b = n.id;
				i = n.itemId;
				j = null;
				k = true;
				if (n instanceof Ext.form.field.Checkbox) {
					j = n.getValue() ? 1 : 0;
				} else {
					if (n instanceof Ext.form.CheckboxGroup) {
						j = Co.getIndex(n);
					} else {
						if (n instanceof Ext.form.field.Hidden) {
							j = n.getValue();
						} else {
							if (n instanceof Ext.slider.Single) {
								j = n.getValue();
							} else {
								if (n instanceof Ext.form.field.Date) {
									var value = n.getValue();
									if (value) {
										j = Ext.Date.format(new Date(value), n.format || "Y-m-d H:i:s"); 	
									}
								} else {
									if (n instanceof Ext.form.field.Base || n instanceof Ext.form.field.HtmlEditor) {
										if (n instanceof Ext.form.field.File) {
											k = false;
										} else {
											a = n instanceof Ext.form.field.ComboBox;
											if (a) {
												if (n.inputEl) {
													//j = n.inputEl.dom.value;
													j = n.getValue();
												} else {
													j = "";
												} 
												if (cname) {
													f[cname] = j;
												} else if (b) { 
													f[b] = j;
												} else if (i) {
													f[i] = j;
												}
												k = false;
											}
											if (n.forceList && a) {
												j = Co.getBindValue(n, n.inputEl ? n.inputEl.dom.value : "");
											} else {
												j = n.getValue();
											}
										}
									} else {
										if (n instanceof Ext.grid.Panel) {
											j = Co.encode(Co.getRows(n, n.outputType === "all"));
										} else {
											k = false;
										}
									}
								}
							}
						}
					}
				} 
				if (k) {
					if (cname) {
						f[cname] = j;
					} else if (b) { 
						f[b] = j;
					} else if (i) {
						f[i] = j;
					}
				}
				if (!notContainsChildren && (n instanceof Ext.container.AbstractContainer) && !(n instanceof Ext.form.FieldContainer)) {
					n.items.each(function (o) {
						_getValue(o, f);
					})
				}
			}
			g = Co.getList(objects);
			for (d in g) {
				_getValue(g[d], f);
			}
			return f;
		},
		/**
		 * 获得组件对象数组。如果传入的是字符串，则根据字符串自动查找其对应的Component
		 * @param {Object} obj 组件对象，可以是数组、对象或字符串（通过“,”分隔多个组件名称）
		 * @return {Object[]} 组件对象数组
		 */
		getList: function (obj) {
			var b = [];
			if (Ext.isArray(obj)) {
				b = obj;
			} else {
				if (Ext.isObject(obj)) {
					b.push(obj);
				} else {
					var e, a = obj.split(",");
					for (e in a) {
						b.push(Co.get(Ext.String.trim(a[e])))
					}
				}
			}
			return b;
		},
		/**
		 * 获得选中组件对象所在组件中的索引或值
		 * @param {Object} obj 组件对象
		 * @return {Integer} 索引或值
		 */
		getIndex: function (obj) {
			var e, d, h, g, f;
			if (obj instanceof Ext.grid.Panel) {
				e = obj.getSelectionModel().getSelection();
				if (e.length > 0) {
					return obj.store.indexOf(e[0]);
				}
			} else {
				if (obj instanceof Ext.form.CheckboxGroup) {
					e = obj.getBoxes();
					d = obj instanceof Ext.form.RadioGroup;
					f = [];
					g = e.length;
					for (h = 0; h < g; h++) {
						if (d) {
							if (e[h].getValue()) {
								return e[h].getSubmitValue() !== null ? e[h].getSubmitValue() : 1;
							}
						} else {
							if (e[h].getValue()) {
								f.push(e[h].getSubmitValue() !== null ? e[h].getSubmitValue() : 1);
							}
						}
					}
					if (!d) {
						return f;
					}
				}
			}
			return -1;
		},
		/**
		 * 获得组件中和value对应的valueField或displayField值
		 * @param {Object} obj 组件
		 * @param {Object} value 值
		 * @return {Object} 组件中和value对应的valueField或displayField值
		 */
		getBindValue: function (obj, value) {
			if (Co.isEmpty(value)) {
				return null;
			}
			var i = obj,
			g = i.displayField || i.valueField,
			e, a = undefined;
			(i.store.snapshot || i.store.data).each(function (b) {
				e = b.get(g);
				if (e === value) {
					a = b.get(i.valueField || i.displayField);
					return false;
				}
			});
			return a;
		},
		/**
		 * 获得表格中的值
		 * @param {Ext.grid.Panel} grid 表格
		 * @param {Boolean} isAll true：获得表格中所有值，false：表格中选中的值
		 * @return {Array} 表格中值数组 
		 */
		getRows: function (grid, isAll) {
			var e, b = [];
			if (isAll) {
				grid.store.each(function (f) {
					b.push(f.data)
				})
			} else {
				e = Co.getSelRec(grid);
				Ext.Array.each(e, function (f) {
					b.push(f.data)
				})
			}
			return b;
		},
		/**
		 * 获得表格中选中的记录
		 * @param {Ext.grid.Panel} grid 表格
		 * @return {Ext.data.Model[]} 记录数组
		 */
		getSelRec: function (grid) {
			return grid.getSelectionModel().getSelection();
		},
		/**
		 * 获得表格选中记录数量
		 * @param {Ext.data.Grid} grid 表格
		 * @return {Integer} 记录数量
		 */
		getSelRecCount: function (grid) {
			return grid.getSelectionModel().getCount();
		},
		/**
		 * 对组件上的回车事件进行监控，如果触发事件，则调用fn进行处理
		 * @param {Object} obj 组件
		 * @param {Function} fn 回调函数
		 */
		monEnter : function(obj, fn) {
			var keymap = obj.getKeyMap();
			var registEnter = true;
			//判断是否在该对象上已经注册了ENTER事件，如果已注册，则不会重复注册
			if (Ext.isArray(keymap.bindings)) {
				Ext.each(keymap.bindings, function(binding){
					Ext.each(binding.keyCode, function(code) {
						if (code == Ext.EventObject.ENTER) {
							registEnter = false;
							return false;
						}
					});
					if (registEnter === false) {
						return false;
					}
				})
			}
			if (registEnter) {
				keymap.on(Ext.EventObject.ENTER, function () {
					if (obj.el.isMasked() || Ext.getBody().isMasked()) {
						return;
					}
					b = Ext.EventObject.target;
					if (b && b.type == "textarea") {
						return;
					}
					if (fn) {
						fn(obj);
					}
					Ext.EventObject.stopEvent();
				});
			}
		},
		/**
		 * 发送Ajax请求
		 * @param {String} url 请求URL
		 * @param {Object} params 请求参数
		 * @param {Function} successCallback 成功回调函数
		 * @param {Function} failureCallback 失败回调函数
		 * @param {Object} config 主要配置参数：showWait(false：不显示提交等待提示)，waitMsg(提交等待提示)，其他参考Ext.Ajax.request
		 */
		request : function(url, params, successCallback, failureCallback, config) {
			config = config || {};
			var waitBox;
			if (!(false === config.showWait)) {
				waitBox = Co.showWait(config.waitMsg);
			}

			//请求数据加密
			if (true === config.reqEncrypt) {
				var encryptParams = {};
				//生成sm4密钥
				var sm4Key = generateSM4Key();
				//加密sm4密钥提交给服务端
				encryptParams["SM4_ENCODE_KEY"] = encryptRSA(sm4Key);
				//加密提交的数据
				Ext.Object.each(params, function(key, value, me){
					//encryptParams[key] = key != "OPER_USER" ? encryptRSA(value) : value; //通过RSA算法加密
					encryptParams[key] = key != "OPER_USER" ? sm4Encode(value,sm4Key) : value; //通过SM4算法加密
				});
				Ext.apply(params, encryptParams);
			}

			//请求数据完整性验证
			if (true === config.reqDataIntegrityValid) {

				var OPER_USER = params["OPER_USER"];
				delete params.OPER_USER;
				//进行了对数据的排序。不然数组排序可能跟后端不一样导致加密验证失败。后端使用一样的排序算法
				var keys = Ext.Object.getKeys(params);
				var values = Ext.Object.getValues(params);
				var queryStr = new Array();
				for ( var i = 0; i < keys.length; i++) {
					queryStr.push(keys[i]+"="+values[i]);
				}
				//var queryStr = Ext.Object.toQueryString(params).split("&");
				if (queryStr.length > 0) {
					Ext.Array.sort(queryStr, function(a, b){
						a = a.split("=")[0].toLowerCase();
						b = b.split("=")[0].toLowerCase();
						return a.localeCompare(b);
					});	
					queryStr = queryStr.join("&");
					//queryStr = queryStr.replace(new RegExp("%0A", "g"), " ");
					//var OPER_DATA_SIGN = hex_md5(queryStr);//对请求参数进行组合并获得MD5签名
					var OPER_DATA_SIGN = sm3(queryStr);//对请求参数进行组合并获得sm3签名--更改为sm3验证
					params["OPER_DATA_SIGN"] = OPER_DATA_SIGN;//签名提交到服务器
				}
				params["OPER_USER"] = OPER_USER;
//				params["DIV_MODE"] = "1";
				params["INTEGRITY_VALIDATION_MODE"] = true;

			}
			if (true === config.reqEncrypt) {
//				params["ENCRYPT_MODE"] = "1";
				params["PARAM_DECRYPT_MODE"] = true;
			}

			var cfg = {
					url : url,
					params : params,
					method : "POST",
					timeout : Co.timeout,
					async : config.async === false ? false : true,
							success : function(response, opts) {
								if (waitBox) {
									waitBox.hide();
								}
								var result;

								if (true === config.rspEncrypt) {
									result = strDec(response.responseText, "1", "2", "3");
								} else {
									result = response.responseText;
								}

								if (true === config.rspDataIntegrityValid) {
									if (!checkDIV(result)) {
										Co.showError("数据在传输过程中被篡改，操作终止！如有问题，请与客服联系！");
										return;
									}
									result = result.substring(32, result.length);
								}
								result = Ext.decode(result);

								if (successCallback) {
									successCallback(result, opts);
								} else {
									if (result.success) {
										Co.alert(result.msg || "操作成功！");
									} else {
										Co.showError(result.msg || "操作失败！", null, result);
									}
								}
							},
							failure : function(response, opts) {
								if (waitBox) {
									waitBox.hide();
								}
								var result = null;
								try {
									result = Ext.decode(response.responseText);
								} catch (e) {
								}
								if (failureCallback) {
									failureCallback(result, opts,response);//2020-04-17 彭飞 添加response参数
								} else {
									if(response.status == '999' || response.status == 999){//登录超时不提示，否则会出现两个提示框

									} else if(response.status == '910' || response.status == 910){//登录被挤不提示，否则会出现两个提示框

									} else {
										Co.showError(result.msg || SERVER_INVALID_MSG, null, result);
									}
								}
							}
			};
			Ext.Ajax.request(cfg);

			function checkDIV(result) {
				var sign = result.substring(0, 32);
				result = result.substring(32, result.length);
				return sign == hex_md5(result);
			}
		},
		/**
		 * 获得表格行号对象
		 * @param {String} header 表格行号列名称
		 * @param {Integer} width 列宽度
		 * @return {Ext.grid.RowNumberer} 
		 */
		gridRowNumberer : function(header, width, config) {
//			return Ext.create("Ext.grid.RowNumberer", {header : header || "No.", width : width || 35});
			return Ext.create("Ext.grid.RowNumberer", {header : header || "序号", width : width || 45,align : "center"});
		},
		/**
		 * 重置Form表单
		 * @param {Ext.form.Panel} form 表单
		 * @param {Boolean} isAll true:清除表单所有字段中的值，false:清除表单字段中的值，但不包括隐藏字段，Display字段，只读字段，不可见字段
		 */
		resetForm : function(form, isAll) {
			if (true === isAll) {
				form.getForm().reset();
			} else {
				var fields = form.getForm().getFields();
				if (fields) {
					fields.each(function(field) {
						if (!(field instanceof Ext.form.field.Hidden) && !(field instanceof Ext.form.field.Display) && !(true === field.readOnly) && !field.isHidden() && !field.isDisabled()) {
							field.reset();
						}
					});
				}    		
			}
		},
		/**
		 * 设置对象值
		 * @param {Object} value {text : "text1", date : "2013-11-01"}
		 * @param {Boolean} reset true：重置对象的值
		 */
		setValue : function(value, reset) {
			var n, v, obj;
			for (n in value) {
				obj = Co.get(n);
				if (!obj)
					continue;
				v = value[n];
				if (obj instanceof Ext.form.CheckboxGroup) {
					if (reset) {
						if (!(obj instanceof Ext.form.RadioGroup))
							Co.setIndex(obj, null);
					} else
						Co.setIndex(obj, v);
				} else if (obj instanceof Ext.form.field.Hidden) {
					if (reset)
						obj.xvalue = null;
					else
						obj.xvalue = v;
				} else if (obj instanceof Ext.slider.Single) {
					if (reset)
						obj.setValue(obj.minValue || 0);
					else
						obj.setValue(v);
				} else if (obj instanceof Ext.form.field.Checkbox) {
					if (reset)
						obj.reset();
					else
						obj.setValue(v === 1 || v === true || v === 'on'
							|| v === '1');
				} else if (obj instanceof Ext.form.field.Date
						|| obj instanceof Ext.form.field.Time
						|| obj instanceof Ext.ux.form.field.DateTime) {
					if (reset || Ext.isEmpty(v))
						obj.reset();
					else {
						if (Ext.isString(v))
							v = Co.strToDate(v);
						obj.setValue(v);
					}
				} else if (obj instanceof Ext.form.field.Base
						|| obj instanceof Ext.form.field.HtmlEditor) {
					if (reset)
						obj.reset();
					else
						obj.setValue(v);
				} else if (obj instanceof Ext.tree.Panel) {
					if (reset)
						Co.check(obj, false, false, true);
				}
			}
		},
		/**
		 * 设置对象选中状态。通过v与对象的inputValue进行比较，若全等，则设置对象状态为checked
		 * @param {Object} obj 要设置的对象
		 * @param {Object/Object[]} v 对象值inputValue
		 */
		setIndex : function(obj, v) {
			var b = obj.getBoxes(), j, k, m;
			if (obj instanceof Ext.form.RadioGroup) {
				j = b.length;
				for (k = 0; k < j; k++) {
					b[k].setValue(true);
					if (b[k].getSubmitValue() === v) {
						break;
					}
					b[k].setValue(false);
				}
			} else {
				j = b.length;
				if (v && !Ext.isArray(v)) {
					v = [v];
				}
				if (Ext.isArray(v)) {
					var isSet;
					for (k = 0; k < j; k++) {
						b[k].setValue(true);
						for (m = 0; m < v.length; m++) {
							if (v[m] === b[k].getSubmitValue()) {
								break;
							}
						}
						if (m >= v.length) {
							b[k].setValue(false);
						}
					}
				}
			}
		},
		/**
		 * 字符串转换为日期时间
		 * @param {String} s 字符串形式的日期时间
		 * @param {Boolean} hasTime true：采用日期时间格式Co.datetimeFormat，false：采用日期格式Co.dateFormat
		 * @return {Date} 转换后的日期对象
		 */
		strToDate : function(s, hasTime) {
			if (true === hasTime) {
				return Ext.Date.parse(s, Co.datetimeFormat);
			}
			return Ext.Date.parse(s, Co.dateFormat);
		},
		/**
		 * 日期时间转换为字符串
		 * @param {Date} dt 日期时间
		 * @param {Boolean} hasTime true：采用日期时间格式Co.datetimeFormat，false：采用日期格式Co.dateFormat
		 * @return {String} 转换后的字符串对象
		 */
		dateToStr : function(dt, hasTime) {
			if (Co.isEmpty(dt))
				return '';
			//var f = Ext.form.field.Date.prototype.format, t = Ext.form.field.Time.prototype.format;
			if (hasTime === true)
				f = Co.datetimeFormat;
			else 
				f = Co.dateFormat;
			if (!Ext.isDate(dt))
				dt = Co.strToDate(dt);
			return Ext.Date.format(dt, f);
		},
		/**
		 * 设置CheckedTree的选中状态，包括节点和子节点
		 * @param {Ext.tree.Panel} tree 树
		 * @param {Boolean} checked 是否选中，true：选中，false：取消选中
		 * @param {Boolean} expand true：展开被选中的节点
		 * @param {Boolean} isAll true：checked/unchecked树中所有节点
		 * @param {Function} cb 节点选中后的回调函数
		 */
		check : function(tree, checked, expand, isAll, cb) {
			var b, s, v, i = 0;
			if (checked)
				b = true;
			else
				b = false;
			s = Co.getSelNode(tree);
			if (!s || isAll)
				s = tree.getRootNode();
			function fx(c) {
				v = c.get('checked');
				if (v !== undefined && v !== null && v != b) {
					c.set('checked', b);
					c.commit();
					tree.fireEvent('checkchange', c, b);
				}
				c.eachChild(function(n) {
					fy(n);
				});
				i--;
				if (i == 0 && cb)
					cb();
			}

			function fy(c) {
				i++;
				if (expand) {
					c.expand(false, function() {
						fx(c);
					});
				} else
					fx(c);
			}
			fy(s);
		},
		/**
		 * 获得树中第一个被选中的节点
		 * @param {Ext.tree.Panel} tree 树
		 * @param {Boolean} retRoot true：如果没有节点被选中，则返回根节点
		 * @return {Ext.data.NodeInterface} 选中的节点对象
		 */
		getSelNode : function(tree, retRoot) {
			var n = tree.getSelectionModel().getSelection();
			if (n && n.length > 0)
				return n[0];
			return retRoot ? tree.getRootNode() : null;
		},
		/**
		 * 获得文件类型
		 * @param {String} fileName 文件名称
		 * @return {String} 文件类型，如zip, jpg
		 */
		getFileExtension : function(fileName) {
			if (fileName) {
				var index = fileName.lastIndexOf(".");
				if (-1 !== index) {
					return fileName.substring(index + 1, fileName.length);
				}
			}
			return "";
		},
		/**
		 * 获得不包含路径的文件名
		 * @param {String} filePath 文件路径
		 * @return {String} 文件名
		 */
		getFileName : function(filePath) {
			if (filePath) {
				var index = filePath.lastIndexOf("\\");
				if (-1 === index) {
					index = filePath.lastIndexOf("/");
				}
				if (-1 !== index) {
					return filePath.substring(index + 1, filePath.length);
				}
			}
			return filePath;
		},
		/**
		 * 创建表单
		 * @param {String} url 表单数据加载URL
		 * @param {Object[]} items 表单项
		 * @param {Object} config 参考Ext.form.Panel配置项
		 * @return {Co.form.Panel} 
		 */
		form : function(url, items, config) {
			config = config || {};
			//拼接token
			url = Co.urlAddToken(url);
			Ext.apply(config, {
				url : url,
				items : items
			});

			return Ext.create("Co.form.Panel", config);
		},
		/**
		 * 创建详情表单
		 * @param {String} url 表单数据加载URL
		 * @param {Object[]} items 表单项
		 * @param {Object} config 参考Ext.form.Panel配置项
		 * @return {Co.form.Panel} 
		 */
		detailForm : function(url, items, config) {
			config = config || {};
			//拼接token
			url = Co.urlAddToken(url);
			Ext.apply(config, {
				url : url,
				items : items
			});

			return Ext.create("Co.form.DetailPanel", config);
		},

		/**
		 * 创建详情Tab页
		 * @param {String} id
		 * @param {Object[]} items
		 */
		detailTab : function(id, items) {
			var tabPanel = Ext.create("Ext.tab.Panel", {
				layout : "fit",
				enableTabScroll : true,
				activeTab : 0,
				border : false,
				frame : false
			});

			Ext.each(items, function(item){
				var obj = {
						id : item.id || "detailTab_" + Ext.id(),
						closable : false,
						layout : "fit",
						title : item.title,
						iconCls : item.iconCls || "applicationIcon",
						scripts : true,
						items : item.items,
						listeners : item.listeners
				};
				Ext.applyIf(obj, item);
				tabPanel.add(obj);
			});

			return tabPanel;
		},
		/**
		 * 创建本地数据源的ComboBox
		 * @param {String} id 组件ID
		 * @param {String} name 组件Name
		 * @param {String} fieldLabel 显示名称
		 * @param {Object[]} data 本地数据
		 * @param {Object} config 参考Ext.form.field.ComboBox配置项
		 * @return {Co.form.field.ComboBoxLocal}
		 */
		comboBoxLocal : function(id, name, fieldLabel, data, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				name : name,
				fieldLabel : fieldLabel,
				data : data
			});

			return Ext.create("Co.form.field.ComboBoxLocal", config);
		},
		/**
		 * 创建服务端数据源的ComboBox
		 * @param {String} id 组件ID
		 * @param {String} name 组件Name
		 * @param {String} fieldLabel 显示名称
		 * @param {String} url 获取数据url
		 * @param {Object} config 参考Ext.form.field.ComboBox配置项
		 * @return {Co.form.field.ComboBoxRemote}
		 */
		comboBoxRemote : function(id, name, fieldLabel, url, config) {
			config = config || {};
			//拼接token
			url = Co.urlAddToken(url);
			Ext.apply(config, {
				id : id,
				name : name,
				fieldLabel : fieldLabel,
				url : url
			});

			return Ext.create("Co.form.field.ComboBoxRemote", config);
		},
		/**
		 * 创建基于数据字典的ComboBox
		 * @param {String} id 组件ID
		 * @param {String} name 组件Name
		 * @param {String} fieldLabel 显示名称
		 * @param {String} type 字典类型，在数据字典中定义
		 * @param {String} config 参考Ext.form.field.ComboBox配置项
		 * @return {Co.form.field.ComboBoxDict}
		 */
		comboBoxDict : function(id, name, fieldLabel, type, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				name : name,
				fieldLabel : fieldLabel,
				type : type
			});
			return Ext.create("Co.form.field.ComboBoxDict", config);
		},
		/**
		 * 创建基于数据字典的Radio
		 * @param {String} id 组件ID
		 * @param {String} name 组件Name
		 * @param {String} fieldLabel 显示名称
		 * @param {String} type 字典类型，在数据字典中定义
		 * @param {String} config 参考Ext.form.field.ComboBox配置项
		 * @return {Co.form.field.ComboBoxDict}
		 */
		radioGroupDict : function(id, name, fieldLabel, type, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				name : name,
				fieldLabel : fieldLabel,
				type : type
			});
			return Ext.create("Co.form.field.RadioGroupDict", config);
		},
		/**
		 * 创建基于数据字典的Checkbox
		 * @param {String} id 组件ID
		 * @param {String} name 组件Name
		 * @param {String} fieldLabel 显示名称
		 * @param {String} type 字典类型，在数据字典中定义
		 * @param {String} config 参考Ext.form.field.ComboBox配置项
		 * @return {Co.form.field.ComboBoxDict}
		 */
		checkboxGroupDict : function(id, name, fieldLabel, type, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				name : name,
				fieldLabel : fieldLabel,
				type : type
			});
			return Ext.create("Co.form.field.CheckboxGroupDict", config);
		},

		/**
		 * 创建Toolbar
		 * @param {String} id 组件ID
		 * @param {Object[]} items 工具栏项
		 * @param {Object} config 参考Ext.toolbar.Toolbar配置项
		 * @return {Co.toolbar.Toolbar}
		 */
		toolbar : function(id, items, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				items : items
			});
			return Ext.create("Co.toolbar.Toolbar", config);
		},
		/**
		 * 获得数据字典中的显示信息
		 * @param {String} type 数据字典类型
		 * @param {String} value 值
		 * @return {String} 显示信息
		 */
		dictText : function(type, value) {
			if (type) {
				var store = Ext.StoreMgr.lookup(type + "Store");
				if (store) {
					var record = store.findRecord("dictValue", value);
					if (record) {
						return record.get("dictText");
					}
				}
			}
			return "";
		},
		/**
		 * 获得数据字典中的显示信息
		 * @param {String} type 数据字典类型
		 * @param {String} value 值
		 * @return {String} 显示信息
		 */
		dictRecords : function(type) {
			if (type) {
				var store = Ext.StoreMgr.lookup(type + "Store");
				if (store) {
					var records = store.data.items;
					var dictRecords = [];
					for (var i = 0; i < records.length; i++) {
						dictRecords.push({
							"dictText":records[i].data["dictText"],
							"dictValue":records[i].data["dictValue"]
						});
					}
					return dictRecords;
				}
			}
			return [];
		},
		/**
		 * 根据图标类型获取图标路径
		 * @param {String} iconClass 图标类型
		 * @return {String} 显示信息
		 */
		iconPath : function(iconClass) {
			if (iconClass) {
				var store = Ext.StoreMgr.lookup("IconStore");
				if (store) {
					var record = store.findRecord("iconClass", iconClass);
					if (record) {
						return record.get("iconPath");
					}
				}
			}
			return "";
		},
		/**
		 * 操作密码验证
		 * @param {Function} fn
		 * @param {String} msg
		 */
		operatePwdCheck : function(fn, msg) {
			var window = Co.window("提示", [{
				xtype : "label",
				text : "请输入操作密码："
			},{
				xtype : "textfield",
				inputType : "password",
				name : "operPwd",
				id : "operPwd"
			}], 220, 130, "form", {
				bodyPadding : "10 10 10 10 ",
				buttons : [{
					id : "__operatePwdCheck_okBtn__",
					text : "确定",
					handler : function() {
						var obj = Ext.getCmp("operPwd");
						var value = obj.getValue();
						if (!Co.isEmpty(value)) {
							//服务端验证提交的操作密码是否正确
							Co.request(rootPath+"/user/securityService/operatePasswordValidate", {"operPwd" : hex_md5(value)}, function(result){
								if (result.success) {
									fn();
								} else {
									Co.showError(result.msg);
								}
							});
							window.close();
						} else {
							Co.showError("请输入操作密码！", function(){
								obj.focus(true);
							});
						}
					}
				}],
				listeners : {
					show : function() {
						Ext.getCmp("operPwd").focus(true);
						Co.monEnter(window, function(){
							Ext.getCmp("__operatePwdCheck_okBtn__").handler();
						});
					}
				},
				closeAction : "destroy",
				maximizable : false
			});
			window.show();
		},
		/**
		 * 打开用户选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		userSelector : function(config) {
			Ext.create("Co.selector.User", config).show();
		},
		/**
		 * 打开用户选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		groupUserSelector : function(config) {
			Ext.create("Co.selector.GroupUser", config).show();
		},
		singleUserSelector : function(config) {
			Ext.create("Co.selector.singleUser", config).show();
		},

		/**
		 * 打开角色选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		roleSelector : function(config) {
			Ext.create("Co.selector.Role", config).show();
		},
		/**
		 * 打开所属科室选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		orgSelector : function(config) {
			Ext.create("Co.selector.Org", config).show();
		},
		/**
		 * 打开样品分类选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		sampleClassSelector : function(config) {
			Ext.create("Co.selector.SampleClass", config).show();
		},
		singleSampleClassSelector : function(config) {
			Ext.create("Co.selector.SingleSampleClass", config).show();
		},

		/**
		 * 打开项目选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		projectSelector : function(config) {
			Ext.create("Co.selector.Project", config).show();
		},
		SCProjectSelector : function(config) {
			Ext.create("Co.selector.SCProject", config).show();
		},

		/**
		 * 打开项目选择器（按所属科室选择）
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		projectByOrgSelector : function(config) {
			Ext.create("Co.selector.ProjectByOrg", config).show();
		},
		/**
		 * 打开设备选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		deviceSelector : function(config) {
			Ext.create("Co.selector.Device", config).show();
		},
		/**
		 * 打开仪器设备选择器（按所属科室选择）
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		deviceByOrgSelector : function(config) {
			Ext.create("Co.selector.DeviceByOrg", config).show();
		},
		/**
		 * 打开客户选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		customerSelector : function(config) {
			Ext.create("Co.selector.Customer", config).show();
		},
		/**
		 * 打开样品选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		sampleSelector : function(config) {
			Ext.create("Co.selector.Sample", config).show();
		},
		/**
		 * 打开人员选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		employeeSelector : function(config) {
			Ext.create("Co.selector.Employee", config).show();
		},
		/**
		 * 打开人员选择器。关联用户
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		employeeJoinUserSelector : function(config) {
			Ext.create("Co.selector.EmployeeJoinUser", config).show();
		},
		/**
		 * 打开专家选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		expertSelector : function(config) {
			Ext.create("Co.selector.Expert", config).show();
		},
		/**
		 * 打开标准选择器（按所属科室选择）
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		standardByOrgSelector : function(config) {
			Ext.create("Co.selector.StandardByOrg", config).show();
		},
		/**
		 * 打开条码选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		barCodeSelector : function(config) {
			Ext.create("Co.selector.BarCode", config).show();
		},
		/**
		 * 打开检测机构选择器
		 * @param {Object} config 配置项，参考Ext.window.Window配置项
		 */
		companySelector : function(config) {
			Ext.create("Co.selector.Company", config).show();
		},
		/**
		 * 创建触发器
		 * @param {String} id 触发器ID
		 * @param {String} name 触发器name
		 * @param {String} fieldLabel 显示名称
		 * @param {Function} triggerHandler 触发回调函数
		 * @param {Object} config 配置项。参考Ext.form.field.Trigger配置项
		 * @return {Co.trigger.Trigger}
		 */
		trigger : function(id, name, fieldLabel, triggerHandler, config) {
			config = config || {};
			Ext.apply(config, {
				id : id,
				name : name,
				fieldLabel : fieldLabel,
				triggerHandler : triggerHandler
			});
			return Ext.create("Co.trigger.Trigger", config);
		},
		/**
		 * 刷新Stroe的记录，并重新勾选。防止load之后 某些值为原来值
		 */
		flushGridStoreRecord : function(grid,store){
			var records = Co.getSelRec(grid);
			grid.getSelectionModel().clearSelections();//清空选中的
			grid.getView().refresh();
			var selModel = grid.getSelectionModel();
			Ext.each(records, function(record){
				var index = store.find("id", record.data.id);
				if (-1 != index) {
					selModel.select(index, true);
				}
			});
		},
		/**
		 * 打开页面并携带当前的token
		 * @param {String} url 页面路径
		 * @param {String} 携带的token。可以为空
		 */
		windowOpenByToken : function(url,token){
			if(!token){
				token = Co.getToken();
			}
			url = Co.urlAddToken(url);
			window.open(url);
		},

		/**
		 * 重定向页面并携带token
		 */
		windowLocationByToken : function(url,token){
			if(!token){
				token = Co.getToken();
			}
			url = Co.urlAddToken(url);
			window.location = url;
		},

		/**
		 * 获取当前存放的令牌
		 * @return {String}
		 */
		getToken : function(){
			return Co.getCookie(TOKEN);
		},
		/**
		 * 参数中添加token参数
		 * @params 请求参数
		 * @return 添加token后的请求参数
		 */
		addTokenParam : function (params){
			params = params || {};
			//添加token
			params[TOKEN] = Co.getToken();
			return params;
		},
		/**
		 * url中追加token参数
		 * @param url 请求url
		 * @return 添加了token参数的url
		 */
		urlAddToken : function(url){
			if( null == url ){
				return null;
			}
			var token = Co.getToken();
			if(url.indexOf("?")!=-1){
				url = url+"&"+TOKEN+"="+token;
			} else {
				url = url+"?"+TOKEN+"="+token;
			}
			return url;
		},

		/**
		 * 验证电话号码
		 * @param {String} 电话号码
		 * @return {String/boolean} true 验证通过。其他为验证错误的提示。
		 */
		checkTel : function(tel){
			//var regTel1 = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(tel);//带区号的固定电话
			//var regTel2 = /^(\d{7,8})(-(\d{3,}))?$/.test(tel);//不带区号的固定电话
			var isTel = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
			if (tel != "") {
//				if (!regTel1 && !regTel2) { 
//				return "电话号码输入有误！";
//				}
				if(!isTel.exec(tel) ){
					return "电话号码输入有误！";
				}
			} else {
				return true;
			}
			return true;
		},

		/**
		 * 验证手机号
		 * @param {String} 手机号码
		 * @return {String/boolean} true 验证通过。其他为验证错误的提示。
		 */
		checkMobile : function(mobile){
			var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
			// 验证手机号码
			if(mobile == ""){
				return true;
			}
			if (!isMobile.exec(mobile) && mobile.length != 11) {
				return "请正确填写手机号码!";
			}
			return true;
		},


		/**
		 * 验证传真
		 * @param {String} 传真号码
		 * @return {String/boolean} true 验证通过。其他为验证错误的提示。
		 */
		checkFax : function(fax){
			var isFax = /^(\d{3,4}-)?\d{7,8}$/;
			// 验证手机号码
			if(fax == ""){
				return true;
			}
			if (!isFax.exec(fax)) {
				return "请正确填写传真号码!";
			}
			return true;
		},

		/**
		 * 验证邮政编码
		 */
		checkPostCode : function(postCode){
			var re= /^[1-9][0-9]{5}$/;
			// 验证手机号码
			if(postCode == ""){
				return true;
			}
			if (!re.exec(postCode)) {
				return "请正确填写邮政编码!";
			}
			return true;
		},

		/**
		 * 验证文件大小
		 * @param {String} 文件组件id。这个id为ExtJs中组件(xtype : "filefield")的id
		 * @param {Integer} 最小文件大小 单位kb
		 * @param {Integer} 最大文件大小 单位kb
		 * @return {String/boolean} 验证通过返回true，否则返回对应的错误提示
		 */
		checkFileSize : function(id,minSize,maxSize){
			//取控件DOM对象
			var field = document.getElementById(id);
			//取控件中的input元素
			var inputs = field.getElementsByTagName('input');
			var fileInput = null;
			var il = inputs.length;
			//取出input 类型为file的元素
			for(var i = 0; i < il; i ++){
				if(inputs[i].type == 'file'){
					fileInput = inputs[i]; 
					break;
				}
			}
			if(fileInput != null){
				var fileSize = Co.getFileSize(fileInput);
				if( minSize && fileSize < minSize ){
					return "文件不得小于"+Co.getFileSizeStr(minSize);
				}
				if( maxSize && fileSize > maxSize){
					return "文件不能大于"+Co.getFileSizeStr(maxSize);
				}
			}
			return true;
		},

		//计算文件大小，返回文件大小值，单位K
		getFileSize : function (target){
			//是否是ie浏览器
			var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
			var fs = 0;
			if (isIE && !target.files) {
				var filePath = target.value;
				var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
				var file = fileSystem.GetFile (filePath);
				fs = file.Size; 
			}else if(target.files && target.files.length > 0){
				fs = target.files[0].size;
			}else{
				fs = 0;
			}
			if(fs > 0){
				fs = fs / 1024;
			}
			return fs;
		},

		/**
		 * 获取文件大小字符。
		 * 1、fileSize < 1024 return fileSize+KB
		 * 2、fileSize > 1024 && fileSize < 1024 * 1024 return fileSize/1024+MB
		 * 3、fileSize > 1024 * 1024 && fileSize < 1024 * 1024 * 1024 return fileSize/1024/1024+GB
		 * @param {Integer} 文件的大小 单位B
		 * @return {String} 文件大小描述
		 */
		getFileSizeStr : function(fileSize){
			//小数位数
			var decimalDigits = 2;
			if( fileSize < 1024 ){
				return fileSize+"B";
			} else if( fileSize >= 1024 && fileSize < 1024 * 1024 ){
				return (fileSize/1024).toFixed(decimalDigits) + "KB";
			} else if( fileSize >= 1024 * 1024 && fileSize < 1024 * 1024 * 1024 ){
				return (fileSize/1024/1024).toFixed(decimalDigits) + "MB";
			} else {
				return (fileSize/1024/1024/1024).toFixed(decimalDigits)+ "GB";
			}
		},

		/**
		 * 下载文件
		 * 且该下载和验证路径为BaseFileController中的方法
		 * @param {String} 下载文件路径
		 * @param {String} 验证文件是否存在的路径
		 * @param {String} model.id
		 */
		downloadFile : function(downloadUrl,existFileUrl,id){
			Co.request(existFileUrl, {
				"model.id" : id
			}, function(result, opts) {
				if (true === result.success) {
					window.location = downloadUrl+"?model.id=" + id;
				} else {
					Co.showError("文件不存在！");
				}
			});
		},

		/**
		 * 添加标签页。
		 * 如果当前页面为index页面的子页面时，将添加到index页的tab中。
		 * 如果当前页面不为index页面的子页面时，将弹出一个新页面
		 * @param {String} id module.id 可空
		 * @param {String} title 标签页的title 可空
		 * @param {String} icon 图标 可空
		 * @param {String} url 标签页请求路径。非空。
		 * @param {String} refresh 如果以存在当前tab。则判断是否重新载入页面
		 */
		addTab : function(id, title, icon, url,refresh){
			if(top.location != self.location){
				var data = {"id":id,"title":title,"icon":icon,"url":url,"refresh":refresh};
				//var indexUrl = "http://192.168.0.159:11001/index";
				window.parent.postMessage({"data":data,"type":"addTab"},'*');
			} else {
				Co.windowOpenByToken(url);
			}
		},

		/**
		 * 获取选中的单一的记录
		 */
		getGridSelectSingleRecord : function(grid){
			var signUpRecords = Co.getSelRec(grid);
			if (signUpRecords && signUpRecords.length >= 1) {
				if( signUpRecords.length > 1 ){
					Co.showError("只能选择一条记录！");
				} else {
					return grid.getSelectionModel().getSelection()[0];
				}
			}else{
				Co.showError("请选择记录！");
			}
		},
		/**
		 * 显示筛选器。
		 * 注意需要引入commonFiltrate.js
		 * @param {Object} columns Extjs 列对象
		 * @param {Object} config 配置对象
		 * 			fieldNameMapping:字段名称映射
		 * 			fieldTypeMapping:字段类型映射
		 * 			fieldDictTypeMapping:字典映射
		 * 			fieldSupportOperatorsMapping:字段支持操作符映射
		 */
		showFilter : function(columns,store,config){
			openFilterWindow(columns,store,config);
		},

		/**
		 * 验证radio 如果不允许为空则弹框提示
		 */
		checkRadioBlank : function(id){
			var radio = Ext.getCmp(id);
			if( radio && radio.allowBlank == false ){//不允许为空
				if (radio.getChecked().length < 1) {
					Co.showError(Ext.getCmp(id).blankText);
					return false;
				}
			}
			return true;
		}




};
/**
 * 监听添加tab。当前只在首页的tab中添加
 * 监听与Co.addTab方法一起使用
 * @param 
 * @returns
 */
//window.addEventListener("message",function(e){
addEvents(window,"message",function(e){
	var type = e.data.type;
	if(type == "addTab"){
		var data = e.data.data;
		if(window.indexTab){
			var id = data.id, title = data.title, icon = data.icon, url = data.url,refresh = data.refresh;
			var queryUrl;
			try {
				var indexOf = url.indexOf("?");
				if( indexOf == -1 ){
					queryUrl = url;
				} else {
					queryUrl = url.substring(0,url.indexOf("?"));
				}
			} catch (e) {
				queryUrl = url;
			}
			Co.request(API.queryModule, {"model.moduleUrl" : queryUrl,"page":1,"limit":1}, function(result, opts){
				if(result.total > 0){
					var module = result.root[0];
					id = id || module.id;
					title = title || module.moduleName;
					icon = icon || module.moduleIcon || "cmpIcon";
				}
				addTab(id,title,icon,url,refresh);
			},null,{
				showWait : true
			});
		} else {
			Co.addTab(data.id,data.title,data.icon,data.url,data.refresh);
		}
	}
});

