/**
 * CocoonUX拓展工具类
 * 
 * 所有方法允许自定义的修改，修改后务必留下您的大名，方便交流。
 * 
 * @class Coe
 * @author PengFei
 * @version 1.0.0
 */
var Coe = {

		/**
		 * 默认的 gird column 属性
		 */
		defaultGirdColumnProperties : {

			/**
			 * 默认的 gird column title 对其方向
			 * @before left
			 * @after center
			 */
			titleAlign : "center",

			/**
			 * 默认的 gird column title 字体粗细
			 * @before bold 加粗
			 * @after normal 正常
			 */
			titleFontWeight : "normal",

			/**
			 * 默认的 gird column title 字体颜色
			 * @before 
			 * @after black 黑色
			 */
			titleColor : "black",
		},
		
		/**
		 *列标题重写。需要在Ext.onReady方法执行前执行。
		 *对column提供titleAlign表示列标题的对齐方向，默认值为align属性
		 */
		columnTitleOverride : function(){
			if(Ext.grid.Column){
				Ext.grid.Column.override({
					afterRender:function(){
						var me = this,
						el = me.el;
						me.callParent(arguments);
						me.titleAlign = me.titleAlign || Coe.defaultGirdColumnProperties.titleAlign;//默认居中
						el.addCls(Ext.baseCSSPrefix+'column-header-align-'+me.titleAlign).addClsOnOver(me.overCls);
					},
					beforeRender:function(){
						var me = this;
						var text = me.text;
						var titleFontWeight = me.titleFontWeight || Coe.defaultGirdColumnProperties.titleFontWeight;
						var titleFontColor = me.titleFontColor || Coe.defaultGirdColumnProperties.titleColor;
						me.text = "<div style = 'font-weight:"+titleFontWeight+";color:"+titleFontColor+";'>" + text + "</div>";
					}
				});
			}
		},
		
		/***
		 *显示文件覆盖提示框
		 */
		showFileOverrideConfirm:function(msg,fn){
			Ext.MessageBox.buttonText.yes = "覆盖";
			Ext.MessageBox.buttonText.no = "不覆盖";
			Ext.Msg.show({
				title:Co.msgTitle,
				msg:msg,
				modal:true,
				fn:fn,
				buttons:Ext.Msg.YESNOCANCEL,
				icon:Ext.Msg.QUESTION
			});
			Ext.MessageBox.buttonText.yes="是";
			Ext.MessageBox.buttonText.no="否";
		},

		/**
		 *表单textField重写。
		 *实现空白字符验证
		 */
		formTextFieldOverride : function(){
			Ext.apply(Ext.form.TextField.prototype,{
				validator : function(text,a,b){
					var me = this;
					if(this.allowBlank == false){
						//防止出现多条提示。为空时不提示。为纯空格在提示
						if(Co.isEmpty(text)){
							
						} else {
							var textLength = Ext.util.Format.trim(text).length;
							if( textLength == 0 ){
								return me.blankText;
							} else {
								return true;
							}
						}
					} else {
						return true;
					}
				}
			});
		},
		
		/**
		 * 初始化函数。对于新样式的修改。
		 * 可以对Coe.defaultGirdColumnProperties的值进行修改。来更改默认的样式
		 */
		initialize : function(){
			Coe.columnTitleOverride();
			Coe.formTextFieldOverride();
		}

}