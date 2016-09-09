// songlist -- functions for all pages with a songlist on them
// This module assumes that the jQuery library has been loaded.  Refer to
// www.jquery.com for documentation.

$(document).ready(function() {
  songlist.initialize_triangles();
  songlist.initialize_colpicker();
  songlist.initialize_favorites();
  songlist.initialize_hotkeys();
});

var songlist = {

  /*************************** SUBACTION UTILITIES ***************************/

  // Start a new subaction, ending any previous subaction.
  start_subaction: function() {
    songlist.end_subaction();
    // Hide the action tray (thus uncovering the subaction tray).
    jQuery("#actions").hide();
  },

  // End the current subaction (if any).
  end_subaction: function() {
    // Unhide the action tray (thus covering the subaction tray).
    jQuery("#actions").show();
    // Remove all children from the subaction tray.
    jQuery("#subactions").empty();
  },

  // Cancel the current subaction (if any).
  cancel: function() {
    songlist.end_subaction();
  },

  add_subaction_item: function(item) {
    jQuery("#subactions").append(item);
  },

  add_subaction_span: function(item) {
    var span = document.createElement("span");
    span.appendChild(item);
    songlist.add_subaction_item(span);
  },

  // Add a text label to the subaction tray.
  //   text: the text of the label (e.g. "Select a foobar to bazify:")
  add_subaction_label: function(text) {
    var label = document.createElement("span");
    label.appendChild(document.createTextNode(text));
    songlist.add_subaction_item(label);
  },

  // Add a textbox to the subaction tray.
  //   ID: the ID of the textbox element, (e.g. "email")
  //   value: the initial contents of the textbox (e.g. "username@example.com")
  //   opt_callback: called with no args when the user hits enter.
  add_subaction_textbox: function(ID, value, opt_callback) {
    var box = document.createElement("input");
    box.type = "text";
    box.size = 30;
    box.id = ID;
    box.value = value;
    songlist.add_subaction_span(box);
    if (opt_callback) {
      jQuery(box).keyup(function(evt) {
        if (evt.keyCode == 13) {  // 13 is return.
          opt_callback();
        }
      });
    }
  },

  // Add a button to the subaction tray.
  //   klass: the CSS class of the button element, (e.g. "ok" or "cancel")
  //   action: code to execute when the button is pressed (e.g. "bazify();")
  //   text: the displayed text on the button (e.g. "Click to bazify!")
  add_subaction_button: function(klass, action, text) {
    var sprite = $('<div/>');
    sprite.addClass('aenclave-sprites aenclave-sprites-' + klass + '-png');
    sprite.html('&nbsp;');
    var button = $('<a/>');
    button.attr('href', 'javascript:' + action);
    button.text(text);
    button.prepend(sprite);
    songlist.add_subaction_item(button);
  },

  // Add a cancel button for the subaction tray; the button will call cancel()
  // when pressed.
  add_subaction_cancel_button: function() {
    songlist.add_subaction_button("cancel", "songlist.cancel();", "Cancel");
  },

  // End the current subaction (if any), and display a success message using
  // the subaction tray.
  //   text: the text to display (e.g. "The thingy was successfully bazified.")
  success_message: function(text) {
    songlist.start_subaction();
    songlist.add_subaction_label(text);
    songlist.add_subaction_button("ok", "songlist.end_subaction();", "Yay!");
  },

  // Cancel the current subaction (if any), and display an error message using
  // the subaction tray.
  //   text: the error text to display (e.g. "The system is down!")
  error_message: function(text) {
    songlist.start_subaction();
    songlist.add_subaction_label(text);
    songlist.add_subaction_button("cancel", "songlist.cancel();", "Phooey!");
  },

  /*************************** CHECKBOX FUNCTIONS ****************************/

  // Sets the checked state of all checkboxes in the songlist to be the same as
  // the checkbox given as an argument.
  select_all: function(box) {
    // WTF What if there are non-checkbox inputs in the songlist?  Who cares,
    //     those inputs will ignore the `checked` attribute anyway.
    jQuery("#songlist input").attr('checked', !!box.checked);
  },

  // Return a random integer from 0 to n - 1 inclusive.
  random_int: function(n) {
    return Math.floor(Math.random() * n);
  },

  // TODO(rnk): Figure out how to do exceptions in JavaScript right.
  E_SAMPLE_SIZE_TOO_LARGE: "sample size greater than pop size",

  // Chooses k random samples from a population.  If k is near the size of the
  // population, it will take longer.  If k is greater than the size of the
  // population, it will raise an error.
  random_sample: function(population, k) {
    var results = [];
    // JS Arrays are kind of like hashes, so we use it like a set.
    var selected = [];
    var pop_size = population.length;
    if (k > pop_size) {
      throw songlist.E_SAMPLE_SIZE_TOO_LARGE;
    }
    for (var i = 0; i < k; i++) {
      j = songlist.random_int(pop_size);
      while (selected[j]) {
        j = songlist.random_int(pop_size);
      }
      selected[j] = true;
      results.push(population[j]);
    }
    return results;
  },

  start_enter_sample: function() {
    with (songlist) {
      start_subaction();
      var label = $('<span id="sample_size_label">Enter sample size:</span>');
      add_subaction_item(label);
      add_subaction_textbox('sample_size', '', songlist.end_enter_sample);
      add_subaction_button('ok', 'songlist.end_enter_sample();', 'Go');
      add_subaction_cancel_button();
    }
  },

  end_enter_sample: function() {
    var k_str = $('#sample_size').val();
    var k = parseInt(k_str, 10);
    var label = $('#sample_size_label');
    if (isNaN(k)) {
      label.text('Sample size was not an integer:');
    } else {
      try {
        songlist.select_random(k);
      } catch (e) {
        if (e === songlist.E_SAMPLE_SIZE_TOO_LARGE) {
          label.text('Sample size too large:');
          return;
        } else {
          throw e;
        }
      }
      songlist.end_subaction();
    }
  },

  select_random: function(k) {
    if (!k) {
      var k_str = $('#select_sample_size').val();
      k = parseInt(k_str, 10);
      if (isNaN(k)) {
        // Have the user enter a number by hand.
        songlist.start_enter_sample();
      }
    }
    var all_songs = $('#songlist .song_selected');
    all_songs.attr('checked', false);
    var songs_sample = songlist.random_sample($.makeArray(all_songs), k);
    $(songs_sample).attr('checked', 'checked');
  },

  // Returns a space-separated string of the IDs of all selected songs.
  //  empty: if true, nothing selected -> empty return value
  //         if false, nothing selected is equivalent to everything selected
  gather_ids: function(empty) {
    function get_names(boxen) {
      return jQuery.makeArray(boxen.map(function(i, box) {
        return box.name;
      }));
    }
    var names = get_names(jQuery('#songlist .song_selected:checked'));
    if (!empty && names.length == 0) {
      // If nothing is selected and empty is false, return all songs.
      return get_names(jQuery("#songlist .song_selected")).join(' ');
    }
    return names.join(' ');
  },

  gather_indices: function() {
    // WTF We can't use ':checked' here, because then we don't get indices.
    var selected = [];
    jQuery("#songlist .song_selected").each(function (i) {
      if (this.checked) selected.push(i);
    });
    return selected.join(' ');
  },

  gather_playids: function() {
    var boxen = jQuery("#songlist .song_selected:checked");
    return jQuery.makeArray(boxen.map(function (i, box) {
      return box.getAttribute('playid');  // Custom attrs require this.
    })).join(' ');
  },

  /********************************* ACTIONS *********************************/

  // Queues a single song with an XHR.
  queue_click: function(link) {
    // Add a paragraph after the link giving the status of the request.
    var para = document.createElement('p');
    var control_div = jQuery('#controls').get(0);
    control_div.appendChild(para);
    para.innerHTML = 'queueing...';
    // Set the cursor over the link to wait.
    link.style.cursor = 'wait';
    para.style.cursor = 'wait';
    var options = {
      type: 'post',
      dataType: 'json',
      url: link.href + "&getupdate=1",
      error: function(transport) {
        para.innerHTML = 'failed to queue.';
      },
      success: function(response_json) {
        if (response_json.error) {
          para.innerHTML = 'failed to queue.';
        } else {
          para.innerHTML = 'queued successfully.';
          controls.update_playlist_info(response_json);
        }
      },
      complete: function(transport) {
        // Undo the waiting cursor.
        link.style.cursor = '';
        para.style.cursor = '';
        // Remove the paragraph after five seconds.
        window.setTimeout(function() {
          control_div.removeChild(para);
        }, 3000);
      }
    };
    jQuery.ajax(options);
    return false;
  },

  // Queues all selected songs.
  queue: function() {
    var ids = songlist.gather_ids(true); // true -> queue nothing if nothing
    if (ids.length > 0) {                //         is selected
      document.forms.queueform.ids.value = ids;
      document.forms.queueform.submit();
    } else {
      songlist.error_message("You haven't selected any songs.");
    }
  },

  // DLs all selected songs.
  dl: function() {
    var ids = songlist.gather_ids(true);
    if (ids.length > 0) {
      document.forms.dlform.ids.value = ids;
      document.forms.dlform.submit();
    } else {
      songlist.error_message("You haven't selected any songs.");
    }
  },

  askcreate: function() {
    with (songlist) {
      start_subaction();
      add_subaction_label("Put songs into a playlist called:");
      add_subaction_textbox("playlistname", "Rockin' Out", songlist.okcreate);
      add_subaction_button("ok", "songlist.okcreate();", "Create playlist");
      add_subaction_cancel_button();
    }
  },

  okcreate: function() {
    var name = document.getElementById("playlistname").value;
    // WTF createform is the name of a form, not something that creates forms.
    document.forms.createform.name.value = name;
    document.forms.createform.ids.value = songlist.gather_ids(false);
    songlist.end_subaction();
    document.forms.createform.submit();
  },

  askdelete: function() {
    with (songlist) {
      start_subaction();
      add_subaction_label("Submit a delete request for the selected songs?");
      add_subaction_button("ok", "songlist.okdelete();", "Yes");
      add_subaction_cancel_button();
    }
  },

  delete_: function() {
    with (songlist) {
      start_subaction();
      add_subaction_label("Really DELETE the selected songs?");
      add_subaction_button("ok", "songlist.okdelete();", "Yes, those tunes suck!");
      add_subaction_cancel_button();
    }
  },

  okdelete: function() {
    // WTF deleteform is the name of a hidden delete form on the page
    document.forms.deleteform.ids.value = songlist.gather_ids(false);
    songlist.end_subaction();
    document.forms.deleteform.submit();
  },

  askadd: function() {
    // We need to figure out which playlists the user is allowed to add to so
    // that we can list those in a dropdown menu.  Let's ask the server.

    jQuery.ajax({
      url: "/audio/json/playlists/user/",
      type: 'GET',
      dataType: 'json',
      success: function(json) {
        if("error" in json) {
          songlist.error_message(json.error);
        } else {
          songlist._make_askadd_tray(json);
        }
      },
      error: function() {
        songlist.error_message("Got no reponse from server.");
      }
    });
  },

  // Called only by askadd().  Create a subaction tray with a dropdown list of
  // the user's playlists.
  _make_askadd_tray: function(json) {
    // Create a menu of playlist choices.
    var select = document.createElement("select");
    select.id = "playlistid"
    for (var i = 0; i < json.length; i++) {
      var item = json[i];
      var option = document.createElement("option");
      option.value = item.pid;
      option.appendChild(document.createTextNode(item.name));
      select.appendChild(option);
    }
    // If there are any choices, make a subaction.
    if (select.childNodes.length > 0) {
      with (songlist) {
        start_subaction();
        add_subaction_label("Add songs to playlist:");
        add_subaction_span(select);
        add_subaction_button("ok", "songlist.okadd();", "Add songs");
        add_subaction_cancel_button();
      }
    } else songlist.error_message("No playlists exist that you may edit.");
  },

  okadd: function() {
    var select = document.getElementById("playlistid");
    var addform = document.forms.addform;
    addform.pid.value = select.value;
    addform.ids.value = songlist.gather_ids(false);
    songlist.end_subaction();
    addform.submit();
  },

  // For 6.867 / recommendations:
  report_bad_recs: function() {
    // *****
    var ids = songlist.gather_ids(true); // true -> queue nothing if nothing
    var options = {
      type: 'post',
      dataType: 'json',
      url: "/audio/recommendations/feedback/",
      data: { original_songs: songlist.original_songs,
	      bad_songs: ids },
      error: function(transport) {
	alert("Error while reporting bad recommendations.");
      },
      success: function(response_json) {
	jQuery('#songlist .song_selected:checked').closest('tr').remove();
	tablesort.recolor_rows();
	jQuery('#feedback_msg').text("Thank you for your feedback!");
	setTimeout(function() {jQuery('#feedback_msg').html("&nbsp;")},
		   3000);
      }
    };
    jQuery.ajax(options);
  },

  /******************************* DRAG & DROP *******************************/

  enable_dnd: function(opt_onDrop) {
    // Make the current song undraggable.
    jQuery('#songlist tr.c .drag').removeClass('drag');
    jQuery('#songlist').tableDnD({
        onDrop: function(table, row) {
          tablesort.recolor_rows();
          // Call this if the caller provided it.
          if (opt_onDrop) {
            opt_onDrop(table, row);
          }
        },
        dragHandle: 'drag'
    });
  },

  update_songlist: function(url) {
    // Collect all the song ids in order and send them to the server.
    var song_ids = [];
    var boxen = jQuery('#songlist input');
    for (var i = 0; i < boxen.length; i++) {
      if (boxen[i].type == 'checkbox' && boxen[i].name) {
        song_ids.push(boxen[i].name);
      }
    }
    var data = {ids: song_ids.join(' ')};
    jQuery.post(url, data, function(json, statusText) {
      if (statusText == 'success') {
        if (json.success) {
          // This is probably unnecesarry...
          //songlist.success_message(json.success);
        } else if (json.error) {
          songlist.error_message(json.error);
        } else {
          songlist.error_message("Malformed server response.");
        }
      } else {
        songlist.error_message("Error reaching the server.");
      }
    }, 'json');
  },

  /******************************* TAG EDITING *******************************/


  /** Utility Functions for Swapping the class / onclick of the edit column **/
  _edit_column_done: function(target) {
    // target must already be wrapped by jQuery
    var oldClasses = "aenclave-sprites-edit-png aenclave-sprites-cancel-png";
    var doneClass = "aenclave-sprites-ok-png";
    $(".aenclave-sprites", target).removeClass(oldClasses).addClass(doneClass);
    target.each(function() {
      this.onclick = function() { songlist.done_editing(this); }
    });
  },

  _edit_column_edit: function(target) {
    // target must already be wrapped by jQuery
    var oldClasses = "aenclave-sprites-ok-png aenclave-sprites-cancel-png";
    var newClass = "aenclave-sprites-edit-png";
    $(".aenclave-sprites", target).removeClass(oldClasses).addClass(newClass);
    target.each(function() {
      this.onclick = function() { songlist.edit_song(this); }
    });
  },

  _edit_column_error: function(target) {
    // target must already be wrapped by jQuery
    var oldClasses = "aenclave-sprites-ok-png aenclave-sprites-edit-png";
    var newClass = "aenclave-sprites-cancel-png";
    $(".aenclave-sprites", target).removeClass(oldClasses).addClass(newClass);
    target.each(function() { this.onclick = function() { }});
  },

  // This is called when the user clicks the edit button next to a song to edit
  // the song tags.
  edit_song: function(target) {
    target = jQuery(target);
    // Replace text with text boxes. (only do it on .editable children)
    target.parent('tr:first').children('.editable').each(function() {
      var cell = jQuery(this);
      var input = jQuery(document.createElement("input"));
      if (cell.hasClass("track")) {
        input.attr("size", "2");
      }
      input.attr("type", "text");
      input.attr("value", cell.text().strip());
      input.addClass("text");
      input.keypress(function(e) {
        // Check if the user hits enter in any of our textboxes.
        if (e.keyCode == 13) songlist.done_editing(target);
      });
      cell.empty().append(input);
    });
    songlist._edit_column_done(target);
  },

  done_editing: function(target) {
    // Collect the parameters from the text boxes.
    target = jQuery(target);
    var parent = target.parent("tr:first");
    var songid = parent.children(".select").children(":first").attr('name');
    var params = {id: songid};

    parent.children(".editable").each(function() {
      elt = jQuery(this);
      params[elt.attr('name')] = elt.children("input:first").attr('value');
    });

    // Send the request.
    var options = {
      url: "/audio/json/edit/",
      type: 'post',
      data: params,
      dataType: 'json',
      success: function(json) {
        if("error" in json) {
          songlist.error_message(json.error);
        } else {
          songlist._update_edited_song(target,json);
        }
      },
      error: function() {
        songlist._edit_column_error(target);
        songlist.error_message("Got no reponse from server.");
      }
    };
    jQuery.ajax(options);
  },

  // Called only by done_editing().  Update the row in the table based on the
  // data sent back by the server.
  _update_edited_song: function(target, json) {
    target = jQuery(target);

    songlist._edit_column_edit(target);

    jQuery(target).parent("TR:first").children(".editable").each(function(i) {
      var elt = jQuery(this);
      var info = json[i];
      if(info.href) {
        var link = jQuery(document.createElement("A"));
        if(info.klass) link.addClass(info.klass);
        link.attr('href', info.href);
        link.text(info.text);
        elt.empty().append(link);
      } else {
        elt.empty().text(info.text);
      }
    });
  },

  insert_row: function(row) {
    jQuery('#songlist tbody').append(row);
    tablesort.recolor_rows();
    songlist.on_songlist_updated();
  },

  sort_column: function(sort_header, order) {
    if (order == 'asc') {
      tablesort.sorta(sort_header[0]);
    } else if (order == 'desc') {
      tablesort.sortd(sort_header[0]);
    }
  },

  /********************************** MISC ***********************************/

  on_songlist_updated: function() {
    songlist.initialize_favorites();
  },

  initialize_favorites: function() {
    // Add event handlers to the hearts -- only select those that have
    // not had event handlers added already.
    var hearts = $('.fav-heart:not(.fav-touched)');
    hearts.click(songlist.toggle_favorite);
    hearts.hover(function() {
      var heart = $(this);
      heart.attr('hovering', 'true');
      songlist.update_heart_sprite(heart);
    }, function() {
      var heart = $(this);
      heart.attr('hovering', 'false');
      songlist.update_heart_sprite(heart);
    });
    // Add a tag to each heart we processed so that we dont do it in
    // the future.
    hearts.addClass('fav-touched');
  },

  toggle_favorite: function() {
    var heart = $(this);
    var favorited = heart.attr('favorited') == 'true' ? 'false' : 'true';
    heart.attr('favorited', favorited);
    heart.attr('hovering', 'false');
    songlist.update_heart_sprite(heart);
    var song_id = heart.attr('id').replace('fav-heart-', '');
    $.post('/audio/json/favorite_song/' + song_id + '/',
           {favorited: favorited});
  },

  update_heart_sprite: function(heart) {
    var pink = 'aenclave-sprites-heart-pink-png';
    var gray = 'aenclave-sprites-heart-gray-png';
    var red = 'aenclave-sprites-heart-png';
    var newClass;
    if (heart.attr('hovering') == 'true') {
      newClass = pink;
    } else {
      if (heart.attr('favorited') == 'true') {
        newClass = red;
      } else {
        newClass = gray;
      }
    }
    heart.removeClass(pink + ' ' + gray + ' ' + red).addClass(newClass);
  },

  // Initialize the column picker on the songlist table.
  initialize_colpicker: function() {
    // These are the columns the user is allowed to hide, by name.  We compute
    // their indexes so we don't have to hardcode them here and update them when
    // we add columns to the table.
    var allowToHide = ['play-count', 'skip-count', 'last-played', 'date-added'];
    var visibleColumns = $.makeArray($('#songlist thead th').map(function (col) {
      $th = $(this);
      for (var i = 0; i < allowToHide.length; i++) {
        if ($th.hasClass(allowToHide[i])) {
          return null;
        }
      }
      return col + 1;  // columnmanager uses 1-indexed column numbers.
    }));
    $('#songlist').columnManager({
        listTargetID: 'col-list',
        onClass: 'col-on',
        offClass: 'col-off',
        onToggle: songlist.update_colmenu_sprites,
        saveState: true,
        hideInList: visibleColumns
    });
    // We use a span styled as a inline-block instead of a div for the sprite
    // because the jquery.clickmenu plugin thinks that a div is a submenu and
    // does things to it.
    $('#col-list li').prepend('<span class="aenclave-sprites">&nbsp;</span>');
    songlist.update_colmenu_sprites();
    // Create the picker click menu (not sure what the function is for...).
    $('#ul-select-col').clickMenu({onClick: function() {}});
  },

  // We use the .col-on and .col-off classes to style the sprites inside the
  // column picker.  We can't do this with pure CSS, which would be awfully
  // nice.
  update_colmenu_sprites: function() {
    var cols = $('#col-list');
    var cols_on = $('li.col-on .aenclave-sprites', cols);
    cols_on.removeClass('aenclave-sprites-cross-png');
    cols_on.addClass('aenclave-sprites-tick-png');
    var cols_on = $('li.col-off .aenclave-sprites', cols);
    cols_on.removeClass('aenclave-sprites-tick-png');
    cols_on.addClass('aenclave-sprites-cross-png');
  },

  show_triangle: function(triangle) {
    triangle.addClass("tri_visible").css('visibility', '');
  },

  hide_triangle: function(triangle) {
    triangle.removeClass("tri_visible").css('visibility', 'hidden');
  },

  initialize_triangles: function() {
    songlist.show_triangle($($('.triangle').get(0)));
  },

  change_selection: function(direction) {
    // Find the next or previous triangle.
    var triangle = $('.triangle.tri_visible');
    var tr = triangle.closest('tr');
    var next_tr;
    if (direction == 'j') {
      next_tr = tr.next('tr');
    } else {
      next_tr = tr.prev('tr');
    }
    var next_triangle = $('.triangle', next_tr);

    // If we're about to go off the end, don't hide the triangle.
    if (next_tr.size() != 0) {
      songlist.hide_triangle(triangle);
      songlist.show_triangle(next_triangle);
    }
  },

  queue_selection: function() {
    var triangle = $('.triangle.tri_visible');
    var queue_link = $('a', triangle.closest('td').nextAll('.title'));
    queue_link.click();
  },

  initialize_hotkeys: function() {
    var options = {'combi': 'a', 'disableInInput': true};
    $(document).bind('keydown', {'combi': 'a', 'disableInInput': true},
      function() {
        var box = $('#checkall').get(0);
        box.checked = !box.checked;
        songlist.select_all(box);
        return false;
      }
    );
    $(document).bind('keydown', {'combi': 'j', 'disableInInput': true},
      function() { songlist.change_selection('j'); });
    $(document).bind('keydown', {'combi': 'k', 'disableInInput': true},
      function() { songlist.change_selection('k'); });
    $(document).bind('keydown', {'combi': 'return', 'disableInInput': true},
      function() { songlist.queue_selection(); });
  }

};
