venclave.filter = {

    filters: [],

    init: function() {
        $('div.facet').each(venclave.bound_func(function(i, div) {
            var type = div.className.split("facet ")[1];
            var filter = new this[type](div);
            this.filters.push(filter);
        }, this));
    },

    /**
     * The last XHR returned by $.post.  If the user updates the slider twice
     * quickly, we need to abort the first request before it finishes.  I'm not
     * sure if JavaScript functions can be preempted, so there may or may not
     * be race conditions.
     */
    update_xhr: null,

    /**
     * Fire off the updated query to the server and load the results into the
     * TBODY.
     */
    update: function() {
        // Abort any old XHR that might be running and only worry about the
        // most recent query.
        if (this.update_xhr) {
            this.update_xhr.abort();
        }
        var state = $.toJSON(this.get_state());
        var query = $('.search_query')[0].value;
        this.update_xhr = $.post('/video/update_list/',
                                 {'f': state, 'q': query},
                                 venclave.bound_func(this.update_success, this),
                                 'json');
    },

    /**
     * Load the results of the new query into the TBODY.
     */
    update_success: function(data) {
        this.update_xhr = null;
        // Reset the panes so that we don't hold onto stale DOM references.
        venclave.videolist.panes = {};
        // This is performance critical, so we use the crazy replaceHtml
        // method.
        var td = $('#list-container').get(0);
        venclave.replaceHtml(td, data.videolist);
        $('#results-banner').text(data.banner_msg);
    },

    get_state: function() {
        return $.map(this.filters, function(f) { return f.get_state(); });
    },

    checkbox: function(div) {
        this.div = div;
        this.name = $(div).children('div.facet-name').text();
        this.name = $.trim(this.name);
        $(div).find('input').change(venclave.bound_func(
            venclave.filter.update, venclave.filter));
    },

    searchbar: function(div) {
        this.div = div;
        this.name = $(div).children('div.facet-name').text();
        this.name = $.trim(this.name);
        $(div).find('input:radio').change(venclave.filter.update);
        $(div).find('form').submit(venclave.bound_func(this.on_submit, this));
    },

    slider: function(div_elt) {
        this.div = div_elt;
        this.name = $(div_elt).children('div.facet-name').text();
        this.name = $.trim(this.name);
        var div = $(div_elt).find('.slider-div');
        this.min = parseInt(div.attr('min'),10);
        this.max = parseInt(div.attr('max'),10);
        var lo = div.prevAll('.slider-lo');
        var hi = div.prevAll('.slider-hi');
        div.slider({range: true,
                    min: this.min,
                    max: this.max,
                    values: [this.min, this.max],
                    slide: function(e, ui) {
                        lo.text(ui.values[0]);
                        hi.text(ui.values[1]);
                    },
                    change: function(e, ui) {
                        venclave.filter.update();
                    }
                   });
    },

};

venclave.filter.checkbox.prototype.get_state = function() {
    var op = $(this.div).find('.facet-options > input:checked').val();
    var selected = $(this.div).find('.facet-choices > input:checked');
    selected = $.map(selected, function(e){return e.value;});
    return {name: this.name, op: op, selected: selected};
};

venclave.filter.searchbar.prototype.on_submit = function() {
    var form = $(this.div).find('form');
    var textfield = form.find('input:text');
    form.next('ul').append(this.create_li(textfield.val()));
    textfield.val('');
    venclave.filter.update();
    return false;
};

venclave.filter.searchbar.prototype.create_li = function(val) {
    var li = $('<li><span>'+val+'</span><a href="#">[x]</a></li>');
    li.find('a').click(this.remove_li_handler(li));
    return li;
};

venclave.filter.searchbar.prototype.remove_li_handler = function(li) {
    return function() {
        li.remove();
        venclave.filter.update();
        return false;
    };
};

venclave.filter.searchbar.prototype.get_state = function() {
    var op = $(this.div).find('.facet-options > input:checked').val();
    var selected = $(this.div).find('.facet-choices li');
    selected = $.map(selected, function(li) {
        return $(li).find('span').text();
    });
    return {name: this.name, op: op, selected: selected};
};

venclave.filter.slider.prototype.get_state = function() {
    var slider = $(this.div).find('.slider-div');
    var lo = slider.slider('values', 0);
    var hi = slider.slider('values', 1);
    var reset = (lo <= this.min) && (hi >= this.max);
    return {name: this.name, lo: lo, hi: hi, reset: reset};
};

$(document).ready(venclave.bound_func(venclave.filter.init, venclave.filter));
