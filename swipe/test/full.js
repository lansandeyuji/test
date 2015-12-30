
// 静态方法：类级别
// 动态方法：对象级别组件开发。通过选择器的对象有此方法
// fn链上的方法，必须创建实例才可以调用

(function($) {
	var switchPage=(function(){
		function switchPage(el,options){
			this.settings=$.extend(true,$.fn.switchPage.default, options||{});//treue为深拷贝
			this.element=el;
			this.init();
		}
		switchPage.prototype={
			init:function(){

			}
		}
		return switchPage;
	})();
	// jquery插件 
	$.fn.switchPage = function (options) () {
		return this.each(function(index, el) {
			var me = $(this),
				instance =  me.data("switchPage");//存放插件的实例
			if(!instance){//单例模式
				instance = new switchPage(me,options);
				me.data('switchPage', instance);
			}
			if($.type(options)==="string"){
				return instance[options]();
			}
		});		
	}
	$.fn.switchPage.default = {
		selectors:{
			sections:".sections",
			section:'.section',
			page:".pages",
			active:'.active'
		},
		index:0,//页面开始索引值
		easing:"ease",//动画
		duration:500,//动画时间
		loop:false,//是否允许循环播放
		pagination:true,//是否分页
		ketboard:true,//是否启动键盘
		direction:"vertical",//默认垂直
		callback:""
	}
})(jQuery);