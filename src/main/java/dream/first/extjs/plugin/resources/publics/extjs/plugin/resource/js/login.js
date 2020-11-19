window.onload=function () {
    var height=$(window).height();
    var cHeight=$('.body_bg').height();
    $('.login_img').css({"height":height});
    $('.box_body').css({"height":height});
    $('.body_bg').css({top:(height-cHeight)/2})
    $('.content').css({top:(height-cHeight)/2})
}
window.onresize=function () {
    var height=$(window).height();
    var cHeight=$('.body_bg').height();
    $('.login_img').css({"height":height});
    $('.box_body').css({"height":height});
    $('.body_bg').css({top:(height-cHeight)/2})
    $('.content').css({top:(height-cHeight)/2})
}