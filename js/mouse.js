$("body").append('<div class="cursor"></div>');
$("html").append('<style>html, body, .msty_notcur {cursor:none !important;}.cursor {z-index:10000000000000; position: fixed;background-color:rgba(255,255,255,0.1);border: 1px solid rgba(0,0,0,0.2);width:25px;height:25px;border-radius:100%;transform:translate(-50%,-50%);top:0px;left:0px;pointer-events:none;} .overlink {background-color:rgba(25, 212, 143, 0.25) !important;border: 1px solid rgba(100,0,0,0.25) !important;} .overtext {background-color:rgba(100,100,255,0.25) !important;border: 1px solid rgba(0,0,100,0.25) !important;}</style>');
var scrollY = 0,
  scrollX = 0;
$(document).mousemove(function (e) {
  $(".cursor").css("top", e.pageY - scrollY + "px").css("left", e.pageX - scrollX + "px");
});
$(document).scroll(function (e) {
  scrollY = $(window).scrollTop();
  scrollX = $(window).scrollLeft();
});
setInterval(function () {
  scroll = $(window).scrollTop();
}, 1000);
$("*").hover(function (e) {
  var index = -1;
  try {
    index = $(this).attr("class").toLowerCase().indexOf("button");
    if (index == -1) {
      index = $(this).attr("class").toLowerCase().indexOf("link");
    }
  } catch (e) {
    index = -1;
  }
  if ($(this).css("cursor") == "pointer" || $(this).get(0).tagName == "A" || $(this).get(0).tagName == "BUTTON" || $(this).hasClass("msty_cur") || index > -1) {
    $(this).addClass("msty_cur");
    $(this).css("cursor", "none");
    $(".cursor").addClass("overlink");
  }
  if ($(this).css("cursor") != "none") {
    $(this).addClass("msty_notcur")
  }
}, function (e) {
  $(this).css("cursor", "none");
  $(".cursor").removeClass("overlink");
});