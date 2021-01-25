const equalHeightPods = function(pod) {

  var columnWrappers = document.querySelectorAll('.column-splitter');
  if (columnWrappers) {
    // go through all the column splitters and see if there's a match for the pod being checked
    for (var splitter = 0; splitter < columnWrappers.length; splitter++) {

      var matchedPods = columnWrappers[splitter].querySelectorAll(pod);
      if (matchedPods.length > 1) {
        matchHeight(pod, matchedPods);
      }
    }
  }

  function matchHeight(podType, podsInside){
    var arrayLength = podsInside.length;
    var heights = [];

    // reset pod height to natural height
    for (var i = 0; i < arrayLength; i++) {
      podsInside[i].querySelector('div[class*="__wrapper"]').style.minHeight = '72px';
    }

    setTimeout(function(){
      // if window width is less than tabvar (640) then don't do it!
      if (window.innerWidth < 640) {
        return;
      } else {
        getNewHeights();
      }
    }, 100);


    function getNewHeights() {
      for (var i = 0; i < arrayLength; i++) {
        heights.push(podsInside[i].offsetHeight);
      }

      var tallest = Math.max.apply(this, heights);

      for (var j = 0; j < arrayLength; j++) {
        podsInside[j].querySelector('div[class*="__wrapper"]').style.minHeight = tallest + "px";
      }

    }
  }

}
var resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    equalHeightPods('.js-equalHeight');
  }, 500);
});

document.addEventListener('DOMContentLoaded', function(){
  equalHeightPods('.js-equalHeight');
}); //dom loaded