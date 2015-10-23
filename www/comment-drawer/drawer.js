
// show & hide
$('.comment-count, .comment-close').click(function() {
  $('body').toggleClass('with-comments')
})

// esc key closes
$(document).keyup(function(e) {
  if (e.which == 27) $('body').removeClass('with-comments')
})

// comment count
$(function() {
  var app = muut(),
      $counter = $('.comment-count'),
      $count = $('span', $counter),
      comment_count = 0,
      timer

  app.one('load', function(page) {

    $.each(page, function(i, thread) {
      comment_count += thread.reply_count

      // user is typing...
      thread.on('type', function() {
        $counter.addClass('typing')
        clearTimeout(timer)
        timer = setTimeout(function() {
          $counter.removeClass('typing')
        }, 1000)
      })

    })

    $count.text(comment_count).parent().show()

    app.on('post', function(post, from_channel) {
      $count.text(++comment_count)
      $counter.addClass('added')
      setTimeout(function() { $counter.removeClass('added') }, 100)
    })

  })

})