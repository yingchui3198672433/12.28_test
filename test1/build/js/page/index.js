"use strict";function render(n){var a="";n.map(function(n){a+='<dl>\n                    <dt><img src="'.concat(n.url,'" alt=""></dt>\n                    <dd>\n                        <p>').concat(n.title,"</p>\n                        <p>").concat(n.price,"</p>\n                        <p>").concat(n.circle,"</p>\n                    </dd>\n                </dl>")}),$(".inner-box").html(a);new BScroll(".pro-list")}$.ajax({url:"/api/data",success:function(n){var a=JSON.parse(n);1===a.code&&render(a.data)}}),$(".search").on("change",function(){var n=$(this).val();$.ajax({url:"/api/list",data:{val:n},success:function(n){6===(n=JSON.parse(n)).code?render(n.list):alert(n.msg)}})});