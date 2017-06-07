/**
 * pssda - 
 * @version v1.0.0
 * @author 
 * @link https://github.com/Pssdesoi/pssda
 * @license ISC
 */
'use strict';

$(document).ready(function () {
  window.setTimeout(function () {
    $('body').removeClass('loading');
    window.ShapesPolyfill.run();
  }, 2000);

  var onResize = function onResize() {
    var half_champagne_right = $('.page-consulting .half-champagne-right');
    var half_champagne_left = $('.page-consulting .half-champagne-left');
    var _document$body = document.body,
        width = _document$body.clientWidth,
        height = _document$body.clientHeight;

    var hyp = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    var angle = Math.atan(width / 2 / height) / Math.PI * 180;
    var padding = hyp / height * 40;
    half_champagne_right.css({
      transform: 'rotate(' + angle + 'deg)',
      left: width / 2 + padding + 'px'
    });
    half_champagne_left.css({
      transform: 'rotate(' + angle + 'deg)',
      right: width / 2 + padding + 'px'
    });
  };
  onResize();
  window.onresize = onResize;

  $(window).scroll(function () {
    var offset = $(window).scrollTop();
    $('.nav').toggleClass('visible', offset > 57);
  });

  $('#menu').change(function () {
    $('.panel-sidebar').toggleClass('visible', this.checked);
  });
});