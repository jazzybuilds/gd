import objectFitImages from 'object-fit-images';

if (process.browser) {

  // initial page load, not triggered by transitions
  var resizeTimer;

  window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
          window.equalHeightPods('.js-equalHeight');
      }, 500);
  });

  document.addEventListener('DOMContentLoaded', function(){
    window.checkRowBgs();
    window.equalHeightPods('.js-equalHeight');
    objectFitImages();

  }); //dom loaded

}
