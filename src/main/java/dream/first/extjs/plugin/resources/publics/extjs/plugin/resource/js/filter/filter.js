var btn = document.getElementsByTagName('button');
var tbody = document.getElementsByTagName('tbody')[0]
var show = document.getElementsByClassName("show");
var hide = document.getElementsByClassName("hide");

//============初始化可以供筛选的所有字段===================
//filters
var fieldNames = Object.keys(filters);//所有的字段名称

/**
 * 所有的操作运算符
 */
var operators = {
		"LIKE" : "包含",
		"NLIKE" : "不包含",
		"EQ" : "等于",
		"NEQ" : "不等于",
		"IS" : "为空",
		"ISN" : "不为空",
		"STARTWITH" : "开始于",
		"ENDWITH" : "结束于"//,
		//"GTE" : "不早于",
		//"LTE" : "不晚于"
}

addFilter();

/**
 * 添加一条过滤条件
 * @returns
 */
function addFilter(){
	var tr = document.createElement('tr');
	var trHTML = "<td>"+generateFieldSelectorHTML()+"</td>";
	trHTML += "<td>"+generateOperatorSelectorHTML()+"</td>";
	trHTML += "<td>"+generateValueInputHTML()+"</td>";
	trHTML += "	<td onclick='del(this)'><button id='img'></button></td>";
	tr.innerHTML += trHTML;
	tbody.appendChild(tr);
	//var tr = tbody.children;
	tr.children[1].children[0].disabled = "true";
	tr.children[2].children[0].disabled = "true";
}

/**
 * 生成字段选择器
 * @returns
 */
function generateFieldSelectorHTML(){
	var fieldSelectorHTML = "<select name='' id='' style='margin-left: 15px;background: #fff;' onchange='fieldSelect(this)'>";
	fieldSelectorHTML += "<option value='' disabled selected hidden>请选择</option>";
	for (var i = 0; i < fieldNames.length; i++) {
		fieldSelectorHTML += "<option value='"+fieldNames[i]+"'>"+filters[fieldNames[i]].fieldText+"</option>";
	}
	fieldSelectorHTML+="</select>";
	return fieldSelectorHTML;
}

/**
 * 生成操作符
 * @param {Object} 筛选对象 如果为null则生成全部
 * @returns {String} 操作符select标签
 */
function generateOperatorSelectorHTML(filtrate){
	var operatorSelectorHTML = "<select name='' id='' onchange='operatorSelect(this)'>";
	operatorSelectorHTML += "<option value='' disabled selected hidden>请选择</option>";
	var operatorKeys;
	if( null == filtrate){
		operatorKeys = Object.keys(operators);
	} else {
		if(filtrate["supportOperators"] == null){
			var fieldType = filtrate["fieldType"];
			if(fieldType == "Date"){
				operatorKeys = ["EQ","STARTWITH","ENDWITH"];
			} else if(fieldType == "Number"){
				operatorKeys = ["LIKE","NLIKE","EQ","NEQ","IS","ISN","STARTWITH","ENDWITH"];
			} else if(fieldType == "String"){
				operatorKeys = ["LIKE","NLIKE","EQ","NEQ","IS","ISN"];
			} else if(fieldType == "Dict"){
				operatorKeys = ["LIKE","NLIKE","EQ","NEQ","IS","ISN"];
			} else {
				operatorKeys = Object.keys(operators);
			}
		} else {
			operatorKeys = filtrate["supportOperators"];
		}
	}

	for (var i = 0; i < operatorKeys.length; i++) {
		operatorSelectorHTML += "<option value='"+operatorKeys[i]+"'>"+operators[operatorKeys[i]]+"</option>";
	}
	operatorSelectorHTML += "</select>";
	return operatorSelectorHTML;
}

/**
 * @param {Object}筛选对象 如果为null则生成 字符 input框
 * @returns {String} 值输入框
 */
function generateValueInputHTML(filtrate){
	var valueInputHTML;
	if( null == filtrate ){
		valueInputHTML = "<input type='text' style='border: 1px solid #ccc; text-indent: 15px;' placeholder='请输入'>";
	} else {
		var fieldType = filtrate["fieldType"];
		if ( fieldType == "Date" ){
			//valueInputHTML = "<input type='date' name='day' style='border:1px solid #ccc;text-indent: 15px;'>";
			valueInputHTML = "<input type='text' class='layui-input' placeholder='日期' id='test2' style='text-indent: 13px'>";
		} else if( fieldType == "DateTime" ){
			valueInputHTML = "<input type='text' class='demo-input' placeholder='日期时间范围'  style='text-indent: 13px'>";
		} else if( fieldType == "Time" ){
			
		} else if( fieldType == "Number" ){
			valueInputHTML = "<input type='text' name='' id='box' placeholder='请输入' />";
		} else if( fieldType == "Dict" ){
			var dictType = filtrate["dictType"];
			var dictRecords = Co.dictRecords(dictType);
			//生成下拉框
			var dictSelectorHTML = "<select style='border:1px solid #ccc;margin-right:20px'>";
			dictSelectorHTML += "<option value='' disabled selected hidden>请选择</option>";
			for (var i = 0; i < dictRecords.length; i++) {
				dictSelectorHTML += "<option value='"+dictRecords[i]["dictValue"]+"'>"+dictRecords[i]["dictText"]+"</option>";
			}
			dictSelectorHTML += "</select>";
			valueInputHTML = dictSelectorHTML;
		} else {
			valueInputHTML = "<input type='text' style='border: 1px solid #ccc; text-indent: 15px;' placeholder='请输入'>";
		}
	}
	return valueInputHTML;
}

/**
 * 选择字段
 * @param fieldSelect 字段select 标签对象
 */
function fieldSelect(fieldSelect) {
	var tr = fieldSelect.parentNode.parentNode;
	var fieldName = fieldSelect.value;
	//替换操作符
	tr.children[1].innerHTML = generateOperatorSelectorHTML(filters[fieldName]);
	//替换框
	tr.children[2].innerHTML = generateValueInputHTML(filters[fieldName]);
	//禁止值input
	tr.children[2].children[0].disabled = "true";

	//number input 
	$('#box').keyup(function () {
		var c = $(this);
		if (/[^\d]/.test(c.val())) {//替换非数字字符
			var temp_amount = c.val().replace(/[^\d]/g, '');
			$(this).val(temp_amount);
		}
	});
	$('input#box').blur(function () {
		var c = $(this);
		if (/[^\d]/.test(c.val())) {//替换非数字字符
			var temp_amount = c.val().replace(/[^\d]/g, '');
			$(this).val(temp_amount);
		}
	});
	//初始化时间组件
	initDateTimeComponent();
}

/**
 * 选择操作符
 * @param operatorSelect 操作符select标签对象
 */
function operatorSelect(operatorSelect){
	var tr = operatorSelect.parentNode.parentNode;
	if(operatorSelect.value == "IS"
		||operatorSelect.value == "ISN"){
		//禁止值input
		tr.children[2].children[0].disabled = "true";
		//tr.children[2].children[0].value = "nulfsadfds l";
	} else {
		tr.children[2].children[0].disabled = "";
	}
	
}


function del(index) {//删除
	var span = index.children;
	var tr = index.parentNode;
	tbody.removeChild(tr);
	if (tbody.children.length == 1) {
		btn[0].disabled = 'true'
	} else {
		btn.disabled = 'false'
	}
}

//if (tbody.children.length == 1) {
//btn[0].disabled = 'true'
//} else {
//for (let index = 0; index < tbody.children.length; index++) {
//btn[index].disabled = ''
//}
//}

/**
 * 将所有的输入框、全部回归到输入之前的状态
 * @returns
 */
function reverse(){//重置
	$("select").val("");
	$("input").val("");
	var trs = document.getElementsByTagName("tr");
	for (var index = 0; index < trs.length; index++) {
		if (trs[index].children[0].children[0].value == "") {
			trs[index].children[1].children[0].disabled = "true"
		} else {
			trs[index].children[1].children[0].disabled = ""
		}

		if (trs[index].children[1].children[0].value == "") {
			trs[index].children[2].children[0].disabled = "true"
		} else {
			trs[index].children[2].children[0].disabled = ""
		}
	}
}

/**
 * 清空所有条件输入框
 * @returns
 */
function clean(){
	tbody.innerHTML = "";
}

/**
 * 刷新
 * @returns
 */
function refresh(){
	//reverse();
	var tbody = document.getElementsByTagName("tbody")[0];
	            trs = tbody.getElementsByTagName("tr");
	            for(var i = trs.length - 1; i > 0; i--) {
	                tbody.deleteRow(i);
	            }
	$("select").val("");
	$("input").val("");
}


$("#close").click(function(){
	$(".background").css('display','none')
});

function sendMessage() {
	var trArray = tbody.children;
	var currentFilters = [];
	//循环获取所有条件
	for (var i = 0; i < trArray.length; i++) {
		//字段
		var field = trArray[i].children[0].children[0].value;
		//操作符
		var operator = trArray[i].children[1].children[0].value;
		//值
		var value = trArray[i].children[2].children[0].value;
		if(Co.isEmpty(field)){
			Co.showError("请选择筛选条件！")
			return;
		}
		var fieldType = filters[field]["selectFieldType"] || filters[field]["fieldType"];
		
		if(Co.isEmpty(field)
				|| Co.isEmpty(operator)){
			Co.showWarning("筛选条件未填写完整！");
			return;
		} else if( operator != "IS" && operator != "ISN" && Co.isEmpty(value)){
			Co.showWarning("筛选条件未填写完整！");
			return;
		} else {
			currentFilters.push({
				"fieldName":field,
				"operator":operator,
				"fieldValue" : ( operator != "IS" && operator != "ISN") ? value : null,
				"fieldTypeStr" : fieldType == "Date" ? "java.util.Date" : "java.lang.String"
			});
		}
	}
	var json = {
			"filters" : currentFilters
	}
	var queryFilterInfo = JSON.stringify(json);
	//console.log(queryFilterInfo);
	//var callBackUrl;
	window.parent.postMessage({"filters":json,"type":"filter"}, '*');
}

/**
 * 初始化时间组件
 * @returns
 */
function initDateTimeComponent(){
	lay('.layui-input').each(function(){
		laydate.render({
		elem: this
		,type: 'date',
		trigger: 'click',
		position: 'fixed',
		theme: '#135975',
		//max:new Date().toLocaleString(),
		});
	});

	lay('.demo-input').each(function(){
		laydate.render({
		elem: this
		,type: 'datetime',
		trigger: 'click',
		position: 'fixed',
		theme: '#135975',
		//max:new Date().toLocaleString(),
		});
	});
}

/**
 * 添加消息监听
 * 
 * 监听重置、筛选等功能
 * 
 * @param e
 * @returns
 */
window.addEventListener('message', function(e){
    var data = e.data;
    if(data.type == "filter"){//筛选
    	sendMessage();
    } else if(data.type == "reset"){//重置
    	//reverse();
    	clean();
    } else if(data.type == "refresh"){//刷新
    	refresh();
    }

}, false);
