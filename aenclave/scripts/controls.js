// controls -- functions for the omni-present control widget
// BTW This module assumes that the Prototype library has been loaded.  Refer
//     to www.prototypejs.org for documentation.

function shallow_array_equals(a1, a2) {
  if (a1.length != a2.length) {
    return false;
  }
  for (var i = 0; i < a1.length; i++) {
    if (a1[i] != a2[i]) {
      return false;
    }
  }
  return true;
}

function pluralize(num, opt_plural, opt_singular) {
  var plural = opt_plural || 's';
  var singular = opt_singular || '';
  if (num == 1) {
    return singular;
  } else {
    return plural;
  }
}

// This is a little stateful object that will call the callback with the given
// frequency, but will also ensure that no two callbacks execute at the same
// time.  The code has been diked from prototypejs, since that's all we used
// from it.
function PeriodicalExecuter(callback, frequency) {
  this.callback = callback;
  this.frequency = frequency;
  // currentlyExecuting is true if the callback is executing, and false
  // otherwise.
  this.currentlyExecuting = false;
  // timer is null when we are stopped, and a setInterval timer value otherwise.
  this.timer = null;
}

PeriodicalExecuter.prototype = {
  registerCallback: function() {
    // WTF We do this dance of wrapping onTimerEvent with oSelf to work around
    //     Javascript's usage of 'this'.
    var oSelf = this;
    this.timer = setInterval(function() { oSelf.onTimerEvent(); },
                             this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },

  // Start periodic execution of our callback.
  start: function() {
    if (!this.timer) {
      this.registerCallback();
      // Do a callback now, since setInterval waits.
      // WTF Yes, wait one millisecond so we don't block.
      // TODO(rnk): Properly bind the 'this' value for the callback.
      window.setTimeout(this.callback, 1);
    }
  },

  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
      } finally {
        this.currentlyExecuting = false;
      }
    }
  }
};

var controls = {

  // The number of seconds between requests to update the controls.
  DELAY: 5,

  // The PeriodicalExecuter that calls controls.update().
  updater: null,

  // The PeriodicalExecuter that moves the progress bar.
  timestepper: null,

  // The JSON object that we get back from the server with the playlist info.
  // We keep this reference with an eye towards using this state for other
  // purposes later.
  playlist_info: null,

  initialize: function(playlist_info) {
    controls.updater = new PeriodicalExecuter(controls.update, controls.DELAY);
    controls.timestepper = new PeriodicalExecuter(function() {
      if (controls.playlist_info) {
        // TODO(rnk): Use the browser's clock to avoid drift better.
        controls.update_elapsed_time(1 + controls.playlist_info.elapsed_time);
      }
    }, 1);
    // WTF Don't delete the next line, or we'll reload the channels page a lot
    //     because we'll think that the playlist has changed.
    controls.playlist_info = playlist_info;
    controls.update_playlist_info(playlist_info);
    if (Boolean($.cookie('controls_minimized'))) {
      controls.minimize();
    } else {
      controls.updater.start();
    }
  },

  // Fires an xhr that will get new info from the server.
  update: function(opt_action) {
    var url = '/audio/json/controls_update/';
    var parameters = null;
    // We do this typeof check to avoid some weird bug.
    if (typeof opt_action == 'string') {
      url = '/audio/json/control/';
      parameters = {'action': opt_action}
    }
    var options = {
      url: url,
      type: 'post',
      dataType: 'json',
      error: function(transport, textStatus, exception) {
        controls.error(textStatus);
      },
      success: function(response_json) {
        // Update the control panel with the response JSON.
        controls.update_playlist_info(response_json);
      }
    };
    if (parameters) {
      options['data'] = parameters;
    }
    jQuery.ajax(options);
  },

  _playlist_empty: function(playlist_info) {
    return !Boolean(playlist_info &&
                    playlist_info.songs &&
                    playlist_info.songs.length > 0);
  },

  playlist_changed: function(playlist_info) {
    // Ugh, this boolean logic is complicated.
    var old_plist_empty = controls._playlist_empty(controls.playlist_info);
    var new_plist_empty = controls._playlist_empty(playlist_info);
    if (!(old_plist_empty || new_plist_empty)) {
      // If both playlists are non-empty, compare their contents.
      return !(controls.playlist_info.playlist_length ==
                 playlist_info.playlist_length &&
               shallow_array_equals(controls.playlist_info.songs,
                                    playlist_info.songs));
    } else {
      // If any playlist is empty, we haven't changed if they're both empty.
      return !(old_plist_empty && new_plist_empty);
    }
  },

  // Updates the controls widget with new playlist information.
  update_playlist_info: function(playlist_info) {
    // If we got an error, just display the message.
    if (playlist_info.error) {
      controls.error(playlist_info.error);
      return;
    }

    // If we're on channels, and the playlist changed, reload the page.
    var regex = /^\/audio\/channels\/(\d+\/)?$/;
    var on_channels = regex.test(window.location.pathname);
    if (on_channels && controls.playlist_changed(playlist_info)) {
      controls.updater.stop();
      window.location.reload();
      return;
    }

    controls.playlist_info = playlist_info;
    if (controls._playlist_empty(playlist_info)) {
      controls.clear_controls();
    } else {
      // We have some songs, display them.
      controls.update_elapsed_time(playlist_info.elapsed_time);
      if (playlist_info.playing) {
        controls.timestepper.start();
        jQuery('#pause').show();
        jQuery('#play').hide();
      } else {
        jQuery('#pause').hide();
        jQuery('#play').show();
      }
      jQuery('#current-song').text(playlist_info.songs[0]);
      var song_list = jQuery('#song-list');
      song_list.empty();
      for (var i = 1; i < playlist_info.songs.length; i++) {
        var li = document.createElement('li');
        song_list.append(li);
        jQuery(li).text(playlist_info.songs[i]);
      }
      var length = playlist_info.playlist_length;
      var duration = playlist_info.playlist_duration;
      // TODO(rnk): Use the HH:MM:SS format for duration.
      var msg = length + ' song' + pluralize(length) + ' total, ';
      msg += duration.toFixed(0) + ' playing time.';
      if (playlist_info.playlist_length > 3) {
        msg = '... ' + msg;
      }
      jQuery('#control-trailer').text(msg);
    }
  },

  // BTW This must stay consistent with base.css.
  TIME_BAR_WIDTH: 160,

  update_elapsed_time: function(time) {
    var tbar = jQuery('#timebar');
    if (tbar.length == 0 || !controls.playlist_info) return;
    controls.playlist_info.elapsed_time = time;
    var width = Math.min(controls.TIME_BAR_WIDTH, controls.TIME_BAR_WIDTH *
                         time / controls.playlist_info.song_duration);
    tbar.css('width', width + 'px');
  },

  error: function(msg) {
    controls.clear_controls();
    jQuery('#current-song').html(msg);
  },

  clear_controls: function() {
    // Leave -- in the current song spot and stop the progress bar.
    controls.timestepper.stop();
    controls.update_elapsed_time(0);
    // In case another callback gets executed, still set the bar to 0.
    setTimeout(function() {
      controls.update_elapsed_time(0);
    }, 1000);
    jQuery('#current-song').text('--');
    // Clear the song list and the other info.
    jQuery('#song-list').empty();
    jQuery('#control-trailer').empty();
  },

  /***************************** CONTROL BUTTONS *****************************/

  minimize: function() {
    jQuery('#controls').hide();
    jQuery('#controls-restore').show();
    controls.updater.stop();
    // Store a cookie to remember that we're minimized.
    $.cookie('controls_minimized', '1', {path: '/', expires: 7});
  },

  restore: function() {
    jQuery('#controls-restore').hide();
    jQuery('#controls').show();
    controls.updater.start();
    // Delete the cookie.
    $.cookie('controls_minimized', '', {path: '/', expires: -1});
  },

  play: function() {
    controls._control_action('play');
  },

  pause: function() {
    controls._control_action('pause');
    controls.timestepper.stop();
    jQuery('#pause').hide();
    jQuery('#play').show();
  },

  skip: function() {
    controls._control_action('skip');
  },

  shuffle: function() {
    controls._control_action('shuffle');
  },

  _control_action: function(action) {
    controls.update(action);
  }

};

(function($) {
  // Bind '/' to focusing on the search box.
  var options = {'combi': '/', 'disableInInput': true};
  $(document).bind('keydown', options, function() {
    $('#search_box').focus().select();
    return false;
  });

  // Navigation shortcuts.
  var navs = {
    'c': '/audio/channels/',
    'p': '/audio/playlists/',
    'f': '/audio/playlists/favorites/',
    'b': '/audio/browse/',
    'u': '/audio/upload/fancy/',
    'r': '/audio/roulette/',
    'h': '/audio/',
  };
  for (var key in navs) {
    // We need a new scope here for the closure to work properly.
    (function () {
      var url = navs[key];
      var options = {'combi': key, 'disableInInput': true};
      $(document).bind('keydown', options, function() {
        window.location = url;
        return false;
      });
    })();
  }
})(jQuery);
