
Co.initialize(Co.timeout, {
	"Ext.ux" : staticResourcesRootPath+"/js/extjs/ux"
});

//标签面板
var tabPanel;

var defaultIndexUrl = rootPath + "/statistic/index";
//var defaultIndexUrl = "";

var API = {
		/*getModule : "http://192.168.0.159:12510/module/getModuleTree",
		queryModule : "http://192.168.0.159:12510/module/query",*/
		getModule : rootPath + "/module/getModuleTree",
		queryModule : rootPath + "/module/query",
		queryUnReadMessage : "/message/queryUnReadMessage",
		readMessage : "/message/readMessage",
		passwordDIVCheck : "/user/passwordDIVCheck"
};

Ext.onReady(function(){	
	//系统右侧TabPanel
	tabPanel = Ext.create("Ext.tab.Panel", {
		layout : "fit",
		enableTabScroll : true,
		activeTab : 0,
		border : false,
		frame : false,
		items : [{
			closable : false,
			id : "index",
			layout : "fit",
			title : "首页",
			iconCls : "index",
			scripts : true,
			html : "<iframe scrolling = 'auto' frameborder = '0' width = '100%' height = '100%' src = '"+defaultIndexUrl+"'></iframe>"
		}],
		plugins : Ext.create('Ext.ux.TabCloseMenu', {
			closeAllTabsText : "关闭所有",
			closeOthersTabsText : "关闭其他",
			closeTabText : "关闭"
		})
	});

	var viewport = Ext.create("Ext.container.Viewport", {
		layout : "border",
		border : false
	});
	var viewport_items = [];
	
	
	
	viewport_items.push({
		region : "center",
		padding : "0 0 0 0",
		layout : "fit",
		items : tabPanel
	});

	viewport.add(viewport_items);

});

/**
 * 添加一个tab
 * @param id tab的id
 * @param title 标题
 * @param icon 图标
 * @param url src
 * @param refresh 是否重新载入页面
 * @returns
 */
function addTab(id, title, icon, url,refresh) {
	if (!Co.isEmpty(url) && !("null" === url)) {
		url = Co.urlAddToken(url);
		//url = url+"?"+TOKEN+"="+Co.getToken();
		var tab = tabPanel.getComponent(id);
		var iframeId;
		if(id){
			iframeId = id+"Iframe";
		}
		if (!tab) {
			Ext.Msg.wait("页面正在加载，请稍候...", "提示");
			var html = "<iframe ";
			if(id){
				html += " id = "+ iframeId
			}
			//iframe的id默认为tab的id+Iframe。如果没有指定tab的id则iframe不存在id
			html += " scrolling = 'auto' frameborder = '0' width = '100%' height = '100%' onload='Ext.Msg.hide()' src = '" + url + "'></iframe>";
			tab = tabPanel.add({
				id : id,
				closable : true,
				layout : "fit",
				title : title,
				iconCls : icon,
				scripts : true,
				html : html
			});
		} else {
			//如果需要重新刷新页面
			if(refresh === true){
				Ext.Msg.wait("页面正在加载，请稍候...", "提示");
				document.getElementById(iframeId).src = url;
			}
		}
		tabPanel.setActiveTab(tab);
	}
}
/**
 * 消息监控。
 * 字页面发出消息。添加tab
 * @param e
 * @returns
 */
//window.addEventListener("message",function(e){
//	var data = e.data.data;
//	var id = data.id, title = data.title, icon = data.icon, url = data.url;
//	Co.request(API.queryModule, {"model.moduleUrl" : data.url,"page":1,"limit":1}, function(result, opts){
//		if(result.total > 0){
//			var module = result.root[0];
//			id = id || module.id;
//			title = title || module.moduleName;
//			icon = icon || module.moduleIcon || "cmpIcon";
//		}
//		addTab(id,title,icon,url);
//	},null,{
//		showWait : false
//	});
//});