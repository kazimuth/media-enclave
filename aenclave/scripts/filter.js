// TODO(rnk): Rewrite this using jQuery.  All this DOM manipulation is *really*
//            slow.  It would be better if we used .cloneNode() or .innerHTML
//            or others.

filter = {

  option: function(value, text) {
    var node = document.createElement("option");
    node.value = value;
    node.appendChild(document.createTextNode(text));
    return node;
  },

  button: function(value, action) {
    var node = document.createElement("input");
    node.type = "button";
    node.value = value;
    node.setAttribute("onclick", action);
    return node;
  },

  kind_select: function() {
    var node = document.createElement("select");
    node.id = "str";
    node.setAttribute("onchange", "filter.change_kind(this);");
    node.appendChild(filter.option("title", "Song title"));
    node.appendChild(filter.option("album", "Album name"));
    node.appendChild(filter.option("artist", "Artist name"));
    node.appendChild(filter.option("track", "Track number"));
    node.appendChild(filter.option("time", "Song duration"));
    node.appendChild(filter.option("date_added", "Date added"));
    node.appendChild(filter.option("last_played", "Last played"));
    node.appendChild(filter.option("play_count", "Play Count"));
    node.appendChild(filter.option("skip_count", "Skip Count"));
    node.appendChild(filter.option("and", "Satisfies all"));
    node.appendChild(filter.option("nand", "Doesn't satisfy all"));
    node.appendChild(filter.option("or", "Satisfies any"));
    node.appendChild(filter.option("nor", "Doesn't satisfy any"));
    return node;
  },

  rule_select: function(cat) {
    var node = document.createElement("select");
    node.setAttribute("onchange", "filter.change_rule(this);");
    if (cat == "str") {
      node.id = "str";
      node.appendChild(filter.option("in", "contains"));
      node.appendChild(filter.option("notin", "doesn't contain"));
      node.appendChild(filter.option("start", "starts with"));
      node.appendChild(filter.option("notstart", "doesn't start with"));
      node.appendChild(filter.option("end", "ends with"));
      node.appendChild(filter.option("notend", "doesn't end with"));
      node.appendChild(filter.option("is", "is"));
      node.appendChild(filter.option("notis", "is not"));
    } else if (cat == "int") {
      node.id = "range";
      node.appendChild(filter.option("inside", "is within range"));
      node.appendChild(filter.option("outside", "is outside range"));
      node.appendChild(filter.option("lte", "is at most"));
      node.appendChild(filter.option("gte", "is at least"));
      node.appendChild(filter.option("is", "is"));
      node.appendChild(filter.option("notis", "is not"));
    } else if (cat == "date") {
      node.id = "range";
      node.appendChild(filter.option("inside", "is within range"));
      node.appendChild(filter.option("outside", "is outside range"));
      node.appendChild(filter.option("before", "is before"));
      node.appendChild(filter.option("after", "is after"));
      node.appendChild(filter.option("last", "is in the last"));
      node.appendChild(filter.option("nolast", "is not in the last"));
    }
    return node;
  },

  change_kind: function(select) {
    var option = select.childNodes[select.selectedIndex];
    var newcat = filter.category(option.value);
    var oldcat = select.id;
    if (oldcat == newcat) return;
    // We are changing categories, so we need new stuff.
    var listitem = select.parentNode;
    listitem.removeChild(select.nextSibling);
    listitem.removeChild(select.nextSibling);
    if (newcat == "bool") {
      var btn = filter.button("+", "filter.add_rule(this);")
      listitem.appendChild(btn);
      listitem.appendChild(document.createElement("ul"));
      filter.add_rule(btn);  // Add an item to the newly created list.
    } else {
      var rulesel = filter.rule_select(newcat);
      listitem.appendChild(rulesel);
      var rule = rulesel.firstChild.value;
      listitem.appendChild(filter.field_span(filter.auspice(newcat, rule)));
    }
    select.id = newcat;
  },

  change_rule: function(select) {
    var cat = select.previousSibling.id;
    var option = select.childNodes[select.selectedIndex];
    var newausp = filter.auspice(cat, option.value);
    var oldausp = select.id;
    if (oldausp == newausp) return;
    // We are changing auspices, so we need new stuff.
    var listitem = select.parentNode;
    listitem.removeChild(select.nextSibling);
    listitem.appendChild(filter.field_span(newausp));
    select.id = newausp;
  },

  textbox: function(size) {
    var node = document.createElement("input");
    node.type = "text";
    node.size = size;
    return node;
  },

  field_span: function(ausp) {
    var span = document.createElement("span");
    span.className = "field";
    if (ausp == "str") {
      span.appendChild(filter.textbox("30"));
    } else if (ausp == "one") {
      span.appendChild(filter.textbox("14"));
    } else if (ausp == "range") {
      span.appendChild(filter.textbox("14"));
      span.appendChild(filter.textbox("14"));
    } else if (ausp == "udate") {
      span.appendChild(filter.textbox("5"));
      var select = document.createElement("select");
      select.appendChild(filter.option("hour", "hours"));
      select.appendChild(filter.option("day", "days"));
      select.appendChild(filter.option("week", "weeks"));
      select.appendChild(filter.option("month", "months"));
      select.appendChild(filter.option("year", "years"));
      span.appendChild(select);
    }
    return span;
  },

  category: function(kind) {
    if (kind == "title" || kind == "album" || kind == "artist") {
      return "str";
    } else if (kind == "time" || kind == "track" || kind == "play_count" ||
               kind == "skip_count") {
      return "int";
    } else if (kind == "date_added" || kind == "last_played") {
      return "date";
    } else if (kind == "and" || kind == "or" || kind == "nand" ||
               kind == "nor") {
      return "bool";
    } else return "nix";
  },

  auspice: function(cat, rule) {
    if (cat == "str") {
      return "str";
    } else if (cat == "int") {
      if (rule == "is" || rule == "notis" || rule == "lte" || rule == "gte") {
        return "one";
      } else if (rule == "inside" || rule == "outside") {
        return "range";
      }
    } else if (cat == "date") {
      if (rule == "before" || rule == "after") return "one";
      else if (rule == "inside" || rule == "outside") return "range";
      else if (rule == "last" || rule == "nolast") return "udate"
    }
    return "nix";
  },

  criterion: function() {
    var listitem = document.createElement("li");
    listitem.appendChild(filter.button("\u2212", "filter.removeFilter(this);"));
    listitem.appendChild(filter.kind_select());
    listitem.appendChild(filter.rule_select("str"));
    listitem.appendChild(filter.field_span("str"));
    return listitem;
  },

  removeFilter: function(button) {
    var listitem = button.parentNode;
    listitem.parentNode.removeChild(listitem);
  },

  add_rule: function(button) {
    button.nextSibling.appendChild(filter.criterion());
  },

  subgather: function(item, prefix) {
    var kindsel = item.firstChild.nextSibling;
    kindsel.name = prefix;
    if (kindsel.id == "bool") {
      prefix += "_"
      var kids = kindsel.nextSibling.nextSibling.childNodes;
      for (var i = 0; i < kids.length; i++) {
        filter.subgather(kids[i], prefix+i);
      }
    } else {
      var rulesel = kindsel.nextSibling;
      rulesel.name = prefix+"_r";
      prefix += "_f"
      var flds = rulesel.nextSibling.childNodes;
      for (var i = 0; i < flds.length; i++) {
        flds[i].name = prefix+i;
      }
    }
  },

  gather: function() {
    filter.subgather(document.getElementById("root"), "k");
  }
}
