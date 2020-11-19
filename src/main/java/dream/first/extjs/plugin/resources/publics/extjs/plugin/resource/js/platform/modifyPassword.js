//密码修改窗口
var modifyPasswordWindow;
//密码修改表单
var modifyPasswordForm;

var changeThemeForm,
	changeThemeFormWindow,
	fm;

Ext.onReady(function(){
	//密码修改表单
	modifyPasswordForm = Co.form(rootPath+"/user/modifyPassword", [{
		inputType : "password",
		fieldLabel : "原密码",
		id : "oldPassword_txt",
		name : "oldPassword_txt",
		allowBlank : false,
		blankText : "请输入原密码",
		maxLength : 20,
		maxLengthText : "原密码长度不能超过20个字符",
		enforceMaxLength : true
	},{
		inputType : "password",
		fieldLabel : "新密码",
		id : "newPassword_txt",
		name : "newPassword_txt",
		allowBlank : false,
		blankText : "请输入新密码",
		maxLength : 20,
		maxLengthText : "新密码长度不能超过20个字符",
		minLength : 8,
		minLengthText : "新密码长度不能少于8个字符",
		enforceMaxLength : true,
		validator : function(v) {
			if (!Co.isEmpty(v)) {
				if (v == loginUsername) return "新密码和账号不能相同";
				if (v == loginUserRealName) return "新密码和姓名不能相同";
				if (v.indexOf(loginUsername) != -1 ) return "密码不能包含账号";
				if (v.indexOf(loginUserRealName) != -1 ) return "密码不能包含姓名";
				if (!(v.match(/[\d]/) && v.match(/[0-9]/) && v.match(/[A-Za-z]/) && v.match(/[^\da-zA-Z]/))) return "密码应包含数字、字母和特殊字符";
				
				if(v === this.up("form").getForm().findField("oldPassword_txt").getValue()) {
					return "新密码不能与原密码相同";
				}
			}
			return true;
		}
	},{
		inputType : "password",
		fieldLabel : "确认密码",
		id : "confirmPassword",
		name : "confirmPassword",
		allowBlank : false,
		blankText : "请输入确认密码",
		maxLength : 20,
		maxLengthText : "确认密码长度不能超过20个字符",
		enforceMaxLength : true,
		validator : function(v) {
			if (v !== this.up("form").getForm().findField("newPassword_txt").getValue()) {
				return "两次输入的密码必须相同";
			}
			return true;
		}
	},{
		xtype : "hiddenfield",
		id : "oldPassword",
		name : "oldPassword"
	},{
		xtype : "hiddenfield",
		id : "newPassword",
		name : "newPassword"
	}],{
		defaultType : "textfield"
	});
	
	//修改密码窗口
	modifyPasswordWindow = Co.formWindow("修改密码", modifyPasswordForm, 400, 210, "fit", {
		okHandler : doModifyPassword,
		focusEl : "oldPassword_txt",
		listeners : {
			beforeclose : function() {
				if (true === fm) {
					Co.showError("您使用的是初始化密码，为保障账号安全，请重新设置密码！");
					return false;
				}
				return true;
			}
		}
	});	
	
	changeThemeForm = Co.form(null, [
	    Co.comboBoxLocal("selectTheme", "selectTheme", "选择主题", [
               ["国网绿", "ext-theme-sgcc/ext-theme-sgcc-all.css"], 
               ["天蓝", "ext-theme-classic/ext-theme-classic-all.css"], 
               ["银灰", "ext-theme-gray/ext-theme-gray-all.css"]
        ],{
        	editable : false
        })
	]);
	
	
	changeThemeFormWindow = Co.formWindow("更换主题", changeThemeForm, 300, 120, "fit", {
		okHandler : doChangeTheme
	});	
});

function modifyPassword(forceModify) {
	fm = forceModify;
	Co.resetForm(modifyPasswordForm);
	modifyPasswordWindow.show();
}

function doModifyPassword() {
	Co.formSave(modifyPasswordForm, function(form, action){
		Co.alert("密码修改成功，请重新登录系统！", function(){
			modifyPasswordWindow.hide();
			window.location = rootPath+"/logout";
		});
	}, function(form, action){
		Co.showError("密码修改失败！请确认原密码是否输入正确！", function(){
			var pwd = modifyPasswordForm.getForm().findField("oldPassword_txt");
			pwd.focus();
			pwd.selectText();
		});
	},{
		listeners : {
			beforesave : function() {
//				Ext.getCmp("oldPassword").setValue(hex_sha1(Ext.getCmp("oldPassword_txt").getValue()));
//				Ext.getCmp("newPassword").setValue(hex_sha1(Ext.getCmp("newPassword_txt").getValue()));
				Ext.getCmp("oldPassword").setValue(strEnc(Ext.getCmp("oldPassword_txt").getValue(), initKey1(), initKey2(), initKey3()));
				Ext.getCmp("newPassword").setValue(strEnc(Ext.getCmp("newPassword_txt").getValue(), initKey1(), initKey2(), initKey3()));
				return true;
			}
		}
	});
}

function changeTheme() {
	changeThemeFormWindow.show();
}
function doChangeTheme() {
	changeThemeFormWindow.close();
	Co.setCookie("__TMS__THEME__", Ext.getCmp("selectTheme").getValue());
	location.reload();
}
