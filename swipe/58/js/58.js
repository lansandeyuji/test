

window.onload = function() {

	document.getElementById('load').style.display='none';



	var mySwiper2 = new Swiper('#swiper-container-h', {
		slidesPerView:'auto',
		centeredSlides: true,
		spaceBetween: 15,
	})

	
	var mySwiper = new Swiper ('#swiper-container-v', {
		speed:500,
		direction : 'vertical',
		pagination: '.swiper-pagination',
  //virtualTranslate : true,
  mousewheelControl : true,
  // effect : 'fade',
//fade: {
//  crossFade: false,
//},
onInit: function(swiper){
	swiper.myactive = 0;  
	for (var i = 0; i < swiper.slides.length; i++){
		swiper.slides[i].style.zIndex = 0;
	}
	swiper.slides[swiper.myactive].style.zIndex = 1;  
	swiperAnimateCache(swiper);
	swiperAnimate(swiper);
	
},
onTransitionStart: function(swiper){
	swiper.params.onlyExternal = true;
},

onTransitionEnd: function(swiper){
	swiper.params.onlyExternal = false;
	swiper.myactive = swiper.activeIndex;
	for (var i = 0; i < swiper.slides.length; i++){
		swiper.slides[i].style.zIndex = 0;
	}
	swiper.slides[swiper.myactive].style.zIndex = 1;
	
	swiperAnimate(swiper);




},


watchSlidesProgress: true,


onProgress: function(swiper){
	
	if(!swiper.myactive){swiper.myactive=0;}
	

	
	for (var i = 0; i < swiper.slides.length; i++){
		
		var slide = swiper.slides[i];
		es = slide.style;	
		
		var progress = slide.progress;
		var translate = progress*swiper.height;  	
		
		opacity = 0;
		
		if(i==swiper.myactive){
			opacity=1-Math.abs(progress)/2;

		}
		if((swiper.slides[swiper.myactive].progress>0 && i==swiper.myactive+1) || (swiper.slides[swiper.myactive].progress<0 && i==swiper.myactive-1)){
			opacity=  0.5+Math.abs(swiper.slides[swiper.myactive].progress * 0.5);
		}
		
		
		slide.style.opacity = opacity;
		if(i!=swiper.myactive){
			es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,'+translate+'px,0)';
		}
		
	}
	

	
},



onSetTransition: function(swiper, speed) {
	for (var i = 0; i < swiper.slides.length; i++){
		es = swiper.slides[i].style;
		es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';

	}
},


})  


}	          
