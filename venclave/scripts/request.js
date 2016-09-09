venclave.request = {

  /* Filled in in the HTML document. */
  upvote_url: null,

  upvote: function(id) {
    jQuery.get(venclave.request.upvote_url, {'upvote': id},
      venclave.request.upvote_done, 'json');
  },

  upvote_done: function(data, textStatus, jqXHR) {
    if (data.error) {
      // TODO(rnk): Make an unobtrusive dialog box for these messages, like
      // a span or div somewhere on the page.
      venclave.request.unobtrusive_alert(data.error);
    } else if (data.success) {
      var votes = jQuery('#votes_' + data.id);
      votes.text((parseInt(votes.text(), 10) + 1));
    }
  },

  unobtrusive_alert: function(msg) {
    var box = $('#error-box');
    box.show();
    var px_below = box.outerHeight();
    box.css({'bottom': -px_below + 'px'});
    box.text(msg).show();
    box.animate({'bottom': '-5px'});
    setTimeout(function() {box.animate({'bottom': -px_below + 'px'});}, 3000);
  }

};
