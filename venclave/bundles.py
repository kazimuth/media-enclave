#!/usr/bin/env python

"""The media bundles for video enclave."""

def get_bundles(_MENCLAVE_ROOT):
    return (
        {'type': 'javascript',
         'name': 'venclave-scripts',
         'path': _MENCLAVE_ROOT + 'venclave/scripts/',
         'url': '/video/scripts/',
         'files': (
             'jquery-1.3.2.min.js',
             'jquery.json-1.3.min.js',
             'jquery-ui-1.7.1.custom.min.js',
             'base.js',
             'filter.js',
             'video-list.js',
             'request.js',
         )},

        {'type': 'css',
         'name': 'venclave-styles',
         'path': _MENCLAVE_ROOT + 'venclave/styles/',
         'url': '/video/styles/',
         'files': (
             'jquery-ui-1.7.1.custom.css',
             'base.css',
             'browse.css',
             'exhibit.css',
             'detail.css',
         )},

        {"type": "png-sprite",
         "name": "venclave-sprites",
         "path": _MENCLAVE_ROOT + "venclave/images/",
         "url": "/audio/images/",
         "css_file": _MENCLAVE_ROOT + "venclave/styles/venclave-sprites.css",
         "files": (
             'star_yellow_full.png',
             'star_yellow_half.png',
             'arrow_blue_up.png',
         )},
    )
