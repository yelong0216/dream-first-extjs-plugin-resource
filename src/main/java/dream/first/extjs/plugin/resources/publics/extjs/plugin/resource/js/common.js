Ext.Ajax.on('requestexception', function(conn, response, options) {
		if (response.status == '999') {
			setTimeout(function(){
				var alert = "您登录已超时，请重新登录！";
				if(top.location != self.location){
					window.parent.postMessage({"type":"requestexception","alert":alert},"*");
				} else {
					Co.alert(alert,function(){
						window.location = ModuleServiceInterface.loginIndex;
					});
				}
			},200);
		} else if (response.status == '901') {
			setTimeout(function(){
				Ext.MessageBox.alert('提示', '您没有访问此功能的权限！如有问题，请与客服联系！');
			},200);
		} else if (response.status == '902') {
			setTimeout(function(){
				Ext.MessageBox.alert('提示', '会话超时或已终止，请重新登录！如有问题，请与客服联系！', function() {
					top.location = contextPath + "/login.jsp";
				});
			},200);
		} else if (response.status == '903') {
			setTimeout(function(){
				Ext.MessageBox.alert('提示', '登录人数已满，请您稍后再试！如有问题，请与客服联系！', function() {
					top.location = contextPath + "/login.jsp";
				});
			},200);
		} else if (response.status == '904') {
			setTimeout(function(){
				Ext.MessageBox.alert('提示', '您已在同一浏览器中使用其他账号登录，当前操作被禁止！如有问题，请与客服联系！', function() {
					top.location = contextPath + "/login.jsp";
				});
			},200);
		}  else if (response.status == '910') {
			setTimeout(function(){
//				Ext.MessageBox.alert('提示', '您已在其他地方登录！如有问题，请与客服联系！', function() {
//					top.location = contextPath + "/login.jsp";
//				});
				var alert = "您已在其他地方登录！";
				if(top.location != self.location){
					window.parent.postMessage({"type":"requestexception","alert":alert},"*");
				} else {
					Co.alert(alert,function(){
						window.location = ModuleServiceInterface.loginIndex;
					});
				}
			},200);
		} else if (response.status == '801') {
			setTimeout(function(){
				Ext.MessageBox.alert('提示', '数据在传输过程中被篡改，操作终止！如有问题，请与客服联系！');
			},200);
		}/* else if (response.status == '404') {
			setTimeout(function(){
				Ext.MessageBox.alert('提示', '系统开小差了，请稍后再试!');
			},200);
		}  */else if (response.status == '0') {
			setTimeout(function(){
				Ext.MessageBox.alert('提示', '系统开小差了，请稍后再试!');
			},200);
		} else{
		     Co.showAjaxException(response.responseText,response);
		}
  });


/**
 * token失效超时监听
 * @param e
 * @returns
 */
window.addEventListener("message",function(e){
	var data = e.data;
	var type = data.type;
	if(type == "tokenLoseEfficacy"){
		//是顶级页面
		if(top.location!=self.location){
			window.parent.postMessage({"type":"tokenLoseEfficacy"},"*");
		} else {
			setTimeout(function(){
				Ext.MessageBox.alert('提示', '您登录已超时，请重新登录！',function(){
					window.location = ModuleServiceInterface.loginIndex;
				});
			},200);
		}
	} else if(type == "requestexception"){
		var alert = data.alert;
		if(top.location != self.location){
			window.parent.postMessage({"type":"requestexception","alert":alert},"*");
		} else {
			Co.alert(alert,function(){
				window.location = ModuleServiceInterface.loginIndex;
			});
		}
	}
});