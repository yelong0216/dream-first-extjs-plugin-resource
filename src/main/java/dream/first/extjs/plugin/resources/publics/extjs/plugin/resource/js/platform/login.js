Co.initialize();
Ext.onReady(function(){
	var panel = Ext.create('Ext.panel.Panel', {
		title: '检测业务管理系统 - 登录',
	    width: 400,
	    height: 200,
	    frame: true,
	    renderTo: Ext.getBody(),
	    items: [{
	    	xtype: "form",
	    	id: "loginForm",
	    	border: false,
	    	frame : true,
	    	height: 128,
	    	bodyStyle : 'padding:30px 0px 0px 10px',
	    	defaults: {
	    		labelWidth: 90,
	    		labelAlign: "right",
	    		labelSeparator: "：",
	    		width: 320,
	    		allowBlank: false
	    	},
	    	items: [{
	    		xtype: "textfield",
	    		fieldLabel: "用户名",
	    		name: "model.username",
	    		id: "username",
	    		maxLength: 15,
	    		maxLengthText: "用户名最长15个字符",
	    		enforceMaxLength : true,
	    		blankText: "请输入用户名",
	    		value : Co.getCookie("__CO_PLAT_LOGIN_USER__"),
	    		listeners: {
	    			specialkey : function(field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							if (!Ext.getCmp("orig-password").getValue()) { 
								Ext.getCmp("orig-password").focus();
							} else {
								login();
							}
						}
					}
	    		}
	    	},{
	    		xtype: "textfield",
	    		inputType: "password",
	    		fieldLabel: "密 码",
	    		id: "orig-password",
	    		maxLength: 15,
	    		maxLengthText: "密码最长15个字符",
	    		enforceMaxLength : true,
	    		blankText: "请输入密码",
	    		listeners: {
	    			specialkey : function(field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							login();
						}
					}
	    		}
	    	},{
	    		xtype : "hiddenfield",
	    		id : "password",
	    		name : "model.password"
	    	},{
	    		xtype: "hiddenfield",
	    		name: "model.state",
	    		value: "0"
	    	},{
	    		xtype: "hiddenfield",
	    		id: "token",
	    		name: "token"
	    	}]
	    }],
	    buttons: [{
	    	text: "登录",
	    	iconCls: "acceptIcon",
	    	handler: login
	    },{
	    	text: "重置",
	    	iconCls: "form_resetIcon",
	    	handler: function() {
				Ext.getCmp("loginForm").getForm().reset();
				Ext.getCmp("username").focus(true);
	    	}
	    }],
	    listeners : {
	    	"afterrender" : function() {
	    		if (!Co.isEmpty(Co.getCookie("__CO_PLAT_LOGIN_USER__"))) {
	    			Ext.getCmp("orig-password").focus();
	    		} else {
	    			Ext.getCmp("username").focus();
	    		}
	    	}
	    }
	});
	
	//居中显示
	panel.el.center();
	
//==========================================================================================
//							              Handlers
//==========================================================================================
	function login() {
		var form = Ext.getCmp("loginForm").getForm();
		if (form.isValid()) {
			form.findField("password").setValue(hex_sha1(form.findField("orig-password").getValue()));
			Ext.getCmp("token").setValue(hex_md5(LOGIN_TOKEN + Ext.getCmp("password").getValue()));
			
			Co.request("login.action", form.getValues(), function(result, opts) {
				if (result.success == true) {
					//在本地保存登录名
					Co.setCookie("__CO_PLAT_LOGIN_USER__", Ext.getCmp("username").getValue());
					window.location = "index.action";
				} else {
					Co.showError(result.msg, function(){
						window.location = "login.jsp";
					});
				}
			},function(result, opts) {
				Co.showError(result.msg, function(){
					window.location = "login.jsp";
				}, result);
			},{
				waitMsg : "正在验证，请稍候...",
				reqEncrypt : true,
				reqDataIntegrityValid : true
			});
		}
	}
});