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

  const scrollTo = scrollTop => {
    $('body').animate({ scrollTop }, 500);
  };

  $(document).on('click', 'a', function (e) {
    let selector = $.attr(this, 'href');
    if (!selector.startsWith('#')) return;

    if (selector.startsWith('#contact-')) {
      const [new_selector, type] = selector.split('-');
      selector = new_selector;
      $('#select-type').val(type);
      $('#select-type').change();
    }

    e.preventDefault();
    scrollTo($(selector).offset().top);
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