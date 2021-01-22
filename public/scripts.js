const equalHeightPods=e=>{var t=document.querySelectorAll(".column-splitter");if(t)for(var r=0;r<t.length;r++){var o=t[r].querySelectorAll(e);o.length>1&&l(e,o)}function l(e,t){for(var r=t.length,o=[],l=0;l<r;l++){const e=t[l].querySelector('div[class*="__wrapper"]');e&&(e.style.minHeight="72px")}setTimeout(function(){window.innerWidth<640||function(){for(var e=0;e<r;e++)o.push(t[e].offsetHeight);for(var l=Math.max.apply(this,o),n=0;n<r;n++){const e=t[n].querySelector('div[class*="__wrapper"]');e&&(e.style.minHeight=l+"px")}}()},100)}};

jQuery.noConflict()
jQuery("a.js-responsiveNav-last.visuallyhidden").remove();

if (!document.cookie.includes("privacy-notification")) {
  jQuery(".privacy-warning").css("display", "block");
}

document.addEventListener('DOMContentLoaded', function() {
  equalHeightPods('.js-equalHeight');
})

var resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    equalHeightPods('.js-equalHeight');
  }, 500);
});