$(document).ready(() => {
  window.setTimeout(() => {
    $('body').removeClass('loading');
    window.ShapesPolyfill.run();
  }, 2000);

  const onResize = () => {
    const half_champagne_right = $('.half-champagne-right');
    const half_champagne_left = $('.half-champagne-left');
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
    $('.champagne').css('background-position-y', 1024 + offset / 4);
    $('.half-champagne-right').css('background-position-y', -offset / 4);
    $('.half-champagne-left').css('background-position-y', offset / 4);
  });

  $('#menu').change(function () {
    $('.panel-sidebar').toggleClass('visible', this.checked);
  });

  $(document).on('click', 'a', function (e) {
    const selector = $.attr(this, 'href');
    if (!selector.startsWith('#')) return;

    e.preventDefault();
    $('body').animate({
      scrollTop: $(selector).offset().top
    }, 500);
    $('#menu').prop('checked', false);
    $('#menu').change();
  });

  const filter = [
    [$('.section-eye-left .eye'), 'graphic'],
    [$('.section-eye-right .eye'), 'consulting'],
    [$('.band'), 'web'],
  ];

  filter.forEach(([$el, key]) => {
    $el.click(() => {
      $('.category').addClass('hide');
      $(`.category-${key}`).removeClass('hide');
      $('body').animate({
        scrollTop: $('#portfolio').offset().top
      }, 500);
    });
  });

  $('.nav svg').click(() => {
    $('.category').removeClass('hide');
    $('body').animate({
      scrollTop: 0
    }, 500);
  });
});