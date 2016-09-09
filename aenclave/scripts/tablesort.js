// tablesort -- functions for sorting tables on columns

/****************************** SORTABLE TABLES ******************************/

var tablesort = {

  // WTF These functions may not work properly for the songlist on the Channels
  //     page.  That's okay -- that songlist doesn't need to be sortable.

  // Recolor the rows of the songlist table so that they alternate properly.
  // This should be called at the end of functions that reorder the rows.
  recolor_rows: function() {
    jQuery('#songlist tbody tr').each(function (i) {
      var row = jQuery(this);
      if (row.hasClass('c')) return;  // Skip the currently playing song.
      row.removeClass('a');
      row.removeClass('b');
      row.addClass(!(i % 2) ? 'a' : 'b');  // Odd is 'a', even is 'b'.
    });
  },

  // The various functions for computing sort keys.
  sort_keys: {

    'int': function(text) {
      var value = parseInt(text, 10);
      if (isNaN(value)) {
        return "";
      } else {
        return value;
      }
    },

    'date': function(text) {
      // TODO(rnk): This date parsing doesn't work when we have humanized dates
      // such as 'Today 02:02:23'; we should provide a Unix timestamp or other
      // consistent representation.
      var date = new Date();
      var dateparts = text.split(" ");
      var timeparts;
      if (dateparts.length == 2) {
        timeparts = dateparts[1].split(":");
        date.setHours(parseInt(timeparts[0], 10));
        date.setMinutes(parseInt(timeparts[1], 10));
        date.setSeconds(parseInt(timeparts[2], 10));
        if (dateparts[0] == "Today");
        else if (dateparts[0] == "Yesterday") {
          date = new Date(date - 24 * 60 * 60 * 1000);
        }
      } else {
        date.setDate(parseInt(dateparts[0], 10));
        date.setMonth({Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6,
            Aug:7, Sep:8, Oct:9, Nov:10, Dec:11}[dateparts[1]]);
        date.setYear(parseInt(dateparts[2], 10));
        timeparts = dateparts[3].split(":");
      }
      date.setHours(parseInt(timeparts[0], 10));
      date.setMinutes(parseInt(timeparts[1], 10));
      date.setSeconds(parseInt(timeparts[2], 10));
      return date;
    },

    'time': function(text) {
      var parts = text.split(":");
      var total = 0;
      for (var i = 0; i < parts.length; i++) {
        total = 60 * total + parseInt(parts[i], 10);
      }
      return total;
    },

    'text': function(text) {
      return text;
    }

  },

  sort_rows_by: function(col, type, reversed) {
    // Step 1: Pick a key function.
    var key = tablesort.sort_keys[type];
    if (!key) throw "Invalid sort key:" + type;
    // Step 2: Pull all the rows out of the table body.
    var tbody = jQuery('#songlist tbody').get(0);
    var rows = $.makeArray($('#songlist tbody tr').map(function (i, row) {
      tbody.removeChild(row);
      var text = $(row.cells[col]).text().strip();
      return {key: key(text), index: i, row: row};
    }));
    // Step 3: Sort the rows, first by key, and then by index to provide
    // stability.
    if (reversed) {
      rows.sort(function(a, b) {
        if (a.key === "") return 1;
        else if (b.key === "") return -1;
        else if (a.key < b.key) return 1;
        else if (a.key > b.key) return -1;
        else return a.index - b.index;
      });
    } else {
      rows.sort(function(a, b) {
        if (a.key === "") return 1;
        else if (b.key === "") return -1;
        else if (a.key < b.key) return -1;
        else if (a.key > b.key) return 1;
        else return a.index - b.index;
      });
    }
    // Step 4: Put the rows back into the table body and recolor the rows.
    for (var i = 0; i < rows.length; i++) {
      tbody.appendChild(rows[i].row);
    }
    tablesort.recolor_rows();
  },

  sorta: function(cell) {
    // Use getAttribute because this is a non-standard attr.
    var type = cell.getAttribute('sorttype');
    var col = -1;
    jQuery('#songlist thead th').each(function (i, child) {
      if (child == cell) {
        col = i;
        child.onclick = function() { tablesort.sortd(child); };
        child.className = "sorta";
      } else if (child.className == "sorta" || child.className == "sortd") {
        child.onclick = function() { tablesort.sorta(child); };
        child.className = "sort";
      }
    });
    if (col == -1) throw "Column not found.";
    tablesort.sort_rows_by(col, type, false);
  },

  sortd: function(cell) {
    // Use getAttribute because this is a non-standard attr.
    var type = cell.getAttribute('sorttype');
    var col = -1;
    jQuery('#songlist thead th').each(function (i, child) {
      if (child == cell) {
        col = i;
        child.onclick = function() { tablesort.sorta(child); };
        child.className = "sortd";
      } else if (child.className == "sorta" || child.className == "sortd") {
        child.onclick = function() { tablesort.sorta(child); };
        child.className = "sort";
      }
    });
    if (col == -1) throw "Column not found.";
    tablesort.sort_rows_by(col, type, true);
  }

};
