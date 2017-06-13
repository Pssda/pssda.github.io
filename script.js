/**
 * pssda - 
 * @version v1.0.0
 * @author 
 * @link https://github.com/Pssdesoi/pssda
 * @license ISC
 */
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

$(document).ready(function () {
  var ie = !!detectIE();

  window.setTimeout(function () {
    $('body').removeClass('loading');
    window.ShapesPolyfill.run();
  }, 2000);

  var onResize = function onResize() {
    var half_champagne_right = $('.half-champagne-right');
    var half_champagne_left = $('.half-champagne-left');
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
    var desktop = !ie && width > 960;
    var mobile = !desktop;
    $('body').toggleClass('desktop', desktop);
    $('body').toggleClass('mobile', mobile);
  };
  onResize();
  window.onresize = onResize;

  $(window).scroll(function () {
    var offset = $(window).scrollTop();
    $('.nav').toggleClass('visible', offset > 57);
    $('.champagne').css('background-position-y', 1024 + offset / 4);
    $('.half-champagne-right').css('background-position-y', -offset / 4);
    $('.half-champagne-left').css('background-position-y', offset / 4);
  });

  $('#menu').change(function () {
    $('.panel-sidebar').toggleClass('visible', this.checked);
  });

  var scrollTo = function scrollTo(scrollTop) {
    $('html,body').animate({ scrollTop: scrollTop }, 500);
  };

  $(document).on('click', 'a', function (e) {
    var selector = $.attr(this, 'href');
    if (selector[0] !== '#') return;

    var _selector$split = selector.split('-'),
        _selector$split2 = _slicedToArray(_selector$split, 2),
        new_selector = _selector$split2[0],
        type = _selector$split2[1];

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

  var filter = [[$('.section-eye-left .eye'), ['graphic']], [$('.section-eye-right .eye'), ['consulting']], [$('.band'), ['web']], [$('#menu-portfolio'), ['graphic', 'web']], [$('#menu-limitless'), ['consulting']]];

  filter.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        $el = _ref2[0],
        keys = _ref2[1];

    $el.click(function () {
      $('.category').addClass('hide');
      keys.every(function (key) {
        return $('.category-' + key).removeClass('hide');
      });
      scrollTo($('#portfolio').offset().top);
    });
  });

  $('.nav svg').click(function () {
    $('.category').removeClass('hide');
    scrollTo(0);
  });

  $('#select-type').change(function () {
    var type = $(this).val();
    $('.input-container > *').removeClass('hide');
    $('.input-container > *').find('input, textarea, select').prop('disabled', false);
    var $els = null;
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
    if ($('#input-logo').val()) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('.logo-preview img')[0].src = e.target.result;
        $('.logo-label').addClass('hide');
        $('.logo-clear').removeClass('hide');
      };
      reader.readAsDataURL(this.files[0]);
    } else {
      $('.logo-preview img')[0].src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
      $('.logo-label').removeClass('hide');
      $('.logo-clear').addClass('hide');
    }
  });

  $('.logo-clear').click(function () {
    $('#input-logo').val('');
    $('#input-logo').change();
  });

  $('.contact-form').ajaxForm({
    success: function success(data, status) {
      alert('문의주셔서 감사합니다. 빠른 시일 내로 연락드리겠습니다.');
      $('.contact-form')[0].reset();
      $('#input-logo').change();
    }, error: function error(data) {
      console.error(data);
      var fields = data.responseJSON.error.fields;

      fields.forEach(function (field) {
        return $('[name=\'' + field + '\']').addClass('error');
      });
    }
  });

  $('input, textarea, select').on('input change', function () {
    $(this).removeClass('error');
  });
});

// https://codepen.io/gapcode/pen/vEJNZN
function detectIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  return false;
}