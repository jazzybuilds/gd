jQuery.noConflict()
jQuery("a.js-responsiveNav-last.visuallyhidden").remove();

jQuery(".privacy-warning").css("display", "none");
if (!document.cookie.includes("privacy-notification")) {
  jQuery(".privacy-warning").css("display", "block");
}

