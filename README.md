
# Media-Enclave

Media-enclave is a collection of Django web applications to manage media in a community environment. Our two major sub-projects are:

Audio-enclave, which allows a community to upload their music to a communal "jukebox" where it can be made into shared playlists and played back.
Video-enclave, which allows users to search their movie collections using metadata scraped from sites like IMDB, metacritic, and Rotten Tomatoes.
Currently, audio-enclave is our only functional application, but we are beginning work on video-enclave.

## Audio-Enclave

Audio-enclave is a web application that controls music player running in the background. It allows users to upload songs, search for music, make playlists, and control playback. We eventually intend to support separate channels of music which are piped to specific locations, but for now the player just outputs to the default device. InstallingAudioEnclave

## Video-Enclave

Video-enclave is a web application that allows users to search their sometimes large movie collections with metadata scraped from IMDB and other web sites. The goal is to make finding a movie to watch as easy as finding music with audio-enclave. We want to allow the user to search for films with Sean Penn or directed by Quentin Tarantino without having to go to an external web site like IMDB and then check if they own that film.

## Speech Interface

During January 2009 we started writing a speech interface for audio-enclave with WAMI from the CS and AI Lab at MIT. Our goal is to be able to walk into the room where the sound system is set up, push a button on the wall, say "queue song name", and have the music start. This would, of course, make a very nice demo. :)

# How to install and set up audio-enclave

## Dependencies

First, make sure the following dependencies are installed:
  * Python (>= 2.6)
  * Django (>= 1.1)
  * django-media-bundler (http://github.com/rnk/django-media-bundler/tree/master)
  * GStreamer (>= 0.10; this includes gstreamer-plugins-base/good/ugly/bad)
  * pygst (spelled 'python-gst' by Ubuntu/Debian)
  * Pyro (python remote objects)
  * Mutagen
  * A database that Django supports.  To start, we recommend sqlite3 because it does not require a daemon running in the background.
  * pngcrush

## Settings

Next, copy settings.py.tmpl to settings.py.  Edit settings.py and supply values
for all variables tagged with 'CUSTOMIZE ME'.  More info on the Django specific
settings and this process in general can be found on the Django web site.

Run the manage.py script in the project root like so:

```sh
python manage.py syncdb
python manage.py bundle_media
```

This will populate the database that you just configured with the model tables
and a default channel, and it will bundle the Javascript, CSS, and image
sprites.

## Running a Server

For development, you should use Django's own HTTP server, but for production
you now need to configure Apache/mod_python for the aenclave Django project.
To run the Django server, run the management script with the argument
'runserver'.  You should be able to go to http://localhost:8000/admin/ and see
the Django admin page without any errors now.

## Running the Player

The last step is to configure the audio enclave player daemon to start on boot.
If you are on Ubuntu/Debian, do the following:

```sh
sudo cp MENCLAVE/aenclave/gst_player/ae-player-init.sh /etc/init.d/ae-player
sudo chmod +x /etc/init.d/ae-player
# Edit the vars labelled 'CUSTOMIZE ME'
sudo vi /etc/init.d/ae-player
sudo update-rc.d ae-player defaults
# Start the player now.
sudo /etc/init.d/ae-player start
```

If you are using another distro, there should be similar mechanisms in place for
your distro.

Alternatively, if you're on OS X, you can install [python-daemon](http://pypi.python.org/pypi/python-daemon/) via `easy_install python-daemon` and run `aenclave/gst_player/ae_player_daemon.py` to start the player in the background.

If you don't have python-daemon installed, you can run the server directly:

```sh
MENCLAVE_DIR="/path/to/menclave"
export PYTHONPATH="$PYTHONPATH:$MENCLAVE_DIR/../"
python aenclave/gst_player/gst_server.py
```

## Testing

To test that everything worked, click 'Upload', upload a song, and queue it by
clicking the link.  If playback does not start, look for tracebacks in both the
Django server process and the gst_server process to try and diagnose the
problem.

## Misc

To make SFTP uploading work, you should run an SFTP server on the same host as
the gst_player process.  TODO(rnk): Document this process more thoroughly.
