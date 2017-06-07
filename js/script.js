$(document).ready(() => {
  window.setTimeout(() => {
    $('body').removeClass('loading');
    window.ShapesPolyfill.run();
  }, 2000);

  const onResize = () => {
    const half_champagne_right = $('.page-consulting .half-champagne-right');
    const half_champagne_left = $('.page-consulting .half-champagne-left');
    const { clientWidth: width, clientHeight: height } = document.body;
    const hyp = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    const angle = Math.atan(width / 2 / height) / Math.PI * 180;
    const padding = hyp / height * 40;
    half_champagne_right.css({
      transform: `rotate(${angle}deg)`,
      left: `${width / 2 + padding}px`,
    });
    half_champagne_left.css({
      transform: `rotate(${angle}deg)`,
      right: `${width / 2 + padding}px`,
    });
  };
  onResize();
  window.onresize = onResize;

  $(window).scroll(function () {
    const offset = $(window).scrollTop();
    $('.nav').toggleClass('visible', offset > 57);
  });

  $('#menu').change(function () {
    $('.panel-sidebar').toggleClass('visible', this.checked);
  });
});