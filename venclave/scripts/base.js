var venclave = {

    /**
     * Binds 'this' for a function and curries any extra arguments provided.
     */
    bound_func: function(f, this_) {
        var args = $.makeArray(arguments);
        args = args.slice(2);  // Drop the first two args.
        return function() {
            return f.apply(this_, args.concat($.makeArray(arguments)));
        };
    },

    /**
     * It turns out that if you want to replace HTML with innerHTML creating a
     * new node and replacing the old one is a lot faster.
     *
     * Instead of writing this:
     *   el.innerHTML = html;
     * Write:
     *   el = venclave.replaceHtml(el, html);
     *
     * Source: http://blog.stevenlevithan.com/archives/faster-than-innerhtml
     */
    replaceHtml: function(el, html) {
        var newEl = el.cloneNode(false);
        newEl.innerHTML = html;
        el.parentNode.replaceChild(newEl, el);
        return newEl;
    },

};
