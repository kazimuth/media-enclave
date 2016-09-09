venclave.videolist = {

    /**
     * A map from id to pane jQuery node.
     */
    panes: {},

    /**
     * Open the pane with the plot summary and metadata when the user clicks on
     * the movie title anchor.
     */
    title_onclick: function(a_elt) {
        var a = $(a_elt);
        var id = a.closest('tr').attr('id1');
        if (!this.panes[id]) {
            // Set panes[id] to something while the call is loading so we don't
            // load two panes if the user clicks twice quickly.
            this.panes[id] = 'loading';
            $.get('/video/load_pane/', {id: id},
                  venclave.bound_func(this.load_pane_success, this, a, id));
            this.toggle_style(a.get(0).parentNode, 'background', '#CCC');
        } else if (this.panes[id] != 'loading') {
            // The pane is already loaded, so toggle it open or closed.
            this.panes[id].toggle();
            this.toggle_style(a_elt.parentNode, 'background', '#CCC');
        }
        return false;
    },

    /**
     * Loads the pane below the anchor when the AJAX call returns.
     */
    load_pane_success: function(a, id, html) {
        // Parse the returned HTML into DOM and wrap it with jQuery.
        var pane = $(html);
        this.panes[id] = pane;
        // Put the new pane after the TR wrapping the anchor.
        a.closest('tr').after(pane);
        // Fill in the nytimes review link.
        var title = pane.find('.nytimes').attr('href').replace(/#/, '');
        var search_url = ("http://www.google.com/uds/GwebSearch?v=1.0" +
                          "&q=nytimes review " + encodeURIComponent(title) +
                          "&callback=?");
        jQuery.getJSON(search_url, function(json) {
            // Grab the URL of the first search result and call that the
            // review URL.
            var review_url = json.responseData.results[0].url;
            pane.find('.nytimes').attr({'href': review_url});
        });
    },

    toggle_style: function(elt, attr, value) {
        if (elt.style[attr]) {
            elt.style[attr] = '';
        } else {
            elt.style[attr] = value;
        }
    },

}
