$(document).ready(function(){
	//切换背景图
	$(".by_tit ul li").click(function(){
		var index =$(this).index();
		$(this).addClass('on').siblings().removeClass('on');
	})
    
	// 跳到指定坑位
	var   byBrand =$('.by_brand'),
	      byPbrand = byBrand.offset().top,
	      byTalent=$('.by_talent'),
	      byPtalent =byTalent.offset().top,
	      floatBox = $('.by_tit'),
	      titTop = floatBox.offset().top,
	      parentContainer = $('.by_tit_parent');

	$(".by_tit_brand").click(function(){
	        //byPbrand = byBrand.offset().top;
      		$(window).scrollTop(byPbrand - floatBox.height());
  	}); 
 	$(".by_tit_talent").click(function(){
 	        byPtalent =byTalent.offset().top;
       		$(window).scrollTop(byPtalent - floatBox.height());
   	}); 
   	$(window).scroll(function(){
		var tarTop = $(window).scrollTop(),
        	byTalent=$('.by_talent'),
	        byPtalent =byTalent.offset().top;
		if(5+ tarTop > byPtalent-floatBox.height()){
			$(".by_tit ul li").removeClass("on").eq(1).addClass("on"); 
		}
		else{
			$(".by_tit ul li").removeClass("on").eq(0).addClass("on");
		}
	});
	// 标题固定
	parentContainer.height(floatBox.height());
	$(window).on("scroll",function(){
		var titScroll = $(window).scrollTop();
		if(titScroll>=titTop){
			floatBox.addClass('by_tit_box');
		}else{
			floatBox.removeClass('by_tit_box');
		}
	});
	//可视范围内图片变换
	var sTop= 0,    
		sHeight=$(window).height(),		
		$goods= $(".by_cpic"),
		clearkey, 
		scrollFunc = function(){
			sTop=$(window).scrollTop();
			cache = [];
			removeCache = [];
			window.clearTimeout(clearkey);
			$goods.each(function(index, item){
				var cTop = $(item).offset().top, 
					itemHeight=$(item).height();
				if(cTop>sTop&&cTop<sTop+sHeight||cTop+itemHeight>sTop&&cTop+itemHeight<sTop+sHeight){
				    // $(".by_cpic a img:first-child").addClass("flip");
				    // 	$(".by_cpic .show_pic img").addClass("by_fade");
                    // 	$(".by_cpic .hide_pic img").addClass("by_fade_none");
					cache.push(index);
				} else {
					removeCache.push(index);
				}
			});
			$(removeCache).each(function(index, item){
				$goods.eq(item).removeClass('flip');
			});
			var idx = 0,
				func = function(){
					var itemL = cache[(idx++)% cache.length],
					   // imgs = $goods.eq(itemL).find('img');
					   imgs=$goods.eq(itemL).find('a');
					    $(imgs).each(function(index, item){
					    var $item = $(item);
					    if($item.hasClass('flip')) {
					        $item.removeClass('flip');
					        $item.fadeOut(1000);
    					}else{
    						$item.addClass('flip');
    						$item.fadeIn(1000);
    					}
    				    
					});
					clearkey = window.setTimeout(func, 2000);
				};
			clearkey = window.setTimeout(func, 1000);
		};
		 $(window).scroll(scrollFunc);
		scrollFunc();
		
        //自定义排序
	    var oDiv = $('#by_cont li'), 
            arr = [];
        for(var i=0;i<oDiv.length;i++){
		    arr.push(oDiv[i]); 
	    }
    
        arr.sort(function(a,b){
            return a.getAttribute('data-id') - b.getAttribute('data-id');
        });
        //渲染节点
        for(var i=0; i<arr.length;i++){
          $("#by_cont ul").append(arr[i]);
        }
		 
});
