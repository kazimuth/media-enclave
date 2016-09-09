// channels -- functions for the Channels page

var channels = {

  // This value is set in the template via an inline script.  It will be set 
  channel_id: null,

  /********************************* ACTIONS *********************************/

  dequeue: function() {
    var playids = songlist.gather_playids();
    if (playids.length > 0) {
      document.forms.dequeueform.playids.value = playids;
      document.forms.dequeueform.submit();
    }
  },

  askemail: function() {
    with (songlist) {
      start_subaction();
      add_subaction_label("Email a link to the current song to:");
      add_subaction_textbox("emailaddress", "username@example.com",
                            channels.okemail);
      add_subaction_button("ok", "channels.okemail();", "Send");
      add_subaction_cancel_button();
    }
  },

  okemail: function() {
    var params = {
      email: jQuery("#emailaddress").val(),
      ids: jQuery("#currentsong").attr('name')
    };
    var options = {
      url: "/audio/json/email/",
      type: "post",
      data: params,
      dataType: 'json',
      error: function() {
        songlist.error_message("Got no reponse from server.");
      },
      success: function(json) {
        if ("error" in json) {
          songlist.error_message(json.error);
        } else if ("success" in json) {
          songlist.success_message(json.success);
        } else {
          songlist.error_message("Unintelligible server response.");
        }
      }
    };
    jQuery.ajax(options);
  },

  recent: function() {
    songlist.error_message("This feature isn't done yet.");
  },

  reorder_songs: function(table, row) {
    row = jQuery(row);
    var prev_row = row.prev("tr");
    var playid = jQuery(".song_selected", row).attr('playid');
    var after_playid = jQuery(".song_selected", prev_row).attr('playid');
    // The current song will not have a checkbox input.
    if (!after_playid) {
      after_playid = -1;  // -1 is a sentinel value for beginning.
    }
    // The channel_id should be set.  If not, we can't actually do reordering.
    if (!channels.channel_id) return;
    jQuery.ajax({
      url: '/audio/channels/' + channels.channel_id + '/reorder/',
      type: 'get',
      data: {'playid': playid, 'after_playid': after_playid},
      dataType: 'json',
      success: function(data) {
        if (data.error) {
          this.error(data.error);
          return;
        }
        controls.update_playlist_info(data);
      },
      error: function(errorMsg) {
        controls.error(String(errorMsg));
      }
    });
  }

};
