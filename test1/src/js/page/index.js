/*
 * @Author: ZXY 
 * @Date: 2018-12-28 19:29:03 
 * @Last Modified by: ZXY
 * @Last Modified time: 2018-12-28 20:11:29
 */

//取数据
$.ajax({
    url: '/api/data',
    success: function(res) {
        var data = JSON.parse(res);
        if (data.code === 1) {
            render(data.data);
        }
    }
})


function render(data) {
    var html = '';
    data.map(function(item) {
        html += `<dl>
                    <dt><img src="${item.url}" alt=""></dt>
                    <dd>
                        <p>${item.title}</p>
                        <p>${item.price}</p>
                        <p>${item.circle}</p>
                    </dd>
                </dl>`;
    });
    $('.inner-box').html(html);
    var bs = new BScroll('.pro-list');
}



//输入关键字搜索条件
$('.search').on('change', function() {
    var value = $(this).val();
    $.ajax({
        url: '/api/list',
        data: {
            val: value
        },
        success: function(res) {
            var res = JSON.parse(res);
            if (res.code === 6) {
                render(res.list)
            } else {
                alert(res.msg);
            }
        }
    })
})