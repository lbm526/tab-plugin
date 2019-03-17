;(function ($,window,document,undefined) {
    $.fn.tabPage = function (options) {
        var defaults = {
            tabArray: ['标签1', '标签2'],
            color: '#555555',
            selectColor: '#1890FF',
            left: '20px',
            right: 0,
            clickTab: 'click'
        };

        //参数不为对象，终止插件使用
        if(typeof options !== 'object' && options){
            return false;
        }

        var tabPageOptions=$.extend(defaults,options);

        return this.each(function () {
            var _this = $(this);
            
            html = '<div class="tab-page-header">';
            html +='<span class="nav_prev">&lt;</span>';
            html +='<span class="nav_next">&gt;</span>';
            html += '<div class="tab-page-contains">';
            html += '<div class="tab-page-nav">';
            $.each(tabPageOptions.tabArray,function (index,el) {
                var tabName = 'tab'+ (index+1);
                html += index ===0 ? '<div class="tabPage-active tabPage-el" tab-name='+tabName+'>'+el+'</div>'
                    : '<div class="tabPage-el" tab-name='+tabName+'>'+el+'</div>';
            });
            html += '<i class="select_tab"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            _this.append(html);

            _this.find('div.tabPage-el').css({
                color: tabPageOptions.color,
            });
            
            _this.find('.select_tab').css({
                width: $('.tabPage-active').width(),
                left: tabPageOptions.left,
                backgroundColor: tabPageOptions.selectColor
            });

            var $nav = $('.tab-page-nav');
            var $contans = $('.tab-page-contains');
            var $containsWidth = $contans.outerWidth(); //容器宽度
            var $navWidth = $nav.outerWidth(); //导航栏宽度
            var $igrationLength; //最大滚动距离
            var translateX = 0; //滚动距离
            var $navEq = -1; //记录标签索引

            _this.find('div.tabPage-el').bind(tabPageOptions.clickTab,function () {
                $(this).addClass('tabPage-active');
                $('.select_tab').animate({
                    left:$(this).position().left + 20, //点击标签时，下划线移到标签下方位置，20为padding-left
                    width: $(this).width() //下划线宽度等于该标签div宽度
                },"slow");
                $(this).siblings().removeClass('tabPage-active');
            });

            /***容器宽度大于导航栏时，隐藏左右伸缩框
             * 标签栏位置归零**/
            window.onresize = function () {
                $containsWidth = $contans.width();
                $navWidth = $nav.width();
                nav_auxiliary($containsWidth,$navWidth);
            //    归零
                $nav.css({
                    transform: 'translateX(0)'
                })
            };
            nav_auxiliary($containsWidth,$navWidth);
            function nav_auxiliary($containsWidth,$navWidth) {
                if($containsWidth > $navWidth){
                    _this.find('span.nav_prev').hide();
                    _this.find('span.nav_next').hide();
                }else {
                    _this.find('span.nav_prev').show();
                    _this.find('span.nav_next').show();
                }
            }

            /**滚动导航菜单
             * 当导航栏宽度大于容器宽度才能滚动**/
            _this.find('span.nav_prev').click(function () {
                $igrationLength = $navWidth - $containsWidth;
                $navEq > 0 ? $navEq-- : $navEq;
                //使用css('width')不用width()，后者不会包含padding
                translateX += parseFloat($nav.find('div').eq($navEq).css('width').split('px')[0]);
                //判断是否超过最大滚动距离
                if(translateX > 0){
                    translateX = 0;
                }
                $nav.css({
                    transform: 'translateX('+translateX+'px)'
                })
            });
            _this.find('span.nav_next').click(function () {
                $igrationLength = $navWidth - $containsWidth;
                $navEq < $nav.find('div').length-1 ? $navEq++ : $navEq;
                //使用css('width')不用width()，后者不会包含padding
                translateX -= parseFloat($nav.find('div').eq($navEq).css('width').split('px')[0]);
                //判断是否超过最大滚动距离
                if(Math.abs(translateX) > $igrationLength){
                    translateX = -($igrationLength);
                }
                $nav.css({
                    transform: 'translateX('+translateX+'px)'
                })
            })
        })
    }
})(jQuery,window,document);