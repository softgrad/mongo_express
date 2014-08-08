$(function () {
  var $content = $('.content');

  setTimeout(function() {
    $content.addClass('open');
  }, 0);

  $('.navigation a').on('click', function (e) {
    e.preventDefault();

    var path = $(this).attr('href');

    if (window.location.pathname === path) {
      return false;
    }

    $content.removeClass('open');

    setTimeout(function() {
      window.location = path;
    }, 500);
  });
});
