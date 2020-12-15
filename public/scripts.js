jQuery.noConflict()
jQuery("a.js-responsiveNav-last.visuallyhidden").remove();

if (!document.cookie.includes("privacy-notification")) {
  jQuery(".privacy-warning").css("display", "block");
}

