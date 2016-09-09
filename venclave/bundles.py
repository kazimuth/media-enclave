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
         )},

        {'type': 'css',
         'name': 'venclave-styles',
         'path': _MENCLAVE_ROOT + 'venclave/styles/',
         'url': '/video/styles/',
         'files': (
             'jquery-ui-1.7.1.custom.css',
             'base.css',
             'browse.css',
         )},

        {"type": "png-sprite",
         "name": "venclave-sprites",
         "path": _MENCLAVE_ROOT + "venclave/images/",
         "url": "/audio/images/",
         "css_file": _MENCLAVE_ROOT + "venclave/styles/venclave-sprites.css",
         "files": (
             'browse_title.png',
             'browse_green.png',
             'slash.png',
             'upload_white.png',
             'mo_icon.png',
             'tv_icon.png',
             'star_yellow_full.png',
             'star_yellow_half.png',
         )},
    )
