
Co.initialize(Co.timeout, {
	"Ext.ux" : "js/extjs/ux"
});

//标签面板
var tabPanel;

var systemManagerModuleNo = "00000005";

var API = {
		getModule : ModuleServiceInterface.getModuleTree,
		queryModule : ModuleServiceInterface.queryModule,
		queryUnReadMessage : "/message/queryUnReadMessage",
		readMessage : "/message/readMessage",
		passwordDIVCheck : "/user/passwordDIVCheck"
};

Ext.onReady(function(){
	//系统管理左侧菜单
	var systemMenu = Ext.create("Ext.panel.Panel", {
		region: "west",
		id: "west_menu",
		title: "功能菜单",
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
		items: []
	});

	//动态获得系统菜单
	Co.request(API.getModule+"?isAuth=false", null, function(result, opts){
		var rootModules = eval(result);
		if (rootModules) {
			//遍历根模块，生成模块树
			for (var i = 0; i < rootModules.length; i++) {
				var module = rootModules[i];
				if(module.extraParam3 != systemManagerModuleNo){
					continue;
				}
				var getModuleUrl = API.getModule + "?recursion=true&autoExpand=true&parentModuleNo=" + module.extraParam3;
				//添加token
				getModuleUrl = Co.urlAddToken(getModuleUrl);
				var moduleStore = Co.treeStore(module.id + "_store",getModuleUrl, {
					autoLoad : true
				});
				var modulePanel = Co.tree(module.id + "_tree", moduleStore, {
					title : module.text,
					iconCls: module.iconCls,
					autoScroll: true,
					border: false,
					listeners : {
						itemclick : function(me, module, eOpts) {
							if (module) {
								addTab(module.data.id, module.data.text, module.data.iconCls, module.data.extraParam2);
							}
						}
					}
				});
				systemMenu.add(modulePanel);
			}
			systemMenu.doLayout();
		}
	},null,{
		waitMsg : "正在加载系统模块，请稍候..."
	});

	//系统右侧TabPanel
	tabPanel = Ext.create("Ext.tab.Panel", {
		layout : "fit",
		enableTabScroll : true,
		activeTab : 0,
		border : false,
		frame : false,
		items : [/*{
			closable : false,
			layout : "fit",
			title : "首页",
			iconCls : "application_homeIcon",
			scripts : true,
			html : "<iframe scrolling = 'auto' frameborder = '0' width = '100%' height = '100%' src = ''></iframe>"
		}*/],
		plugins : Ext.create('Ext.ux.TabCloseMenu', {
			closeAllTabsText : "关闭所有",
			closeOthersTabsText : "关闭其他",
			closeTabText : "关闭"
		})
	});

	var viewport = Ext.create("Ext.container.Viewport", {
		layout : "border",
//		items : [{
//		region : "north",
//		contentEl: "north",
//		hidden : true
//		},systemMenu, {
//		region : "center",
//		padding : "0 0 0 0",
//		layout : "fit",
//		items : tabPanel
//		}],
		border : false
	});

	var viewport_items = [];
	if (!("no" == showTop)) {
		document.getElementById("north").style.visibility = "visible";
		viewport_items.push({
			region : "north",
			contentEl: "north"
		});
	}
	viewport_items.push(systemMenu);
	viewport_items.push({
		region : "center",
		padding : "0 0 0 0",
		layout : "fit",
		items : tabPanel
	});

	viewport.add(viewport_items);

//	var runner = new Ext.util.TaskRunner();
//	var task = runner.start({
//	run: checkMessage,
//	interval: 60000
//	});
});

function addTab(id, title, icon, url) {
	if (!Co.isEmpty(url) && !("null" === url)) {
		url = url+"?"+TOKEN+"="+Co.getToken();
		var tab = tabPanel.getComponent(id);
		if (!tab) {
			Ext.Msg.wait("页面正在加载，请稍候...", "提示");
			tab = tabPanel.add({
				id : id,
				closable : true,
				layout : "fit",
				title : title,
				iconCls : icon,
				scripts : true,
				html : "<iframe scrolling = 'auto' frameborder = '0' width = '100%' height = '100%' onload='Ext.Msg.hide()' src = '" + url + "'></iframe>"
			});
		}
		tabPanel.setActiveTab(tab);
	}
}

function checkMessage() {
	var notifyFlag = Co.getCookie("__CO_NOTIFY_FLAG__") || "0";
	if ("0" === notifyFlag) {
		Co.request(API.queryUnReadMessage, null, function(result, opts){

			if (result.total > 0) {
				var msgs = result.root;
				Ext.each(msgs, function(msg){
					Ext.create('Ext.ux.window.Notification', {
						title: Co.dictText("msgType", msg.msgType),
						width : 300,
						position: 'br',
						manager: 'index_center',
						iconCls: 'ux-notification-icon-information',
						autoCloseDelay: 10000,
						spacing: 20,
						html: msg.msgContent,
						notifyListeners : {
							afterdestroy : function() {
								//设置消息为已读
								Co.request(API.readMessage, {"model.id" : msg.id},function(result, opts){

								},null,{
									showWait : false
								});
							},
							noNotifyChecked : function(combobox, newValue, oldValue, eOpts ) {
								if ("1" == newValue) {
									Co.setCookie("__CO_NOTIFY_FLAG__", "1");
								} else {
									Co.setCookie("__CO_NOTIFY_FLAG__", "0");
								}
							},
							viewNotifyContent : function() {
								var viewType = msg.viewType;
								if ("01" === viewType) {
									Co.showInfo(msg.msgContent);
								} else if ("02" === msg.viewType) {
									var parts = msg.viewUrl.split("#");
									if (parts && parts.length >= 2) {
										//0:打开模式(open_window,open_tab)；2:viewUrl; 3,4,5:如果是open_tab，则分别代表模块ID，模块名称，模块图标
										var openMode = parts[0],
										viewUrl = parts[1];
										if ("open_window" === openMode) {
											window.open(viewUrl);
										} else if ("open_tab" === openMode) {
											if (parent.inFrame) {
												window.open(parent.webUrl + "/new_index.action?direct_url=" + viewUrl);
											} else {
												addTab(parts[2], parts[3], parts[4], viewUrl);		
											}
										}
									}
								}
							}
						}
					}).show();
				});
			}
		},null,{
			showWait : false
		});
	}
	//密码篡改检测
	Co.request(API.passwordDIVCheck, {"model.id" : loginUserId}, function(result, opts){
		if (!result.success) {
			Co.showError(result.msg);
		}
	},null,{
		showWait : false
	});
}