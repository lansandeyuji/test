$(function() {

        var init = function() {
            // 一些前奏 修改class
            var $pages = $('.m-page-marker');
            var isEdit = 0;

            if ($('body').hasClass('mogujie-edit-h5-custom')) isEdit = 1;
            
            $pages.each(function(i, item) {
                $(item).parents('.module_row').addClass('m-page m-hidden');
                $(item).removeClass('m-page-marker m-hidden');
                if (isEdit) {
                    var $img = $(item).find('img');
                    var src = $img.data('src');
                    $img[0].src = src;
                }
            });


            function setsize() {

                var maxWidth = document.body.clientWidth;
                var maxHeight = document.body.clientHeight;

                window.scale = 1;

                if (maxWidth / maxHeight > 320 / 503) {
                    window.scale = maxHeight / 503;
                } else {
                    window.scale = maxWidth / 320;
                }

                // $(".view_wrap").css({
                //     "-webkit-transform":"scale(" +window.scale+ ")",
                //         "-ms-transform":"scale(" +window.scale+ ")",
                //          "-o-transform":"scale(" +window.scale+ ")",
                //             "transform":"scale(" +window.scale+ ")"
                // });
            }

            function loadjs(file) {
                var head = $('head');
                $("<scri" + "pt>" + "</scr" + "ipt>").attr({
                    src: file,
                    type: 'text/javascript',
                    id: 'load'
                }).appendTo(head);
            }

            if (!isEdit) {
                $('.page_activity').addClass('view_wrap');
                setsize();
            } else {
                loadjs('http://www.mogujie.com/__/static/widgets/lib/require.js');
            }
        };

        init();


        require([
            'assets/js/carousel',
        ], function(carousel) {

            carousel.init();
        });
        /**
         * 页面切换模块
         * @ yefei
         * 2014-11-02
         *****************************************/

        define('assets/js/carousel', ['assets/js/util'], function(Util) {

            var carousel = {
                /**
                 * 一些属性值 ^_^
                 ***************************************************************/
                _num: $('.m-page').length,
                _curNum: 0,
                _$document: $(document),
                _handleClass: '.m-page',
                _nav: '.m-nav',
                _$elem: '', // 当前操作的DOM
                _touch: {}, // 储存坐标值
                _startXY: {}, // 初始坐标值
                _moveXY: {}, // 滑动时坐标值
                _direction: 1, // 滑动时方向 -1: 上一页; 1: 下一页 
                _isMoving: false, // 是否正在滑动
                _moveStart: false, // 是否开始滑动
                handleNode: [], // 当前操作的节点
                /**
                 * 一些方法啊方法 ^_^
                 ***************************************************************/
                initFirst: function() {

                    var self = carousel;

                    // 默认显示第一个 localStorage 中读取当前显示哪一张
                    var pageIndex = parseInt(window.localStorage.getItem('curCarouselIndex'), 10);

                    if (pageIndex) {
                        window.localStorage.removeItem('curCarouselIndex');
                    } else {
                        pageIndex = 0;
                    }
                    $(".view_wrap").append('<div class="arrow"></div>');

                    if (pageIndex == self._num - 1) {
                        $(".view_wrap").addClass('last-page');
                    } else {
                        $(".view_wrap").removeClass('last-page');
                    }
                    $('.m-page').eq(pageIndex).removeClass('m-hidden').addClass('m-active');
                    self.loading(pageIndex);
                    self.loading(pageIndex + 1);
                    self.loading(pageIndex - 1);
                    
                    $('.view_wrap').addClass('first-page');
                },
                loading: function(index) {
                    var self = carousel;
                    var $nextPage = $(self._handleClass).eq(index);

                    var $imgs = $nextPage.find('img');

                    $imgs.each(function(i, item) {

                        var $img = $(item);

                        if ($img.hasClass('J_lazy_img')) {
                            var src = $img.data('src');
                            var img = $img[0];

                            img.src = src;

                            if (img.complete) {} else {
                                img.onload = function() {
                                    $img.removeClass('J_lazy_img').removeAttr('data-src');
                                    img.onload = null;
                                };
                            }
                        } else {

                        }
                    });

                },
                addEvent: function() {
                    var self = this;
                    self._$document.on('touchstart mousedown', self._handleClass, function(event) {

                        self.handleStart(event);

                    });
                    self._$document.on('touchmove mousemove', self._handleClass, function(event) {
                        self.handleMove(event);
                    });
                    self._$document.on('touchend mouseup', self._handleClass, function(event) {
                        self.handleEnd(event);
                    });

                    // 点击按钮
                    self._$document.on('tap', self._nav, function(event) {
                        self.changePage(event);
                    });

                },
                handleStart: function(event) {

                    var self = carousel;
                    event.preventDefault();

                    if (self._moveStart) {
                        self._moveStart = false;
                        return;
                    }

                    self._moveStart = true;

                    self._$elem = $(event.target).parents('.m-page');

                    // 记录触点初始位置
                    if (event.type == "mousedown") {
                        self._startXY['X'] = event.pageX;
                        self._startXY['Y'] = event.pageY;
                    } else {
                        self._startXY['X'] = event.touches[0].pageX;
                        self._startXY['Y'] = event.touches[0].pageY;
                    }

                    self._touch['x1'] = self._startXY['X'];
                    self._touch['y1'] = self._startXY['Y'];


                    self._touch['x2'] = self._startXY['X'];
                    self._touch['y2'] = self._startXY['Y'];

                },
                handleMove: function(event) {
                    var diffXY = {};
                    var self = carousel;

                    event.preventDefault();

                    if (!self._moveStart) return;

                    self._isMoving = true;

                    self._$elem = $(event.target).parents('.m-page');

                    if (event.type == "mousemove") {
                        self._moveXY['X'] = event.pageX;
                        self._moveXY['Y'] = event.pageY;
                    } else {
                        self._moveXY['X'] = event.touches[0].pageX;
                        self._moveXY['Y'] = event.touches[0].pageY;
                    }

                    self._touch['x2'] = self._moveXY['X'];
                    self._touch['y2'] = self._moveXY['Y'];

                    self.handleNode = self.getTargetPages();

                    self.handleExchange(self.handleNode);
                },

                handleEnd: function(event) {

                    event.preventDefault();
                    var self = carousel;
                    var diffXY = {};
                    var absDiffXY = {};
                    var $cur = self.handleNode[0];
                    var $next = self.handleNode[1];

                    absDiffXY['X'] = Math.abs(self._touch['x2'] - self._touch['x1']);
                    absDiffXY['Y'] = Math.abs(self._touch['y2'] - self._touch['y1']);

                    self._touch = {};

                    if (self._curNum >= (self._num - 2) && self._direction == 1) {
                        $('.view_wrap').addClass('last-page');
                    } else if (self._curNum < (self._num - 2) && self._direction == -1) {
                        $('.view_wrap').removeClass('last-page');
                    }
                    

                    if (!absDiffXY['X']) {
                        
                        // 没有移动
                        self._moveStart = false;
                        if ($(event.target).hasClass('anchor') || $(event.target).parents().hasClass('anchor')) {
                            // 记录下当前位置
                            var $target = $(event.target);

                            if ($(event.target).parents().hasClass('anchor')) {
                                $target = $(event.target).parents('.anchor');
                            }
                            var $parent = $target.parents('.m-page');
                            var curIndex = $(self._handleClass).index($parent);
                            window.localStorage.setItem('curCarouselIndex', curIndex);
                            var href = $target.attr('href');
                            window.location.href = href;
                        } else {
                            window.localStorage.removeItem('curCarouselIndex');
                            return;
                        }
                    } else {
                        if(self._curNum + self._direction == 0) {
                            $('.view_wrap').addClass('first-page');
                        } else if (self._curNum + self._direction > 0) {
                            $('.view_wrap').removeClass('first-page');
                        }
                        if ($next) {
                            if (absDiffXY['X'] > 10) {
                                var curHeight = $cur.height();
                                var curWidth = $cur.width();
                                var index = $(self._handleClass).index($next);

                                if (self._direction == 1) {
                                    // 完成页面切换
                                    $cur[0].style[Util.prefixStyle('transform')] = 'translate3d(-' + curWidth + 'px, 0, 0)';
                                    $cur[0].style[Util.prefixStyle('transition')] = 'all .2s';
                                    index = index + 1;
                                } else if (self._direction == -1) {

                                    $cur[0].style[Util.prefixStyle('transform')] = 'translate3d(' + curWidth + 'px, 0, 0)';
                                    $cur[0].style[Util.prefixStyle('transition')] = 'all .2s';

                                    index = index - 1;

                                }
                                $next[0].style[Util.prefixStyle('transition')] = 'all .2s';
                                $next[0].style[Util.prefixStyle('transform')] = 'translate3d(0, 0, 0)';

                                self.loading(index);

                                setTimeout(function() {
                                    $next.removeClass('m-active');
                                    $next.siblings('.m-page').addClass('m-hidden');

                                    $cur.data('translate', '');
                                    $next.data('translate', '');

                                    $cur[0].style[Util.prefixStyle('transform')] = '';
                                    $cur[0].style[Util.prefixStyle('transition')] = '';
                                    $next[0].style[Util.prefixStyle('transform')] = '';
                                    $next[0].style[Util.prefixStyle('transition')] = '';

                                    self._moveStart = false;

                                    // 触发自定义事件
                                    self._$document.trigger('handleEnded', self);

                                }, 200);

                            } else {
                                // 取消页面切换
                                setTimeout(function() {
                                    $next.removeClass('m-active');
                                    $next.addClass('m-hidden');

                                    $cur.data('translate', '');
                                    $next.data('translate', '');

                                    $cur[0].style[Util.prefixStyle('transform')] = '';
                                    $cur[0].style[Util.prefixStyle('transition')] = '';

                                    $next[0].style[Util.prefixStyle('transform')] = '';
                                    $next[0].style[Util.prefixStyle('transition')] = '';

                                    self._moveStart = false;

                                }, 200);
                            }
                        } else {
                            self._moveStart = false;
                        }
                        window.localStorage.removeItem('curCarouselIndex');
                    }
                },
                getTargetPages: function() {

                    var self = carousel;
                    var diffXY = {};
                    var $cur = self._$elem;
                    var $next = '';
                    var handleNode = [];
                    var curHeight = $cur.height();
                    var curWidth = $cur.width();

                    self._curNum = $(self._handleClass).index(self._$elem);

                    diffXY['X'] = self._touch['x2'] - self._touch['x1'];
                    diffXY['Y'] = self._touch['y2'] - self._touch['y1'];

                    if (diffXY['X'] < 0) {

                        self._direction = 1;

                        //  如果是最后一个 则暂时不切换 
                        if (self._curNum !== (self._num - 1)) {
                            $next = $(self._handleClass).eq(self._curNum + 1);
                            $cur.data('translate', diffXY['X']);
                            $next.data('translate', curWidth + diffXY['X']);
                        } else {
                            // TODO 可配置为循环展示
                            $next = null;
                        }

                        if (self._curNum >= (self._num - 2)) {
                            $('.view_wrap').addClass('last-page');
                        } else {
                            $('.view_wrap').removeClass('last-page');
                        }
                    } else if (diffXY['X'] > 0) {

                        $('.view_wrap').removeClass('last-page');

                        self._direction = -1;

                        if (self._curNum > 0) {
                            $next = $(self._handleClass).eq(self._curNum - 1);
                            $cur.data('translate', diffXY['X']);
                            $next.data('translate', -curWidth + diffXY['X']);

                        } else {
                            $next = null;
                        }
                    }

                    handleNode = [$cur, $next];

                    return handleNode;

                },
                handleExchange: function(targets) {
                    var self = carousel;
                    var $cur = targets[0];
                    var $next = targets[1];

                    if ($next) {
                        $next.addClass('m-active');
                        $cur.siblings('.m-page').addClass('m-hidden');
                        $next.removeClass('m-hidden');

                        $cur[0].style[Util.prefixStyle('transform')] = 'translate3d('+ $cur.data('translate') + 'px, 0, 0)';

                        $cur[0].style[Util.prefixStyle('transition')] = 'all .2s';
                        
                        $next[0].style[Util.prefixStyle('transform')] = 'translate3d('+ $next.data('translate') + 'px, 0, 0)';
                        $next[0].style[Util.prefixStyle('transition')] = 'all .2s';

                    }
                },
                changePage: function(event){
                    var self = carousel;
                    var $cur = $('.m-page:visible');
                    var curNum = $('.m-page').index($cur);
                    var curWidth = $cur.width();
                    var $next;

                    // 下一个
                    if ($(event.target).hasClass('nav-next')) {
                        
                        $('.view_wrap').removeClass('first-page');
                        if(curNum >= (self._num - 2)) {
                            $('.view_wrap').addClass('last-page');
                        } else {
                            // $('.view_wrap').removeClass('last-page');
                        }
                        $next = $('.m-page').eq(curNum + 1);
                        if ($next.length) {

                            // $next[0].style[Util.prefixStyle('transform')] = 'translate3d('+ curWidth + 'px, 0, 0)';

                            $cur.removeClass('m-active');
                            $next.removeClass('m-hidden');

                            $cur[0].style[Util.prefixStyle('transform')] = 'translate3d(-' + curWidth + 'px, 0, 0)';
                            $cur[0].style[Util.prefixStyle('transition')] = 'all .3s';

                            // $next[0].style[Util.prefixStyle('transform')] = 'translate3d(0, 0, 0)';
                            // $next[0].style[Util.prefixStyle('transition')] = 'all .3s';

                            self.loading(curNum+1);

                            setTimeout(function() {
                                $next.removeClass('m-active');
                                $next.siblings('.m-page').addClass('m-hidden');
                                $cur[0].style[Util.prefixStyle('transform')] = '';
                                $cur[0].style[Util.prefixStyle('transition')] = '';
                                $next[0].style[Util.prefixStyle('transform')] = '';
                                $next[0].style[Util.prefixStyle('transition')] = '';

                                self._moveStart = false;

                                // 触发自定义事件
                                self._$document.trigger('handleEnded', self);

                            }, 300);
                        }
                    } else if ($(event.target).hasClass('nav-prev')) {
                        if (curNum - 1 < 0) return; 
                        $('.view_wrap').removeClass('last-page');
                        $next = $('.m-page').eq(curNum - 1);
                        if(curNum == 1) {
                            $('.view_wrap').addClass('first-page');
                        } else if (curNum > 1) {
                            $('.view_wrap').removeClass('first-page');
                        }
                        if ($next.length) {
                            $cur.removeClass('m-active');
                            $next.removeClass('m-hidden');

                            $cur[0].style[Util.prefixStyle('transform')] = 'translate3d(' + curWidth + 'px, 0, 0)';
                            $cur[0].style[Util.prefixStyle('transition')] = 'all .3s';

                            self.loading(curNum-1);

                            setTimeout(function() {
                                $next.removeClass('m-active');
                                $next.siblings('.m-page').addClass('m-hidden');
                                $cur[0].style[Util.prefixStyle('transform')] = '';
                                $cur[0].style[Util.prefixStyle('transition')] = '';
                                $next[0].style[Util.prefixStyle('transform')] = '';
                                $next[0].style[Util.prefixStyle('transition')] = '';

                                self._moveStart = false;

                                // 触发自定义事件
                                self._$document.trigger('handleEnded', self);

                            }, 300);
                        }
                    }

                },
                init: function() {
                    var self = this;
                    self.initFirst();
                    self.addEvent();
                }
            };

            return carousel;
        });
        /**
         * 工具函数集合
         **************************************************/

        define('assets/js/util', [], function() {

            var util = {
                /**
                 * 一些病量 ^_^
                 ***************************************************************/
                _click: ("ontouchstart" in window) ? "tap" : "click",
                _windowHeight: $(window).height(), // 设备屏幕高度
                _windowWidth: $(window).width(), // 设备屏幕宽度
                _isUC: RegExp("Android").test(navigator.userAgent) && RegExp("UC").test(navigator.userAgent) ? true : false,
                _isweixin: RegExp("MicroMessenger").test(navigator.userAgent) ? true : false,
                _isiPhone: RegExp("iPhone").test(navigator.userAgent) || RegExp("iPod").test(navigator.userAgent) || RegExp("iPad").test(navigator.userAgent) ? true : false,
                _isAndroid: RegExp("Android").test(navigator.userAgent) ? true : false,
                _IsPC: function() {
                    var userAgentInfo = navigator.userAgent,
                        Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"],
                        flag = true;

                    for (var v = 0; v < Agents.length; v++) {
                        if (userAgentInfo.indexOf(Agents[v]) > 0) {
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                },
                /**
                 * 一些方法 O(∩_∩)O
                 ***************************************************************/

                // 判断浏览器内核类型
                getVendor: function() {
                    var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                        transform,
                        i = 0,
                        l = vendors.length,
                        elemStyle = document.createElement('div').style;

                    for (; i < l; i++) {
                        transform = vendors[i] + 'ransform';
                        if (transform in elemStyle) return vendors[i].substr(0, vendors[i].length - 1);
                    }
                    return false;
                },

                // 判断浏览器来适配css属性值
                prefixStyle: function(style) {
                    if (this.getVendor() === false) return false;
                    if (this.getVendor() === '') return style;
                    console.log(this.getVendor() + style.charAt(0).toUpperCase() + style.substr(1));
                    return this.getVendor() + style.charAt(0).toUpperCase() + style.substr(1);
                }
            };

            return util;
        });
    });