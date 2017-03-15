var Tips = (function(){

	var $tipBox = $(".tips-box");

	var bind = function(){

	}

	bind();
	return {
		show: function(){
			$tipBox.removeClass("hide");
		},
		hide: function(){
			$tipBox.addClass("hide");
		},
		init: function(){

		}
	}
})();

var BackPic = (function(){
	var pics = ['http://7ximdq.com1.z0.glb.clouddn.com/1429618334309?imageView2/2/w/400/format/jpg',
				'http://7ximdq.com1.z0.glb.clouddn.com/1429536892299?imageView2/2/w/400/format/jpg',
				'http://7ximdq.com1.z0.glb.clouddn.com/1429536552889?imageView2/2/w/400/format/jpg',
                'http://7ximdq.com1.z0.glb.clouddn.com/1432456940456?imageView2/2/w/640/format/jpg',
                'http://7ximdq.com1.z0.glb.clouddn.com/1432458593460?imageView2/2/w/600/format/jpg',
                'http://7ximdq.com1.z0.glb.clouddn.com/1429536555889?imageView2/2/w/400/format/jpg'

                ];
	var num = Math.floor(Math.random()*pics.length);
	var url = pics[num];
	return {
		init: function(){
			//$('.left-col').css('background', 'url('+ url +') center no-repeat');
			$.ajax({
				url: 'http://weiboxb.sinaapp.com/background',
				type: 'POST',
				data: { bg: 'bg'},
				success: function(url) {
					$('.left-col').css('background', 'url('+ url +') no-repeat center');
				},
				error: function(e) {
					$('.left-col').css('background', 'url('+ url +') no-repeat center');
				}
			})
		}
	}
})();

var Search=(function(){
	var searchFunc = function(path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "xml",
        success: function( xmlResponse ) {
            // get the contents from search data
            var datas = $( "entry", xmlResponse ).map(function() {
                return {
                    title: $( "title", this ).text(),
                    content: $("content",this).text(),
                    url: $( "url" , this).text()
                };
            }).get();
            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);
            $input.addEventListener('input', function(){
                var str='<ul class=\"search-result-list\">';                
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    return;
                }
                // perform local searching
                datas.forEach(function(data) {
                    var isMatch = true;
                    var content_index = [];
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // only match artiles with not empty titles and contents
                    if(data_title != '' && data_content != '') {
                        keywords.forEach(function(keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);
                            if( index_title < 0 && index_content < 0 ){
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                            }
                        });
                    }
                    // show search results
                    if (isMatch) {
                        str += "<li><a href='"+ data_url +"' class='search-result-title'>"+ data_title +"</a>";
                        var content = data.content.trim().replace(/<[^>]+>/g,"");
                        if (first_occur >= 0) {
                            // cut out 100 characters
                            var start = first_occur - 20;
                            var end = first_occur + 80;
                            if(start < 0){
                                start = 0;
                            }
                            if(start == 0){
                                end = 100;
                            }
                            if(end > content.length){
                                end = content.length;
                            }
                            var match_content = content.substr(start, end); 
                            // highlight all keywords
                            keywords.forEach(function(keyword){
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
                            });
                            
                            str += "<p class=\"search-result\">" + match_content +"...</p>"
                        }
                        str += "</li>";
                    }
                });
                str += "</ul>";
                $resultContent.innerHTML = str;
            });
        }
    });
}

})();

var Main = (function(){

	var resetTags = function(){
		var tags = $(".tagcloud a");
		tags.css({"font-size": "12px"});
		for(var i=0,len=tags.length; i<len; i++){
			//var num = parseInt(Math.random()*5+1);
			var num = tags.eq(i).html().length % 5 +1;
			tags[i].className = "";
			tags.eq(i).addClass("color"+num);
		}
	}

	var slide = function(idx){
		var $wrap = $(".switch-wrap");
		$wrap.css({
			"transform": "translate(-"+idx*100+"%, 0 )"
		});
		$(".icon-wrap").addClass("hide");
		$(".icon-wrap").eq(idx).removeClass("hide");
	}

	var bind = function(){
		var switchBtn = $("#myonoffswitch");
		var tagcloud = $(".second-part");
		var navDiv = $(".first-part");
		switchBtn.click(function(){
			if(switchBtn.hasClass("clicked")){
				switchBtn.removeClass("clicked");
				tagcloud.removeClass("turn-left");
				navDiv.removeClass("turn-left");
			}else{
				switchBtn.addClass("clicked");
				tagcloud.addClass("turn-left");
				navDiv.addClass("turn-left");
				resetTags();
			}
		});

		var timeout;
		var isEnterBtn = false;
		var isEnterTips = false;

		$(".icon").bind("mouseenter", function(){
			isEnterBtn = true;
			Tips.show();
		}).bind("mouseleave", function(){
			isEnterBtn = false;
			setTimeout(function(){
				if(!isEnterTips){
					Tips.hide();
				}
			}, 100);
		});

		$(".tips-box").bind("mouseenter", function(){
			isEnterTips = true;
			Tips.show();
		}).bind("mouseleave", function(){
			isEnterTips = false;
			setTimeout(function(){
				if(!isEnterBtn){
					Tips.hide();
				}
			}, 100);
		});

		$(".tips-inner li").bind("click", function(){
			var idx = $(this).index();
			slide(idx);
			Tips.hide();
		});
	}

	var fancyInit = function(){

		var isFancy = $(".isFancy");

		if(isFancy.length != 0){
			var imgArr = $(".article-inner img");
			for(var i=0,len=imgArr.length;i<len;i++){
                if($(imgArr[i]).parents(".gallery").length>=1){

                    break;
                }
				var src = imgArr.eq(i).attr("src");
				var title = imgArr.eq(i).attr("alt");
				imgArr.eq(i).replaceWith("<a href='"+src+"' title='"+title+"' rel='fancy-group' class='fancy-ctn fancybox'><img src='"+src+"' title='"+title+"'></a>");
			}
			$(".article-inner .fancy-ctn").fancybox();
		}
	}

	var enterAnm = function(){
		//avatar
		$(".js-avatar").attr("src", $(".js-avatar").attr("lazy-src"));
		$(".js-avatar")[0].onload = function(){
			$(".js-avatar").addClass("show");
		}

		//article
		function showArticle(){
			$(".article").each(function(){
				if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && !$(this).hasClass('show') ) {
					$(this).addClass("show");
				}
				if($(this).offset().top<$(window).height()){
				    $(this).addClass("show");
				}
			});
		}
		$(window).on('scroll', function(){
			showArticle();
		});
		showArticle();
	}

	return {
		init: function(){
			resetTags();
			bind();
			enterAnm();
			fancyInit();
			Tips.init();
			BackPic.init();
			Search.init();
			new Mobile({
				ctn: document.getElementsByClassName("slider-trigger")[0]
			});
		}
	}
})();

$(Main.init());
