/**
 * 添加监听
 * @param target 监听的元素
 * @param eventType 时间类型
 * @param handle 处理函数
 */
function addEvents(target,eventType,handle){
    if(document.addEventListener){// 所有主流浏览器，除了 IE 8 及更早版本
    	 target.addEventListener(eventType,handle,false);
    }else{ // IE 8 及更早版本
//    	 target.attachEvent('on'+eventType,function(){
//             handle.call(target,arguments);
//         });
    	target.attachEvent("on"+eventType, handle);
    };
};



/**
 * token失效超时监听
 * @param e
 * @returns
 */
//addEvents(window,"message",function(e){
//	var type = e.data.type;
//	if(type == "tokenLoseEfficacy"){
//		//是顶级页面
//		if(top.location!=self.location){
//			window.parent.postMessage({"type":"tokenLoseEfficacy"},"*");
//		} else {
//			Ext.Msg.alert("提示","您登录已超时，请重新登录！",function(){
//				window.location = ModuleServiceInterface.login;
//			});
//		}
//	}
//});