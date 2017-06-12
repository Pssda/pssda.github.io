$(document).ready(() => {
  const ie = !!detectIE();

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
    const desktop = !ie && width > 960;
    const mobile = !desktop;
    $('body').toggleClass('desktop', desktop);
    $('body').toggleClass('mobile', mobile);
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

  const scrollTo = scrollTop => {
    $('html,body').animate({ scrollTop }, 500);
  };

  $(document).on('click', 'a', function (e) {
    let selector = $.attr(this, 'href');
    if (selector[0] !== '#') return;

    const [new_selector, type] = selector.split('-');
    if (new_selector === '#contact') {
      selector = new_selector;
      if (type) {
        $('#select-type').val(type);
        $('#select-type').change();
      }
    }

    e.preventDefault();
    scrollTo($(selector).offset().top);
    $('#menu').prop('checked', false);
    $('#menu').change();
  });

  const filter = [
    [$('.section-eye-left .eye'), ['graphic']],
    [$('.section-eye-right .eye'), ['consulting']],
    [$('.band'), ['web']],
    [$('#menu-portfolio'), ['graphic', 'web']],
    [$('#menu-limitless'), ['consulting']],
  ];

  filter.forEach(([$el, keys]) => {
    $el.click(() => {
      $('.category').addClass('hide');
      keys.every(key => $(`.category-${key}`).removeClass('hide'));
      scrollTo($('#portfolio').offset().top);
    });
  });

  $('.nav svg').click(() => {
    $('.category').removeClass('hide');
    scrollTo(0);
  });

  $('#select-type').change(function () {
    const type = $(this).val();
    $('.input-container > *').removeClass('hide');
    $('.input-container > *').find('input, textarea, select').prop('disabled', false);
    let $els = null;
    switch (type) {
      case 'general':
      case 'consulting':
        $els = $('#row-logo, #row-color, #row-style');
        break;
      case 'graphic':
        $els = $('#row-style');
        break;
    }
    if ($els) {
      $els.addClass('hide');
      $els.find('input, textarea, select').prop('disabled', true);
    }
  });
  $('#select-type').change();

  $('#input-logo').change(function () {
    const reader = new FileReader();
    reader.onload = e => {
      $('.logo-preview img')[0].src = e.target.result;
      $('.logo-label').addClass('hide');
    };
    reader.readAsDataURL(this.files[0]);
  });
});

// https://codepen.io/gapcode/pen/vEJNZN
function detectIE() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  const edge = ua.indexOf('Edge/');
  if (edge > 0) {
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  return false;
}