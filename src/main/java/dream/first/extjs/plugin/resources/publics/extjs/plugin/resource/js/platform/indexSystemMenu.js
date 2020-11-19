
Co.initialize(Co.timeout, {
	"Ext.ux" : staticResourcesRootPath+"/js/extjs/ux"
});

//标签面板
var tabPanel;

var rootModuleUlId = "parent_ul";

var systemManagerModuleNo = "";

var API = {
		//getModule : "http://192.168.0.159:12510/module/getModuleTree",
		//queryModule : "http://192.168.0.159:12510/module/query",
		//getModule : ModuleServiceInterface.getModuleTree,
		//queryModule : ModuleServiceInterface.queryModule,
		//searchIndex : ModuleServiceInterface.searchIndex
		getModule : rootPath + "/module/getModuleTree",
		queryModule : rootPath + "/module/query"//,
		//searchIndex : ModuleServiceInterface.searchIndex
};

Ext.onReady(function(){

	//动态获得系统菜单
	Co.request(API.getModule, null, function(result, opts){
		var rootModules = eval(result);
		if (rootModules) {
			//遍历根模块，生成模块树
			for (var i = 0; i < rootModules.length; i++) {
				var module = rootModules[i];
				if(module.extraParam3 == systemManagerModuleNo){
					continue;
				}
				//var systemMenu = document.getElementById("v-pills-tab");//通过id号获取frameDiv 的父类（也就是上一级的节点）
				//systemMenu.appendChild(moduleA);//把创建的节点frameDiv 添加到父类body 中；
				addSystemMenu(module);
			}
		}
	},null,{
		waitMsg : "正在加载系统模块，请稍候..."
	});


	function addSystemMenu(module){
		var getModuleUrl = API.getModule + "?recursion=true&autoExpand=true&parentModuleNo=" + module.extraParam3;
		//动态获得系统菜单
		Co.request(getModuleUrl, null, function(result, opts){
			var moduleLi = addModuleTree(module,rootModuleUlId);
			var childrenModules = eval(result);
			if(childrenModules && childrenModules.length > 0){
				addModuleChildren(childrenModules,moduleLi);
			}
			//遍历根模块，生成模块树
//			for (var i = 0; i < childrenModules.length; i++) {
//				var module = childrenModules[i];
//				addModuleTree(module,"parent_ul");
//			}
		},null,{
			async: false
		});
	}

	/**
	 * 添加module树
	 * @param module 模块
	 * @param parentModuleLabelId 父模块 label Id
	 * @return {Object}这个module的li标签对象
	 */
	function addModuleTree(module,parentModuleLabelId){
		var expanded = module.expanded;
		var extraParam1 = module.extraParam1;
		var extraParam2 = module.extraParam2;//模块url
		var extraParam3 = module.extraParam3;//模块编号
		var extraParam4 = module.extraParam4;
		var iconCls = module.iconCls;//图标
		var id = module.id ;//模块id
		var text = module.text ;//模块名称
		var children = module.children;//模块的子模块
		var parentModuleLabel = document.getElementById(parentModuleLabelId);//通过id号获取父类（也就是上一级的节点）

		//模块标签。一个标签为一个模块。模块里面使用a来进行展示
		var moduleLi = document.createElement("li");
		var moduleLiId = "moduleLi_"+id;
		moduleLi.setAttribute("id", moduleLiId);//给创建的a设置id值；
		parentModuleLabel.appendChild(moduleLi);//把创建的节点frameDiv 添加到父类body 中；

		//当前a的层级
		var moduleHierarchy = getModuleHierarchy(moduleLi);
		//模块标签
		var moduleA = document.createElement("a");//创建一个标签
		var moduleId = "module_A"+id;
		moduleA.setAttribute("id", moduleId);//给创建的a设置id值；
		//不是第一列模块
		if( parentModuleLabelId != rootModuleUlId ){
			var sourceTextIndent = (moduleHierarchy * 30) + 12;
			var sourceWidth = 208//225//(moduleHierarchy * 30) + 225;
			moduleA.setAttribute("sourceWidth",sourceWidth);
			moduleA.setAttribute("sourceTextIndent",sourceTextIndent);
			moduleA.setAttribute("style", "text-indent:"+sourceTextIndent+"px;width:"+sourceWidth+"px");
			//moduleA.setAttribute("style", "color: #fff; border-top: 1px solid #ffffff78;text-indent:"+sourceTextIndent+"px;width:"+sourceWidth+"px");
		} else {
			//moduleA.setAttribute("style", "color: #fff; border-top: 1px solid #ffffff78;");
		}
		moduleA.className="nav-link active"; //给创建的a设置class；
		moduleA.setAttribute("data-toggle", "pill");
		moduleA.setAttribute("href", "#v-pills-home");
		moduleA.setAttribute("role", "tab");
		moduleA.setAttribute("aria-controls", "v-pills-home");
		moduleA.setAttribute("aria-selected", "true");
		//addTab(module.data.id, module.data.text, module.data.iconCls, module.data.extraParam2);
		//添加图标
		var iconPath = Co.iconPath(iconCls);
		var moduleHTML = "<img src='"+iconPath+"' alt='' />"+text;
		moduleA.innerHTML = moduleHTML;
		//将a标签添加到li里面
		moduleLi.appendChild(moduleA);

		if(children && children.length > 0){
			moduleHTML += "<img src='"+staticResourcesRootPath+"/certImages/index/箭头_右.png' alt='' class='img_right' style='float: right; margin-right: 18px;' />";
			moduleA.innerHTML = moduleHTML;
			addModuleChildren(children,moduleLi);
			//子ul
//			var moduleChildrenUl = document.createElement("ul");//创建一个标签
//			var moduleChildrenUlId = moduleLiId+"_moduleChildrenUl";
//			moduleChildrenUl.setAttribute("id", moduleChildrenUlId);//给创建的a设置id值；
//			moduleChildrenUl.setAttribute("style","padding: 0");
//			//moduleChildrenUl.className="ul"; //给创建的a设置class；
//			//将ul标签添加到父ul标签后面。与li同级
//			parentModuleLabel.appendChild(moduleChildrenUl);
//			for (var i = 0; i < children.length; i++) {
//				var childrenModule = children[i];
//				addModuleTree(childrenModule,moduleChildrenUlId);
//			}
//			moduleLi.setAttribute("onclick", "creat(this,'"+moduleChildrenUlId+"','name1','45px')");
		} else {
			moduleLi.setAttribute("onclick", "addTab('"+id+"','"+text+"','"+iconCls+"','"+module.extraParam2+"')");
		}
		moduleA.innerHTML = moduleHTML;
		return moduleLi;
	}

	/**
	 * 添加module子
	 * @param children 子module集合
	 * @param parentModuleLi 父module li 标签对象
	 * @return ${Object} 子标签 ul 标签对象
	 */
	function addModuleChildren(children,parentModuleLi){
		//父 module li 标签id
		var parentModuleLiId = parentModuleLi.getAttribute("id");
		//父module li 的 ul
		var parentModuleLiUl = parentModuleLi.parentNode;
		//修改父module li 中的 a 添加img
		var parentModuleLiUlHTMLFirstChild = parentModuleLi.firstChild;
		var parentModuleLiUlHTMLFirstChildHTML = parentModuleLiUlHTMLFirstChild.innerHTML;
		parentModuleLiUlHTMLFirstChildHTML += "<img src='"+staticResourcesRootPath+"/certImages/index/箭头_右.png' alt='' class='img_right' style='float: right; margin-right: 18px;' />";
		parentModuleLiUlHTMLFirstChild.innerHTML = parentModuleLiUlHTMLFirstChildHTML;
		var moduleChildrenUl = document.createElement("ul");//创建一个标签
		var moduleChildrenUlId = parentModuleLiId+"_moduleChildrenUl";
		moduleChildrenUl.setAttribute("id", moduleChildrenUlId);//给创建的a设置id值；
		moduleChildrenUl.setAttribute("style","margin-bottom: 0;display: none;");
		
		//将ul标签添加到父ul标签后面。与li同级
		parentModuleLiUl.appendChild(moduleChildrenUl);
		for (var i = 0; i < children.length; i++) {
			var childrenModule = children[i];
			addModuleTree(childrenModule,moduleChildrenUlId);
		}
		var moduleHierarchy = getModuleHierarchy(parentModuleLi);
		parentModuleLi.setAttribute("onclick", "creat(this,'"+moduleChildrenUlId+"','name1','"+(45+moduleHierarchy*30)+"px')");
		//parentModuleLi.setAttribute("onclick", "creat(this,'"+moduleChildrenUlId+"','name1')");
		return moduleChildrenUl;
	}

	/**
	 * 获取当前module层级
	 * @param {Object} module 的li 标签对象
	 */
	function getModuleHierarchy(moduleLi){
		var parentNode = moduleLi.parentNode;
		var moduleHierarchy = 0;
		while(true){
			if(parentNode.getAttribute("id") == rootModuleUlId ){
				break;
			} else if(parentNode.getAttribute("id" == "v-pills-tab")){
				break;
			} else {
				parentNode = parentNode.parentNode;
				moduleHierarchy += 1;
			}
		}
		return moduleHierarchy;
	}

});


/**
 * 添加tab页
 * @param id
 * @param title
 * @param icon
 * @param url
 * @param refresh 是否重新载入页面
 * @returns
 */
function addTab(id , title,icon,url,refresh){
	if(url){
		var data = {"id":id,"title":title,"icon":icon,"url":url,"refresh":refresh};
		//var indexUrl = homePageIndex;
		//document.getElementById('indexTab').contentWindow.postMessage({"data":data,"type":"addTab"},indexUrl);
		document.getElementById('indexTab').contentWindow.postMessage({"data":data,"type":"addTab"},"*");
	}
}


/**
 * 查询
 * @returns
 */
function query(){
	var queryText = document.getElementById('queryText').value;
	var searchType = document.getElementById('searchType').value;
	//Co.windowOpenByToken(API.searchIndex+"?searchName="+queryText);
	if(Co.isEmpty(queryText)){
		return;
	}
	addTab("search","搜索结果","搜索结果",API.searchIndex+"?searchName="+encodeURI(queryText)+"&searchType="+searchType,true);
}

/* 退出登录 */
function logout(){
	Co.showConfirm("确定要退出吗？",function(btn){
		if (btn == "ok") {
			window.location = rootPath+"/logout";
		}
	});
}
